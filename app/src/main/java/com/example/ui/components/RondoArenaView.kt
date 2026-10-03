package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material.icons.filled.SportsSoccer
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.FootballCategory
import com.example.data.model.FootballPlayer
import com.example.ui.screens.race.RondoPhase
import com.example.ui.theme.ArenaDark
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.PitchGreenDark
import com.example.ui.theme.PitchGreenLight
import com.example.ui.theme.PitchGreenMid
import com.example.ui.theme.PitchLineWhite
import com.example.ui.theme.RondoGold
import com.example.ui.theme.RondoRed

@Composable
fun RondoArenaView(
    category: FootballCategory,
    turnOwner: Int, // 1: Player 1, 2: Player 2 or AI
    phase: RondoPhase,
    remainingSeconds: Float,
    totalTurnSeconds: Int,
    isCritical: Boolean,
    opponentName: String,
    isOpponentAI: Boolean,
    player1Score: Int,
    player1Streak: Int,
    player2Score: Int,
    usedPlayers: List<FootballPlayer>,
    modifier: Modifier = Modifier
) {
    val progressFraction = (remainingSeconds / totalTurnSeconds.toFloat()).coerceIn(0f, 1f)

    val timerColor by animateColorAsState(
        targetValue = when {
            isCritical -> RondoRed
            remainingSeconds <= 2.5f -> Color(0xFFF59E0B)
            else -> RondoGold
        },
        animationSpec = tween(150),
        label = "timer_color_anim"
    )

    val infiniteTransition = rememberInfiniteTransition(label = "pulse_crit")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = if (isCritical) 1.12f else 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(280, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_scale"
    )

    val ballTargetFraction = if (turnOwner == 1) 0.15f else 0.85f
    val ballPosition by animateFloatAsState(
        targetValue = ballTargetFraction,
        animationSpec = tween(durationMillis = 400, easing = FastOutSlowInEasing),
        label = "ball_position"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        ArenaDark,
                        PitchGreenDark,
                        PitchGreenMid
                    )
                )
            )
            .border(2.dp, RondoGold.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Category Banner Header
        CategoryHeaderBadge(category = category)

        Spacer(modifier = Modifier.height(14.dp))

        // Pitch Arena Canvas with Players & Center Circle
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
                .clip(RoundedCornerShape(18.dp))
                .background(
                    Brush.linearGradient(
                        colors = listOf(PitchGreenMid, PitchGreenDark, PitchGreenLight.copy(alpha = 0.4f))
                    )
                )
                .border(1.5.dp, PitchLineWhite.copy(alpha = 0.35f), RoundedCornerShape(18.dp))
                .padding(10.dp)
        ) {
            // Center Pitch Circle & Line
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .align(Alignment.Center)
                    .border(1.5.dp, PitchLineWhite.copy(alpha = 0.25f), CircleShape)
            )
            Box(
                modifier = Modifier
                    .width(1.5.dp)
                    .height(140.dp)
                    .align(Alignment.Center)
                    .background(PitchLineWhite.copy(alpha = 0.25f))
            )

            // Left Side: Player 1 (You)
            PlayerPitchNode(
                name = "أنت 👤",
                score = player1Score,
                streak = player1Streak,
                isActive = (turnOwner == 1 && phase != RondoPhase.COUNTDOWN && phase != RondoPhase.FINISHED),
                isAI = false,
                modifier = Modifier.align(Alignment.CenterStart)
            )

            // Center: Circular Live Countdown
            Box(
                modifier = Modifier
                    .align(Alignment.Center)
                    .scale(if (isCritical) pulseScale else 1.0f),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    progress = { progressFraction },
                    modifier = Modifier.size(76.dp),
                    color = timerColor,
                    strokeWidth = 6.dp,
                    trackColor = Color.Black.copy(alpha = 0.45f),
                )
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = String.format("%.1f", remainingSeconds.coerceAtLeast(0f)),
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Black,
                        color = timerColor
                    )
                    Text(
                        text = "ثواني",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.White.copy(alpha = 0.7f),
                        fontSize = 9.sp
                    )
                }
            }

            // Right Side: Opponent (AI or Player 2)
            PlayerPitchNode(
                name = opponentName,
                score = player2Score,
                streak = 0,
                isActive = (turnOwner == 2 && phase != RondoPhase.COUNTDOWN && phase != RondoPhase.FINISHED),
                isAI = isOpponentAI,
                modifier = Modifier.align(Alignment.CenterEnd)
            )

            // Animated Football traveling between players
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 6.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(fraction = ballPosition)
                )
                Icon(
                    imageVector = Icons.Default.SportsSoccer,
                    contentDescription = "كرة القدم",
                    tint = Color.White,
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .background(Color.Black.copy(alpha = 0.4f))
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Pass History Strip (Used players in current rondo)
        if (usedPlayers.isNotEmpty()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "تمريرات الجولة (${usedPlayers.size}):",
                    style = MaterialTheme.typography.labelMedium,
                    color = RondoGold,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.width(6.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(usedPlayers.takeLast(6)) { player ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFF1E293B).copy(alpha = 0.85f),
                            border = androidx.compose.foundation.BorderStroke(0.5.dp, RondoGold.copy(alpha = 0.4f))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "⚽",
                                    fontSize = 11.sp
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = player.arabicName,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Color.White,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CategoryHeaderBadge(category: FootballCategory) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.Black.copy(alpha = 0.55f),
        border = androidx.compose.foundation.BorderStroke(1.dp, RondoGold.copy(alpha = 0.7f)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(vertical = 8.dp, horizontal = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = category.iconEmoji,
                    fontSize = 18.sp
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = category.titleAr,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.ExtraBold,
                    color = RondoGold,
                    textAlign = TextAlign.Center
                )
            }
            Text(
                text = category.descriptionAr,
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.85f),
                textAlign = TextAlign.Center,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
private fun PlayerPitchNode(
    name: String,
    score: Int,
    streak: Int,
    isActive: Boolean,
    isAI: Boolean,
    modifier: Modifier = Modifier
) {
    val borderColor = if (isActive) RondoGold else Color.Transparent
    val bgGlow = if (isActive) RondoGold.copy(alpha = 0.25f) else Color.Black.copy(alpha = 0.4f)

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .background(bgGlow)
            .border(2.dp, borderColor, RoundedCornerShape(14.dp))
            .padding(8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(if (isAI) NeonCyan.copy(alpha = 0.2f) else RondoGold.copy(alpha = 0.25f))
                .border(1.5.dp, if (isAI) NeonCyan else RondoGold, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = if (isAI) Icons.Default.SmartToy else Icons.Default.Person,
                contentDescription = name,
                tint = if (isAI) NeonCyan else RondoGold,
                modifier = Modifier.size(20.dp)
            )
        }

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = name,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )

        Text(
            text = "$score نقطة",
            style = MaterialTheme.typography.labelSmall,
            color = RondoGold,
            fontWeight = FontWeight.ExtraBold,
            fontSize = 10.sp
        )

        if (streak >= 3) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(top = 2.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.LocalFireDepartment,
                    contentDescription = "Streak",
                    tint = Color(0xFFF97316),
                    modifier = Modifier.size(12.dp)
                )
                Text(
                    text = "x$streak",
                    color = Color(0xFFF97316),
                    fontWeight = FontWeight.Black,
                    fontSize = 10.sp
                )
            }
        }
    }
}
