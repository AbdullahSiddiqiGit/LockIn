package com.lockin.timer.ui

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognizerIntent
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.textfield.TextInputEditText
import com.lockin.timer.R
import com.lockin.timer.databinding.ActivityMainBinding
import kotlinx.coroutines.launch
import java.util.Locale
import java.util.concurrent.TimeUnit

class MainActivity : AppCompatActivity() {

    private lateinit var b: ActivityMainBinding
    private val vm: TimerViewModel by viewModels()

    private var isRunning = false
    private var startTimeMs = 0L
    private var elapsedMs = 0L

    private val handler = Handler(Looper.getMainLooper())
    private val ticker = object : Runnable {
        override fun run() {
            elapsedMs = System.currentTimeMillis() - startTimeMs
            updateTimerDisplay(elapsedMs)
            handler.postDelayed(this, 100)
        }
    }

    private val speechLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val text = result.data
                ?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
                ?.firstOrNull() ?: ""
            pendingTitleInput?.setText(text)
        }
    }

    private var pendingTitleInput: TextInputEditText? = null

    private val adapter = SegmentsAdapter { id -> vm.deleteSegment(id) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        b = ActivityMainBinding.inflate(layoutInflater)
        setContentView(b.root)

        b.rvSegments.adapter = adapter

        b.btnStartStop.setOnClickListener {
            if (isRunning) stopTimer() else startTimer()
        }

        lifecycleScope.launch {
            vm.segments.collect { segments ->
                adapter.submitList(segments)
                b.tvEmptyHint.visibility = if (segments.isEmpty()) View.VISIBLE else View.GONE
            }
        }
    }

    private fun startTimer() {
        startTimeMs = System.currentTimeMillis()
        isRunning = true
        b.btnStartStop.text = getString(R.string.stop)
        b.btnStartStop.setIconResource(R.drawable.ic_stop)
        handler.post(ticker)
    }

    private fun stopTimer() {
        val endMs = System.currentTimeMillis()
        handler.removeCallbacks(ticker)
        isRunning = false
        b.btnStartStop.text = getString(R.string.start)
        b.btnStartStop.setIconResource(R.drawable.ic_play)
        showSaveTitleDialog(startTimeMs, endMs, elapsedMs)
        updateTimerDisplay(0)
        elapsedMs = 0
    }

    private fun showSaveTitleDialog(startMs: Long, endMs: Long, durationMs: Long) {
        val view = layoutInflater.inflate(R.layout.dialog_save_segment, null)
        val etTitle = view.findViewById<TextInputEditText>(R.id.etTitle)
        pendingTitleInput = etTitle

        val durationText = SegmentsAdapter.formatDuration(durationMs)

        AlertDialog.Builder(this, R.style.DialogTheme)
            .setTitle(getString(R.string.dialog_title))
            .setMessage(getString(R.string.dialog_duration_label, durationText))
            .setView(view)
            .setPositiveButton(R.string.save) { _, _ ->
                val title = etTitle.text?.toString() ?: ""
                vm.saveSegment(title, startMs, endMs)
                pendingTitleInput = null
            }
            .setNegativeButton(R.string.discard) { _, _ ->
                pendingTitleInput = null
            }
            .setNeutralButton(R.string.mic) { _, _ ->
                // mic button re-opens dialog after speech — handled via speech launcher callback
            }
            .show()
            .also { dialog ->
                dialog.getButton(AlertDialog.BUTTON_NEUTRAL).setOnClickListener {
                    launchSpeechInput()
                    // Keep dialog open so user sees the filled text
                }
            }
    }

    private fun launchSpeechInput() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
            putExtra(RecognizerIntent.EXTRA_PROMPT, getString(R.string.mic_prompt))
        }
        try {
            speechLauncher.launch(intent)
        } catch (e: Exception) {
            Toast.makeText(this, R.string.speech_not_available, Toast.LENGTH_SHORT).show()
        }
    }

    private fun updateTimerDisplay(ms: Long) {
        val h = TimeUnit.MILLISECONDS.toHours(ms)
        val m = TimeUnit.MILLISECONDS.toMinutes(ms) % 60
        val s = TimeUnit.MILLISECONDS.toSeconds(ms) % 60
        val cents = (ms % 1000) / 10

        b.tvHours.text = "%02d".format(h)
        b.tvMinutes.text = "%02d".format(m)
        b.tvSeconds.text = "%02d".format(s)
        b.tvCentiseconds.text = "%02d".format(cents)

        b.tvHours.visibility = if (h > 0) View.VISIBLE else View.GONE
        b.tvColonHours.visibility = if (h > 0) View.VISIBLE else View.GONE
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(ticker)
    }
}
