package com.lockin.timer.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [TimerSegment::class], version = 1, exportSchema = false)
abstract class TimerDatabase : RoomDatabase() {
    abstract fun timerDao(): TimerDao

    companion object {
        @Volatile private var INSTANCE: TimerDatabase? = null

        fun getInstance(context: Context): TimerDatabase =
            INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    TimerDatabase::class.java,
                    "timer_db"
                ).build().also { INSTANCE = it }
            }
    }
}
