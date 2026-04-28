package com.lockin.timer.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.lockin.timer.data.TimerDatabase
import com.lockin.timer.data.TimerSegment
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class TimerViewModel(app: Application) : AndroidViewModel(app) {
    private val dao = TimerDatabase.getInstance(app).timerDao()

    val segments = dao.getAllSegments().stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        emptyList()
    )

    fun saveSegment(title: String, startMs: Long, endMs: Long) {
        viewModelScope.launch {
            dao.insert(
                TimerSegment(
                    title = title.ifBlank { "Untitled" },
                    startTimeMs = startMs,
                    endTimeMs = endMs,
                    durationMs = endMs - startMs
                )
            )
        }
    }

    fun deleteSegment(id: Long) {
        viewModelScope.launch { dao.deleteById(id) }
    }
}
