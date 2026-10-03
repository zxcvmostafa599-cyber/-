package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "players")
data class Player(
    @PrimaryKey val id: Int = 1,
    val name: String = "لاعب روندو",
    val xp: Int = 0,
    val coins: Int = 100,
    val currentLevel: Int = 1,
    val totalMatches: Int = 0,
    val wins: Int = 0,
    val losses: Int = 0,
    val currentStreak: Int = 0,
    val longestStreak: Int = 0,
    val totalAnswers: Int = 0,
    val correctAnswers: Int = 0,
    val fastestAnswerSec: Double = 0.0,
    val lastMatchTimestamp: Long = 0L
) {
    val winRate: Double
        get() = if (totalMatches > 0) (wins.toDouble() / totalMatches) * 100.0 else 0.0

    val accuracy: Double
        get() = if (totalAnswers > 0) (correctAnswers.toDouble() / totalAnswers) * 100.0 else 100.0

    val playerRankTitle: String
        get() = when {
            xp >= 5000 -> "أسطورة الروندو 👑 (Legend)"
            xp >= 3000 -> "موسوعة كروية 🧠 (Master)"
            xp >= 1500 -> "لاعب نخبة ⚡ (Elite)"
            xp >= 500 -> "منافس محترف ⚽ (Pro)"
            else -> "مبتدئ كرة قدم 👟 (Rookie)"
        }

    val xpForNextRank: Int
        get() = when {
            xp < 500 -> 500
            xp < 1500 -> 1500
            xp < 3000 -> 3000
            xp < 5000 -> 5000
            else -> 10000
        }
}
