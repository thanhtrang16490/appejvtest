package com.appejv.android.core.utils

object Constants {
    const val API_BASE_URL = "https://api.appejv.app/api/v1/"
    const val SUPABASE_URL = "https://mrcmratcnlsoxctsbalt.supabase.co"
    const val SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY21yYXRjbmxzb3hjdHNiYWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNzAxNjcsImV4cCI6MjA4NTg0NjE2N30.W87kTi4pxY8qbam72R-Jdh0SCmUiIkROdNWx8rRsTOk"
    
    // Preferences
    const val PREFS_NAME = "appejv_prefs"
    const val KEY_ACCESS_TOKEN = "access_token"
    const val KEY_REFRESH_TOKEN = "refresh_token"
    const val KEY_USER_ID = "user_id"
    const val KEY_USER_EMAIL = "user_email"
    const val KEY_USER_ROLE = "user_role"
    
    // API Timeouts
    const val CONNECT_TIMEOUT = 30L
    const val READ_TIMEOUT = 30L
    const val WRITE_TIMEOUT = 30L
}
