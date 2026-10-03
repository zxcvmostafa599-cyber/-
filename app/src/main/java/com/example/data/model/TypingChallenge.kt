package com.example.data.model

data class TypingChallenge(
    val id: String,
    val text: String,
    val level: Int, // 1 to 10
    val topic: String, // e.g. "حكمة", "علوم", "تكنولوجيا", "حياة يومية", "تاريخ", "أدب"
    val requiresTashkeel: Boolean = false,
    val wordCount: Int = text.trim().split(Regex("\\s+")).size
)

data class GameLevel(
    val levelNumber: Int,
    val title: String,
    val description: String,
    val minAccuracy: Double,
    val targetAiWpm: Double,
    val wordCountRange: String,
    val isBoss: Boolean = false
)

object LevelDefinitions {
    val levels = listOf(
        GameLevel(
            levelNumber = 1,
            title = "المستوى 1: الانطلاقة",
            description = "كلمات شائعة وبسيطة بدون علامات ترقيم معقدة",
            minAccuracy = 80.0,
            targetAiWpm = 15.0,
            wordCountRange = "3–5 كلمات"
        ),
        GameLevel(
            levelNumber = 2,
            title = "المستوى 2: البدايات",
            description = "مفردات يومية وجمل قصيرة مألوفة",
            minAccuracy = 80.0,
            targetAiWpm = 20.0,
            wordCountRange = "3–6 كلمات"
        ),
        GameLevel(
            levelNumber = 3,
            title = "المستوى 3: التسارع",
            description = "جمل أطول قليلاً مع تركيب لغوي ممتع",
            minAccuracy = 82.0,
            targetAiWpm = 25.0,
            wordCountRange = "4–7 كلمات"
        ),
        GameLevel(
            levelNumber = 4,
            title = "المستوى 4: متوسط",
            description = "علامات الترقيم الأساسية مع تدفق متوازن",
            minAccuracy = 85.0,
            targetAiWpm = 30.0,
            wordCountRange = "6–8 كلمات"
        ),
        GameLevel(
            levelNumber = 5,
            title = "المستوى 5: الإتقان",
            description = "تنوع في المفردات ومصطلحات ثقافية وعلمية",
            minAccuracy = 85.0,
            targetAiWpm = 35.0,
            wordCountRange = "7–10 كلمات"
        ),
        GameLevel(
            levelNumber = 6,
            title = "المستوى 6: السرعة العالية",
            description = "جمل ممتدة وعلامات ترقيم دقيقة",
            minAccuracy = 88.0,
            targetAiWpm = 45.0,
            wordCountRange = "8–12 كلمة"
        ),
        GameLevel(
            levelNumber = 7,
            title = "المستوى 7: متقدم",
            description = "مفردات غنية وحروف متقاربة الرسم",
            minAccuracy = 90.0,
            targetAiWpm = 50.0,
            wordCountRange = "10–15 كلمة"
        ),
        GameLevel(
            levelNumber = 8,
            title = "المستوى 8: الفارس",
            description = "قواعد دقيقة وترقيم محكم وحركات اختيارية",
            minAccuracy = 90.0,
            targetAiWpm = 55.0,
            wordCountRange = "12–18 كلمة"
        ),
        GameLevel(
            levelNumber = 9,
            title = "المستوى 9: الخبير",
            description = "نصوص فصيحة وتراكيب لغوية صعبة وتشكيل جزئي",
            minAccuracy = 92.0,
            targetAiWpm = 65.0,
            wordCountRange = "15–25 كلمة"
        ),
        GameLevel(
            levelNumber = 10,
            title = "المستوى 10: زعيم السباق",
            description = "فقرة كاملة بليغة، دقة صارمة وسرعة خارقة",
            minAccuracy = 95.0,
            targetAiWpm = 75.0,
            wordCountRange = "30+ كلمة",
            isBoss = true
        )
    )

    fun getLevel(number: Int): GameLevel {
        return levels.firstOrNull { it.levelNumber == number } ?: levels.first()
    }
}
