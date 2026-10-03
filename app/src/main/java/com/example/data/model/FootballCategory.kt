package com.example.data.model

enum class CategoryDifficulty(
    val titleAr: String,
    val titleEn: String,
    val defaultTimerSeconds: Int,
    val scoreMultiplier: Double
) {
    ROOKIE("مبتدئ جداً", "Rookie", 5, 1.0),
    BEGINNER("مبتدئ", "Beginner", 5, 1.1),
    RISING("صاعد", "Rising", 5, 1.2),
    INTERMEDIATE("متوسط", "Intermediate", 4, 1.4),
    COMPETITOR("منافس", "Competitor", 4, 1.6),
    ADVANCED("متقدم", "Advanced", 4, 1.8),
    EXPERT("خبير", "Expert", 3, 2.0),
    ELITE("نخبة", "Elite", 3, 2.2),
    LEGEND("أسطوري", "Legend", 3, 2.5),
    BOSS("الزعيم", "Boss", 3, 3.0)
}

data class FootballCategory(
    val id: String,
    val titleAr: String,
    val titleEn: String,
    val descriptionAr: String,
    val descriptionEn: String,
    val difficulty: CategoryDifficulty,
    val timerSeconds: Int = difficulty.defaultTimerSeconds,
    val levelNumber: Int = 1,
    val iconEmoji: String = "⚽",
    val predicate: (FootballPlayer) -> Boolean
)
