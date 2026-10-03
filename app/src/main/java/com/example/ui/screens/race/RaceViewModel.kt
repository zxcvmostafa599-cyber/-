package com.example.ui.screens.race

import android.os.SystemClock
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.model.FootballCategory
import com.example.data.model.FootballPlayer
import com.example.data.model.RaceResult
import com.example.data.repository.FootballCatalog
import com.example.data.repository.GameRepository
import com.example.engine.AIDifficulty
import com.example.engine.AIOpponent
import com.example.engine.FootballValidationEngine
import com.example.engine.LocalPlayerOpponent
import com.example.engine.NormalizationMode
import com.example.engine.RondoOpponent
import com.example.engine.SoundManager
import com.example.engine.ValidationResult
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlin.math.max

enum class RondoPhase {
    COUNTDOWN,
    PLAYER_TURN,      // Player 1
    OPPONENT_TURN,    // AI or Player 2
    PASSING_BALL,     // Visual transition
    FINISHED
}

data class RondoUiState(
    val phase: RondoPhase = RondoPhase.COUNTDOWN,
    val countdownNumber: Int = 3,
    val category: FootballCategory = FootballCatalog.allCategories.first(),
    val gameMode: String = "AI", // "AI", "LOCAL_2P", "QUICK", "LEVEL", "DAILY"
    val levelNumber: Int = 1,
    val opponent: RondoOpponent = AIOpponent(),
    val turnOwner: Int = 1, // 1: Player 1, 2: Player 2 or AI
    val turnTotalSeconds: Int = 5,
    val remainingTimeSeconds: Float = 5.0f,
    val isTimerCritical: Boolean = false,
    val usedPlayers: List<FootballPlayer> = emptyList(),
    val inputQuery: String = "",
    val feedbackMessage: String = "",
    val isSuccessFeedback: Boolean? = null,
    val player1Score: Int = 0,
    val player1Streak: Int = 0,
    val player1BestStreak: Int = 0,
    val player1CorrectAnswers: Int = 0,
    val player2Score: Int = 0,
    val player2Streak: Int = 0,
    val player2CorrectAnswers: Int = 0,
    val totalRounds: Int = 0,
    val winner: String? = null, // "PLAYER_1", "OPPONENT", "PLAYER_2"
    val finishReason: String = "",
    val avgResponseTimeSeconds: Double = 0.0,
    val ballPositionProgress: Float = 0.0f // 0f: Player 1, 1f: Opponent
)

