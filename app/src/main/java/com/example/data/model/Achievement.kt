package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "achievements")
data class Achievement(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val iconName: String,
    val unlocked: Boolean = false,
    val unlockedAt: Long? = null,
    val coinReward: Int = 20,
    val xpReward: Int = 100
)
