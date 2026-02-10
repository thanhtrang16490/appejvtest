package com.appejv.android.core.utils

import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

// Currency formatting
fun Double.toCurrency(): String {
    val format = NumberFormat.getCurrencyInstance(Locale("vi", "VN"))
    return format.format(this)
}

fun Int.toCurrency(): String {
    return this.toDouble().toCurrency()
}

// Date formatting
fun String.toFormattedDate(): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val outputFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
        val date = inputFormat.parse(this)
        outputFormat.format(date ?: Date())
    } catch (e: Exception) {
        this
    }
}

fun String.toFormattedDateTime(): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val outputFormat = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
        val date = inputFormat.parse(this)
        outputFormat.format(date ?: Date())
    } catch (e: Exception) {
        this
    }
}

// Order status
fun String.getOrderStatusText(): String {
    return when (this) {
        "draft" -> "Đơn nháp"
        "ordered" -> "Đơn đặt hàng"
        "shipping" -> "Giao hàng"
        "paid" -> "Thanh toán"
        "completed" -> "Hoàn thành"
        "cancelled" -> "Đã hủy"
        else -> this
    }
}

// String utilities
fun String.getInitials(): String {
    val words = this.trim().split(" ")
    return if (words.size >= 2) {
        "${words[0].first()}${words[1].first()}".uppercase()
    } else {
        this.take(2).uppercase()
    }
}
