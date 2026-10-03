package com.example.ui.screens.levels

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.SportsSoccer
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
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
import com.example.data.model.FootballCategory
import com.example.data.repository.FootballCatalog
import com.example.ui.theme.ArenaDark
import com.example.ui.theme.PitchGreenDark
import com.example.ui.theme.RondoGold
import com.example.ui.theme.RondoGreen

@Composable
fun LevelsScreen(
    currentUnlockedLevel: Int,
    onSelectLevel: (Int) -> Unit,
    onBack: () -> Unit
) {
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
                        text = "مستويات الروندو (10 مراحل) 🏆",
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
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    Text(
                        text = "اختر مرحلتك الكروية، تغلب على فئات التحدي واصعد نحو مواجهة الزعيم الأكبر!",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 6.dp)
                    )
                }

                items(FootballCatalog.allCategories) { category ->
                    val isUnlocked = category.levelNumber <= currentUnlockedLevel
                    val isCompleted = category.levelNumber < currentUnlockedLevel
                    val isCurrent = category.levelNumber == currentUnlockedLevel

                    CategoryLevelCard(
                        category = category,
                        isUnlocked = isUnlocked,
                        isCompleted = isCompleted,
                        isCurrent = isCurrent,
                        onClick = {
                            if (isUnlocked) {
                                onSelectLevel(category.levelNumber)
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun CategoryLevelCard(
    category: FootballCategory,
    isUnlocked: Boolean,
    isCompleted: Boolean,
    isCurrent: Boolean,
    onClick: () -> Unit
) {
    val isBoss = category.levelNumber == 10

    val borderColor = when {
        isBoss && isUnlocked -> RondoGold
        isCurrent -> RondoGold
        isCompleted -> RondoGreen
        else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.35f)
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = isUnlocked) { onClick() }
            .border(
                width = if (isCurrent || isBoss) 2.dp else 1.dp,
                color = borderColor,
                shape = RoundedCornerShape(18.dp)
            ),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isUnlocked) MaterialTheme.colorScheme.surface else Color(0xFF0D121F)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Level badge number & icon
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(
                            when {
                                isBoss && isUnlocked -> Brush.linearGradient(listOf(RondoGold, Color(0xFFB45309)))
                                isCompleted -> Brush.linearGradient(listOf(RondoGreen, Color(0xFF059669)))
                                isCurrent -> Brush.linearGradient(listOf(RondoGold, PitchGreenDark))
                                else -> Brush.linearGradient(listOf(Color(0xFF1E293B), Color(0xFF0F172A)))
                            }
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    if (isCompleted) {
                        Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = Color.White, modifier = Modifier.size(24.dp))
                    } else if (isUnlocked) {
                        Text(
                            text = "${category.levelNumber}",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Black,
                            color = if (isCurrent) Color.Black else Color.White
                        )
                    } else {
                        Icon(imageVector = Icons.Default.Lock, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(20.dp))
                    }
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = category.titleAr,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (isUnlocked) MaterialTheme.colorScheme.onSurface else Color(0xFF64748B)
                        )
                        if (isBoss) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = RondoGold.copy(alpha = 0.2f),
                                border = androidx.compose.foundation.BorderStroke(0.5.dp, RondoGold)
                            ) {
                                Text(
                                    text = "👑 الزعيم",
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Black,
                                    color = RondoGold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }

                    Text(
                        text = category.descriptionAr,
                        style = MaterialTheme.typography.bodySmall,
                        color = if (isUnlocked) MaterialTheme.colorScheme.onSurfaceVariant else Color(0xFF475569)
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Timer,
                                contentDescription = null,
                                tint = if (isUnlocked) RondoGold else Color(0xFF475569),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "وقت التمرير: ${category.timerSeconds} ثوانٍ",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (isUnlocked) RondoGold else Color(0xFF475569),
                                fontWeight = FontWeight.SemiBold
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.SportsSoccer,
                                contentDescription = null,
                                tint = if (isUnlocked) MaterialTheme.colorScheme.onSurfaceVariant else Color(0xFF475569),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = category.difficulty.titleAr,
                                style = MaterialTheme.typography.labelSmall,
                                color = if (isUnlocked) MaterialTheme.colorScheme.onSurfaceVariant else Color(0xFF475569)
                            )
                        }
                    }
                }
            }

            // Action button
            if (isUnlocked) {
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(if (isCurrent) RondoGold else MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = "بدء المرحلة",
                        tint = if (isCurrent) Color.Black else MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}
