package com.example.ui.screens.race

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.SportsSoccer
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.repository.FootballCatalog
import com.example.engine.FootballValidationEngine
import com.example.ui.components.CountdownOverlay
import com.example.ui.components.RondoArenaView
import com.example.ui.theme.ArenaDark
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.PitchGreenDark
import com.example.ui.theme.RondoGold
import com.example.ui.theme.RondoGreen
import com.example.ui.theme.RondoRed

@Composable
fun RaceScreen(
    viewModel: RaceViewModel,
    onFinishRace: (winner: String, score: Int, rounds: Int, streak: Int, time: Double) -> Unit,
    onBack: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val focusRequester = remember { FocusRequester() }
    val keyboardController = LocalSoftwareKeyboardController.current

    // Real-time suggestions for fast pass submission
    val suggestions by remember(uiState.inputQuery, uiState.usedPlayers) {
        derivedStateOf {
            val query = uiState.inputQuery.trim()
            if (query.length < 2) emptyList()
            else {
                val usedIds = uiState.usedPlayers.map { it.id }.toSet()
                FootballValidationEngine.resolvePlayer(query)
                    .filterNot { usedIds.contains(it.id) }
                    .sortedByDescending { uiState.category.predicate(it) }
                    .take(4)
            }
        }
    }

    LaunchedEffect(uiState.phase, uiState.turnOwner) {
        if ((uiState.phase == RondoPhase.PLAYER_TURN && uiState.turnOwner == 1) ||
            (uiState.phase == RondoPhase.OPPONENT_TURN && uiState.gameMode == "LOCAL_2P")
        ) {
            try {
                focusRequester.requestFocus()
            } catch (_: Exception) {}
        } else if (uiState.phase == RondoPhase.FINISHED) {
            keyboardController?.hide()
            onFinishRace(
                uiState.winner ?: "OPPONENT",
                uiState.player1Score,
                uiState.totalRounds,
                uiState.player1BestStreak,
                uiState.avgResponseTimeSeconds
            )
        }
    }

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
                    IconButton(onClick = { viewModel.resign(); onBack() }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "انسحاب ورجوع",
                            tint = RondoGold
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "مباراة روندو ⚽",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.ExtraBold,
                            color = RondoGold
                        )
                        Text(
                            text = when (uiState.gameMode) {
                                "LOCAL_2P" -> "تحدي محلي لشخصين 👥"
                                "LEVEL" -> "المستوى ${uiState.levelNumber} 🏆"
                                "DAILY" -> "التحدي اليومي 📅"
                                else -> "ضد الذكاء الاصطناعي 🤖"
                            },
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                    }

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color.Black.copy(alpha = 0.5f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, RondoGold.copy(alpha = 0.5f))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocalFireDepartment,
                                contentDescription = "Combo",
                                tint = Color(0xFFF97316),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "x${uiState.player1Streak}",
                                fontWeight = FontWeight.Black,
                                color = Color(0xFFF97316),
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Rondo Pitch Arena & Visual Circular Countdown
                    RondoArenaView(
                        category = uiState.category,
                        turnOwner = uiState.turnOwner,
                        phase = uiState.phase,
                        remainingSeconds = uiState.remainingTimeSeconds,
                        totalTurnSeconds = uiState.turnTotalSeconds,
                        isCritical = uiState.isTimerCritical,
                        opponentName = uiState.opponent.nameAr,
                        isOpponentAI = uiState.opponent.isAI,
                        player1Score = uiState.player1Score,
                        player1Streak = uiState.player1Streak,
                        player2Score = uiState.player2Score,
                        usedPlayers = uiState.usedPlayers
                    )

                    // Dynamic Live Feedback Banner
                    if (uiState.feedbackMessage.isNotBlank()) {
                        val bannerBg = when (uiState.isSuccessFeedback) {
                            true -> RondoGreen.copy(alpha = 0.2f)
                            false -> RondoRed.copy(alpha = 0.2f)
                            else -> RondoGold.copy(alpha = 0.15f)
                        }
                        val bannerBorder = when (uiState.isSuccessFeedback) {
                            true -> RondoGreen
                            false -> RondoRed
                            else -> RondoGold
                        }

                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, bannerBorder, RoundedCornerShape(12.dp)),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = bannerBg)
                        ) {
                            Text(
                                text = uiState.feedbackMessage,
                                style = MaterialTheme.typography.bodyMedium,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                textAlign = TextAlign.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp, horizontal = 12.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.weight(1f))

                    // Instant Suggestions Chips (Speed & Mobile Ergonomics)
                    if (suggestions.isNotEmpty()) {
                        Column(modifier = Modifier.fillMaxWidth()) {
                            Text(
                                text = "اقتراحات سريعة (اضغط للتمرير الفوري):",
                                style = MaterialTheme.typography.labelSmall,
                                color = RondoGold,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                            LazyRow(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                items(suggestions) { p ->
                                    val isCategoryMatch = uiState.category.predicate(p)
                                    Surface(
                                        shape = RoundedCornerShape(20.dp),
                                        color = if (isCategoryMatch) RondoGold else Color(0xFF1E293B),
                                        border = androidx.compose.foundation.BorderStroke(
                                            1.dp,
                                            if (isCategoryMatch) Color.White else RondoGold.copy(alpha = 0.5f)
                                        ),
                                        modifier = Modifier.clickable {
                                            viewModel.submitAnswer(p.arabicName)
                                        }
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = if (isCategoryMatch) "⭐ " else "⚽ ",
                                                fontSize = 12.sp
                                            )
                                            Text(
                                                text = p.arabicName,
                                                style = MaterialTheme.typography.labelMedium,
                                                fontWeight = FontWeight.Bold,
                                                color = if (isCategoryMatch) Color.Black else Color.White
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Turn indicator & Input Field
                    val isMyTurn = (uiState.turnOwner == 1 && uiState.phase == RondoPhase.PLAYER_TURN) ||
                            (uiState.turnOwner == 2 && uiState.gameMode == "LOCAL_2P" && uiState.phase == RondoPhase.OPPONENT_TURN)

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(18.dp))
                            .background(Color(0xFF0F172A))
                            .border(1.5.dp, if (isMyTurn) RondoGold else Color.Gray.copy(alpha = 0.3f), RoundedCornerShape(18.dp))
                            .padding(12.dp)
                    ) {
                        Text(
                            text = if (isMyTurn) {
                                if (uiState.turnOwner == 1) "دورك الآن! اكتب اسم لاعب واضغط مرّر ⚡" else "دور اللاعب 2! اكتب اسم لاعب ⚡"
                            } else "انتظر تمريرة الخصم... ⏳",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (isMyTurn) RondoGold else Color.Gray,
                            modifier = Modifier.padding(bottom = 6.dp)
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            OutlinedTextField(
                                value = uiState.inputQuery,
                                onValueChange = { viewModel.onQueryChange(it) },
                                placeholder = {
                                    Text(
                                        text = "مثال: ميسي، كريستيانو، بنزيما...",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = Color.Gray
                                    )
                                },
                                singleLine = true,
                                enabled = isMyTurn,
                                modifier = Modifier
                                    .weight(1f)
                                    .focusRequester(focusRequester),
                                keyboardOptions = KeyboardOptions(
                                    autoCorrectEnabled = false,
                                    imeAction = ImeAction.Send
                                ),
                                keyboardActions = KeyboardActions(
                                    onSend = {
                                        viewModel.submitAnswer(uiState.inputQuery)
                                    }
                                ),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = RondoGold,
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                shape = RoundedCornerShape(12.dp)
                            )

                            Button(
                                onClick = { viewModel.submitAnswer(uiState.inputQuery) },
                                enabled = isMyTurn && uiState.inputQuery.isNotBlank(),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = RondoGold,
                                    contentColor = Color.Black
                                ),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.height(54.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.AutoMirrored.Filled.Send,
                                        contentDescription = "مرّر",
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "مرّر ⚽",
                                        fontWeight = FontWeight.ExtraBold,
                                        fontSize = 14.sp
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                }

                // Countdown Overlay 3 -> 2 -> 1 -> GO!
                if (uiState.phase == RondoPhase.COUNTDOWN) {
                    CountdownOverlay(count = uiState.countdownNumber)
                }
            }
        }
    }
}
