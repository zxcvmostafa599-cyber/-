package com.example.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.RacerAIColor

@Composable
fun RaceTrackView(
    playerProgress: Float,
    aiProgress: Float,
    playerWpm: Double,
    aiWpm: Double,
    playerName: String = "أنت",
    aiName: String = "الذكاء الاصطناعي",
    modifier: Modifier = Modifier
) {
    val animatedPlayerProgress by animateFloatAsState(
        targetValue = playerProgress.coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = 200),
        label = "player_race_anim"
    )

    val animatedAiProgress by animateFloatAsState(
        targetValue = aiProgress.coerceIn(0f, 1f),
        animationSpec = tween(durationMillis = 250),
        label = "ai_race_anim"
    )

    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        Column(
            modifier = modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant)
                .border(
                    width = 1.dp,
                    color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                    shape = RoundedCornerShape(16.dp)
                )
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Track Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "🏁 مسار السباق المباشر",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = "خط النهاية ⬅️",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.tertiary
                )
            }

            // Player Lane
            RacerLane(
                name = playerName,
                speedText = "${playerWpm.toInt()} ك/د",
                percentage = (playerProgress * 100).toInt(),
                progress = animatedPlayerProgress,
                accentColor = NeonCyan,
                icon = {
                    Icon(
                        imageVector = Icons.Default.DirectionsCar,
                        contentDescription = "سيارة اللاعب",
                        tint = Color.Black,
                        modifier = Modifier.size(18.dp)
                    )
                }
            )

            // AI Lane
            RacerLane(
                name = aiName,
                speedText = "${aiWpm.toInt()} ك/د",
                percentage = (aiProgress * 100).toInt(),
                progress = animatedAiProgress,
                accentColor = RacerAIColor,
                icon = {
                    Icon(
                        imageVector = Icons.Default.SmartToy,
                        contentDescription = "الخصم الذكي",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
            )
        }
    }
}

@Composable
private fun RacerLane(
    name: String,
    speedText: String,
    percentage: Int,
    progress: Float,
    accentColor: Color,
    icon: @Composable () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(accentColor)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = name,
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = speedText,
                    style = MaterialTheme.typography.labelSmall,
                    color = accentColor,
                    fontWeight = FontWeight.Bold
                )
            }
            Text(
                text = "$percentage%",
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Track lane bar with car moving across
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(30.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFF070B14))
                .border(0.5.dp, Color(0xFF1E293B), RoundedCornerShape(8.dp))
                .padding(horizontal = 4.dp),
            contentAlignment = Alignment.CenterStart
        ) {
            // Lane road dashes
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                repeat(8) {
                    Box(
                        modifier = Modifier
                            .width(16.dp)
                            .height(2.dp)
                            .background(Color(0x22FFFFFF))
                    )
                }
            }

            // Progress bar fill
            Box(
                modifier = Modifier
                    .fillMaxWidth(fraction = progress.coerceIn(0.01f, 1f))
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp))
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(accentColor.copy(alpha = 0.3f), accentColor)
                        )
                    )
            )

            // Vehicle Badge positioned according to progress
            Box(
                modifier = Modifier
                    .fillMaxWidth(),
                contentAlignment = Alignment.CenterStart
            ) {
                // Approximate container width offset
                Row(
                    modifier = Modifier.fillMaxWidth(fraction = progress.coerceIn(0f, 1f)),
                    horizontalArrangement = Arrangement.End
                ) {
                    Box(
                        modifier = Modifier
                            .size(26.dp)
                            .clip(CircleShape)
                            .background(accentColor)
                            .border(1.5.dp, Color.White.copy(alpha = 0.8f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        icon()
                    }
                }
            }
        }
    }
}
