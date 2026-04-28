package com.lockin.timer.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface TimerDao {
    @Insert
    suspend fun insert(segment: TimerSegment): Long

    @Query("SELECT * FROM timer_segments ORDER BY startTimeMs DESC")
    fun getAllSegments(): Flow<List<TimerSegment>>

    @Query("DELETE FROM timer_segments WHERE id = :id")
    suspend fun deleteById(id: Long)
}
