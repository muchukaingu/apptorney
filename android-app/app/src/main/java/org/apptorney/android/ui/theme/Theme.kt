package org.apptorney.android.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Color(0xFF111111),
    onPrimary = Color.White,
    secondary = Color(0xFF222222),
    onSecondary = Color.White,
    background = Color(0xFFFFFFFF),
    onBackground = Color(0xFF111111),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF111111),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFFFFFFF),
    onPrimary = Color(0xFF111111),
    secondary = Color(0xFFE0E0E0),
    onSecondary = Color(0xFF111111),
    background = Color(0xFF111111),
    onBackground = Color(0xFFF3F3F3),
    surface = Color(0xFF1A1A1A),
    onSurface = Color(0xFFF3F3F3),
)

@Composable
fun ApptorneyTheme(content: @Composable () -> Unit) {
    val useDark = isSystemInDarkTheme()
    MaterialTheme(
        colorScheme = if (useDark) DarkColors else LightColors,
        content = content,
    )
}
