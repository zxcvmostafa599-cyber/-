package com.example.data.repository

import com.example.data.model.TypingChallenge
import java.util.Calendar

object ChallengeCatalog {

    val allChallenges: List<TypingChallenge> = listOf(
        // Level 1: 3-5 words, simple sentences, no difficult punctuation
        TypingChallenge("l1_1", "العلم نور والجهل ظلام", 1, "حكم"),
        TypingChallenge("l1_2", "الشمس تشرق كل صباح", 1, "طبيعة"),
        TypingChallenge("l1_3", "الصبر مفتاح الفرج دائما", 1, "حكم"),
        TypingChallenge("l1_4", "القراءة تنمي العقل والفكر", 1, "تعليم"),
        TypingChallenge("l1_5", "الكتاب خير جليس للانسان", 1, "أدب"),

        // Level 2: 3-6 words, basic daily Arabic
        TypingChallenge("l2_1", "شرب الماء النقي ينعش الجسد", 2, "صحة"),
        TypingChallenge("l2_2", "الرياضة الصباحية تمنح الطاقة والنشاط", 2, "رياضة"),
        TypingChallenge("l2_3", "العمل الدؤوب يحقق النجاح الباهر", 2, "تطوير"),
        TypingChallenge("l2_4", "الصدق خلق كريم يحبه الجميع", 2, "أخلاق"),
        TypingChallenge("l2_5", "الحديقة مليئة بالازهار العطرة الجميلة", 2, "طبيعة"),

        // Level 3: 4-7 words, slightly more complex
        TypingChallenge("l3_1", "تساعد الحواسيب على تسريع انجاز الاعمال", 3, "تكنولوجيا"),
        TypingChallenge("l3_2", "سماء الليل مرصعة بالنجوم اللامعة البعيدة", 3, "فلك"),
        TypingChallenge("l3_3", "من جد وجد ومن زرع حصد", 3, "أمثال"),
        TypingChallenge("l3_4", "التعاون بين الاصدقاء يصنع المعجزات العظيمة", 3, "مجتمع"),
        TypingChallenge("l3_5", "البحر واسع وعميق ويخفي الكثير من الاسرار", 3, "جغرافيا"),

        // Level 4: 6-8 words, common punctuation
        TypingChallenge("l4_1", "التفكير الايجابي يقود الى قرارات صائبة، وحياة هادئة.", 4, "حياة يومية"),
        TypingChallenge("l4_2", "اللغة العربية بحر زاخر بالمعاني الدقيقة، والالفاظ الفصيحة.", 4, "لغة"),
        TypingChallenge("l4_3", "تسهم الاشجار في تنقية الهواء، وحماية البيئة الطبيعية.", 4, "بيئة"),
        TypingChallenge("l4_4", "الابتسامة لغة يفهمها كل البشر، بلا حاجة الى ترجمة.", 4, "تواصل"),
        TypingChallenge("l4_5", "تعتبر الطاقة المتجددة خيار المستقبل المشرق لكوكب الارض.", 4, "علوم"),

        // Level 5: 7-10 words, more varied vocabulary
        TypingChallenge("l5_1", "ان اكتساب مهارة الكتابة السريعة يتطلب الممارسة اليومية المنتظمة والتركيز العالي.", 5, "تعليم"),
        TypingChallenge("l5_2", "تزخر الصحراء العربية بالكثبان الرملية الساحرة، والواحات الغناء التي تفيض بالحياة.", 5, "جغرافيا"),
        TypingChallenge("l5_3", "يقاس تقدم الامم بمدى اهتمامها بالبحث العلمي وتشجيع المبتكرين الشباب.", 5, "علوم"),
        TypingChallenge("l5_4", "الصحة تاج على رؤوس الاصحاء لا يراه الا المرضى المتألمون.", 5, "صحة"),
        TypingChallenge("l5_5", "البرمجة ليست مجرد كتابة اكواد، بل هي فن حل المشكلات المعقدة.", 5, "تكنولوجيا"),

        // Level 6: 8-12 words, longer sentences, more punctuation
        TypingChallenge("l6_1", "كانت بغداد في العصر العباسي قبلة للعلماء والادباء؛ حيث ازدهرت بيت الحكمة بالترجمة والتأليف.", 6, "تاريخ"),
        TypingChallenge("l6_2", "تعد شبكة الانترنت اعظم اختراع في العصر الحديث، فقد ربطت شعوب العالم وقربت المسافات.", 6, "تكنولوجيا"),
        TypingChallenge("l6_3", "النجاح الحقيقي ليس في عدم السقوط مطلقا، بل في النهوض بقوة بعد كل عثرة تواجهها.", 6, "تطوير"),
        TypingChallenge("l6_4", "تعتبر المحيطات موطنا لملايين الكائنات البحرية المتنوعة، وهي تنظم المناخ وتولد الاكسجين.", 6, "علوم"),

        // Level 7: 10-15 words, complex vocabulary, similar-looking characters
        TypingChallenge("l7_1", "تتجلى بلاغة الشعر العربي القديم في قصائد المعلقات التي خلدت بطولات الفرسان ووصف الصحراء والديار الراحلة بدقة مذهلة.", 7, "أدب"),
        TypingChallenge("l7_2", "ان التطور المتسارع للذكاء الاصطناعي يفتح افاقا جديدة في الطب والصناعة، مع طرح تساؤلات اخلاقية هامة حول المستقبل.", 7, "تكنولوجيا"),
        TypingChallenge("l7_3", "الصداقة الصادقة عملة نادرة في زمن المصالح، فهي تقوم على التضحية المتبادلة والوفاء الدائم دون انتظار مقابل.", 7, "حياة يومية"),

        // Level 8: 12-18 words, difficult grammar and punctuation
        TypingChallenge("l8_1", "لو تأملت جريان الانهار وصمود الجبال الرواسي، لادركت عظمة الكون وتناسق سنن الطبيعة؛ فكل شيء يسير بميزان دقيق لا يختل ابدا.", 8, "فلسفة"),
        TypingChallenge("l8_2", "تعتمد الروبوتات الحديثة على مستشعرات فائقة الحساسية وخوارزميات تعلم الالة؛ لتنفيذ المهام الجراحية الدقيقة بمعدلات امان غير مسبوقة.", 8, "تكنولوجيا"),
        TypingChallenge("l8_3", "ليس الفخر ان تقهر خصمك بالقوة والبطش، وانما الشرف في العفو عند المقدرة وحسن المعاملة وكرم النفس.", 8, "أخلاق"),

        // Level 9: 15-25 words, complex vocabulary with partial tashkeel
        TypingChallenge("l9_1", "تَمتَد الحضارة الاسلامية عبر قرونٍ من الاشعاع الفكري، حيث اسهم ابن الهيثم في علم البصريات، ووضع الخوارزمي اسس علم الجبر، فمهدوا الطريق للنهضة العلمية العالمية.", 9, "تاريخ", true),
        TypingChallenge("l9_2", "ان صَقْلَ الموهبة بالدراسة والمثابرة يُحول الشغف الفردي الى ابداعٍ حقيقي يترك بصمةً لا تُمحى في سجل الانسانية المعرفي والجمالي.", 9, "أدب", true),

        // Level 10: MASTER BOSS - 30+ words, full paragraph, strict accuracy
        TypingChallenge(
            "l10_boss",
            "ان اللغة العربية بحرٌ لا ساحل له، تنبض حروفها بالفصاحة والبلاغة، وتتجلى اعجازاتها في محكم التنزيل وروائع الشعر والنثر؛ فمن ملك ناصيتها وتدربت انامله على صياغة دررها بسرعة ودقة متناهية، فقد حاز شرف البيان وسما الى قمة الفرسان في ميدان سباق الكلمات الخالدة.",
            10,
            "تحدي الزعيم الأكبر",
            false
        )
    )

    fun getChallengesForLevel(level: Int): List<TypingChallenge> {
        val list = allChallenges.filter { it.level == level }
        return if (list.isNotEmpty()) list else listOf(allChallenges.first())
    }

    fun getRandomChallenge(level: Int): TypingChallenge {
        val list = getChallengesForLevel(level)
        return list.random()
    }

    fun getDailyChallenge(): TypingChallenge {
        val dayOfYear = Calendar.getInstance().get(Calendar.DAY_OF_YEAR)
        // Select an intermediate-to-advanced challenge deterministically by day
        val candidates = allChallenges.filter { it.level in 4..8 }
        return candidates[dayOfYear % candidates.size]
    }
}
