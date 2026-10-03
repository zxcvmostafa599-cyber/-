package com.example.ui.navigation

sealed class Screen(val route: String) {
    data object Splash : Screen("splash")
    data object Dashboard : Screen("dashboard")
    data object Levels : Screen("levels")
    data object Race : Screen("race/{levelNumber}/{gameMode}") {
        fun createRoute(levelNumber: Int, gameMode: String): String {
            return "race/$levelNumber/$gameMode"
        }
    }
    data object Results : Screen("results/{resultId}") {
        fun createRoute(resultId: Long): String {
            return "results/$resultId"
        }
    }
    data object Statistics : Screen("statistics")
    data object Achievements : Screen("achievements")
    data object Settings : Screen("settings")
}
