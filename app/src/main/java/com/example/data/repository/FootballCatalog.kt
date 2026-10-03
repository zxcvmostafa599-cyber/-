package com.example.data.repository

import com.example.data.model.CategoryDifficulty
import com.example.data.model.FootballCategory
import com.example.data.model.FootballPlayer

object FootballCatalog {

    val allPlayers: List<FootballPlayer> = listOf(
        // MESSI
        FootballPlayer(
            id = "messi",
            canonicalName = "Lionel Messi",
            arabicName = "ليونيل ميسي",
            englishName = "Lionel Messi",
            aliases = listOf("ميسي", "ليو ميسي", "ليونيل", "البرغوث", "Leo Messi", "Messi", "L. Messi"),
            shortNames = listOf("ميسي", "Messi"),
            clubHistory = listOf("barcelona", "psg", "inter_miami"),
            nationalTeams = listOf("argentina"),
            competitions = listOf("champions_league", "world_cup", "copa_america", "la_liga", "ligue_1", "mls"),
            achievements = listOf("ballon_dor", "world_cup_winner", "champions_league_winner", "golden_boot", "treble", "fifa_the_best"),
            positions = listOf("FW", "RW", "AM"),
            isCommon = true,
            notableStats = "8 Ballon d'Or, World Cup 2022, 129 UCL Goals"
        ),
        // CRISTIANO RONALDO
        FootballPlayer(
            id = "c_ronaldo",
            canonicalName = "Cristiano Ronaldo",
            arabicName = "كريستيانو رونالدو",
            englishName = "Cristiano Ronaldo",
            aliases = listOf("رونالدو", "الدون", "كريستيانو", "صاروخ ماديرا", "CR7", "Cristiano", "Ronaldo", "C. Ronaldo"),
            shortNames = listOf("كريستيانو", "رونالدو", "CR7"),
            clubHistory = listOf("sporting_cp", "manchester_united", "real_madrid", "juventus", "al_nassr"),
            nationalTeams = listOf("portugal"),
            competitions = listOf("champions_league", "premier_league", "la_liga", "serie_a", "euro", "saudi_pro_league"),
            achievements = listOf("ballon_dor", "champions_league_winner", "golden_boot", "euro_winner", "fifa_the_best"),
            positions = listOf("FW", "LW", "ST"),
            isCommon = true,
            notableStats = "5 Ballon d'Or, 5 UCL, 140 UCL Goals"
        ),
        // RONALDO NAZARIO (R9)
        FootballPlayer(
            id = "ronaldo_nazario",
            canonicalName = "Ronaldo Nazario",
            arabicName = "رونالدو نازاريو",
            englishName = "Ronaldo Nazario",
            aliases = listOf("الظاهرة", "رونالدو البرازيلي", "الظاهرة رونالدو", "رونالدو دي ليما", "R9", "Ronaldo Fenomeno", "Ronaldo Nazario", "El Fenomeno"),
            shortNames = listOf("الظاهرة", "R9"),
            clubHistory = listOf("cruzeiro", "psv", "barcelona", "inter", "real_madrid", "milan", "corinthians"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("world_cup", "copa_america", "la_liga", "serie_a"),
            achievements = listOf("ballon_dor", "world_cup_winner", "golden_boot"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "2 World Cups (1994, 2002), 2 Ballon d'Or"
        ),
        // LUIS FIGO
        FootballPlayer(
            id = "figo",
            canonicalName = "Luis Figo",
            arabicName = "لويس فيغو",
            englishName = "Luis Figo",
            aliases = listOf("فيغو", "لويس فيجو", "فيجو", "Figo", "Luis Figo"),
            shortNames = listOf("فيغو", "Figo"),
            clubHistory = listOf("sporting_cp", "barcelona", "real_madrid", "inter"),
            nationalTeams = listOf("portugal"),
            competitions = listOf("champions_league", "la_liga", "serie_a"),
            achievements = listOf("ballon_dor", "champions_league_winner"),
            positions = listOf("RW", "MF"),
            isCommon = true,
            notableStats = "Ballon d'Or 2000, Barcelona & Real Madrid"
        ),
        // LUIS ENRIQUE
        FootballPlayer(
            id = "luis_enrique",
            canonicalName = "Luis Enrique",
            arabicName = "لويس إنريكي",
            englishName = "Luis Enrique",
            aliases = listOf("إنريكي", "لويس انريكي", "انريكي", "Luis Enrique", "Enrique"),
            shortNames = listOf("إنريكي", "Enrique"),
            clubHistory = listOf("sporting_gijon", "real_madrid", "barcelona"),
            nationalTeams = listOf("spain"),
            competitions = listOf("la_liga"),
            achievements = listOf("treble"),
            positions = listOf("MF", "FW"),
            isCommon = false,
            notableStats = "Played for Real Madrid & Barcelona"
        ),
        // SAMUEL ETO'O
        FootballPlayer(
            id = "eto",
            canonicalName = "Samuel Eto'o",
            arabicName = "صامويل إيتو",
            englishName = "Samuel Eto'o",
            aliases = listOf("إيتو", "ايتو", "صامويل ايتو", "Eto'o", "Samuel Etoo", "Etoo"),
            shortNames = listOf("إيتو", "Eto'o"),
            clubHistory = listOf("real_madrid", "mallorca", "barcelona", "inter", "anzhi", "chelsea", "everton"),
            nationalTeams = listOf("cameroon"),
            competitions = listOf("champions_league", "la_liga", "serie_a", "premier_league", "afcon"),
            achievements = listOf("champions_league_winner", "treble", "afcon_winner"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "2 Back-to-Back Trebles (Barca & Inter)"
        ),
        // MICHAEL LAUDRUP
        FootballPlayer(
            id = "laudrup",
            canonicalName = "Michael Laudrup",
            arabicName = "مايكل لاودروب",
            englishName = "Michael Laudrup",
            aliases = listOf("لاودروب", "مايكل لودروب", "Laudrup", "Michael Laudrup"),
            shortNames = listOf("لاودروب", "Laudrup"),
            clubHistory = listOf("juventus", "barcelona", "real_madrid", "ajax"),
            nationalTeams = listOf("denmark"),
            competitions = listOf("champions_league", "la_liga", "serie_a"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("AM"),
            isCommon = false,
            notableStats = "Played for Barcelona & Real Madrid"
        ),
        // JAVIER SAVIOLA
        FootballPlayer(
            id = "saviola",
            canonicalName = "Javier Saviola",
            arabicName = "خافيير سافيولا",
            englishName = "Javier Saviola",
            aliases = listOf("سافيولا", "الأرنب", "Saviola", "Javier Saviola"),
            shortNames = listOf("سافيولا", "Saviola"),
            clubHistory = listOf("river_plate", "barcelona", "monaco", "sevilla", "real_madrid", "benfica", "malaga", "olympiacos", "verona"),
            nationalTeams = listOf("argentina"),
            competitions = listOf("la_liga"),
            achievements = emptyList(),
            positions = listOf("ST"),
            isCommon = false,
            notableStats = "Played for Barcelona & Real Madrid"
        ),
        // ZLATAN IBRAHIMOVIC
        FootballPlayer(
            id = "ibrahimovic",
            canonicalName = "Zlatan Ibrahimovic",
            arabicName = "زلاتان إبراهيموفيتش",
            englishName = "Zlatan Ibrahimovic",
            aliases = listOf("إبراهيموفيتش", "ابراهيموفيتش", "زلاتان", "السلطان", "Zlatan", "Ibrahimovic", "Ibra"),
            shortNames = listOf("زلاتان", "إبرا", "Zlatan"),
            clubHistory = listOf("malmo", "ajax", "juventus", "inter", "barcelona", "milan", "psg", "manchester_united", "la_galaxy"),
            nationalTeams = listOf("sweden"),
            competitions = listOf("champions_league", "serie_a", "la_liga", "ligue_1", "premier_league", "europa_league"),
            achievements = listOf("europa_league_winner"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Inter, Milan & Juventus; 49 UCL Goals"
        ),
        // ANDREA PIRLO
        FootballPlayer(
            id = "pirlo",
            canonicalName = "Andrea Pirlo",
            arabicName = "أندريا بيرلو",
            englishName = "Andrea Pirlo",
            aliases = listOf("بيرلو", "المايسترو", "اندريا بيرلو", "Pirlo", "Andrea Pirlo"),
            shortNames = listOf("بيرلو", "Pirlo"),
            clubHistory = listOf("brescia", "inter", "milan", "juventus", "nycfc"),
            nationalTeams = listOf("italy"),
            competitions = listOf("champions_league", "world_cup", "serie_a"),
            achievements = listOf("world_cup_winner", "champions_league_winner"),
            positions = listOf("DM", "CM"),
            isCommon = true,
            notableStats = "World Cup 2006, 2 UCL with Milan, Played for Inter, Milan & Juve"
        ),
        // CLARENCE SEEDORF
        FootballPlayer(
            id = "seedorf",
            canonicalName = "Clarence Seedorf",
            arabicName = "كلارنس سيدورف",
            englishName = "Clarence Seedorf",
            aliases = listOf("سيدورف", "كلارينس سيدورف", "Seedorf", "Clarence Seedorf"),
            shortNames = listOf("سيدورف", "Seedorf"),
            clubHistory = listOf("ajax", "sampdoria", "real_madrid", "inter", "milan", "botafogo"),
            nationalTeams = listOf("netherlands"),
            competitions = listOf("champions_league", "serie_a", "la_liga"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("CM"),
            isCommon = true,
            notableStats = "Won UCL with 3 different clubs (Ajax, Real Madrid, Milan)"
        ),
        // MARIO BALOTELLI
        FootballPlayer(
            id = "balotelli",
            canonicalName = "Mario Balotelli",
            arabicName = "ماريو بالوتيلي",
            englishName = "Mario Balotelli",
            aliases = listOf("بالوتيلي", "سوبر ماريو", "Balotelli", "Mario Balotelli"),
            shortNames = listOf("بالوتيلي", "Balotelli"),
            clubHistory = listOf("inter", "manchester_city", "milan", "liverpool", "nice", "marseille", "brescia", "adana_demirspor"),
            nationalTeams = listOf("italy"),
            competitions = listOf("champions_league", "serie_a", "premier_league"),
            achievements = listOf("champions_league_winner", "treble"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Inter, Milan, Man City, Liverpool"
        ),
        // HAKAN CALHANOGLU
        FootballPlayer(
            id = "calhanoglu",
            canonicalName = "Hakan Calhanoglu",
            arabicName = "هاكان تشالهان أوغلو",
            englishName = "Hakan Calhanoglu",
            aliases = listOf("تشالهان أوغلو", "هاكان", "تشاناهولو", "Calhanoglu", "Hakan Calhanoglu"),
            shortNames = listOf("تشالهان أوغلو", "هاكان"),
            clubHistory = listOf("karlsruher", "hsv", "leverkusen", "milan", "inter"),
            nationalTeams = listOf("turkey"),
            competitions = listOf("serie_a", "champions_league"),
            achievements = emptyList(),
            positions = listOf("CM", "AM"),
            isCommon = true,
            notableStats = "Played for both Milan & Inter"
        ),
        // LEONARDO BONUCCI
        FootballPlayer(
            id = "bonucci",
            canonicalName = "Leonardo Bonucci",
            arabicName = "ليوناردو بونوتشي",
            englishName = "Leonardo Bonucci",
            aliases = listOf("بونوتشي", "Bonucci", "Leonardo Bonucci"),
            shortNames = listOf("بونوتشي", "Bonucci"),
            clubHistory = listOf("inter", "treviso", "pisa", "bari", "juventus", "milan", "union_berlin", "fenerbahce"),
            nationalTeams = listOf("italy"),
            competitions = listOf("serie_a", "euro"),
            achievements = listOf("euro_winner"),
            positions = listOf("CB"),
            isCommon = true,
            notableStats = "Played for Inter, Juventus, and Milan"
        ),
        // DAVID BECKHAM
        FootballPlayer(
            id = "beckham",
            canonicalName = "David Beckham",
            arabicName = "ديفيد بيكهام",
            englishName = "David Beckham",
            aliases = listOf("بيكهام", "ديفيد بيكام", "بيكام", "Beckham", "David Beckham"),
            shortNames = listOf("بيكهام", "Beckham"),
            clubHistory = listOf("manchester_united", "preston", "real_madrid", "la_galaxy", "milan", "psg"),
            nationalTeams = listOf("england"),
            competitions = listOf("champions_league", "premier_league", "la_liga", "ligue_1", "mls"),
            achievements = listOf("champions_league_winner", "treble"),
            positions = listOf("RM", "CM"),
            isCommon = true,
            notableStats = "Man United & Real Madrid, Treble 1999"
        ),
        // ANGEL DI MARIA
        FootballPlayer(
            id = "di_maria",
            canonicalName = "Angel Di Maria",
            arabicName = "أنخيل دي ماريا",
            englishName = "Angel Di Maria",
            aliases = listOf("دي ماريا", "انخيل دي ماريا", "فيديو", "Di Maria", "Angel Di Maria"),
            shortNames = listOf("دي ماريا", "Di Maria"),
            clubHistory = listOf("rosario_central", "benfica", "real_madrid", "manchester_united", "psg", "juventus"),
            nationalTeams = listOf("argentina"),
            competitions = listOf("champions_league", "world_cup", "copa_america", "la_liga", "premier_league", "ligue_1", "serie_a"),
            achievements = listOf("world_cup_winner", "champions_league_winner"),
            positions = listOf("RW", "LW", "MF"),
            isCommon = true,
            notableStats = "World Cup 2022, UCL 2014, Real Madrid & Man Utd"
        ),
        // CASEMIRO
        FootballPlayer(
            id = "casemiro",
            canonicalName = "Casemiro",
            arabicName = "كاسيميرو",
            englishName = "Casemiro",
            aliases = listOf("كاسيميرو", "كارلوس كاسيميرو", "Casemiro"),
            shortNames = listOf("كاسيميرو", "Casemiro"),
            clubHistory = listOf("sao_paulo", "real_madrid", "porto", "manchester_united"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "la_liga", "premier_league", "copa_america"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("DM"),
            isCommon = true,
            notableStats = "5 Champions League titles with Real Madrid, Man Utd"
        ),
        // RAPHAEL VARANE
        FootballPlayer(
            id = "varane",
            canonicalName = "Raphael Varane",
            arabicName = "رافايل فاران",
            englishName = "Raphael Varane",
            aliases = listOf("فاران", "رافائيل فاران", "Varane", "Raphael Varane"),
            shortNames = listOf("فاران", "Varane"),
            clubHistory = listOf("lens", "real_madrid", "manchester_united", "como"),
            nationalTeams = listOf("france"),
            competitions = listOf("champions_league", "world_cup", "la_liga", "premier_league"),
            achievements = listOf("world_cup_winner", "champions_league_winner"),
            positions = listOf("CB"),
            isCommon = true,
            notableStats = "4 UCL with Real Madrid, World Cup 2018, Man Utd"
        ),
        // RUUD VAN NISTELROOY
        FootballPlayer(
            id = "van_nistelrooy",
            canonicalName = "Ruud van Nistelrooy",
            arabicName = "رود فان نيستلروي",
            englishName = "Ruud van Nistelrooy",
            aliases = listOf("فان نيستلروي", "فان نستلروي", "نيستلروي", "Van Nistelrooy", "Ruud van Nistelrooy"),
            shortNames = listOf("فان نيستلروي", "Van Nistelrooy"),
            clubHistory = listOf("den_bosch", "heerenveen", "psv", "manchester_united", "real_madrid", "hsv", "malaga"),
            nationalTeams = listOf("netherlands"),
            competitions = listOf("champions_league", "premier_league", "la_liga"),
            achievements = listOf("golden_boot"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Man United & Real Madrid, 56 UCL Goals"
        ),
        // JAVIER HERNANDEZ (CHICHARITO)
        FootballPlayer(
            id = "chicharito",
            canonicalName = "Javier Hernandez",
            arabicName = "خافيير هيرنانديز (تشيتشاريتو)",
            englishName = "Javier Hernandez (Chicharito)",
            aliases = listOf("تشيتشاريتو", "خافيير هيرنانديز", "هيرنانديز", "Chicharito", "Javier Hernandez"),
            shortNames = listOf("تشيتشاريتو", "Chicharito"),
            clubHistory = listOf("guadalajara", "manchester_united", "real_madrid", "leverkusen", "west_ham", "sevilla", "la_galaxy"),
            nationalTeams = listOf("mexico"),
            competitions = listOf("premier_league", "la_liga"),
            achievements = emptyList(),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Man United & Real Madrid"
        ),
        // MICHAEL OWEN
        FootballPlayer(
            id = "owen",
            canonicalName = "Michael Owen",
            arabicName = "مايكل أوين",
            englishName = "Michael Owen",
            aliases = listOf("أوين", "اوين", "مايكل اوين", "Owen", "Michael Owen"),
            shortNames = listOf("أوين", "Owen"),
            clubHistory = listOf("liverpool", "real_madrid", "newcastle", "manchester_united", "stoke"),
            nationalTeams = listOf("england"),
            competitions = listOf("premier_league", "la_liga"),
            achievements = listOf("ballon_dor"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Ballon d'Or 2001, Liverpool, Real Madrid, Man Utd"
        ),
        // KARIM BENZEMA
        FootballPlayer(
            id = "benzema",
            canonicalName = "Karim Benzema",
            arabicName = "كريم بنزيما",
            englishName = "Karim Benzema",
            aliases = listOf("بنزيما", "الحكومة", "كريم", "Benzema", "Karim Benzema", "KB9"),
            shortNames = listOf("بنزيما", "Benzema"),
            clubHistory = listOf("lyon", "real_madrid", "al_ittihad"),
            nationalTeams = listOf("france"),
            competitions = listOf("champions_league", "la_liga", "ligue_1", "saudi_pro_league"),
            achievements = listOf("ballon_dor", "champions_league_winner"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Ballon d'Or 2022, 5 UCL, 90 UCL Goals"
        ),
        // LUKA MODRIC
        FootballPlayer(
            id = "modric",
            canonicalName = "Luka Modric",
            arabicName = "لوكا مودريتش",
            englishName = "Luka Modric",
            aliases = listOf("مودريتش", "لوكا", "الساحر", "Modric", "Luka Modric"),
            shortNames = listOf("مودريتش", "Modric"),
            clubHistory = listOf("dinamo_zagreb", "tottenham", "real_madrid"),
            nationalTeams = listOf("croatia"),
            competitions = listOf("champions_league", "la_liga", "premier_league", "world_cup"),
            achievements = listOf("ballon_dor", "champions_league_winner", "fifa_the_best"),
            positions = listOf("CM"),
            isCommon = true,
            notableStats = "Ballon d'Or 2018, 6 UCL with Real Madrid"
        ),
        // ZINEDINE ZIDANE
        FootballPlayer(
            id = "zidane",
            canonicalName = "Zinedine Zidane",
            arabicName = "زين الدين زيدان",
            englishName = "Zinedine Zidane",
            aliases = listOf("زيدان", "زيزو", "Zidane", "Zizou", "Zinedine Zidane"),
            shortNames = listOf("زيدان", "Zidane"),
            clubHistory = listOf("cannes", "bordeaux", "juventus", "real_madrid"),
            nationalTeams = listOf("france"),
            competitions = listOf("champions_league", "world_cup", "euro", "serie_a", "la_liga"),
            achievements = listOf("ballon_dor", "world_cup_winner", "champions_league_winner", "euro_winner"),
            positions = listOf("AM"),
            isCommon = true,
            notableStats = "World Cup 1998, Ballon d'Or 1998, UCL 2002"
        ),
        // KAKA
        FootballPlayer(
            id = "kaka",
            canonicalName = "Kaka",
            arabicName = "كاكا",
            englishName = "Kaka",
            aliases = listOf("كاكا", "ريكاردو كاكا", "Kaka", "Ricardo Kaka"),
            shortNames = listOf("كاكا", "Kaka"),
            clubHistory = listOf("sao_paulo", "milan", "real_madrid", "orlando_city"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "world_cup", "serie_a", "la_liga"),
            achievements = listOf("ballon_dor", "world_cup_winner", "champions_league_winner"),
            positions = listOf("AM"),
            isCommon = true,
            notableStats = "Ballon d'Or 2007, World Cup 2002, UCL 2007"
        ),
        // RONALDINHO
        FootballPlayer(
            id = "ronaldinho",
            canonicalName = "Ronaldinho",
            arabicName = "رونالدينيو",
            englishName = "Ronaldinho",
            aliases = listOf("رونالدينيو", "الساحر البرازيلي", "رونالدينهو", "Ronaldinho", "Ronaldinho Gaucho"),
            shortNames = listOf("رونالدينيو", "Ronaldinho"),
            clubHistory = listOf("gremio", "psg", "barcelona", "milan", "flamengo", "atletico_mineiro", "queretaro"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "world_cup", "copa_america", "la_liga", "serie_a", "ligue_1"),
            achievements = listOf("ballon_dor", "world_cup_winner", "champions_league_winner"),
            positions = listOf("LW", "AM"),
            isCommon = true,
            notableStats = "Ballon d'Or 2005, World Cup 2002, UCL 2006"
        ),
        // THIERRY HENRY
        FootballPlayer(
            id = "henry",
            canonicalName = "Thierry Henry",
            arabicName = "تييري هنري",
            englishName = "Thierry Henry",
            aliases = listOf("هنري", "تيري هنري", "الغزال الأسمر", "Henry", "Thierry Henry"),
            shortNames = listOf("هنري", "Henry"),
            clubHistory = listOf("monaco", "juventus", "arsenal", "barcelona", "ny_red_bulls"),
            nationalTeams = listOf("france"),
            competitions = listOf("champions_league", "world_cup", "euro", "premier_league", "la_liga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "treble", "golden_boot", "euro_winner"),
            positions = listOf("FW", "LW", "ST"),
            isCommon = true,
            notableStats = "Arsenal Legend, 4 Premier League Golden Boots, World Cup 1998, UCL 2009"
        ),
        // MOHAMED SALAH
        FootballPlayer(
            id = "salah",
            canonicalName = "Mohamed Salah",
            arabicName = "محمد صلاح",
            englishName = "Mohamed Salah",
            aliases = listOf("صلاح", "مو صلاح", "فخر العرب", "الملك المصري", "Salah", "Mo Salah", "Mohamed Salah"),
            shortNames = listOf("صلاح", "Salah"),
            clubHistory = listOf("al_mokawloon", "basel", "chelsea", "fiorentina", "roma", "liverpool"),
            nationalTeams = listOf("egypt"),
            competitions = listOf("champions_league", "premier_league", "serie_a"),
            achievements = listOf("champions_league_winner", "golden_boot"),
            positions = listOf("RW", "FW"),
            isCommon = true,
            notableStats = "3 Premier League Golden Boots, UCL 2019"
        ),
        // SADIO MANE
        FootballPlayer(
            id = "mane",
            canonicalName = "Sadio Mane",
            arabicName = "ساديو ماني",
            englishName = "Sadio Mane",
            aliases = listOf("ماني", "ساديو", "Mane", "Sadio Mane"),
            shortNames = listOf("ماني", "Mane"),
            clubHistory = listOf("metz", "salzburg", "southampton", "liverpool", "bayern_munich", "al_nassr"),
            nationalTeams = listOf("senegal"),
            competitions = listOf("champions_league", "premier_league", "bundesliga", "afcon", "saudi_pro_league"),
            achievements = listOf("champions_league_winner", "afcon_winner", "golden_boot"),
            positions = listOf("LW", "FW"),
            isCommon = true,
            notableStats = "AFCON 2021, UCL 2019, PL Golden Boot 2019"
        ),
        // RIYAD MAHREZ
        FootballPlayer(
            id = "mahrez",
            canonicalName = "Riyad Mahrez",
            arabicName = "رياض محرز",
            englishName = "Riyad Mahrez",
            aliases = listOf("محرز", "رياض", "فخر الجزائر", "Mahrez", "Riyad Mahrez"),
            shortNames = listOf("محرز", "Mahrez"),
            clubHistory = listOf("quimper", "le_havre", "leicester", "manchester_city", "al_ahli"),
            nationalTeams = listOf("algeria"),
            competitions = listOf("champions_league", "premier_league", "afcon", "saudi_pro_league"),
            achievements = listOf("champions_league_winner", "treble", "afcon_winner"),
            positions = listOf("RW"),
            isCommon = true,
            notableStats = "Premier League with Leicester & Man City, Treble 2023, AFCON 2019"
        ),
        // ERLING HAALAND
        FootballPlayer(
            id = "haaland",
            canonicalName = "Erling Haaland",
            arabicName = "إرلينغ هالاند",
            englishName = "Erling Haaland",
            aliases = listOf("هالاند", "ارلينغ هالاند", "الوحش النرويجي", "Haaland", "Erling Haaland"),
            shortNames = listOf("هالاند", "Haaland"),
            clubHistory = listOf("bryne", "molde", "salzburg", "dortmund", "manchester_city"),
            nationalTeams = listOf("norway"),
            competitions = listOf("champions_league", "premier_league", "bundesliga"),
            achievements = listOf("champions_league_winner", "treble", "golden_boot"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Treble 2023, 2x PL Golden Boot, 40+ UCL Goals"
        ),
        // KYLIAN MBAPPE
        FootballPlayer(
            id = "mbappe",
            canonicalName = "Kylian Mbappe",
            arabicName = "كيليان مبابي",
            englishName = "Kylian Mbappe",
            aliases = listOf("مبابي", "كيليان", "Mbappe", "Kylian Mbappe"),
            shortNames = listOf("مبابي", "Mbappe"),
            clubHistory = listOf("monaco", "psg", "real_madrid"),
            nationalTeams = listOf("france"),
            competitions = listOf("world_cup", "champions_league", "ligue_1", "la_liga"),
            achievements = listOf("world_cup_winner", "golden_boot"),
            positions = listOf("FW", "LW", "ST"),
            isCommon = true,
            notableStats = "World Cup 2018, WC Golden Boot 2022 (Hat-trick in final)"
        ),
        // NEYMAR JR
        FootballPlayer(
            id = "neymar",
            canonicalName = "Neymar Jr",
            arabicName = "نيمار جونيور",
            englishName = "Neymar Jr",
            aliases = listOf("نيمار", "نيمار دا سيلفا", "Neymar", "Neymar Jr"),
            shortNames = listOf("نيمار", "Neymar"),
            clubHistory = listOf("sao_paulo", "santos", "barcelona", "psg", "al_hilal"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "la_liga", "ligue_1", "copa_libertadores", "saudi_pro_league"),
            achievements = listOf("champions_league_winner", "treble"),
            positions = listOf("LW", "AM"),
            isCommon = true,
            notableStats = "Treble 2015 with Barcelona, Brazil All-time top scorer"
        ),
        // LUIS SUAREZ
        FootballPlayer(
            id = "suarez",
            canonicalName = "Luis Suarez",
            arabicName = "لويس سواريز",
            englishName = "Luis Suarez",
            aliases = listOf("سواريز", "السفاح", "Suarez", "Luis Suarez", "El Pistolero"),
            shortNames = listOf("سواريز", "Suarez"),
            clubHistory = listOf("nacional", "groningen", "ajax", "liverpool", "barcelona", "atletico_madrid", "gremio", "inter_miami"),
            nationalTeams = listOf("uruguay"),
            competitions = listOf("champions_league", "copa_america", "premier_league", "la_liga", "mls"),
            achievements = listOf("champions_league_winner", "treble", "golden_boot"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Golden Boot in PL & La Liga, Treble 2015"
        ),
        // ROBERT LEWANDOWSKI
        FootballPlayer(
            id = "lewandowski",
            canonicalName = "Robert Lewandowski",
            arabicName = "روبرت ليفاندوفسكي",
            englishName = "Robert Lewandowski",
            aliases = listOf("ليفاندوفسكي", "ليفا", "روبرت ليفاندوفسكي", "Lewandowski", "Robert Lewandowski", "Lewa"),
            shortNames = listOf("ليفاندوفسكي", "ليفا", "Lewy"),
            clubHistory = listOf("lech_poznan", "dortmund", "bayern_munich", "barcelona"),
            nationalTeams = listOf("poland"),
            competitions = listOf("champions_league", "bundesliga", "la_liga"),
            achievements = listOf("champions_league_winner", "treble", "golden_boot", "fifa_the_best"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Treble 2020, 94+ UCL Goals, 2x FIFA Best"
        ),
        // KEVIN DE BRUYNE
        FootballPlayer(
            id = "de_bruyne",
            canonicalName = "Kevin De Bruyne",
            arabicName = "كيفين دي بروين",
            englishName = "Kevin De Bruyne",
            aliases = listOf("دي بروين", "كيفن دي بروين", "المهندس", "KDB", "De Bruyne", "Kevin De Bruyne"),
            shortNames = listOf("دي بروين", "KDB"),
            clubHistory = listOf("genk", "chelsea", "bremen", "wolfsburg", "manchester_city"),
            nationalTeams = listOf("belgium"),
            competitions = listOf("champions_league", "premier_league", "bundesliga"),
            achievements = listOf("champions_league_winner", "treble"),
            positions = listOf("AM", "CM"),
            isCommon = true,
            notableStats = "Treble 2023, Man City Maestro"
        ),
        // TONI KROOS
        FootballPlayer(
            id = "kroos",
            canonicalName = "Toni Kroos",
            arabicName = "توني كروس",
            englishName = "Toni Kroos",
            aliases = listOf("كروس", "توني كروس", "المهندس الألماني", "Kroos", "Toni Kroos"),
            shortNames = listOf("كروس", "Kroos"),
            clubHistory = listOf("bayern_munich", "leverkusen", "real_madrid"),
            nationalTeams = listOf("germany"),
            competitions = listOf("champions_league", "world_cup", "bundesliga", "la_liga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "treble"),
            positions = listOf("CM"),
            isCommon = true,
            notableStats = "World Cup 2014, 6 Champions League titles (Bayern & Real)"
        ),
        // SERGIO RAMOS
        FootballPlayer(
            id = "ramos",
            canonicalName = "Sergio Ramos",
            arabicName = "سيرجيو راموس",
            englishName = "Sergio Ramos",
            aliases = listOf("راموس", "سيرخيو راموس", "القيصر", "الكابيتانو", "Ramos", "Sergio Ramos"),
            shortNames = listOf("راموس", "Ramos"),
            clubHistory = listOf("sevilla", "real_madrid", "psg"),
            nationalTeams = listOf("spain"),
            competitions = listOf("champions_league", "world_cup", "euro", "la_liga", "ligue_1"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "euro_winner"),
            positions = listOf("CB"),
            isCommon = true,
            notableStats = "World Cup 2010, 2 Euros, 4 UCL with Real Madrid"
        ),
        // IKER CASILLAS
        FootballPlayer(
            id = "casillas",
            canonicalName = "Iker Casillas",
            arabicName = "إيكر كاسياس",
            englishName = "Iker Casillas",
            aliases = listOf("كاسياس", "القديس", "ايكر كاسياس", "Casillas", "Iker Casillas", "San Iker"),
            shortNames = listOf("كاسياس", "Casillas"),
            clubHistory = listOf("real_madrid", "porto"),
            nationalTeams = listOf("spain"),
            competitions = listOf("champions_league", "world_cup", "euro", "la_liga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "euro_winner"),
            positions = listOf("GK"),
            isCommon = true,
            notableStats = "World Cup 2010 Captain, 2 Euros, 3 UCL"
        ),
        // GIANLUIGI BUFFON
        FootballPlayer(
            id = "buffon",
            canonicalName = "Gianluigi Buffon",
            arabicName = "جانلويجي بوفون",
            englishName = "Gianluigi Buffon",
            aliases = listOf("بوفون", "جيجي بوفون", "Buffon", "Gigi Buffon", "Gianluigi Buffon"),
            shortNames = listOf("بوفون", "Buffon"),
            clubHistory = listOf("parma", "juventus", "psg"),
            nationalTeams = listOf("italy"),
            competitions = listOf("world_cup", "serie_a", "ligue_1"),
            achievements = listOf("world_cup_winner"),
            positions = listOf("GK"),
            isCommon = true,
            notableStats = "World Cup 2006, 10 Serie A titles, Juve legend"
        ),
        // MANUEL NEUER
        FootballPlayer(
            id = "neuer",
            canonicalName = "Manuel Neuer",
            arabicName = "مانويل نوير",
            englishName = "Manuel Neuer",
            aliases = listOf("نوير", "مانويل نوير", "جدار برلين", "Neuer", "Manuel Neuer"),
            shortNames = listOf("نوير", "Neuer"),
            clubHistory = listOf("schalke", "bayern_munich"),
            nationalTeams = listOf("germany"),
            competitions = listOf("champions_league", "world_cup", "bundesliga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "treble"),
            positions = listOf("GK"),
            isCommon = true,
            notableStats = "World Cup 2014, 2 Trebles with Bayern (2013, 2020)"
        ),
        // ANDRES INIESTA
        FootballPlayer(
            id = "iniesta",
            canonicalName = "Andres Iniesta",
            arabicName = "أندريس إنييستا",
            englishName = "Andres Iniesta",
            aliases = listOf("إنييستا", "انييستا", "الرسام", "Iniesta", "Andres Iniesta", "Don Andres"),
            shortNames = listOf("إنييستا", "Iniesta"),
            clubHistory = listOf("barcelona", "vissel_kobe", "emirates_club"),
            nationalTeams = listOf("spain"),
            competitions = listOf("champions_league", "world_cup", "euro", "la_liga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "treble", "euro_winner"),
            positions = listOf("CM", "AM"),
            isCommon = true,
            notableStats = "Scored 2010 WC Winning Goal, 2 Trebles, 4 UCL"
        ),
        // XAVI HERNANDEZ
        FootballPlayer(
            id = "xavi",
            canonicalName = "Xavi Hernandez",
            arabicName = "تشافي هيرنانديز",
            englishName = "Xavi Hernandez",
            aliases = listOf("تشافي", "زافي", "تشافي هرنانديز", "Xavi", "Xavi Hernandez"),
            shortNames = listOf("تشافي", "Xavi"),
            clubHistory = listOf("barcelona", "al_sadd"),
            nationalTeams = listOf("spain"),
            competitions = listOf("champions_league", "world_cup", "euro", "la_liga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "treble", "euro_winner"),
            positions = listOf("CM"),
            isCommon = true,
            notableStats = "World Cup 2010, 2 Euros, 4 UCL, 2 Trebles"
        ),
        // GERARD PIQUE
        FootballPlayer(
            id = "pique",
            canonicalName = "Gerard Pique",
            arabicName = "جيرارد بيكيه",
            englishName = "Gerard Pique",
            aliases = listOf("بيكيه", "جيرارد بيكي", "بيكي", "Pique", "Gerard Pique"),
            shortNames = listOf("بيكيه", "Pique"),
            clubHistory = listOf("barcelona", "manchester_united", "zaragoza"),
            nationalTeams = listOf("spain"),
            competitions = listOf("champions_league", "world_cup", "euro", "premier_league", "la_liga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "treble", "euro_winner"),
            positions = listOf("CB"),
            isCommon = true,
            notableStats = "UCL with Man Utd & Barca, World Cup 2010"
        ),
        // CARLES PUYOL
        FootballPlayer(
            id = "puyol",
            canonicalName = "Carles Puyol",
            arabicName = "كارليس بويول",
            englishName = "Carles Puyol",
            aliases = listOf("بويول", "قلب الأسد", "كارلس بويول", "Puyol", "Carles Puyol"),
            shortNames = listOf("بويول", "Puyol"),
            clubHistory = listOf("barcelona"),
            nationalTeams = listOf("spain"),
            competitions = listOf("champions_league", "world_cup", "euro", "la_liga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "treble", "euro_winner"),
            positions = listOf("CB"),
            isCommon = true,
            notableStats = "Barca Captain, World Cup 2010, 3 UCL"
        ),
        // N'GOLO KANTE
        FootballPlayer(
            id = "kante",
            canonicalName = "N'Golo Kante",
            arabicName = "نغولو كانتي",
            englishName = "N'Golo Kante",
            aliases = listOf("كانتي", "نغولو", "انغولو كانتي", "Kante", "N'Golo Kante"),
            shortNames = listOf("كانتي", "Kante"),
            clubHistory = listOf("boulogne", "caen", "leicester", "chelsea", "al_ittihad"),
            nationalTeams = listOf("france"),
            competitions = listOf("champions_league", "world_cup", "premier_league", "europa_league", "saudi_pro_league"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "europa_league_winner"),
            positions = listOf("DM", "CM"),
            isCommon = true,
            notableStats = "World Cup 2018, UCL 2021, PL with Leicester & Chelsea"
        ),
        // HARRY KANE
        FootballPlayer(
            id = "kane",
            canonicalName = "Harry Kane",
            arabicName = "هاري كين",
            englishName = "Harry Kane",
            aliases = listOf("كين", "هاري كين", "Kane", "Harry Kane"),
            shortNames = listOf("كين", "Kane"),
            clubHistory = listOf("tottenham", "leyton_orient", "millwall", "norwich", "leicester", "bayern_munich"),
            nationalTeams = listOf("england"),
            competitions = listOf("premier_league", "bundesliga", "champions_league"),
            achievements = listOf("golden_boot"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "3x PL Golden Boot, World Cup 2018 Golden Boot"
        ),
        // SON HEUNG-MIN
        FootballPlayer(
            id = "son",
            canonicalName = "Son Heung-min",
            arabicName = "سون هيونغ مين",
            englishName = "Son Heung-min",
            aliases = listOf("سون", "سون هيونغ-مين", "Son", "Son Heung-min"),
            shortNames = listOf("سون", "Son"),
            clubHistory = listOf("hsv", "leverkusen", "tottenham"),
            nationalTeams = listOf("south_korea"),
            competitions = listOf("premier_league", "bundesliga", "champions_league"),
            achievements = listOf("golden_boot"),
            positions = listOf("LW", "FW"),
            isCommon = true,
            notableStats = "Premier League Golden Boot 2022"
        ),
        // SERGIO AGUERO
        FootballPlayer(
            id = "aguero",
            canonicalName = "Sergio Aguero",
            arabicName = "سيرجيو أغويرو",
            englishName = "Sergio Aguero",
            aliases = listOf("أغويرو", "اغويرو", "كون أغويرو", "Aguero", "Kun Aguero", "Sergio Aguero"),
            shortNames = listOf("أغويرو", "Aguero"),
            clubHistory = listOf("independiente", "atletico_madrid", "manchester_city", "barcelona"),
            nationalTeams = listOf("argentina"),
            competitions = listOf("premier_league", "la_liga", "copa_america"),
            achievements = listOf("golden_boot"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "Man City all-time top scorer, PL Golden Boot 2015, Copa America 2021"
        ),
        // EDEN HAZARD
        FootballPlayer(
            id = "hazard",
            canonicalName = "Eden Hazard",
            arabicName = "إيدين هازارد",
            englishName = "Eden Hazard",
            aliases = listOf("هازارد", "ايدين هازارد", "Hazard", "Eden Hazard"),
            shortNames = listOf("هازارد", "Hazard"),
            clubHistory = listOf("lille", "chelsea", "real_madrid"),
            nationalTeams = listOf("belgium"),
            competitions = listOf("premier_league", "la_liga", "ligue_1", "champions_league"),
            achievements = listOf("champions_league_winner", "europa_league_winner"),
            positions = listOf("LW", "AM"),
            isCommon = true,
            notableStats = "Premier League & La Liga with Chelsea & Real Madrid"
        ),
        // DIDIER DROGBA
        FootballPlayer(
            id = "drogba",
            canonicalName = "Didier Drogba",
            arabicName = "ديدييه دروغبا",
            englishName = "Didier Drogba",
            aliases = listOf("دروغبا", "ديديه دروغبا", "Drogba", "Didier Drogba"),
            shortNames = listOf("دروغبا", "Drogba"),
            clubHistory = listOf("le_mans", "guingamp", "marseille", "chelsea", "shanghai_shenhua", "galatasaray", "montreal_impact"),
            nationalTeams = listOf("ivory_coast"),
            competitions = listOf("champions_league", "premier_league", "afcon"),
            achievements = listOf("champions_league_winner", "golden_boot"),
            positions = listOf("ST"),
            isCommon = true,
            notableStats = "2x PL Golden Boot, UCL 2012 Final Hero"
        ),
        // YAYA TOURE
        FootballPlayer(
            id = "yaya_toure",
            canonicalName = "Yaya Toure",
            arabicName = "يايا توريه",
            englishName = "Yaya Toure",
            aliases = listOf("يايا توري", "يايا توريه", "توري", "Yaya Toure", "Toure"),
            shortNames = listOf("توريه", "Toure"),
            clubHistory = listOf("beveren", "metalurh", "olympiacos", "monaco", "barcelona", "manchester_city", "qingdao"),
            nationalTeams = listOf("ivory_coast"),
            competitions = listOf("champions_league", "la_liga", "premier_league", "afcon"),
            achievements = listOf("champions_league_winner", "treble", "afcon_winner"),
            positions = listOf("CM"),
            isCommon = true,
            notableStats = "4x African Player of the Year, Treble 2009 with Barca, Man City Legend"
        ),
        // MOHAMED ABOUTRIKA
        FootballPlayer(
            id = "aboutrika",
            canonicalName = "Mohamed Aboutrika",
            arabicName = "محمد أبو تريكة",
            englishName = "Mohamed Aboutrika",
            aliases = listOf("أبو تريكة", "ابو تريكة", "الماجيكو", "امير القلوب", "Aboutrika", "Mohamed Aboutrika"),
            shortNames = listOf("أبو تريكة", "Aboutrika"),
            clubHistory = listOf("tersana", "al_ahly", "baniyas"),
            nationalTeams = listOf("egypt"),
            competitions = listOf("afcon", "caf_champions_league"),
            achievements = listOf("afcon_winner"),
            positions = listOf("AM"),
            isCommon = true,
            notableStats = "2x AFCON (2006, 2008), 5 CAF Champions League titles"
        ),
        // ESSAM EL-HADARY
        FootballPlayer(
            id = "elhadary",
            canonicalName = "Essam El-Hadary",
            arabicName = "عصام الحضري",
            englishName = "Essam El-Hadary",
            aliases = listOf("الحضري", "السد العالي", "عصام الحضري", "El-Hadary", "Essam El-Hadary"),
            shortNames = listOf("الحضري", "El-Hadary"),
            clubHistory = listOf("damietta", "al_ahly", "sion", "ismaily", "zamalek", "al_merrikh", "wadi_degla", "al_taawoun", "nogoom"),
            nationalTeams = listOf("egypt"),
            competitions = listOf("afcon", "world_cup", "caf_champions_league"),
            achievements = listOf("afcon_winner"),
            positions = listOf("GK"),
            isCommon = true,
            notableStats = "4x AFCON Winner, Oldest player in World Cup history (2018)"
        ),
        // ACHRAF HAKIMI
        FootballPlayer(
            id = "hakimi",
            canonicalName = "Achraf Hakimi",
            arabicName = "أشرف حكيمي",
            englishName = "Achraf Hakimi",
            aliases = listOf("حكيمي", "اشرف حكيمي", "Hakimi", "Achraf Hakimi"),
            shortNames = listOf("حكيمي", "Hakimi"),
            clubHistory = listOf("real_madrid", "dortmund", "inter", "psg"),
            nationalTeams = listOf("morocco"),
            competitions = listOf("champions_league", "la_liga", "serie_a", "ligue_1", "world_cup"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("RB"),
            isCommon = true,
            notableStats = "World Cup 2022 Semi-finalist, UCL with Real Madrid, Serie A with Inter, Ligue 1 with PSG"
        ),
        // YASSINE BOUNOU
        FootballPlayer(
            id = "bounou",
            canonicalName = "Yassine Bounou",
            arabicName = "ياسين بونو",
            englishName = "Yassine Bounou",
            aliases = listOf("بونو", "ياسين بونو", "Bono", "Bounou", "Yassine Bounou"),
            shortNames = listOf("بونو", "Bono"),
            clubHistory = listOf("wydad", "atletico_madrid", "zaragoza", "girona", "sevilla", "al_hilal"),
            nationalTeams = listOf("morocco"),
            competitions = listOf("europa_league", "la_liga", "world_cup", "saudi_pro_league"),
            achievements = listOf("europa_league_winner"),
            positions = listOf("GK"),
            isCommon = true,
            notableStats = "World Cup 2022 hero, 2x Europa League with Sevilla, Zamora Trophy"
        ),
        // JUDE BELLINGHAM
        FootballPlayer(
            id = "bellingham",
            canonicalName = "Jude Bellingham",
            arabicName = "جود بيلينغهام",
            englishName = "Jude Bellingham",
            aliases = listOf("بيلينغهام", "بيلينجهام", "جود", "Bellingham", "Jude Bellingham"),
            shortNames = listOf("بيلينغهام", "Bellingham"),
            clubHistory = listOf("birmingham", "dortmund", "real_madrid"),
            nationalTeams = listOf("england"),
            competitions = listOf("champions_league", "la_liga", "bundesliga"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("AM", "CM"),
            isCommon = true,
            notableStats = "UCL & La Liga winner in debut season with Real Madrid 2024"
        ),
        // VINICIUS JR
        FootballPlayer(
            id = "vinicius",
            canonicalName = "Vinicius Junior",
            arabicName = "فينيسيوس جونيور",
            englishName = "Vinicius Junior",
            aliases = listOf("فينيسيوس", "فيني", "فيني جونيور", "Vini Jr", "Vinicius Jr", "Vinicius"),
            shortNames = listOf("فينيسيوس", "Vini Jr"),
            clubHistory = listOf("flamengo", "real_madrid"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "la_liga"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("LW"),
            isCommon = true,
            notableStats = "Scored in 2 Champions League Finals (2022, 2024)"
        ),
        // RODRI
        FootballPlayer(
            id = "rodri",
            canonicalName = "Rodri Hernandez",
            arabicName = "رودري هيرنانديز",
            englishName = "Rodri",
            aliases = listOf("رودري", "رودري هيرنانديز", "Rodri", "Rodrigo"),
            shortNames = listOf("رودري", "Rodri"),
            clubHistory = listOf("villarreal", "atletico_madrid", "manchester_city"),
            nationalTeams = listOf("spain"),
            competitions = listOf("champions_league", "premier_league", "la_liga", "euro"),
            achievements = listOf("champions_league_winner", "treble", "euro_winner", "ballon_dor"),
            positions = listOf("DM"),
            isCommon = true,
            notableStats = "Scored Treble Winning UCL goal 2023, Euro 2024 MVP, Ballon d'Or 2024"
        ),
        // GARETH BALE
        FootballPlayer(
            id = "bale",
            canonicalName = "Gareth Bale",
            arabicName = "غاريث بيل",
            englishName = "Gareth Bale",
            aliases = listOf("بيل", "غاريث بيل", "الصاروخ الويلزي", "Bale", "Gareth Bale"),
            shortNames = listOf("بيل", "Bale"),
            clubHistory = listOf("southampton", "tottenham", "real_madrid", "lafc"),
            nationalTeams = listOf("wales"),
            competitions = listOf("champions_league", "la_liga", "premier_league", "mls"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("RW", "LW"),
            isCommon = true,
            notableStats = "5 Champions League titles with Real Madrid"
        ),
        // THOMAS MULLER
        FootballPlayer(
            id = "muller",
            canonicalName = "Thomas Muller",
            arabicName = "توماس مولر",
            englishName = "Thomas Muller",
            aliases = listOf("مولر", "توماس مولر", "صائد المساحات", "Muller", "Thomas Muller"),
            shortNames = listOf("مولر", "Muller"),
            clubHistory = listOf("bayern_munich"),
            nationalTeams = listOf("germany"),
            competitions = listOf("champions_league", "world_cup", "bundesliga"),
            achievements = listOf("world_cup_winner", "champions_league_winner", "treble", "golden_boot"),
            positions = listOf("AM", "FW"),
            isCommon = true,
            notableStats = "World Cup 2014, 2 Trebles with Bayern, 54 UCL Goals"
        ),
        // RAUL GONZALEZ
        FootballPlayer(
            id = "raul",
            canonicalName = "Raul Gonzalez",
            arabicName = "راؤول غونزاليس",
            englishName = "Raul Gonzalez",
            aliases = listOf("راؤول", "راوول", "الفتى الذهبي", "Raul", "Raul Gonzalez"),
            shortNames = listOf("راؤول", "Raul"),
            clubHistory = listOf("real_madrid", "schalke", "al_sadd", "ny_cosmos"),
            nationalTeams = listOf("spain"),
            competitions = listOf("champions_league", "la_liga", "bundesliga"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("FW"),
            isCommon = true,
            notableStats = "3 UCL with Real Madrid, 71 UCL Goals"
        ),
        // DIEGO MARADONA
        FootballPlayer(
            id = "maradona",
            canonicalName = "Diego Maradona",
            arabicName = "دييغو مارادونا",
            englishName = "Diego Maradona",
            aliases = listOf("مارادونا", "دييغو", "دييجو مارادونا", "الأسطورة مارادونا", "Maradona", "Diego Maradona"),
            shortNames = listOf("مارادونا", "Maradona"),
            clubHistory = listOf("argentinos_juniors", "boca_juniors", "barcelona", "napoli", "sevilla", "newells"),
            nationalTeams = listOf("argentina"),
            competitions = listOf("world_cup", "serie_a", "la_liga"),
            achievements = listOf("world_cup_winner"),
            positions = listOf("AM"),
            isCommon = true,
            notableStats = "World Cup 1986, 2 Serie A titles with Napoli"
        ),
        // PELE
        FootballPlayer(
            id = "pele",
            canonicalName = "Pele",
            arabicName = "بيليه",
            englishName = "Pele",
            aliases = listOf("بيليه", "الجوهرة السوداء", "الملك بيليه", "Pele", "Edson Arantes do Nascimento"),
            shortNames = listOf("بيليه", "Pele"),
            clubHistory = listOf("santos", "ny_cosmos"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("world_cup", "copa_libertadores"),
            achievements = listOf("world_cup_winner"),
            positions = listOf("FW", "AM"),
            isCommon = true,
            notableStats = "Only player to win 3 World Cups (1958, 1962, 1970)"
        ),
        // THIBAUT COURTOIS
        FootballPlayer(
            id = "courtois",
            canonicalName = "Thibaut Courtois",
            arabicName = "تيبو كورتوا",
            englishName = "Thibaut Courtois",
            aliases = listOf("كورتوا", "تيبو", "Courtois", "Thibaut Courtois"),
            shortNames = listOf("كورتوا", "Courtois"),
            clubHistory = listOf("genk", "atletico_madrid", "chelsea", "real_madrid"),
            nationalTeams = listOf("belgium"),
            competitions = listOf("champions_league", "la_liga", "premier_league"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("GK"),
            isCommon = true,
            notableStats = "UCL 2022 & 2024 with Real Madrid, Premier League with Chelsea, La Liga with Atletico"
        ),
        // ALISSON BECKER
        FootballPlayer(
            id = "alisson",
            canonicalName = "Alisson Becker",
            arabicName = "أليسون بيكر",
            englishName = "Alisson Becker",
            aliases = listOf("أليسون", "اليسون", "بيكر", "Alisson", "Alisson Becker"),
            shortNames = listOf("أليسون", "Alisson"),
            clubHistory = listOf("internacional", "roma", "liverpool"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "premier_league", "copa_america", "serie_a"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("GK"),
            isCommon = true,
            notableStats = "UCL 2019, Premier League 2020, Copa America 2019"
        ),
        // VIRGIL VAN DIJK
        FootballPlayer(
            id = "van_dijk",
            canonicalName = "Virgil van Dijk",
            arabicName = "فيرجيل فان دايك",
            englishName = "Virgil van Dijk",
            aliases = listOf("فان دايك", "فيرجيل", "فاندايك", "Van Dijk", "Virgil van Dijk", "VVD"),
            shortNames = listOf("فان دايك", "Van Dijk"),
            clubHistory = listOf("groningen", "celtic", "southampton", "liverpool"),
            nationalTeams = listOf("netherlands"),
            competitions = listOf("champions_league", "premier_league"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("CB"),
            isCommon = true,
            notableStats = "UCL 2019, UEFA Player of the Year 2019, Premier League 2020"
        ),
        // DANI ALVES
        FootballPlayer(
            id = "dani_alves",
            canonicalName = "Dani Alves",
            arabicName = "داني ألفيس",
            englishName = "Dani Alves",
            aliases = listOf("ألفيس", "داني الفيس", "الفيس", "Dani Alves", "Alves"),
            shortNames = listOf("ألفيس", "Alves"),
            clubHistory = listOf("bahia", "sevilla", "barcelona", "juventus", "psg", "sao_paulo", "pumas"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "la_liga", "serie_a", "ligue_1", "copa_america"),
            achievements = listOf("champions_league_winner", "treble"),
            positions = listOf("RB"),
            isCommon = true,
            notableStats = "Most decorated player in history (43 trophies), 2 Trebles with Barca"
        ),
        // MARCELO
        FootballPlayer(
            id = "marcelo",
            canonicalName = "Marcelo Vieira",
            arabicName = "مارسيلو",
            englishName = "Marcelo",
            aliases = listOf("مارسيلو", "Marcelo", "Marcelo Vieira"),
            shortNames = listOf("مارسيلو", "Marcelo"),
            clubHistory = listOf("fluminense", "real_madrid", "olympiacos"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "la_liga", "copa_libertadores"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("LB"),
            isCommon = true,
            notableStats = "5 Champions League titles with Real Madrid, Copa Libertadores with Fluminense"
        ),
        // WAYNE ROONEY
        FootballPlayer(
            id = "rooney",
            canonicalName = "Wayne Rooney",
            arabicName = "واين روني",
            englishName = "Wayne Rooney",
            aliases = listOf("روني", "واين روني", "الفتى الذهبي الإنجليزي", "Rooney", "Wayne Rooney"),
            shortNames = listOf("روني", "Rooney"),
            clubHistory = listOf("everton", "manchester_united", "dc_united", "derby_county"),
            nationalTeams = listOf("england"),
            competitions = listOf("champions_league", "premier_league", "europa_league"),
            achievements = listOf("champions_league_winner", "europa_league_winner"),
            positions = listOf("FW", "ST", "AM"),
            isCommon = true,
            notableStats = "Manchester United all-time top scorer (253 goals), UCL 2008"
        ),
        // CESC FABREGAS
        FootballPlayer(
            id = "fabregas",
            canonicalName = "Cesc Fabregas",
            arabicName = "سيسك فابريغاس",
            englishName = "Cesc Fabregas",
            aliases = listOf("فابريغاس", "فابريجاس", "سيسك", "Fabregas", "Cesc Fabregas"),
            shortNames = listOf("فابريغاس", "Fabregas"),
            clubHistory = listOf("arsenal", "barcelona", "chelsea", "monaco", "como"),
            nationalTeams = listOf("spain"),
            competitions = listOf("world_cup", "euro", "premier_league", "la_liga"),
            achievements = listOf("world_cup_winner", "euro_winner"),
            positions = listOf("CM"),
            isCommon = true,
            notableStats = "World Cup 2010 (Assisted Iniesta's winner), 2 Euros, Arsenal, Barca, Chelsea"
        ),
        // DAVID SILVA
        FootballPlayer(
            id = "david_silva",
            canonicalName = "David Silva",
            arabicName = "دافيد سيلفا",
            englishName = "David Silva",
            aliases = listOf("دافيد سيلفا", "ديفيد سيلفا", "David Silva"),
            shortNames = listOf("سيلفا دافيد", "D. Silva"),
            clubHistory = listOf("valencia", "eibar", "celta", "manchester_city", "real_sociedad"),
            nationalTeams = listOf("spain"),
            competitions = listOf("world_cup", "euro", "premier_league", "la_liga"),
            achievements = listOf("world_cup_winner", "euro_winner"),
            positions = listOf("AM", "LW"),
            isCommon = true,
            notableStats = "World Cup 2010, 2 Euros, 4 Premier League titles with Man City"
        ),
        // THIAGO SILVA
        FootballPlayer(
            id = "thiago_silva",
            canonicalName = "Thiago Silva",
            arabicName = "تياغو سيلفا",
            englishName = "Thiago Silva",
            aliases = listOf("تياغو سيلفا", "تياجو سيلفا", "الوحش", "Thiago Silva"),
            shortNames = listOf("تياغو سيلفا", "T. Silva"),
            clubHistory = listOf("juventude", "fluminense", "milan", "psg", "chelsea"),
            nationalTeams = listOf("brazil"),
            competitions = listOf("champions_league", "serie_a", "ligue_1", "premier_league", "copa_america"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("CB"),
            isCommon = true,
            notableStats = "UCL 2021 with Chelsea, Serie A with Milan, 7 Ligue 1 titles with PSG"
        ),
        // BERNARDO SILVA
        FootballPlayer(
            id = "bernardo_silva",
            canonicalName = "Bernardo Silva",
            arabicName = "برناردو سيلفا",
            englishName = "Bernardo Silva",
            aliases = listOf("برناردو سيلفا", "برناردو", "Bernardo Silva", "Bernardo"),
            shortNames = listOf("برناردو سيلفا", "B. Silva"),
            clubHistory = listOf("benfica", "monaco", "manchester_city"),
            nationalTeams = listOf("portugal"),
            competitions = listOf("champions_league", "premier_league", "ligue_1"),
            achievements = listOf("champions_league_winner", "treble"),
            positions = listOf("RW", "CM", "AM"),
            isCommon = true,
            notableStats = "Treble 2023 with Manchester City, Ligue 1 with Monaco"
        ),
        // ANTOINE GRIEZMANN
        FootballPlayer(
            id = "griezmann",
            canonicalName = "Antoine Griezmann",
            arabicName = "أنطوان غريزمان",
            englishName = "Antoine Griezmann",
            aliases = listOf("غريزمان", "انطوان غريزمان", "جريزمان", "Griezmann", "Antoine Griezmann"),
            shortNames = listOf("غريزمان", "Griezmann"),
            clubHistory = listOf("real_sociedad", "atletico_madrid", "barcelona"),
            nationalTeams = listOf("france"),
            competitions = listOf("world_cup", "europa_league", "la_liga"),
            achievements = listOf("world_cup_winner", "europa_league_winner"),
            positions = listOf("FW", "AM"),
            isCommon = true,
            notableStats = "World Cup 2018 winner & Bronze Ball, Atletico Madrid all-time top scorer"
        ),
        // PETR CECH
        FootballPlayer(
            id = "cech",
            canonicalName = "Petr Cech",
            arabicName = "بيتر تشيك",
            englishName = "Petr Cech",
            aliases = listOf("بيتر تشيك", "تشيك", "صاحب الخوذة", "Cech", "Petr Cech"),
            shortNames = listOf("تشيك", "Cech"),
            clubHistory = listOf("chmel_blsany", "sparta_prague", "rennes", "chelsea", "arsenal"),
            nationalTeams = listOf("czech_republic"),
            competitions = listOf("champions_league", "europa_league", "premier_league"),
            achievements = listOf("champions_league_winner", "europa_league_winner"),
            positions = listOf("GK"),
            isCommon = true,
            notableStats = "UCL 2012 with Chelsea, 4 Premier League titles, Arsenal & Chelsea"
        ),
        // ASHLEY COLE
        FootballPlayer(
            id = "ashley_cole",
            canonicalName = "Ashley Cole",
            arabicName = "أشلي كول",
            englishName = "Ashley Cole",
            aliases = listOf("أشلي كول", "اشلي كول", "كول", "Ashley Cole"),
            shortNames = listOf("أشلي كول", "A. Cole"),
            clubHistory = listOf("arsenal", "crystal_palace", "chelsea", "roma", "la_galaxy", "derby"),
            nationalTeams = listOf("england"),
            competitions = listOf("champions_league", "europa_league", "premier_league"),
            achievements = listOf("champions_league_winner", "europa_league_winner"),
            positions = listOf("LB"),
            isCommon = true,
            notableStats = "Invincible with Arsenal, UCL 2012 with Chelsea"
        ),
        // KAI HAVERTZ
        FootballPlayer(
            id = "havertz",
            canonicalName = "Kai Havertz",
            arabicName = "كاي هافيرتز",
            englishName = "Kai Havertz",
            aliases = listOf("هافيرتز", "كاي هافرتز", "هافرتز", "Havertz", "Kai Havertz"),
            shortNames = listOf("هافيرتز", "Havertz"),
            clubHistory = listOf("leverkusen", "chelsea", "arsenal"),
            nationalTeams = listOf("germany"),
            competitions = listOf("champions_league", "premier_league", "bundesliga"),
            achievements = listOf("champions_league_winner"),
            positions = listOf("FW", "AM"),
            isCommon = true,
            notableStats = "Scored 2021 UCL Winning Goal for Chelsea, Chelsea & Arsenal"
        )
    )

    val allCategories: List<FootballCategory> = listOf(
        // LEVEL 1: ROOKIE
        FootballCategory(
            id = "cat_messi_clubs",
            titleAr = "أندية لعب لها ليونيل ميسي",
            titleEn = "Clubs Lionel Messi Played For",
            descriptionAr = "سمِّ أي نادٍ ارتدى ليونيل ميسي قميصه رسمياً في مسيرته الاحترافية.",
            descriptionEn = "Name any club Lionel Messi played for officially in his career.",
            difficulty = CategoryDifficulty.ROOKIE,
            timerSeconds = 5,
            levelNumber = 1,
            iconEmoji = "🐐",
            predicate = { player ->
                // Here "player" represents answers if category accepts players or clubs!
                // For a consistent player trivia rondo, let's keep all categories focused on Football Players:
                player.clubHistory.contains("barcelona") && player.nationalTeams.contains("argentina")
            }
        ),
        FootballCategory(
            id = "cat_ballon_dor",
            titleAr = "الفائزون بجائزة الكرة الذهبية (Ballon d'Or)",
            titleEn = "Ballon d'Or Winners",
            descriptionAr = "اذكر لاعباً توّج بجائزة الكرة الذهبية عبر التاريخ!",
            descriptionEn = "Name any player who has won the Ballon d'Or in football history!",
            difficulty = CategoryDifficulty.ROOKIE,
            timerSeconds = 5,
            levelNumber = 1,
            iconEmoji = "🏆",
            predicate = { it.achievements.contains("ballon_dor") }
        ),

        // LEVEL 2: BEGINNER
        FootballCategory(
            id = "cat_world_cup_winners",
            titleAr = "أبطال كأس العالم عبر التاريخ",
            titleEn = "World Cup Winners",
            descriptionAr = "سمِّ لاعباً فاز بكأس العالم مع منتخب بلاده!",
            descriptionEn = "Name a player who lifted the FIFA World Cup trophy!",
            difficulty = CategoryDifficulty.BEGINNER,
            timerSeconds = 5,
            levelNumber = 2,
            iconEmoji = "🌍",
            predicate = { it.achievements.contains("world_cup_winner") }
        ),
        FootballCategory(
            id = "cat_brazil_legends",
            titleAr = "نجوم وأساطير منتخب البرازيل 🇧🇷",
            titleEn = "Brazil National Team Legends",
            descriptionAr = "اذكر لاعباً برازيلياً ارتدى قميص السامبا!",
            descriptionEn = "Name any iconic Brazilian national team player!",
            difficulty = CategoryDifficulty.BEGINNER,
            timerSeconds = 5,
            levelNumber = 2,
            iconEmoji = "🇧🇷",
            predicate = { it.nationalTeams.contains("brazil") }
        ),

        // LEVEL 3: RISING PLAYER
        FootballCategory(
            id = "cat_ucl_winners",
            titleAr = "الفائزون بدوري أبطال أوروبا (UCL)",
            titleEn = "UEFA Champions League Winners",
            descriptionAr = "اذكر لاعباً رفع الكأس ذات الأذنين مع أي نادٍ أوروبي!",
            descriptionEn = "Name any player who won the UEFA Champions League!",
            difficulty = CategoryDifficulty.RISING,
            timerSeconds = 5,
            levelNumber = 3,
            iconEmoji = "⭐",
            predicate = { it.achievements.contains("champions_league_winner") }
        ),
        FootballCategory(
            id = "cat_african_icons",
            titleAr = "أساطير الكرة الأفريقية وتتويجات الكان 🌍",
            titleEn = "African Football Legends",
            descriptionAr = "سمِّ لاعباً أفريقياً بارزاً أو بطلاً لكأس الأمم الأفريقية!",
            descriptionEn = "Name a prominent African footballer or AFCON winner!",
            difficulty = CategoryDifficulty.RISING,
            timerSeconds = 5,
            levelNumber = 3,
            iconEmoji = "🦁",
            predicate = {
                it.achievements.contains("afcon_winner") ||
                listOf("egypt", "senegal", "algeria", "cameroon", "ivory_coast", "morocco").any { country ->
                    it.nationalTeams.contains(country)
                }
            }
        ),

        // LEVEL 4: INTERMEDIATE
        FootballCategory(
            id = "cat_pl_la_liga",
            titleAr = "لاعبون لعبوا في الدوري الإنجليزي والإسباني معاً",
            titleEn = "Played in both Premier League & La Liga",
            descriptionAr = "سمِّ لاعباً خاض مباريات في البريميرليغ والليغا الإسبانية!",
            descriptionEn = "Name a player who played in both Premier League and La Liga!",
            difficulty = CategoryDifficulty.INTERMEDIATE,
            timerSeconds = 4,
            levelNumber = 4,
            iconEmoji = "⚔️",
            predicate = {
                it.competitions.contains("premier_league") && it.competitions.contains("la_liga")
            }
        ),
        FootballCategory(
            id = "cat_golden_boot",
            titleAr = "الحاصلون على الحذاء الذهبي (الدوريات أو المونديال)",
            titleEn = "Golden Boot Winners",
            descriptionAr = "سمِّ هدافاً توّج بجائزة الحذاء الذهبي في الدوريات الكبرى أو كأس العالم!",
            descriptionEn = "Name a striker who won a Golden Boot in top leagues or World Cup!",
            difficulty = CategoryDifficulty.INTERMEDIATE,
            timerSeconds = 4,
            levelNumber = 4,
            iconEmoji = "👟",
            predicate = { it.achievements.contains("golden_boot") }
        ),

        // LEVEL 5: COMPETITOR (THE FAMOUS CLASICO RONDO)
        FootballCategory(
            id = "cat_barca_madrid",
            titleAr = "لاعبون مثلوا برشلونة وريال مدريد معاً!",
            titleEn = "Played for both Barcelona & Real Madrid",
            descriptionAr = "التحدي الكلاسيكي الشهير! اذكر لاعباً ارتدى قميصي الغريمين برشلونة وريال مدريد!",
            descriptionEn = "The famous Clasico challenge! Name a player who played for both Barca and Real Madrid!",
            difficulty = CategoryDifficulty.COMPETITOR,
            timerSeconds = 4,
            levelNumber = 5,
            iconEmoji = "👑",
            predicate = {
                it.clubHistory.contains("barcelona") && it.clubHistory.contains("real_madrid")
            }
        ),
        FootballCategory(
            id = "cat_french_stars",
            titleAr = "أبطال فرنسا المتوجون بكأس العالم (1998 أو 2018) 🇫🇷",
            titleEn = "French World Cup Champions",
            descriptionAr = "اذكر لاعباً فرنسياً فاز بالمونديال مع الديوك!",
            descriptionEn = "Name a French player who won the World Cup with Les Bleus!",
            difficulty = CategoryDifficulty.COMPETITOR,
            timerSeconds = 4,
            levelNumber = 5,
            iconEmoji = "🇫🇷",
            predicate = {
                it.nationalTeams.contains("france") && it.achievements.contains("world_cup_winner")
            }
        ),

        // LEVEL 6: ADVANCED (MILANESE DERBY)
        FootballCategory(
            id = "cat_milan_inter",
            titleAr = "لاعبون لعبوا للغريمين إنتر وميلان (ديربي الغضب)",
            titleEn = "Played for both AC Milan & Inter Milan",
            descriptionAr = "اذكر نجوماً ارتدوا القميصين النيراتزوري والروسونيري في ديربي ميلانو!",
            descriptionEn = "Name players who crossed the Milan divide to play for both Inter and Milan!",
            difficulty = CategoryDifficulty.ADVANCED,
            timerSeconds = 4,
            levelNumber = 6,
            iconEmoji = "🔴🔵",
            predicate = {
                it.clubHistory.contains("inter") && it.clubHistory.contains("milan")
            }
        ),
        FootballCategory(
            id = "cat_chelsea_arsenal",
            titleAr = "لاعبون لعبوا لتشيلسي وأرسنال معاً",
            titleEn = "Played for both Chelsea & Arsenal",
            descriptionAr = "سمِّ لاعباً خاض تجربة بقميص البلوز والغانرز في لندن!",
            descriptionEn = "Name a footballer who represented both Chelsea and Arsenal!",
            difficulty = CategoryDifficulty.ADVANCED,
            timerSeconds = 4,
            levelNumber = 6,
            iconEmoji = "🔴🔵",
            predicate = {
                it.clubHistory.contains("chelsea") && it.clubHistory.contains("arsenal")
            }
        ),

        // LEVEL 7: EXPERT
        FootballCategory(
            id = "cat_ucl_wc_double",
            titleAr = "أساطير حققوا الثنائية: كأس العالم ودوري الأبطال معاً!",
            titleEn = "Won both World Cup & Champions League",
            descriptionAr = "فئة النخبة! سمِّ لاعباً حقق كأس العالم ودوري أبطال أوروبا في مسيرته!",
            descriptionEn = "Elite double: Name a player who won both the World Cup and Champions League!",
            difficulty = CategoryDifficulty.EXPERT,
            timerSeconds = 3,
            levelNumber = 7,
            iconEmoji = "🥇",
            predicate = {
                it.achievements.contains("world_cup_winner") && it.achievements.contains("champions_league_winner")
            }
        ),
        FootballCategory(
            id = "cat_top_goalkeepers",
            titleAr = "حراس مرمى كبار توجوا بالبطولات القارية أو المونديال 🧤",
            titleEn = "Legendary Decorated Goalkeepers",
            descriptionAr = "سمِّ حارس مرمى أسطورياً توج بدوري الأبطال أو كأس العالم أو اليورو!",
            descriptionEn = "Name an iconic goalkeeper with major international or UCL honors!",
            difficulty = CategoryDifficulty.EXPERT,
            timerSeconds = 3,
            levelNumber = 7,
            iconEmoji = "🧤",
            predicate = { it.positions.contains("GK") }
        ),

        // LEVEL 8: ELITE
        FootballCategory(
            id = "cat_united_real_madrid",
            titleAr = "لاعبون لعبوا لمانشستر يونايتد وريال مدريد معاً!",
            titleEn = "Played for Manchester United & Real Madrid",
            descriptionAr = "تحدٍ تاريخي! سمِّ نجماً ارتدى قميص الشياطين الحمر والميرنغي!",
            descriptionEn = "Name any player who represented both Manchester United and Real Madrid!",
            difficulty = CategoryDifficulty.ELITE,
            timerSeconds = 3,
            levelNumber = 8,
            iconEmoji = "⚡",
            predicate = {
                it.clubHistory.contains("manchester_united") && it.clubHistory.contains("real_madrid")
            }
        ),
        FootballCategory(
            id = "cat_spanish_golden_gen",
            titleAr = "جيل إسبانيا الذهبي (أبطال كأس العالم 2010)",
            titleEn = "Spain 2010 World Cup Champions",
            descriptionAr = "سمِّ لاعباً من الجيل التاريخي للماتادور الإسباني المتوج بمونديال 2010!",
            descriptionEn = "Name a player from Spain's legendary 2010 World Cup winning squad!",
            difficulty = CategoryDifficulty.ELITE,
            timerSeconds = 3,
            levelNumber = 8,
            iconEmoji = "🇪🇸",
            predicate = {
                it.nationalTeams.contains("spain") && it.achievements.contains("world_cup_winner")
            }
        ),

        // LEVEL 9: LEGEND
        FootballCategory(
            id = "cat_treble_winners",
            titleAr = "أبطال الثلاثية التاريخية (الدوري + الكأس + دوري الأبطال)",
            titleEn = "Historic Treble Winners",
            descriptionAr = "نخبة الأساطير! اذكر لاعباً فاز بالثلاثية التاريخية في موسم واحد!",
            descriptionEn = "Name a player who won the continental Treble in a single season!",
            difficulty = CategoryDifficulty.LEGEND,
            timerSeconds = 3,
            levelNumber = 9,
            iconEmoji = "👑",
            predicate = { it.achievements.contains("treble") }
        ),
        FootballCategory(
            id = "cat_serie_a_giants_trio",
            titleAr = "لاعبون مثلوا قطبي ميلانو أو يوفنتوس مع نادٍ كبير آخر",
            titleEn = "Played for Inter, Milan or Juventus",
            descriptionAr = "سمِّ لاعباً ارتدى قمصان عمالقة الكالتشيو (يوفنتوس، ميلان، إنتر)!",
            descriptionEn = "Name players who played for Italy's giants (Juventus, Milan, or Inter)!",
            difficulty = CategoryDifficulty.LEGEND,
            timerSeconds = 3,
            levelNumber = 9,
            iconEmoji = "🇮🇹",
            predicate = {
                it.clubHistory.contains("juventus") || (it.clubHistory.contains("milan") && it.clubHistory.contains("inter"))
            }
        ),

        // LEVEL 10: THE BOSS CHALLENGE (SUDDEN DEATH RONDO)
        FootballCategory(
            id = "cat_boss_ballon_dor_world_cup",
            titleAr = "تحدي الزعيم: جمعوا بين الكرة الذهبية وكأس العالم معاً!",
            titleEn = "Boss: Ballon d'Or & World Cup Winners",
            descriptionAr = "المواجهة الكبرى! فقط الأساطير الذين فازوا بالكرة الذهبية وكأس العالم معاً!",
            descriptionEn = "The ultimate boss test! Only players who won both Ballon d'Or and the FIFA World Cup!",
            difficulty = CategoryDifficulty.BOSS,
            timerSeconds = 3,
            levelNumber = 10,
            iconEmoji = "🔥",
            predicate = {
                it.achievements.contains("ballon_dor") && it.achievements.contains("world_cup_winner")
            }
        )
    )

    fun getCategoryById(id: String): FootballCategory {
        return allCategories.firstOrNull { it.id == id } ?: allCategories.first()
    }

    fun getCategoryForLevel(level: Int): FootballCategory {
        val clamped = level.coerceIn(1, 10)
        return allCategories.firstOrNull { it.levelNumber == clamped } ?: allCategories.first()
    }

    fun getRandomCategory(difficulty: CategoryDifficulty? = null): FootballCategory {
        val pool = if (difficulty != null) {
            allCategories.filter { it.difficulty == difficulty }
        } else {
            allCategories
        }
        return (if (pool.isNotEmpty()) pool else allCategories).random()
    }

    fun getDailyChallenge(): FootballCategory {
        // Deterministic daily category based on days since epoch
        val dayIndex = (System.currentTimeMillis() / (1000 * 60 * 60 * 24)).toInt()
        val index = (dayIndex % allCategories.size).let { if (it < 0) it + allCategories.size else it }
        return allCategories[index]
    }

    fun getValidPlayersForCategory(category: FootballCategory): List<FootballPlayer> {
        return allPlayers.filter { category.predicate(it) }
    }
}
