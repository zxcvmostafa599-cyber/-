package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.data.model.Achievement
import com.example.data.model.Player
import com.example.data.model.RaceResult
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [Player::class, RaceResult::class, Achievement::class],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun playerDao(): PlayerDao
    abstract fun raceResultDao(): RaceResultDao
    abstract fun achievementDao(): AchievementDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "rondo_football_trivia.db"
                )
                    .fallbackToDestructiveMigration()
                    .addCallback(DatabaseCallback(scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database)
                    }
                }
            }

            suspend fun populateInitialData(database: AppDatabase) {
                val playerDao = database.playerDao()
                if (playerDao.getPlayerDirect() == null) {
                    playerDao.insertOrUpdate(Player())
                }

                val achievementDao = database.achievementDao()
                val initialAchievements = listOf(
                    Achievement(
                        id = "first_rondo",
                        title = "أول تمريرة روندو",
                        description = "أكمل أول مواجهة روندو كروية لك بنجاح",
                        iconName = "sports_soccer",
                        coinReward = 50,
                        xpReward = 150
                    ),
                    Achievement(
                        id = "hat_trick",
                        title = "هاتريك روندو! ⚽",
                        description = "سجل 3 إجابات صحيحة متتالية في جولة واحدة",
                        iconName = "flash_on",
                        coinReward = 50,
                        xpReward = 200
                    ),
                    Achievement(
                        id = "on_fire",
                        title = "نار وشرار 🔥",
                        description = "حقق سلسلة 10 إجابات صحيحة متتالية في الروندو",
                        iconName = "local_fire_department",
                        coinReward = 100,
                        xpReward = 500
                    ),
                    Achievement(
                        id = "football_brain",
                        title = "عقل كروي خارق 🧠",
                        description = "حقق الفوز في 10 مواجهات روندو ضد الذكاء الاصطناعي",
                        iconName = "psychology",
                        coinReward = 150,
                        xpReward = 600
                    ),
                    Achievement(
                        id = "speedster",
                        title = "البرق الكروي ⚡",
                        description = "مرر إجابة صحيحة في أقل من 1.5 ثانية تحت الضغط",
                        iconName = "speed",
                        coinReward = 80,
                        xpReward = 300
                    ),
                    Achievement(
                        id = "perfect_rondo",
                        title = "روندو مثالي 🏆",
                        description = "اربح مواجهة روندو كاملة بدون ارتكاب أي خطأ",
                        iconName = "verified",
                        coinReward = 120,
                        xpReward = 450
                    ),
                    Achievement(
                        id = "clasico_master",
                        title = "سيد الكلاسيكو 🇪🇸",
                        description = "أتقن فئة لاعبي برشلونة وريال مدريد بنجاح",
                        iconName = "military_tech",
                        coinReward = 100,
                        xpReward = 400
                    ),
                    Achievement(
                        id = "level_10",
                        title = "قاهر الزعيم 👑",
                        description = "تغلب على المستوى العاشر واهزم زعيم الروندو",
                        iconName = "workspace_premium",
                        coinReward = 250,
                        xpReward = 1000
                    ),
                    Achievement(
                        id = "daily_champ",
                        title = "بطل التحدي اليومي 📅",
                        description = "أكمل تحدي الروندو اليومي بنجاح",
                        iconName = "event_available",
                        coinReward = 60,
                        xpReward = 250
                    )
                )
                achievementDao.insertAll(initialAchievements)
            }
        }
    }
}
