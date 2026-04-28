package com.lockin.timer.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.lockin.timer.data.TimerSegment
import com.lockin.timer.databinding.ItemSegmentBinding
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit

class SegmentsAdapter(
    private val onDelete: (Long) -> Unit
) : ListAdapter<TimerSegment, SegmentsAdapter.ViewHolder>(DIFF) {

    companion object {
        private val DIFF = object : DiffUtil.ItemCallback<TimerSegment>() {
            override fun areItemsTheSame(a: TimerSegment, b: TimerSegment) = a.id == b.id
            override fun areContentsTheSame(a: TimerSegment, b: TimerSegment) = a == b
        }

        private val DATE_FMT = SimpleDateFormat("MMM d, yyyy  h:mm a", Locale.getDefault())

        fun formatDuration(ms: Long): String {
            val h = TimeUnit.MILLISECONDS.toHours(ms)
            val m = TimeUnit.MILLISECONDS.toMinutes(ms) % 60
            val s = TimeUnit.MILLISECONDS.toSeconds(ms) % 60
            return if (h > 0) "%d:%02d:%02d".format(h, m, s)
            else "%02d:%02d".format(m, s)
        }
    }

    inner class ViewHolder(private val b: ItemSegmentBinding) : RecyclerView.ViewHolder(b.root) {
        fun bind(segment: TimerSegment) {
            b.tvTitle.text = segment.title
            b.tvDuration.text = formatDuration(segment.durationMs)
            b.tvDate.text = DATE_FMT.format(Date(segment.startTimeMs))
            b.btnDelete.setOnClickListener { onDelete(segment.id) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) = ViewHolder(
        ItemSegmentBinding.inflate(LayoutInflater.from(parent.context), parent, false)
    )

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
}
