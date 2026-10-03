package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = RondoGold,
    onPrimary = Color(0xFF1A1300),
    primaryContainer = RondoDarkBrown,
    onPrimaryContainer = RondoGoldLight,
    secondary = RondoGoldLight,
    onSecondary = Color(0xFF15110E),
    secondaryContainer = Color(0xFF2C2018),
    onSecondaryContainer = RondoGoldLight,
    tertiary = RondoSoftPink,
    onTertiary = Color(0xFF3B1E26),
    tertiaryContainer = Color(0xFF422730),
    onTertiaryContainer = RondoSoftPink,
    background = RondoDarkBg,
    onBackground = RondoDarkPrimaryText,
    surface = RondoDarkCard,
    onSurface = RondoDarkPrimaryText,
    surfaceVariant = RondoDarkSecondaryBg,
    onSurfaceVariant = RondoDarkSecondaryText,
    outline = RondoDarkBorder,
    error = StrikeErrorRed,
    onError = Color.White
)

private val LightColorScheme = lightColorScheme(
    primary = RondoGoldDark,
    onPrimary = Color.White,
    primaryContainer = RondoLightSecondaryBg,
    onPrimaryContainer = RondoLightDarkText,
    secondary = RondoGold,
    onSecondary = Color.White,
    secondaryContainer = RondoSoftPinkLight,
    onSecondaryContainer = Color(0xFF4A2530),
    tertiary = RondoSoftPink,
    onTertiary = Color(0xFF381E26),
    tertiaryContainer = Color(0xFFFBECEF),
    onTertiaryContainer = Color(0xFF381E26),
    background = RondoLightBg,
    onBackground = RondoLightDarkText,
    surface = RondoLightCard,
    onSurface = RondoLightDarkText,
    surfaceVariant = RondoLightSecondaryBg,
    onSurfaceVariant = RondoLightSecondaryText,
    outline = RondoLightBorder,
    error = StrikeErrorRed,
    onError = Color.White
)

@Composable
fun RondoTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    RondoTheme(darkTheme = darkTheme, content = content)
}
