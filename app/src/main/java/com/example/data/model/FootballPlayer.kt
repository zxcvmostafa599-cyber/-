package com.example.data.model

data class FootballPlayer(
    val id: String,
    val canonicalName: String,
    val arabicName: String,
    val englishName: String,
    val aliases: List<String> = emptyList(),
    val shortNames: List<String> = emptyList(),
    val clubHistory: List<String> = emptyList(),
    val nationalTeams: List<String> = emptyList(),
    val competitions: List<String> = emptyList(),
    val achievements: List<String> = emptyList(),
    val positions: List<String> = emptyList(),
    val isCommon: Boolean = true,
    val notableStats: String = ""
)