class RaceViewModel(
    private val repository: GameRepository,
    private val soundManager: SoundManager
) : ViewModel() {

    private val _uiState = MutableStateFlow(RondoUiState())
    val uiState: StateFlow<RondoUiState> = _uiState.asStateFlow()

    private var countdownJob: Job? = null
    private var timerJob: Job? = null
    private var aiJob: Job? = null

    private var turnStartTimeElapsed: Long = 0L
    private val playerResponseTimes = mutableListOf<Double>()
    private var normalizationMode: NormalizationMode = NormalizationMode.SMART

    fun initRondo(
        category: FootballCategory,
        levelNumber: Int,
        gameMode: String,
        difficulty: AIDifficulty = AIDifficulty.INTERMEDIATE
    ) {
        timerJob?.cancel()
        countdownJob?.cancel()
        aiJob?.cancel()
        playerResponseTimes.clear()

        val opponent: RondoOpponent = if (gameMode == "LOCAL_2P") {
            LocalPlayerOpponent()
        } else {
            AIOpponent(difficulty = difficulty)
        }

        val turnSeconds = category.timerSeconds

        _uiState.value = RondoUiState(
            phase = RondoPhase.COUNTDOWN,
            countdownNumber = 3,
            category = category,
            gameMode = gameMode,
            levelNumber = levelNumber,
            opponent = opponent,
            turnOwner = 1,
            turnTotalSeconds = turnSeconds,
            remainingTimeSeconds = turnSeconds.toFloat(),
            isTimerCritical = false,
            usedPlayers = emptyList(),
            inputQuery = "",
            feedbackMessage = "",
            isSuccessFeedback = null,
            player1Score = 0,
            player1Streak = 0,
            player1BestStreak = 0,
            player1CorrectAnswers = 0,
            player2Score = 0,
            player2Streak = 0,
            player2CorrectAnswers = 0,
            totalRounds = 0,
            winner = null,
            finishReason = "",
            avgResponseTimeSeconds = 0.0,
            ballPositionProgress = 0f
        )

        startCountdown()
    }

    private fun startCountdown() {
        countdownJob?.cancel()
        countdownJob = viewModelScope.launch {
            for (count in 3 downTo 1) {
                _uiState.value = _uiState.value.copy(countdownNumber = count)
                soundManager.playCountdownTick()
                delay(1000)
            }
            _uiState.value = _uiState.value.copy(countdownNumber = 0)
            soundManager.playPassSuccess()
            delay(400)
            startTurn(player = 1)
        }
    }

    private fun startTurn(player: Int) {
        val current = _uiState.value
        val turnLimit = current.turnTotalSeconds
        turnStartTimeElapsed = SystemClock.elapsedRealtime()

        _uiState.value = current.copy(
            phase = if (player == 1) RondoPhase.PLAYER_TURN else RondoPhase.OPPONENT_TURN,
            turnOwner = player,
            remainingTimeSeconds = turnLimit.toFloat(),
            isTimerCritical = false,
            inputQuery = "",
            ballPositionProgress = if (player == 1) 0f else 1f
        )

        soundManager.playTurnSwitch()

        // Monotonic timer job
        startMonotonicTurnTimer(turnLimit, player)

        // If turn is AI, start AI logic
        if (player == 2 && current.opponent is AIOpponent) {
            startAITurn(current.opponent, current.category, turnLimit)
        }
    }

    private fun startMonotonicTurnTimer(turnSeconds: Int, player: Int) {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            val totalMillis = turnSeconds * 1000L
            while (true) {
                val elapsedMs = SystemClock.elapsedRealtime() - turnStartTimeElapsed
                val remainingMs = (totalMillis - elapsedMs).coerceAtLeast(0L)
                val remainingSec = remainingMs / 1000f

                val isCritical = remainingSec <= 1.5f && remainingSec > 0f

                _uiState.value = _uiState.value.copy(
                    remainingTimeSeconds = remainingSec,
                    isTimerCritical = isCritical
                )

                if (isCritical) {
                    soundManager.playUrgentTick()
                }

                if (remainingMs <= 0) {
                    // Turn expired! Timeout loss for active player
                    handleTurnTimeout(player)
                    break
                }

                delay(50) // Frequent smooth updates for circular meter
            }
        }
    }

    private fun handleTurnTimeout(playerNumber: Int) {
        timerJob?.cancel()
        aiJob?.cancel()
        soundManager.playMistakeOrTimeout()

        val isPlayerOne = (playerNumber == 1)
        val winner = if (isPlayerOne) {
            if (_uiState.value.gameMode == "LOCAL_2P") "PLAYER_2" else "OPPONENT"
        } else {
            "PLAYER_1"
        }

        val reasonText = if (isPlayerOne) {
            "انتهى الوقت المسموح لك! ⏱️"
        } else {
            "انتهى وقت الخصم! ⏱️"
        }

        _uiState.value = _uiState.value.copy(
            feedbackMessage = reasonText,
            isSuccessFeedback = false
        )

        finishMatch(winner = winner, reason = "انتهى الوقت")
    }

    /**
     * Called when Player 1 (or Player 2 in local mode) submits their answer
     */
    fun submitAnswer(query: String) {
        val current = _uiState.value
        if (current.phase != RondoPhase.PLAYER_TURN && current.phase != RondoPhase.OPPONENT_TURN) return
        val trimmed = query.trim()
        if (trimmed.isBlank()) return

        val currentPlayer = current.turnOwner
        val usedIds = current.usedPlayers.map { it.id }.toSet()

        val responseElapsedSec = (SystemClock.elapsedRealtime() - turnStartTimeElapsed) / 1000.0
        if (currentPlayer == 1) {
            playerResponseTimes.add(responseElapsedSec)
        }

        // Validate via Engine
        val result = FootballValidationEngine.validateAnswer(
            rawInput = trimmed,
            category = current.category,
            usedPlayerIds = usedIds,
            mode = normalizationMode
        )

        when (result) {
            is ValidationResult.Valid -> {
                handleValidPass(currentPlayer, result.player, responseElapsedSec)
            }
            is ValidationResult.AlreadyUsed -> {
                soundManager.playMistakeOrTimeout()
                _uiState.value = current.copy(
                    feedbackMessage = "اللاعب (${result.player.arabicName}) مستخدم بالفعل! ❌",
                    isSuccessFeedback = false
                )
                // In Rondo rules, repeating an already used player is an immediate strike/loss
                val winner = if (currentPlayer == 1) {
                    if (current.gameMode == "LOCAL_2P") "PLAYER_2" else "OPPONENT"
                } else "PLAYER_1"
                finishMatch(winner = winner, reason = "تكرار لاعب مستخدم")
            }
            is ValidationResult.CategoryMismatch -> {
                soundManager.playMistakeOrTimeout()
                _uiState.value = current.copy(
                    feedbackMessage = "(${result.player.arabicName}) لا يحقق شروط الفئة! ❌",
                    isSuccessFeedback = false
                )
                val winner = if (currentPlayer == 1) {
                    if (current.gameMode == "LOCAL_2P") "PLAYER_2" else "OPPONENT"
                } else "PLAYER_1"
                finishMatch(winner = winner, reason = "لاعب لا يحقق الشروط")
            }
            is ValidationResult.Ambiguous -> {
                soundManager.playMistakeOrTimeout()
                val names = result.matchingPlayers.take(3).joinToString(" أو ") { it.arabicName }
                _uiState.value = current.copy(
                    feedbackMessage = "الاسم غامض! يرجى التحديد: $names",
                    isSuccessFeedback = false
                )
            }
            is ValidationResult.NotFound -> {
                soundManager.playMistakeOrTimeout()
                _uiState.value = current.copy(
                    feedbackMessage = "لاعب غير معروف! تأكد من كتابة الاسم بدقة.",
                    isSuccessFeedback = false
                )
            }
        }
    }

    private fun handleValidPass(playerNumber: Int, player: FootballPlayer, responseElapsedSec: Double) {
        timerJob?.cancel()
        aiJob?.cancel()
        soundManager.playPassSuccess()

        val current = _uiState.value
        val speedBonus = ((current.turnTotalSeconds - responseElapsedSec).coerceAtLeast(0.0) * 40).toInt()
        val baseScore = 100 + speedBonus

        val newStreak = if (playerNumber == 1) current.player1Streak + 1 else current.player2Streak + 1
        val comboBonus = (newStreak * 20)
        val roundScore = baseScore + comboBonus

        // Check Combo triggers
        if (newStreak == 3 || newStreak == 5 || newStreak == 10) {
            soundManager.playComboHot()
        }

        val updatedUsed = current.usedPlayers + player
        val nextPlayer = if (playerNumber == 1) 2 else 1

        val updatedState = if (playerNumber == 1) {
            current.copy(
                usedPlayers = updatedUsed,
                player1Score = current.player1Score + roundScore,
                player1Streak = newStreak,
                player1BestStreak = max(current.player1BestStreak, newStreak),
                player1CorrectAnswers = current.player1CorrectAnswers + 1,
                totalRounds = current.totalRounds + 1,
                feedbackMessage = "تمريرة ممتازة! ⚽ (${player.arabicName})",
                isSuccessFeedback = true,
                inputQuery = "",
                phase = RondoPhase.PASSING_BALL,
                ballPositionProgress = 1f
            )
        } else {
            current.copy(
                usedPlayers = updatedUsed,
                player2Score = current.player2Score + roundScore,
                player2Streak = newStreak,
                player2CorrectAnswers = current.player2CorrectAnswers + 1,
                totalRounds = current.totalRounds + 1,
                feedbackMessage = "تمريرة الخصم! ⚽ (${player.arabicName})",
                isSuccessFeedback = true,
                inputQuery = "",
                phase = RondoPhase.PASSING_BALL,
                ballPositionProgress = 0f
            )
        }

        _uiState.value = updatedState

        // Small delay for ball transition before switching turn
        viewModelScope.launch {
            delay(600)
            if (_uiState.value.phase == RondoPhase.PASSING_BALL) {
                startTurn(player = nextPlayer)
            }
        }
    }

    private fun startAITurn(ai: AIOpponent, category: FootballCategory, turnLimit: Int) {
        aiJob?.cancel()
        aiJob = viewModelScope.launch {
            val usedIds = _uiState.value.usedPlayers.map { it.id }.toSet()
            val decision = ai.decideTurn(category, usedIds, turnLimit)

            when (decision) {
                is AIOpponent.AIDecision.Answer -> {
                    handleValidPass(playerNumber = 2, player = decision.player, responseElapsedSec = decision.responseTimeMs / 1000.0)
                }
                is AIOpponent.AIDecision.Mistake -> {
                    timerJob?.cancel()
                    soundManager.playMistakeOrTimeout()
                    _uiState.value = _uiState.value.copy(
                        feedbackMessage = "خطأ من الذكاء الاصطناعي: ${decision.reason} ❌",
                        isSuccessFeedback = false
                    )
                    finishMatch(winner = "PLAYER_1", reason = decision.reason)
                }
                is AIOpponent.AIDecision.Timeout -> {
                    handleTurnTimeout(playerNumber = 2)
                }
            }
        }
    }

    fun onQueryChange(newQuery: String) {
        _uiState.value = _uiState.value.copy(inputQuery = newQuery)
    }

    private fun finishMatch(winner: String, reason: String) {
        timerJob?.cancel()
        aiJob?.cancel()

        val current = _uiState.value
        val isPlayerWon = (winner == "PLAYER_1")

        if (isPlayerWon) {
            soundManager.playVictory()
        } else {
            soundManager.playDefeat()
        }

        val avgTime = if (playerResponseTimes.isNotEmpty()) {
            playerResponseTimes.average()
        } else 0.0

        val xp = if (isPlayerWon) (150 + current.player1Score / 10) else (50 + current.player1Score / 20)
        val coins = if (isPlayerWon) (40 + current.player1CorrectAnswers * 5) else 15

        _uiState.value = current.copy(
            phase = RondoPhase.FINISHED,
            winner = winner,
            finishReason = reason,
            avgResponseTimeSeconds = avgTime
        )

        // Record in Database
        viewModelScope.launch {
            val matchResult = RaceResult(
                categoryId = current.category.id,
                categoryTitle = current.category.titleAr,
                level = current.levelNumber,
                gameMode = current.gameMode,
                opponentName = current.opponent.nameAr,
                correctAnswers = current.player1CorrectAnswers,
                totalRounds = current.totalRounds,
                bestStreak = current.player1BestStreak,
                avgResponseTime = avgTime,
                score = current.player1Score,
                won = isPlayerWon,
                reason = reason,
                xpEarned = xp,
                coinsEarned = coins
            )
            repository.recordMatchResult(matchResult)
        }
    }

    fun resign() {
        finishMatch(winner = "OPPONENT", reason = "انسحاب")
    }

    fun setNormalizationMode(mode: NormalizationMode) {
        this.normalizationMode = mode
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
        countdownJob?.cancel()
        aiJob?.cancel()
    }
}
