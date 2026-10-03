package com.example.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.ParagraphStyle
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.engine.CharState
import com.example.engine.ComparisonResult
import com.example.ui.theme.ErrorRed
import com.example.ui.theme.ErrorRedGlow
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.PendingGray
import com.example.ui.theme.SuccessGreen

@Composable
fun ArabicTargetTextView(
    targetText: String,
    comparisonResult: ComparisonResult,
    fontSizeSp: Int = 22,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "cursor_pulse")
    val cursorAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(
            animation = tween(600),
            repeatMode = RepeatMode.Reverse
        ),
        label = "cursor_alpha"
    )

    val annotatedString = buildArabicTargetAnnotatedString(
        targetText = targetText,
        comparisonResult = comparisonResult,
        cursorAlpha = cursorAlpha
    )

    CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
        Box(
            modifier = modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(MaterialTheme.colorScheme.surface)
                .border(
                    width = 1.5.dp,
                    color = MaterialTheme.colorScheme.outline,
                    shape = RoundedCornerShape(16.dp)
                )
                .padding(18.dp)
        ) {
            Text(
                text = annotatedString,
                fontSize = fontSizeSp.sp,
                lineHeight = (fontSizeSp + 14).sp,
                style = TextStyle(
                    textDirection = TextDirection.Rtl,
                    textAlign = TextAlign.Start,
                    fontWeight = FontWeight.Medium
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
            )
        }
    }
}

/**
 * Builds an AnnotatedString for Arabic typing with strict RTL paragraph direction.
 * Adjacent characters sharing the same state are grouped into contiguous ranges
 * to preserve Arabic cursive ligatures, prevent glyph disconnection, and maintain
 * natural Right-to-Left visual ordering.
 */
fun buildArabicTargetAnnotatedString(
    targetText: String,
    comparisonResult: ComparisonResult,
    cursorAlpha: Float = 0.8f
): AnnotatedString {
    if (targetText.isEmpty()) return AnnotatedString("")

    val builder = AnnotatedString.Builder(targetText)

    // 1. Force strict RTL paragraph direction so Arabic script flows naturally right-to-left
    builder.addStyle(
        ParagraphStyle(
            textDirection = TextDirection.Rtl,
            textAlign = TextAlign.Start
        ),
        0,
        targetText.length
    )

    // 2. Group adjacent characters with identical state into contiguous ranges
    // This prevents breaking Arabic words into disconnected 1-character glyph runs
    val feedbacks = comparisonResult.feedbacks
    var startIndex = 0
    var currentState = feedbacks.getOrNull(0)?.state ?: CharState.PENDING

    for (i in 1 until targetText.length) {
        val state = feedbacks.getOrNull(i)?.state ?: CharState.PENDING
        if (state != currentState) {
            applyStateStyle(builder, currentState, startIndex, i, cursorAlpha)
            currentState = state
            startIndex = i
        }
    }
    // Apply final span chunk
    applyStateStyle(builder, currentState, startIndex, targetText.length, cursorAlpha)

    return builder.toAnnotatedString()
}

private fun applyStateStyle(
    builder: AnnotatedString.Builder,
    state: CharState,
    start: Int,
    end: Int,
    cursorAlpha: Float
) {
    if (start >= end) return

    val spanStyle = when (state) {
        CharState.CORRECT -> SpanStyle(
            color = SuccessGreen,
            fontWeight = FontWeight.Medium
        )
        CharState.INCORRECT -> SpanStyle(
            color = ErrorRed,
            background = ErrorRedGlow,
            textDecoration = TextDecoration.Underline,
            fontWeight = FontWeight.Medium
        )
        CharState.CURRENT -> SpanStyle(
            color = NeonCyan,
            background = NeonCyan.copy(alpha = cursorAlpha * 0.35f),
            textDecoration = TextDecoration.Underline,
            fontWeight = FontWeight.Medium
        )
        CharState.PENDING -> SpanStyle(
            color = PendingGray,
            fontWeight = FontWeight.Medium
        )
    }
    builder.addStyle(spanStyle, start, end)
}
