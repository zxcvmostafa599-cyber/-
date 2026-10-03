package com.example.engine

import com.example.data.model.FootballCategory
import com.example.data.model.FootballPlayer
import com.example.data.repository.FootballCatalog
import kotlinx.coroutines.delay
import kotlin.random.Random

enum class AIDifficulty(
    val titleAr: String,
    val titleEn: String,
    val minResponseDelayMs: Long,
    val maxResponseDelayMs: Long,
    val mistakeProbability: Double,
    val preferCommonAnswers: Boolean
) {
    CASUAL("عادي (Casual)", "Casual", 2000L, 2800L, 0.12, true),
    INTERMEDIATE("متوسط (Intermediate)", "Intermediate", 1500L, 2000L, 0.06, false),
    ADVANCED("متقدم (Advanced)", "Advanced", 1100L, 1500L, 0.03, false),
    EXPERT("خبير (Expert)", "Expert", 900L, 1200L, 0.01, false),
    BOSS("الزعيم (Boss)", "Boss", 700L, 1000L, 0.00, false)
}

sealed interface RondoOpponent {
    val nameAr: String
    val nameEn: String
    val isAI: Boolean
}

data class AIOpponent(
    val difficulty: AIDifficulty = AIDifficulty.INTERMEDIATE,
    override val nameAr: String = "ذكاء روندو الاصطناعي 🤖",
    override val nameEn: String = "Rondo AI 🤖",
    override val isAI: Boolean = true
) : RondoOpponent {

    sealed interface AIDecision {
        data class Answer(val player: FootballPlayer, val responseTimeMs: Long) : AIDecision
        data class Mistake(val player: FootballPlayer?, val reason: String, val responseTimeMs: Long) : AIDecision
        data class Timeout(val delayMs: Long) : AIDecision
    }

    /**
     * Strategically decides an answer based on category, used players, and difficulty.
     */
    suspend fun decideTurn(
        category: FootballCategory,
        usedPlayerIds: Set<String>,
        turnTimeSeconds: Int
    ): AIDecision {
        val baseDelay = Random.nextLong(difficulty.minResponseDelayMs, difficulty.maxResponseDelayMs)
        val jitter = Random.nextLong(-150L, 180L)
        val thinkingTimeMs = (baseDelay + jitter).coerceAtLeast(600L)

        val turnLimitMs = turnTimeSeconds * 1000L

        // Check if AI runs out of time (only on lower difficulties, small chance)
        if (thinkingTimeMs >= turnLimitMs) {
            delay(turnLimitMs)
            return AIDecision.Timeout(turnLimitMs)
        }

        // Wait for natural thinking delay
        delay(thinkingTimeMs)

        // Determine all eligible valid answers
        val validPool = FootballCatalog.getValidPlayersForCategory(category)
        val remainingValid = validPool.filterNot { usedPlayerIds.contains(it.id) }

        // Mistake roll
        val makeMistake = Random.nextDouble() < difficulty.mistakeProbability

        if (remainingValid.isEmpty()) {
            // No valid answers left in pool -> AI is forced to timeout/fail
            return AIDecision.Timeout(thinkingTimeMs)
        }

        if (makeMistake) {
            val mistakeType = Random.nextInt(3)
            return when {
                mistakeType == 0 && usedPlayerIds.isNotEmpty() -> {
                    // Mistake: Repeating a player already used
                    val usedPlayer = FootballCatalog.allPlayers.firstOrNull { it.id == usedPlayerIds.random() }
                    AIDecision.Mistake(usedPlayer, "اللاعب مستخدم بالفعل!", thinkingTimeMs)
                }
                mistakeType == 1 -> {
                    // Mistake: Choosing an invalid player from outside the category
                    val invalidPlayer = FootballCatalog.allPlayers.filterNot { category.predicate(it) }.randomOrNull()
                    AIDecision.Mistake(invalidPlayer, "اللاعب لا يحقق الشروط!", thinkingTimeMs)
                }
                else -> {
                    // Mistake: Hesitation timeout
                    AIDecision.Timeout(thinkingTimeMs)
                }
            }
        }

        // Pick smart answer based on strategy
        val selectedPlayer = if (difficulty.preferCommonAnswers) {
            val commonAnswers = remainingValid.filter { it.isCommon }
            if (commonAnswers.isNotEmpty()) commonAnswers.random() else remainingValid.random()
        } else {
            // Expert & Boss favor deeper / rare answers first
            val rareAnswers = remainingValid.filterNot { it.isCommon }
            if (rareAnswers.isNotEmpty() && Random.nextDouble() < 0.65) {
                rareAnswers.random()
            } else {
                remainingValid.random()
            }
        }

        return AIDecision.Answer(selectedPlayer, thinkingTimeMs)
    }
}

data class LocalPlayerOpponent(
    val playerNumber: Int = 2,
    override val nameAr: String = "اللاعب 2 👤",
    override val nameEn: String = "Player 2 👤",
    override val isAI: Boolean = false
) : RondoOpponent

data class OnlinePlayerOpponent(
    val onlineId: String,
    val displayName: String,
    override val nameAr: String = displayName,
    override val nameEn: String = displayName,
    override val isAI: Boolean = false
) : RondoOpponent
