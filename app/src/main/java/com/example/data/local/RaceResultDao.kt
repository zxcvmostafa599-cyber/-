package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.data.model.RaceResult
import kotlinx.coroutines.flow.Flow

@Dao
interface RaceResultDao {
    @Query("SELECT * FROM race_results ORDER BY timestamp DESC")
    fun getAllResults(): Flow<List<RaceResult>>

    @Query("SELECT * FROM race_results ORDER BY timestamp DESC LIMIT :limit")
    fun getRecentResults(limit: Int = 10): Flow<List<RaceResult>>

    @Query("SELECT * FROM race_results WHERE gameMode = :mode ORDER BY timestamp DESC")
    fun getResultsByMode(mode: String): Flow<List<RaceResult>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertResult(result: RaceResult): Long

    @Query("DELETE FROM race_results")
    suspend fun clearAll()
}
