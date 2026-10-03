package com.example.data.repository

import com.example.data.local.AchievementDao
import com.example.data.local.PlayerDao
import com.example.data.local.RaceResultDao
import com.example.data.model.Achievement
import com.example.data.model.Player
import com.example.data.model.RaceResult
import kotlinx.coroutines.flow.Flow
import kotlin.math.max
import kotlin.math.min

class GameRepository(
    private val playerDao: PlayerDao,
    private val raceResultDao: RaceResultDao,
    private val achievementDao: AchievementDao
) {
    val player: Flow<Player?> = playerDao.getPlayer()
    val allResults: Flow<List<RaceResult>> = raceResultDao.getAllResults()
    val recentResults: Flow<List<RaceResult>> = raceResultDao.getRecentResults(20)
    val achievements: Flow<List<Achievement>> = achievementDao.getAllAchievements()

    suspend fun getPlayerDirect(): Player {
        return playerDao.getPlayerDirect() ?: Player().also {
            playerDao.insertOrUpdate(it)
        }
    }

    suspend fun updatePlayerName(newName: String) {
        val current = getPlayerDirect()
        playerDao.insertOrUpdate(current.copy(name = newName.trim()))
    }

    suspend fun recordMatchResult(result: RaceResult): List<Achievement> {
        raceResultDao.insertResult(result)
        val current = getPlayerDirect()

        val newStreak = if (result.won) current.currentStreak + 1 else 0
        val longestStreak = max(current.longestStreak, max(newStreak, result.bestStreak))

        var unlockedLevel = current.currentLevel
        if (result.won && result.gameMode == "LEVEL" && result.level == current.currentLevel && current.currentLevel < 10) {
            unlockedLevel = current.currentLevel + 1
        }

        val fastest = if (current.fastestAnswerSec == 0.0) {
            result.avgResponseTime
        } else {
            min(current.fastestAnswerSec, result.avgResponseTime)
        }

        val updatedPlayer = current.copy(
            xp = current.xp + result.xpEarned,
            coins = current.coins + result.coinsEarned,
            totalMatches = current.totalMatches + 1,
            wins = current.wins + (if (result.won) 1 else 0),
            losses = current.losses + (if (!result.won) 1 else 0),
            currentStreak = newStreak,
            longestStreak = longestStreak,
            currentLevel = unlockedLevel,
            totalAnswers = current.totalAnswers + result.totalRounds,
            correctAnswers = current.correctAnswers + result.correctAnswers,
            fastestAnswerSec = fastest,
            lastMatchTimestamp = result.timestamp
        )
        playerDao.insertOrUpdate(updatedPlayer)

        return checkAchievements(updatedPlayer, result)
    }

    private suspend fun checkAchievements(player: Player, result: RaceResult): List<Achievement> {
        val newlyUnlocked = mutableListOf<Achievement>()

        suspend fun unlock(id: String) {
            val ach = achievementDao.getAchievement(id)
            if (ach != null && !ach.unlocked) {
                val updated = ach.copy(unlocked = true, unlockedAt = System.currentTimeMillis())
                achievementDao.update(updated)
                newlyUnlocked.add(updated)
                val p = getPlayerDirect()
                playerDao.insertOrUpdate(p.copy(xp = p.xp + ach.xpReward, coins = p.coins + ach.coinReward))
            }
        }

        // First Rondo
        if (player.totalMatches >= 1) unlock("first_rondo")
        // Hat-Trick
        if (result.bestStreak >= 3) unlock("hat_trick")
        // On Fire (10 streak)
        if (result.bestStreak >= 10 || player.longestStreak >= 10) unlock("on_fire")
        // Football Brain (10 wins)
        if (player.wins >= 10) unlock("football_brain")
        // Speedster
        if (result.avgResponseTime in 0.1..1.5 && result.correctAnswers > 0) unlock("speedster")
        // Perfect Rondo
        if (result.won && result.correctAnswers >= 5) unlock("perfect_rondo")
        // Clasico Master
        if (result.categoryId.contains("barca") && result.won) unlock("clasico_master")
        // Level 10 (Boss conquered)
        if (result.level == 10 && result.won) unlock("level_10")
        // Daily champ
        if (result.gameMode == "DAILY" && result.won) unlock("daily_champ")

        return newlyUnlocked
    }

    suspend fun resetProgress() {
        raceResultDao.clearAll()
        achievementDao.resetAll()
        playerDao.insertOrUpdate(Player())
    }
}
