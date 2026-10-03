package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "race_results")
data class RaceResult(
    @PrimaryKey(autoGenerate = true) val id: Long = 0L,
    val categoryId: String,
    val categoryTitle: String,
    val level: Int = 1,
    val gameMode: String, // "AI", "LOCAL_2P", "QUICK", "LEVEL", "DAILY"
    val opponentName: String = "الذكاء الاصطناعي",
    val correctAnswers: Int,
    val totalRounds: Int,
    val bestStreak: Int,
    val avgResponseTime: Double,
    val score: Int,
    val won: Boolean,
    val reason: String = "",
    val xpEarned: Int,
    val coinsEarned: Int,
    val timestamp: Long = System.currentTimeMillis()
)
