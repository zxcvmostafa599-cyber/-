package com.example.engine

enum class CharState {
    CORRECT,
    INCORRECT,
    CURRENT,
    PENDING
}

data class TargetCharFeedback(
    val char: Char,
    val state: CharState,
    val isWhitespace: Boolean = char.isWhitespace()
)

data class ComparisonResult(
    val feedbacks: List<TargetCharFeedback>,
    val correctCharsCount: Int,
    val totalTypedCount: Int,
    val errorCount: Int,
    val progress: Float, // 0.0f to 1.0f
    val isFinished: Boolean,
    val cursorIndex: Int
)

object TypingComparisonEngine {

    /**
     * Compares the user input with the target text character by character.
     * Preserves logical ordering for Arabic RTL processing.
     */
    fun compare(
        targetText: String,
        inputText: String,
        mode: NormalizationMode
    ): ComparisonResult {
        val feedbacks = ArrayList<TargetCharFeedback>(targetText.length)
        var correctCount = 0
        var errorCount = 0
        val inputLen = inputText.length
        val targetLen = targetText.length

        // Find how many consecutive characters are correct
        for (i in 0 until targetLen) {
            val targetChar = targetText[i]
            val state = when {
                i < inputLen -> {
                    val inputChar = inputText[i]
                    val isMatch = ArabicNormalizer.areCharsEqual(targetChar, inputChar, mode)
                    if (isMatch) {
                        correctCount++
                        CharState.CORRECT
                    } else {
                        errorCount++
                        CharState.INCORRECT
                    }
                }
                i == inputLen -> CharState.CURRENT
                else -> CharState.PENDING
            }
            feedbacks.add(TargetCharFeedback(targetChar, state))
        }

        // Count any extra characters typed beyond target length as errors
        if (inputLen > targetLen) {
            errorCount += (inputLen - targetLen)
        }

        val progress = if (targetLen > 0) {
            (correctCount.toFloat() / targetLen.toFloat()).coerceIn(0f, 1f)
        } else 1f

        val isFinished = targetLen > 0 && correctCount == targetLen && inputLen == targetLen

        return ComparisonResult(
            feedbacks = feedbacks,
            correctCharsCount = correctCount,
            totalTypedCount = inputLen,
            errorCount = errorCount,
            progress = progress,
            isFinished = isFinished,
            cursorIndex = inputLen.coerceAtMost(targetLen)
        )
    }
}
