package com.example

import com.example.data.model.LevelDefinitions
import com.example.engine.ArabicNormalizer
import com.example.engine.CharState
import com.example.engine.MetricsEngine
import com.example.engine.NormalizationMode
import com.example.engine.TypingComparisonEngine
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ArabicGameEngineTest {

    @Test
    fun testTashkeelStripping() {
        val withTashkeel = "العِلْمُ نُورٌ وَالجَهْلُ ظَلَامٌ"
        val stripped = ArabicNormalizer.stripTashkeel(withTashkeel)
        assertEquals("العلم نور والجهل ظلام", stripped)
    }

    @Test
    fun testSmartArabicNormalization() {
        // Alef variations: أ, إ, آ -> ا
        assertEquals('ا', ArabicNormalizer.normalizeChar('أ', NormalizationMode.SMART))
        assertEquals('ا', ArabicNormalizer.normalizeChar('إ', NormalizationMode.SMART))
        assertEquals('ا', ArabicNormalizer.normalizeChar('آ', NormalizationMode.SMART))

        // Taa Marbuta & Haa: ة -> ه
        assertEquals('ه', ArabicNormalizer.normalizeChar('ة', NormalizationMode.SMART))

        // Alif Maqsura & Yaa: ى -> ي
        assertEquals('ي', ArabicNormalizer.normalizeChar('ى', NormalizationMode.SMART))

        // Arabic-Indic Digits: ٥ -> 5
        assertEquals('5', ArabicNormalizer.normalizeChar('٥', NormalizationMode.SMART))
    }

    @Test
    fun testTypingComparisonEngine() {
        val target = "العلم نور"
        val userInput = "العلم "

        val result = TypingComparisonEngine.compare(target, userInput, NormalizationMode.SMART)

        assertEquals(6, result.correctCharsCount)
        assertEquals(0, result.errorCount)
        assertFalse(result.isFinished)
        assertTrue(result.progress > 0.5f)

        // First 6 characters should be CORRECT
        for (i in 0 until 6) {
            assertEquals(CharState.CORRECT, result.feedbacks[i].state)
        }
        // 7th character (index 6) is CURRENT cursor position
        assertEquals(CharState.CURRENT, result.feedbacks[6].state)
        // Subsequent characters should be PENDING
        assertEquals(CharState.PENDING, result.feedbacks[7].state)
    }

    @Test
    fun testTypingCompletion() {
        val target = "الصبر مفتاح الفرج"
        val result = TypingComparisonEngine.compare(target, target, NormalizationMode.STRICT)

        assertEquals(target.length, result.correctCharsCount)
        assertEquals(0, result.errorCount)
        assertEquals(1.0f, result.progress, 0.001f)
        assertTrue(result.isFinished)
    }

    @Test
    fun testMetricsEngineCalculations() {
        // 50 characters in 30 seconds -> 10 words in 0.5 min = 20 WPM
        val wpm = MetricsEngine.calculateWpm(correctChars = 50, elapsedSeconds = 30.0)
        assertEquals(20.0, wpm, 0.1)

        // 45 correct out of 50 typed -> 90% accuracy
        val accuracy = MetricsEngine.calculateAccuracy(correctChars = 45, totalTypedChars = 50)
        assertEquals(90.0, accuracy, 0.1)

        // Score should be positive and include bonuses
        val score = MetricsEngine.calculateScore(
            wpm = 35.0,
            accuracy = 95.0,
            timeSeconds = 25.0,
            level = 3,
            won = true,
            streak = 2
        )
        assertTrue(score > 500)
    }

    @Test
    fun testLevelDefinitions() {
        assertEquals(10, LevelDefinitions.levels.size)
        val bossLevel = LevelDefinitions.getLevel(10)
        assertTrue(bossLevel.isBoss)
        assertEquals(75.0, bossLevel.targetAiWpm, 0.1)
    }

    @Test
    fun testArabicAnnotatedStringPreservesTextAndAppliesRtl() {
        val target = "الكتب خير جليس"
        val comparison = TypingComparisonEngine.compare(target, "الكتب ", NormalizationMode.SMART)

        val annotatedString = com.example.ui.components.buildArabicTargetAnnotatedString(
            targetText = target,
            comparisonResult = comparison,
            cursorAlpha = 0.8f
        )

        // Ensure underlying text is completely intact and in natural Arabic order
        assertEquals(target, annotatedString.text)
        assertEquals('ا', annotatedString.text[0])
        assertEquals('ل', annotatedString.text[1])
        assertEquals('ك', annotatedString.text[2])
        assertEquals('ت', annotatedString.text[3])
        assertEquals('ب', annotatedString.text[4])

        // Check paragraph style is RTL
        val paragraphStyles = annotatedString.paragraphStyles
        assertTrue(paragraphStyles.isNotEmpty())
        assertEquals(
            androidx.compose.ui.text.style.TextDirection.Rtl,
            paragraphStyles[0].item.textDirection
        )

        // Check span styles are grouped: correctly typed "الكتب " (indices 0..6) should be a single span
        val spanStyles = annotatedString.spanStyles
        assertTrue(spanStyles.isNotEmpty())
        val firstSpan = spanStyles[0]
        assertEquals(0, firstSpan.start)
        assertEquals(6, firstSpan.end)
        assertEquals(com.example.ui.theme.SuccessGreen, firstSpan.item.color)
    }
}
