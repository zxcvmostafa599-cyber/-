package com.example.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.CyberGold
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.SuccessGreen

@Composable
fun CountdownOverlay(
    count: Int, // 3, 2, 1, 0 (0 means GO / انطلق)
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.75f)),
        contentAlignment = Alignment.Center
    ) {
        AnimatedContent(
            targetState = count,
            transitionSpec = {
                (scaleIn(initialScale = 0.4f) + fadeIn()) togetherWith (scaleOut(targetScale = 1.6f) + fadeOut())
            },
            label = "countdown_anim"
        ) { targetCount ->
            val (displayText, textColor, circleBrush) = when (targetCount) {
                3 -> Triple(
                    "3",
                    CyberGold,
                    Brush.radialGradient(listOf(CyberGold.copy(alpha = 0.3f), Color.Transparent))
                )
                2 -> Triple(
                    "2",
                    NeonCyan,
                    Brush.radialGradient(listOf(NeonCyan.copy(alpha = 0.3f), Color.Transparent))
                )
                1 -> Triple(
                    "1",
                    Color(0xFFF43F5E),
                    Brush.radialGradient(listOf(Color(0xFFF43F5E).copy(alpha = 0.3f), Color.Transparent))
                )
                else -> Triple(
                    "انطلق!",
                    SuccessGreen,
                    Brush.radialGradient(listOf(SuccessGreen.copy(alpha = 0.4f), Color.Transparent))
                )
            }

            Box(
                modifier = Modifier
                    .size(160.dp)
                    .clip(CircleShape)
                    .background(circleBrush)
                    .border(3.dp, textColor, CircleShape)
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = displayText,
                    color = textColor,
                    fontSize = if (targetCount == 0) 36.sp else 64.sp,
                    fontWeight = FontWeight.Black,
                    style = MaterialTheme.typography.displayLarge
                )
            }
        }
    }
}
