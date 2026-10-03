package com.example.engine

import com.example.data.model.FootballCategory
import com.example.data.model.FootballPlayer
import com.example.data.repository.FootballCatalog

sealed interface ValidationResult {
    data class Valid(val player: FootballPlayer) : ValidationResult
    data class AlreadyUsed(val player: FootballPlayer) : ValidationResult
    data class CategoryMismatch(val player: FootballPlayer, val reasonAr: String) : ValidationResult
    data class Ambiguous(val matchingPlayers: List<FootballPlayer>) : ValidationResult
    data class NotFound(val rawQuery: String) : ValidationResult
}

object FootballValidationEngine {

    /**
     * Resolves an input string against the database of football players.
     */
    fun resolvePlayer(
        rawQuery: String,
        mode: NormalizationMode = NormalizationMode.SMART
    ): List<FootballPlayer> {
        val queryNorm = ArabicNormalizer.normalize(rawQuery, mode)
        if (queryNorm.isBlank()) return emptyList()

        val directMatches = mutableListOf<FootballPlayer>()

        for (player in FootballCatalog.allPlayers) {
            val namesToCheck = mutableListOf(
                player.canonicalName,
                player.arabicName,
                player.englishName
            )
            namesToCheck.addAll(player.aliases)
            namesToCheck.addAll(player.shortNames)

            // 1. Exact normalized match
            val isExact = namesToCheck.any {
                ArabicNormalizer.normalize(it, mode) == queryNorm
            }
            if (isExact) {
                directMatches.add(player)
                continue
            }

            // 2. High confidence match (starts with or word contains if length is long enough)
            if (queryNorm.length >= 3) {
                val hasMatch = namesToCheck.any {
                    val norm = ArabicNormalizer.normalize(it, mode)
                    norm == queryNorm ||
                    norm.split(" ").contains(queryNorm) ||
                    ArabicNormalizer.similarity(norm, queryNorm) >= 0.88
                }
                if (hasMatch) {
                    directMatches.add(player)
                }
            }
        }

        return directMatches.distinctBy { it.id }
    }

    /**
     * Validates a player answer against the active Rondo category and previously used players.
     */
    fun validateAnswer(
        rawInput: String,
        category: FootballCategory,
        usedPlayerIds: Set<String>,
        mode: NormalizationMode = NormalizationMode.SMART,
        strictAmbiguity: Boolean = true
    ): ValidationResult {
        val matches = resolvePlayer(rawInput, mode)

        if (matches.isEmpty()) {
            return ValidationResult.NotFound(rawInput)
        }

        if (matches.size > 1 && strictAmbiguity) {
            // Check if multiple matched players are distinct (e.g. David Silva vs Thiago Silva vs Bernardo Silva)
            return ValidationResult.Ambiguous(matches)
        }

        val player = matches.first()

        // Check if already used in this match
        if (usedPlayerIds.contains(player.id)) {
            return ValidationResult.AlreadyUsed(player)
        }

        // Check category criterion
        val satisfiesCategory = category.predicate(player)
        if (!satisfiesCategory) {
            return ValidationResult.CategoryMismatch(
                player = player,
                reasonAr = "اللاعب لا يحقق شروط الفئة الحالية!"
            )
        }

        return ValidationResult.Valid(player)
    }
}
