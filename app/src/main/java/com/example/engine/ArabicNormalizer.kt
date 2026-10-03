package com.example.engine

enum class NormalizationMode(val titleArabic: String, val descriptionArabic: String) {
    SMART("الوضع الذكي (موصى به)", "يتسامح مع همزات الألف والتاء المربوطة والياء والحركات"),
    STRICT("الوضع الصارم", "تطابق حرفي تام بدون أي تساهل"),
}

object ArabicNormalizer {

    private val TASHKEEL_REGEX = Regex("[\\u064B-\\u065F\\u0670]")
    private val TATWEEL_CHAR = '\u0640'
    private val PUNCTUATION_REGEX = Regex("[\\p{Punct}،؛؟«»\"'-]")
    private val WHITESPACE_REGEX = Regex("\\s+")

    /**
     * Strips Arabic diacritics and tatweel
     */
    fun stripTashkeel(text: String): String {
        return text.replace(TASHKEEL_REGEX, "").replace(TATWEEL_CHAR.toString(), "")
    }

    /**
     * Normalizes a single character in SMART mode
     */
    fun normalizeChar(c: Char, mode: NormalizationMode = NormalizationMode.SMART): Char {
        return when (mode) {
            NormalizationMode.STRICT -> c
            NormalizationMode.SMART -> {
                when (c) {
                    'أ', 'إ', 'آ', 'ٱ' -> 'ا'
                    'ة' -> 'ه'
                    'ى' -> 'ي'
                    '٠' -> '0'
                    '١' -> '1'
                    '٢' -> '2'
                    '٣' -> '3'
                    '٤' -> '4'
                    '٥' -> '5'
                    '٦' -> '6'
                    '٧' -> '7'
                    '٨' -> '8'
                    '٩' -> '9'
                    else -> c
                }
            }
        }
    }

    /**
     * Full string normalization for football player search and validation.
     * Cleans whitespace, lowercases, removes diacritics, unifies alef, yaa, and taa marbuta.
     */
    fun normalize(text: String, mode: NormalizationMode = NormalizationMode.SMART): String {
        var result = stripTashkeel(text.trim())
        result = result.replace(PUNCTUATION_REGEX, " ")
        result = result.replace(WHITESPACE_REGEX, " ").trim().lowercase()

        if (mode == NormalizationMode.SMART) {
            val sb = StringBuilder(result.length)
            for (ch in result) {
                sb.append(normalizeChar(ch, mode))
            }
            result = sb.toString()
        }
        return result
    }

    /**
     * Calculates Levenshtein similarity score between 0.0 (completely different) and 1.0 (identical).
     */
    fun similarity(s1: String, s2: String): Double {
        val n1 = normalize(s1)
        val n2 = normalize(s2)
        if (n1 == n2) return 1.0
        if (n1.isEmpty() || n2.isEmpty()) return 0.0

        val maxLen = maxOf(n1.length, n2.length)
        val dist = levenshteinDistance(n1, n2)
        return 1.0 - (dist.toDouble() / maxLen)
    }

    private fun levenshteinDistance(lhs: CharSequence, rhs: CharSequence): Int {
        val len0 = lhs.length + 1
        val len1 = rhs.length + 1

        var cost = IntArray(len0)
        var newCost = IntArray(len0)

        for (i in 0 until len0) cost[i] = i

        for (j in 1 until len1) {
            newCost[0] = j
            for (i in 1 until len0) {
                val match = if (lhs[i - 1] == rhs[j - 1]) 0 else 1
                val costReplace = cost[i - 1] + match
                val costInsert = cost[i] + 1
                val costDelete = newCost[i - 1] + 1
                newCost[i] = minOf(costInsert, costDelete, costReplace)
            }
            val swap = cost
            cost = newCost
            newCost = swap
        }
        return cost[len0 - 1]
    }
}
