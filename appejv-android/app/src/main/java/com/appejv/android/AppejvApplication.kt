package com.appejv.android

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class AppejvApplication : Application() {
    override fun onCreate() {
        super.onCreate()
    }
}
