package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.data.local.AppDatabase
import com.example.data.model.Player
import com.example.data.repository.FootballCatalog
import com.example.data.repository.GameRepository
import com.example.engine.AIDifficulty
import com.example.engine.NormalizationMode
import com.example.engine.SoundManager
import com.example.ui.navigation.Screen
import com.example.ui.screens.achievements.AchievementsScreen
import com.example.ui.screens.dashboard.DashboardScreen
import com.example.ui.screens.levels.LevelsScreen
import com.example.ui.screens.race.RaceScreen
import com.example.ui.screens.race.RaceViewModel
import com.example.ui.screens.results.ResultScreen
import com.example.ui.screens.settings.SettingsScreen
import com.example.ui.screens.splash.SplashScreen
import com.example.ui.screens.stats.StatisticsScreen
import com.example.ui.theme.ArabicTypingRaceTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private lateinit var soundManager: SoundManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        soundManager = SoundManager(this)

        setContent {
            ArabicTypingRaceTheme(darkTheme = true) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    RondoApp(soundManager = soundManager)
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        soundManager.release()
    }
}

@Composable
fun RondoApp(soundManager: SoundManager) {
    val navController = rememberNavController()
    val scope = rememberCoroutineScope()
    val context = androidx.compose.ui.platform.LocalContext.current

    val database = remember { AppDatabase.getDatabase(context, scope) }
    val repository = remember {
        GameRepository(
            playerDao = database.playerDao(),
            raceResultDao = database.raceResultDao(),
            achievementDao = database.achievementDao()
        )
    }

    val playerState by repository.player.collectAsState(initial = null)
    val recentResults by repository.recentResults.collectAsState(initial = emptyList())
    val allAchievements by repository.achievements.collectAsState(initial = emptyList())

    val player = playerState ?: Player()

    // Global settings state
    var currentNormalization by remember { mutableStateOf(NormalizationMode.SMART) }
    var currentDifficulty by remember { mutableStateOf(AIDifficulty.NORMAL) }
    var soundEnabled by remember { mutableStateOf(true) }
    var hapticsEnabled by remember { mutableStateOf(true) }

    // Transient result state for results screen
    var lastResultWon by remember { mutableStateOf(false) }
    var lastScore by remember { mutableStateOf(0) }
    var lastRounds by remember { mutableStateOf(0) }
    var lastBestStreak by remember { mutableStateOf(0) }
    var lastAvgResponseTime by remember { mutableStateOf(0.0) }
    var lastLevelNumber by remember { mutableStateOf(1) }
    var lastGameMode by remember { mutableStateOf("QUICK") }

    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        NavHost(
            navController = navController,
            startDestination = Screen.Splash.route,
            modifier = Modifier.fillMaxSize()
        ) {
            composable(Screen.Splash.route) {
                SplashScreen(
                    onNavigateToDashboard = {
                        navController.navigate(Screen.Dashboard.route) {
                            popUpTo(Screen.Splash.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Dashboard.route) {
                DashboardScreen(
                    player = player,
                    onStartQuickRace = {
                        val level = player.currentLevel
                        navController.navigate(Screen.Race.createRoute(level, "QUICK"))
                    },
                    onStartLocalTwoPlayer = {
                        val level = player.currentLevel
                        navController.navigate(Screen.Race.createRoute(level, "LOCAL_2P"))
                    },
                    onNavigateLevels = {
                        navController.navigate(Screen.Levels.route)
                    },
                    onNavigateDailyChallenge = {
                        navController.navigate(Screen.Race.createRoute(player.currentLevel, "DAILY"))
                    },
                    onNavigateStatistics = {
                        navController.navigate(Screen.Statistics.route)
                    },
                    onNavigateAchievements = {
                        navController.navigate(Screen.Achievements.route)
                    },
                    onNavigateSettings = {
                        navController.navigate(Screen.Settings.route)
                    },
                    onUpdatePlayerName = { newName ->
                        scope.launch {
                            repository.updatePlayerName(newName)
                        }
                    }
                )
            }

            composable(Screen.Levels.route) {
                LevelsScreen(
                    currentUnlockedLevel = player.currentLevel,
                    onSelectLevel = { levelNum ->
                        navController.navigate(Screen.Race.createRoute(levelNum, "LEVEL"))
                    },
                    onBack = { navController.popBackStack() }
                )
            }

            composable(
                route = Screen.Race.route,
                arguments = listOf(
                    navArgument("levelNumber") { type = NavType.IntType },
                    navArgument("gameMode") { type = NavType.StringType }
                )
            ) { backStackEntry ->
                val levelNumber = backStackEntry.arguments?.getInt("levelNumber") ?: 1
                val gameMode = backStackEntry.arguments?.getString("gameMode") ?: "QUICK"
                val isLocal2P = (gameMode == "LOCAL_2P")

                val category = remember(levelNumber, gameMode) {
                    if (gameMode == "DAILY") {
                        FootballCatalog.getDailyCategory()
                    } else if (gameMode == "QUICK") {
                        FootballCatalog.getRandomCategory()
                    } else {
                        FootballCatalog.getCategoryForLevel(levelNumber)
                    }
                }

                val raceViewModel = remember(category.id, gameMode) {
                    RaceViewModel(repository, soundManager).apply {
                        setNormalizationMode(currentNormalization)
                        setAIDifficulty(currentDifficulty)
                        initRondoMatch(category, levelNumber, gameMode, isLocal2P)
                    }
                }

                RaceScreen(
                    viewModel = raceViewModel,
                    onFinishRace = { won, score, rounds, bestStreak, avgResponseTime, level ->
                        lastResultWon = won
                        lastScore = score
                        lastRounds = rounds
                        lastBestStreak = bestStreak
                        lastAvgResponseTime = avgResponseTime
                        lastLevelNumber = level
                        lastGameMode = gameMode

                        navController.navigate("results_view") {
                            popUpTo(Screen.Race.route) { inclusive = true }
                        }
                    },
                    onBack = { navController.popBackStack() }
                )
            }

            composable("results_view") {
                ResultScreen(
                    won = lastResultWon,
                    score = lastScore,
                    rounds = lastRounds,
                    bestStreak = lastBestStreak,
                    avgResponseTime = lastAvgResponseTime,
                    levelNumber = lastLevelNumber,
                    onPlayAgain = {
                        navController.navigate(Screen.Race.createRoute(lastLevelNumber, lastGameMode)) {
                            popUpTo("results_view") { inclusive = true }
                        }
                    },
                    onNextLevel = {
                        val nextLevel = (lastLevelNumber + 1).coerceAtMost(10)
                        navController.navigate(Screen.Race.createRoute(nextLevel, "LEVEL")) {
                            popUpTo("results_view") { inclusive = true }
                        }
                    },
                    onHome = {
                        navController.navigate(Screen.Dashboard.route) {
                            popUpTo(Screen.Dashboard.route) { inclusive = true }
                        }
                    }
                )
            }

            composable(Screen.Statistics.route) {
                StatisticsScreen(
                    player = player,
                    recentResults = recentResults,
                    onBack = { navController.popBackStack() }
                )
            }

            composable(Screen.Achievements.route) {
                AchievementsScreen(
                    achievements = allAchievements,
                    onBack = { navController.popBackStack() }
                )
            }

            composable(Screen.Settings.route) {
                SettingsScreen(
                    currentNormalization = currentNormalization,
                    currentDifficulty = currentDifficulty,
                    soundEnabled = soundEnabled,
                    hapticsEnabled = hapticsEnabled,
                    onNormalizationChanged = { currentNormalization = it },
                    onDifficultyChanged = { currentDifficulty = it },
                    onSoundToggled = {
                        soundEnabled = it
                        soundManager.soundEnabled = it
                        soundManager.effectsEnabled = it
                    },
                    onHapticsToggled = {
                        hapticsEnabled = it
                        soundManager.vibrationEnabled = it
                    },
                    onResetProgress = {
                        scope.launch {
                            repository.resetProgress()
                        }
                    },
                    onBack = { navController.popBackStack() }
                )
            }
        }
    }
}
