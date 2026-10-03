package com.example.ui.screens.stats

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.SportsSoccer
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Player
import com.example.data.model.RaceResult
import com.example.ui.theme.ArenaDark
import com.example.ui.theme.PitchGreenDark
import com.example.ui.theme.RondoGold
import com.example.ui.theme.RondoGreen
import com.example.ui.theme.RondoRed
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.roundToInt

@Composable
fun StatisticsScreen(
    player: Player,
    recentResults: List<RaceResult>,
    onBack: () -> Unit
) {
    val averageScore = if (recentResults.isNotEmpty()) {
        val avg = recentResults.map { it.score }.average()
        (avg * 10).roundToInt() / 10.0
    } else 0.0

    val averageRounds = if (recentResults.isNotEmpty()) {
        val avg = recentResults.map { it.rounds }.average()
        (avg * 10).roundToInt() / 10.0
    } else 0.0

    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        Scaffold(
            containerColor = MaterialTheme.colorScheme.background,
            topBar = {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(ArenaDark)
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "رجوع",
                            tint = RondoGold
                        )
                    }
                    Text(
                        text = "تحليلات وإحصائيات الروندو 📊",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.ExtraBold,
                        color = RondoGold
                    )
                    Box(modifier = Modifier.size(48.dp))
                }
            }
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Key Performance Metrics Grid
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        StatTile(
                            label = "أسرع استجابة وتمريرة",
                            value = if (player.fastestAnswerSec > 0.0) String.format(Locale.US, "%.1f", player.fastestAnswerSec) else "-",
                            unit = "ثانية",
                            accentColor = RondoGold,
                            icon = Icons.Default.Timer,
                            modifier = Modifier.weight(1f)
                        )
                        StatTile(
                            label = "أطول سلسلة (Combo)",
                            value = "${player.longestStreak}",
                            unit = "تمريرة",
                            accentColor = Color(0xFFF97316),
                            icon = Icons.Default.LocalFireDepartment,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        StatTile(
                            label = "إجمالي التمريرات",
                            value = "${player.correctAnswers}",
                            unit = "ناجحة",
                            accentColor = RondoGreen,
                            icon = Icons.Default.SportsSoccer,
                            modifier = Modifier.weight(1f)
                        )
                        StatTile(
                            label = "معدل الانتصارات",
                            value = "${player.winRate.toInt()}%",
                            unit = "(${player.wins}/${player.totalMatches})",
                            accentColor = RondoGold,
                            icon = Icons.Default.EmojiEvents,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // Score Progression Graph
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, RondoGold.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                text = "منحنى النقاط في المباريات الأخيرة 📈",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = RondoGold
                            )

                            if (recentResults.size >= 2) {
                                ScoreProgressionChart(
                                    results = recentResults.take(10).reversed(),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(140.dp)
                                    )
                            } else {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(100.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "العب مباراتين أو أكثر لمشاهدة منحنى تطور نقاطك في الروندو",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }

                // Recent Matches History Log
                item {
                    Text(
                        text = "سجل المواجهات الأخيرة ⚽",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }

                if (recentResults.isEmpty()) {
                    item {
                        Text(
                            text = "لم تلعب أي مباراة روندو بعد. ابدأ أول مواجهة الآن!",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                } else {
                    items(recentResults) { res ->
                        RecentMatchHistoryItem(res)
                    }
                }
            }
        }
    }
}

@Composable
private fun ScoreProgressionChart(
    results: List<RaceResult>,
    modifier: Modifier = Modifier
) {
    val maxScore = (results.maxOfOrNull { it.score } ?: 200).coerceAtLeast(100).toFloat()
    val points = results.map { it.score.toFloat() }

    Canvas(modifier = modifier) {
        val width = size.width
        val height = size.height
        val stepX = width / (points.size - 1).coerceAtLeast(1)

        val path = Path()
        points.forEachIndexed { index, score ->
            val x = index * stepX
            val y = height - (score / maxScore * (height - 30f)) - 10f

            if (index == 0) {
                path.moveTo(x, y)
            } else {
                path.lineTo(x, y)
            }

            drawCircle(
                color = RondoGold,
                radius = 6f,
                center = Offset(x, y)
            )
        }

        drawPath(
            path = path,
            color = RondoGold,
            style = Stroke(width = 3.dp.toPx(), cap = StrokeCap.Round)
        )
    }
}

@Composable
private fun RecentMatchHistoryItem(result: RaceResult) {
    val dateFormat = SimpleDateFormat("dd/MM - HH:mm", Locale.getDefault())
    val dateStr = dateFormat.format(Date(result.timestamp))

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(
                1.dp,
                if (result.won) RondoGreen.copy(alpha = 0.5f) else RondoRed.copy(alpha = 0.4f),
                RoundedCornerShape(14.dp)
            ),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(12.dp)
                        .clip(CircleShape)
                        .background(if (result.won) RondoGreen else RondoRed)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = if (result.won) "🏆 انتصار في الروندو" else "💥 نهاية الجولة",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "فئة: ${result.categoryTitle} • $dateStr",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "${result.score} نقطة",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Black,
                    color = RondoGold
                )
                Text(
                    text = "${result.rounds} تمريرة",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun StatTile(
    label: String,
    value: String,
    unit: String,
    accentColor: Color,
    icon: ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.border(
            1.dp,
            MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
            RoundedCornerShape(14.dp)
        ),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Icon(imageVector = icon, contentDescription = null, tint = accentColor, modifier = Modifier.size(16.dp))
            }
            Row(verticalAlignment = Alignment.Bottom) {
                Text(
                    text = value,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onSurface
                )
                if (unit.isNotEmpty()) {
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = unit,
                        style = MaterialTheme.typography.labelSmall,
                        color = accentColor,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(bottom = 2.dp)
                    )
                }
            }
        }
    }
}
