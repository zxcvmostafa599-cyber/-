package com.example

import com.example.data.model.FootballCategory
import com.example.data.repository.FootballCatalog
import com.example.engine.AIDifficulty
import com.example.engine.AIOpponentEngine
import com.example.engine.ArabicNormalizer
import com.example.engine.FootballValidationEngine
import com.example.engine.NormalizationMode
import com.example.engine.ValidationResult
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class FootballRondoEngineTest {

    @Test
    fun testArabicNormalizerTashkeelAndSmart() {
        val raw = "لِيُونِيل مِيسِي"
        val stripped = ArabicNormalizer.stripTashkeel(raw)
        assertEquals("ليونيل ميسي", stripped)

        val normalized = ArabicNormalizer.normalize("أحمد حَسَن", NormalizationMode.SMART)
        assertEquals("احمد حسن", normalized)
    }

    @Test
    fun testArabicSimilarity() {
        val s1 = "ليونيل ميسي"
        val s2 = "ميسي"
        val sim = ArabicNormalizer.similarity(s1, s2)
        assertTrue("Similarity should be substantial", sim > 0.3)

        val exactSim = ArabicNormalizer.similarity("رونالدو", "رونالدو")
        assertEquals(1.0, exactSim, 0.001)
    }

    @Test
    fun testPlayerResolution() {
        val category = FootballCatalog.getCategoryForLevel(1) // Real Madrid or Barcelona

        // Test resolving "ميسي"
        val resolvedMessi = FootballValidationEngine.resolvePlayer("ميسي")
        assertNotNull(resolvedMessi)
        assertEquals("messi", resolvedMessi?.id)

        // Test resolving "كريستيانو"
        val resolvedRonaldo = FootballValidationEngine.resolvePlayer("كريستيانو")
        assertNotNull(resolvedRonaldo)
        assertEquals("c_ronaldo", resolvedRonaldo?.id)

        // Test resolving "بنزيما"
        val resolvedBenzema = FootballValidationEngine.resolvePlayer("كريم بنزيما")
        assertNotNull(resolvedBenzema)
        assertEquals("benzema", resolvedBenzema?.id)
    }

    @Test
    fun testCategoryValidationSuccess() {
        val category = FootballCatalog.getCategoryForLevel(1) // Real Madrid or Barcelona
        val usedPlayers = mutableSetOf<String>()

        val result1 = FootballValidationEngine.validateInput("ميسي", category, usedPlayers)
        assertTrue(result1 is ValidationResult.Valid)
        assertEquals("messi", (result1 as ValidationResult.Valid).player.id)

        // Add to used players
        usedPlayers.add(result1.player.id)

        // Attempting to use Messi again should result in AlreadyUsed
        val resultRepeat = FootballValidationEngine.validateInput("ميسي", category, usedPlayers)
        assertTrue(resultRepeat is ValidationResult.AlreadyUsed)

        // Cristiano Ronaldo is valid
        val result2 = FootballValidationEngine.validateInput("كريستيانو رونالدو", category, usedPlayers)
        assertTrue(result2 is ValidationResult.Valid)
    }

    @Test
    fun testCategoryValidationWrongCategory() {
        val category = FootballCatalog.getCategoryForLevel(10) // Played for both Real Madrid and Barcelona (Figo, Ronaldo Nazario, etc.)
        val usedPlayers = emptySet<String>()

        // Messi did NOT play for both Real Madrid and Barcelona, so he should fail level 10
        val result = FootballValidationEngine.validateInput("ميسي", category, usedPlayers)
        assertTrue(result is ValidationResult.WrongCategory)
    }

    @Test
    fun testAIOpponentDecision() {
        val category = FootballCatalog.getCategoryForLevel(1)
        val usedPlayers = setOf("messi", "c_ronaldo")

        // EXPERT difficulty AI should have low mistake rate and pick valid player
        val decision = AIOpponentEngine.generateAnswer(category, usedPlayers, AIDifficulty.EXPERT)
        assertNotNull(decision)

        if (decision is AIOpponentEngine.AIDecision.Answer) {
            assertTrue("AI player must not be in used players", decision.player.id !in usedPlayers)
            assertTrue("AI player must match category", category.validate(decision.player))
        }
    }

    @Test
    fun testFootballCatalogIntegrity() {
        assertEquals("Should have 10 categories for 10 levels", 10, FootballCatalog.allCategories.size)
        assertTrue("Catalog should contain over 50 registered players", FootballCatalog.allPlayers.size >= 50)

        // Check each category has at least 3 matching players
        for (cat in FootballCatalog.allCategories) {
            val matching = FootballCatalog.allPlayers.count { cat.validate(it) }
            assertTrue("Category ${cat.titleAr} should have at least 3 matching players in catalog", matching >= 3)
        }
    }
}
