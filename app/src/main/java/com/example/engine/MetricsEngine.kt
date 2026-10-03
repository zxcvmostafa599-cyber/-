package com.example.engine

import kotlin.math.roundToInt

data class RaceMetrics(
    val wpm: Double,
    val accuracy: Double,
    val errors: Int,
    val timeSeconds: Double,
    val score: Int,
    val xpEarned: Int,
    val coinsEarned: Int
)

object MetricsEngine {

    /**
     * Standard typing formula: WPM = (Characters / 5) / (seconds / 60)
     */
    fun calculateWpm(correctChars: Int, elapsedSeconds: Double): Double {
        if (elapsedSeconds <= 0.5) return 0.0
        val minutes = elapsedSeconds / 60.0
        val words = correctChars.toDouble() / 5.0
        val rawWpm = words / minutes
        return (rawWpm * 10.0).roundToInt() / 10.0 // 1 decimal place
    }

    /**
     * Accuracy = (Correct Characters / Total Characters Typed) * 100
     */
    fun calculateAccuracy(correctChars: Int, totalTypedChars: Int): Double {
        if (totalTypedChars <= 0) return 100.0
        val raw = (correctChars.toDouble() / totalTypedChars.toDouble()) * 100.0
        return ((raw * 10.0).roundToInt() / 10.0).coerceIn(0.0, 100.0)
    }

    /**
     * Calculates competitive game score based on performance metrics.
     */
    fun calculateScore(
        wpm: Double,
        accuracy: Double,
        timeSeconds: Double,
        level: Int,
        won: Boolean,
        streak: Int
    ): Int {
        val baseScore = (wpm * 20.0).toInt()
        val accuracyMultiplier = (accuracy / 100.0)
        val accuracyBonus = when {
            accuracy >= 100.0 -> 500
            accuracy >= 98.0 -> 300
            accuracy >= 95.0 -> 150
            accuracy >= 90.0 -> 50
            else -> 0
        }
        val levelBonus = level * 80
        val streakBonus = (streak.coerceAtMost(10)) * 30
        val winBonus = if (won) 350 else 50
        val timePenalty = (timeSeconds * 2.0).toInt().coerceAtMost(300)

        val total = ((baseScore * accuracyMultiplier).toInt() + accuracyBonus + levelBonus + streakBonus + winBonus - timePenalty)
        return total.coerceAtLeast(50)
    }

    /**
     * Calculates XP and Coins earned for the race.
     */
    fun calculateRewards(
        won: Boolean,
        accuracy: Double,
        wpm: Double,
        isNewRecord: Boolean,
        level: Int
    ): Pair<Int, Int> {
        var xp = 60
        var coins = 10

        if (won) {
            xp += 60
            coins += 20
        }
        if (accuracy >= 98.0) {
            xp += 40
            coins += 15
        } else if (accuracy >= 92.0) {
            xp += 20
            coins += 5
        }
        if (isNewRecord) {
            xp += 100
            coins += 25
        }
        xp += level * 15
        coins += level * 3

        return Pair(xp, coins)
    }
}
