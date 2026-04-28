package com.lockin.timer.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "timer_segments")
data class TimerSegment(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val startTimeMs: Long,
    val endTimeMs: Long,
    val durationMs: Long
)
