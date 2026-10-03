package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.Player
import kotlinx.coroutines.flow.Flow

@Dao
interface PlayerDao {
    @Query("SELECT * FROM players WHERE id = 1")
    fun getPlayer(): Flow<Player?>

    @Query("SELECT * FROM players WHERE id = 1")
    suspend fun getPlayerDirect(): Player?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(player: Player)

    @Update
    suspend fun update(player: Player)
}
