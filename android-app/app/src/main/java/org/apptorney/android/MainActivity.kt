package org.apptorney.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import org.apptorney.android.ui.ApptorneyApp
import org.apptorney.android.ui.theme.ApptorneyTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ApptorneyTheme {
                ApptorneyApp()
            }
        }
    }
}
