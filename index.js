const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { TicTacToe, ConnectFour, RockPaperScissors, GuessTheNumber, QuickClick, Slot, Snake } = require('discord-gamecord');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// قائمة أعلام الدول
const flagsGameData = [
    { country: "المملكة العربية السعودية", flag: "🇸🇦", options: ["المملكة العربية السعودية", "الإمارات العربية المتحدة", "الكويت", "قطر"] },
    { country: "اليابان", flag: "🇯🇵", options: ["الصين", "اليابان", "كوريا الجنوبية", "فيتنام"] },
    { country: "البرازيل", flag: "🇧🇷", options: ["الأرجنتين", "البرازيل", "البرتغال", "إسبانيا"] },
    { country: "فرنسا", flag: "🇫🇷", options: ["إيطاليا", "ألمانيا", "فرنسا", "بلجيكا"] },
    { country: "المملكة المتحدة", flag: "🇬🇧", options: ["الولايات المتحدة", "المملكة المتحدة", "كندا", "استراليا"] },
    { country: "مصر", flag: "🇪🇬", options: ["مصر", "المغرب", "العراق", "تونس"] }
];

// قائمة ألعاب فكك (كلمات مبعثرة)
const fakkData = [
    { scrambled: "م ك ت بة", correct: "مكتبة" },
    { scrambled: "ح ا س ب", correct: "حاسب" },
    { scrambled: "ب ر م ج ة", correct: "برمجة" },
    { scrambled: "د ي س ك و ر د", correct: "ديسكورد" },
    { scrambled: "ق ه و ة", correct: "قهوة" }
];

// 🎮 لعبة ركب (ترتيب الكلمات والجمل)
const rakibData = [
    { scrambled: "س م ك", correct: "سمك" },
    { scrambled: "ق م ر", correct: "قمر" },
    { scrambled: "ش م س", correct: "شمس" },
    { scrambled: "ك ت ا ب", correct: "كتاب" },
    { scrambled: "ق ل م", correct: "قلم" }
];

// 🧠 لعبة حزر (الألغاز والتخمين)
const hazirData = [
    { riddle: "ما هو الشيء الذي أبيض من السن وأسود من الليل؟", correct: "خط القران" },
    { riddle: "له عين واحدة ولا يرى بها فما هو؟", correct: "الإبرة" },
    { riddle: "ما هو الشيء الذي يوجد وسط مكة؟", correct: "حرف الكاف" },
    { riddle: "يتحرك بلا رجليْن ولا يدخل إلا للأذنين فما هو؟", correct: "الصوت" },
    { riddle: "ما هو الشيء الذي كلما أخذت منه كبر وكلما وضعت فيه صغر؟", correct: "الحفرة" }
];

// ❓ قاعدة بيانات الأسئلة العامة (100 سؤال)
const triviaData = [
    { question: "ما هو أعلى حزام يمكن الوصول إليه في رياضة التايكوندو؟", correct: "الأسود", options: ["الأخضر", "الأحمر", "الأبيض", "الأسود"] },
    { question: "ما هي عاصمة جمهورية مصر العربية؟", correct: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"] },
    { question: "كم عدد سور القرآن الكريم؟", correct: "114", options: ["110", "112", "114", "120"] },
    { question: "أي كوكب يسمى بالكوكب الأحمر؟", correct: "المريخ", options: ["الزهرة", "المريخ", "المشتري", "زحل"] },
    { question: "ما هو العنصر الكيميائي الذي يرمز له بالرمز (Au)؟", correct: "الذهب", options: ["الفضة", "الحديد", "الذهب", "النحاس"] },
    { question: "كم عدد ركعات صلاة الفجر؟", correct: "ركعتان", options: ["ركعة واحدة", "ركعتان", "ثلاث ركعات", "أربع ركعات"] },
    { question: "في اي دولة تقع مدينة تيمبوكتو التاريخية؟", correct: "مالي", options: ["المغرب", "مالي", "السنغال", "موريتانيا"] },
    { question: "ما هي عاصمة المملكة العربية السعودية؟", correct: "الرياض", options: ["جدة", "الدمام", "الرياض", "مكة المكرمة"] },
    { question: "من هو القائد المسلم الذي فتح قسطنطينية؟", correct: "محمد الفاتح", options: ["صلاح الدين الأيوبي", "طارق بن زياد", "محمد الفاتح", "عقبة بن نافع"] },
    { question: "ما هو أكبر بحر مغلق في العالم؟", correct: "بحر قزوين", options: ["البحر الاحمر", "البحر الميت", "بحر قزوين", "البحر الأسود"] },
    { question: "كم عدد أركان الإسلام؟", correct: "خمسة", options: ["أربعة", "خمسة", "ستة", "سبعة"] },
    { question: "ما هي عاصمة دولة الإمارات العربية المتحدة؟", correct: "أبوظبي", options: ["دبي", "الشارقة", "أبوظبي", "عجمان"] },
    { question: "ما هو الحيوان الذي يُسمى بـ (سفينة الصحراء)؟", correct: "الجمل", options: ["الحصان", "الجمل", "الفيل", "الأسد"] },
    { question: "من هو النبي الذي ألقي في النار فلم تأكله؟", correct: "إبراهيم عليه السلام", options: ["موسى عليه السلام", "إبراهيم عليه السلام", "عيسى عليه السلام", "نوح عليه السلام"] },
    { question: "ما هي عاصمة فرنسا؟", correct: "باريس", options: ["لندن", "باريس", "روما", "مدريد"] },
    { question: "كم عدد ألوان قوس قزح؟", correct: "7 ألوان", options: ["5 ألوان", "6 ألوان", "7 ألوان", "8 ألوان"] },
    { question: "ما هو أسرع حيوان بري في العالم؟", correct: "الفهد", options: ["الأسد", "الفهد", "الغزال", "الحصان"] },
    { question: "في اي عام حدثت غزوة بدر الكبرى؟", correct: "السنة الثانية للهجرة", options: ["السنة الأولى للهجرة", "السنة الثانية للهجرة", "السنة الثالثة للهجرة", "السنة الرابعة للهجرة"] },
    { question: "ما هي عاصمة دولة الكويت؟", correct: "مدينة الكويت", options: ["الجهراء", "مدينة الكويت", "المباركية", "الفحيحيل"] },
    { question: "ما هو الغاز الأكثر غزارة في الغلاف الجوي للأرض؟", correct: "النيتروجين", options: ["الأكسجين", "ثاني أكسيد الكربون", "النيتروجين", "الهيدروجين"] },
    { question: "من هو مكتشف أمريكا؟", correct: "كريستوفر كولومبس", options: ["فاسكو دي جاما", "كريستوفر كولومبس", "ماجلان", "ابن بطوطة"] },
    { question: "ما هو الحيوان الذي ينام إحدى عينيه مفتوحة والأخرى مغلقة؟", correct: "الدلفين", options: ["القرش", "الدلفين", "البومة", "التمساح"] },
    { question: "كم عدد دول مجلس التعاون الخليجي؟", correct: "6 دول", options: ["5 دول", "6 دول", "7 دول", "8 دول"] },
    { question: "ما هي عاصمة اليابان؟", correct: "طوكيو", options: ["أوساكا", "طوكيو", "كيوتو", "هيروشيما"] },
    { question: "ما هي سورة القران التي تسمى بقلب القرآن؟", correct: "سورة يس", options: ["سورة البقرة", "سورة الملك", "سورة يس", "سورة الكهف"] },
    { question: "كم عدد عظام جسم الإنسان البالغ؟", correct: "206 عظمة", options: ["180 عظمة", "206 عظمة", "240 عظمة", "300 عظمة"] },
    { question: "ما هو أطول نهر في العالم؟", correct: "نهر النيل", options: ["نهر الأمازون", "نهر النيل", "نهر المسيسيبي", "نهر الفرات"] },
    { question: "من هو أول خلفاء المسلمين الراشدين؟", correct: "أبو بكر الصديق", options: ["عمر بن الخطاب", "عثمان بن عفان", "أبو بكر الصديق", "علي بن أبي طالب"] },
    { question: "ما هي عاصمة دولة قطر؟", correct: "الدوحة", options: ["الدوحة", "الريان", "الوكرة", "الخور"] },
    { question: "ما هو المعدن السائل في درجة حرارة الغرفة؟", correct: "الزئبق", options: ["الحديد", "الذهب", "الزئبق", "الفضة"] },
    { question: "من هو مؤلف رواية (البؤساء) الشهيرة؟", correct: "فيكتور هوغو", options: ["وليام شكسبير", "فيكتور هوغو", "تولستوي", "تشيخوف"] },
    { question: "ما هي عاصمة الأردن؟", correct: "عمان", options: ["إربد", "عمان", "الزرقاء", "معان"] },
    { question: "ما هو أكبر كوكب في المجموعة الشمسية؟", correct: "المشتري", options: ["زحل", "المشتري", "المريخ", "الأرض"] },
    { question: "كم عدد أجزاء القرآن الكريم؟", correct: "30 جزءاً", options: ["20 جزءاً", "25 جزءاً", "30 جزءاً", "40 جزءاً"] },
    { question: "ما هي عاصمة سلطنة عمان؟", correct: "مسقط", options: ["صلالة", "مسقط", "نزوى", "صويرة"] },
    { question: "ما هي الدولة الأكثر سكاناً في العالم؟", correct: "الهند", options: ["الصين", "الهند", "الولايات المتحدة", "إندونيسيا"] },
    { question: "من هو سيف الله المسلول؟", correct: "خالد بن الوليد", options: ["حمزة بن عبدالمطلب", "علي بن أبي طالب", "خالد بن الوليد", "سعد بن أبي وقاص"] },
    { question: "ما هي عاصمة سوريا؟", correct: "دمشق", options: ["حلب", "دمشق", "حمص", "اللاذقية"] },
    { question: "ما هو الحيوان المائي الذي يعتبر أذكى الحيوانات؟", correct: "الدلفين", options: ["الحوت الأزرق", "الدلفين", "الأخطبوط", "القرش"] },
    { question: "كم جناحاً للذباب؟", correct: "جناحان", options: ["جناحان", "أربعة أجنحة", "ستة أجنحة", "بدون أجنحة"] },
    { question: "ما هي عاصمة المغرب؟", correct: "الرباط", options: ["الدار البيضاء", "مراكش", "الرباط", "فاس"] },
    { question: "في أي قارة تقع دولة البرازيل؟", correct: "أمريكا الجنوبية", options: ["أفريقيا", "أوروبا", "أمريكا الشمالية", "أمريكا الجنوبية"] },
    { question: "ما هو أكبر طائر في العالم من حيث الحجم؟", correct: "النعامة", options: ["النسر", "النعامة", "البطريق", "العقاب"] },
    { question: "من هو النبي الذي أُمر ببناء السفينة؟", correct: "نوح عليه السلام", options: ["نوح عليه السلام", "هود عليه السلام", "صالح عليه السلام", "لوط عليه السلام"] },
    { question: "ما هي عاصمة الجزائر؟", correct: "الجزائر", options: ["وهران", "عنابة", "الجزائر", "قسنطينة"] },
    { question: "ما هي وحدة القياس المستخدمة لشدة الصوت؟", correct: "الديسيبل", options: ["الهرتز", "الديسيبل", "الفولت", "الأمبير"] },
    { question: "ما هي عاصمة لبنان؟", correct: "بيروت", options: ["طرابلس", "بيروت", "صيدا", "البقاع"] },
    { question: "ما هو الجزء المسؤول عن التوازن في جسم الإنسان؟", correct: "الأذن الداخلية", options: ["المخ", "المخيخ", "الأذن الداخلية", "العمود الفقري"] },
    { question: "من هو الشاعر الجاهلي صاحب المعلقة الشهيرة التي تبدأ بـ (قفا نبكِ من ذكرى حبيب ومنزلِ)؟", correct: "امرؤ القيس", options: ["طرفة بن العبد", "امرؤ القيس", "زهير بن أبي سلمى", "عنترة بن شداد"] },
    { question: "ما هي عاصمة تونس؟", correct: "تونس", options: ["سوسة", "صفاقس", "تونس", "بنزرت"] },
    { question: "ما هي عاصمة العراق؟", correct: "بغداد", options: ["الموصل", "البصرة", "بغداد", "أربيل"] },
    { question: "كم عدد ركعات صلاة المغرب؟", correct: "ثلاث ركعات", options: ["ركعتان", "ثلاث ركعات", "أربع ركعات", "أربع ركعات سرية"] },
    { question: "ما هو أعمق بحار ومحيطات العالم؟", correct: "المحيط الهادئ", options: ["المحيط الأطلسي", "المحيط الهندي", "المحيط الهادئ", "المحيط المتجمد الشمالي"] },
    { question: "من هو الملقب بـ (أسد الأندلس)؟", correct: "عبد الرحمن الداخل", options: ["موسى بن نصير", "طارق بن زياد", "عبد الرحمن الداخل", "يوسف بن تاشفين"] },
    { question: "ما هي عاصمة ليبيا؟", correct: "طرابلس", options: ["بنغازي", "طرابلس", "مصراتة", "سبها"] },
    { question: "ما هو أبطأ حيوان بري في العالم؟", correct: "الكسلان", options: ["السلحفاة", "الكسلان", "القنفذ", "الحلزون"] },
    { question: "ما هي عاصمة السودان؟", correct: "الخرطوم", options: ["بورتسودان", "الخرطوم", "أم درمان", "الدامر"] },
    { question: "في اي عام هجري فرضت الصلاة؟", correct: "سنة الإسراء والمعراج", options: ["السنة الأولى للهجرة", "سنة الإسراء والمعراج", "السنة الثانية للهجرة", "السنة الخامسة للهجرة"] },
    { question: "ما هي عاصمة فلسطين؟", correct: "القدس", options: ["غزة", "القدس", "رام الله", "نابلس"] },
    { question: "ما هو أصل كلمة (تلفزيون)؟", correct: "يوناني ولاتيني", options: ["عربي", "إنجليزي محض", "يوناني ولاتيني", "فرنسي"] },
    { question: "من هو النبي الذي أوتي ملكاً لا ينبغي لأحد من بعده؟", correct: "سليمان عليه السلام", options: ["داود عليه السلام", "سليمان عليه السلام", "يوسف عليه السلام", "ذو القرنين"] },
    { question: "ما هي عاصمة اليمن؟", correct: "صنعاء", options: ["عدن", "صنعاء", "تعز", "المكلا"] },
    { question: "ما هو العنصر الأكثر وفرة في قشرة الأرض؟", correct: "الأكسجين", options: ["السيليكون", "الأكسجين", "الحديد", "الألومنيوم"] },
    { question: "ما هي عاصمة موريتانيا؟", correct: "نواكشوط", options: ["نواذيبو", "نواكشوط", "كيديماغا", "الروسو"] },
    { question: "كم عدد سجدات التلاوة في القرآن الكريم؟", correct: "15 سجدة", options: ["10 سجدات", "14 سجدة", "15 سجدة", "20 سجدة"] },
    { question: "ما هي عاصمة الصومال؟", correct: "مقديشو", options: ["هرجيسا", "مقديشو", "بربرة", "كيسمايو"] },
    { question: "ما هو الحيوان الذي يستطيع حبس أنفاسه تحت الماء لمدة أطول؟", correct: "الحوت الأزرق", options: ["التمساح", "الحوت الأزرق", "فرس النهر", "البطريق"] },
    { question: "من هو الصحابي الجليل الذي لقبه النبي بـ (أمين الأمة)؟", correct: "أبو عبيدة بن الجراح", options: ["عمر بن الخطاب", "أبو عبيدة بن الجراح", "معاذ بن جبل", "زيد بن ثابت"] },
    { question: "ما هي عاصمة تركيا؟", correct: "أنقرة", options: ["إسطنبول", "أنقرة", "إزمير", "بورصة"] },
    { question: "ما هو أكبر حيوان ثديي بحري؟", correct: "الحوت الأزرق", options: ["الحوت الأبيض", "الحوت الأزرق", "قرش الحوت", "الفيل البحرى"] },
    { question: "ما هي عاصمة إيران؟", correct: "طهران", options: ["أصفهان", "طهران", "شيراز", "تبريز"] },
    { question: "كم عدد أركان الإيمان؟", correct: "ستة", options: ["خمسة", "ستة", "سبعة", "ثلاثة"] },
    { question: "ما هي عاصمة باكستان؟", correct: "إسلام آباد", options: ["كراتشي", "لاهور", "إسلام آباد", "بيشاور"] },
    { question: "من هو أول من أسلم من الرجال؟", correct: "أبو بكر الصديق", options: ["علي بن أبي طالب", "زيد بن حارثة", "أبو بكر الصديق", "عثمان بن عفان"] },
    { question: "ما هي عاصمة الهند؟", correct: "نيودلهي", options: ["مومباي", "نيودلهي", "بنغالور", "كلكتا"] },
    { question: "ما هو الطائر الذي يستطيع الطيران للوراء؟", correct: "الطنان", options: ["العصفور", "الطنان", "النسر", "الغراب"] },
    { question: "ما هي عاصمة إيطاليا؟", correct: "روما", options: ["ميلانو", "فلورنسا", "روما", "البندقية"] },
    { question: "كم عدد سور القرآن المكية؟", correct: "82 سورة", options: ["82 سورة", "86 سورة", "90 سورة", "92 سورة"] },
    { question: "ما هي عاصمة إسبانيا؟", correct: "مدريد", options: ["برشلونة", "مدريد", "إشبيلية", "فالنسيا"] },
    { question: "ما هو الحيوان الذي ليس له صوت يسمى (أبكم)؟", correct: "الزرافة", options: ["الفيل", "الزرافة", "الكنغر", "السلحفاة"] },
    { question: "ما هي عاصمة ألمانيا؟", correct: "برلين", options: ["ميونيخ", "فرانكفورت", "برلين", "هامبورغ"] },
    { question: "من هو الصحابي الذي اهتز لموته عرش الرحمن؟", correct: "سعد بن معاذ", options: ["حمزة بن عبدالمطلب", "سعد بن معاذ", "مصعب بن عمير", "جعفر الطيار"] },
    { question: "ما هي عاصمة روسيا؟", correct: "موسكو", options: ["سان بطرسبرغ", "موسكو", "كازان", "سوتشي"] },
    { question: "ما هو الاسم الآخر لغزوة الأحزاب؟", correct: "غزوة الخندق", options: ["غزوة بدر", "غزوة أحد", "غزوة الخندق", "غزوة تبوك"] },
    { question: "ما هي عاصمة الصين؟", correct: "بكين", options: ["شانغهاي", "بكين", "هونغ كونغ", "شنجن"] },
    { question: "ما هي عاصمة كندا؟", correct: "أوتاوا", options: ["تورونتو", "فانكوفر", "أوتاوا", "مونتريال"] },
    { question: "من هو النبي الملقب بـ (كليم الله)؟", correct: "موسى عليه السلام", options: ["إبراهيم عليه السلام", "عيسى عليه السلام", "موسى عليه السلام", "نوح عليه السلام"] },
    { question: "ما هي عاصمة أستراليا؟", correct: "كانبيرا", options: ["سيدني", "ملبورن", "كانبيرا", "بريزبان"] },
    { question: "ما هو الحيوان الذي يمتلك ثلاثة قلوب؟", correct: "الأخطبوط", options: ["القرش", "الأخطبوط", "قنديل البحر", "الدلفين"] },
    { question: "ما هي عاصمة الأرجنتين؟", correct: "بوينس آيرس", options: ["قرطبة", "بوينس آيرس", "روزاريو", "مندوزا"] },
    { question: "كم سنة استمر نزول القرآن الكريم؟", correct: "23 سنة", options: ["20 سنة", "22 سنة", "23 سنة", "25 سنة"] },
    { question: "ما هي عاصمة البرازيل؟", correct: "برازيليا", options: ["ريو دي جانيرو", "ساو باولو", "برازيليا", "سالفادور"] },
    { question: "من هو أول من اخترع المصباح الكهربائي؟", correct: "توماس إديسون", options: ["نيكولا تسلا", "توماس إديسون", "ألبرت أينشتاين", "ألكسندر غراهام بيل"] },
    { question: "ما هي عاصمة كوريا الجنوبية؟", correct: "سيول", options: ["بوسان", "سيول", "إنتشون", "دايغو"] },
    { question: "ما هو اللقب الذي أطلق على حمزة بن عبد المطلب رضي الله عنه؟", correct: "أسد الله", options: ["سيف الله", "أسد الله", "حبر الأمة", "ترجمان القرآن"] },
    { question: "ما هي عاصمة بريطانيا؟", correct: "لندن", options: ["مانشستر", "لندن", "ليفربول", "إدنبرة"] },
    { question: "ما هو أكبر محيط في العالم؟", correct: "المحيط الهادئ", options: ["المحيط الأطلسي", "المحيط الهندي", "المحيط الهادئ", "المحيط المتجمد الجنوبي"] },
    { question: "من هي أم المؤمنين الملقبة بـ (الصديقة بنت الصديق)؟", correct: "عائشة بنت أبي بكر", options: ["حفصة بنت عمر", "عائشة بنت أبي بكر", "زينب بنت جحش", "أم سلمة"] },
    { question: "ما هي عاصمة هولندا؟", correct: "أمستردام", options: ["روتردام", "لاهاي", "أمستردام", "أوترخت"] }
];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

client.once('ready', () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // 🧹 أمر الحذف (يحذف الرسائل غير المثبتة فقط)
    if (message.content.startsWith('!clear')) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply({ content: '❌ ما عندك صلاحية لإستخدام هذا الأمر!', ephemeral: true });
        }

        try {
            let fetched;
            do {
                fetched = await message.channel.messages.fetch({ limit: 100 });
                const messagesToDelete = fetched.filter(msg => !msg.pinned && (Date.now() - msg.createdTimestamp < 1209600000));

                if (messagesToDelete.size === 0) break;

                await message.channel.bulkDelete(messagesToDelete, true);

                if (fetched.size < 100) break;
            } while (true);

            const reply = await message.channel.send('✅ تم تنظيف الروم بنجاح! تم حذف الرسائل غير المثبتة.');
            setTimeout(() => reply.delete().catch(() => {}), 4000);
        } catch (error) {
            console.error(error);
            message.channel.send('❌ حدث خطأ أثناء محاولة مسح الرسائل.');
        }
        return;
    }

    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle('🎮 قائمة ألعاب البوت التفاعلية الشاملة')
            .setDescription('اختر لعبتك المفضلة واكتب أمرها في الشات:')
            .addFields(
                { name: '❌ إكس أو', value: '`!xo`', inline: true },
                { name: '🟡 أربع على الحواف', value: '`!اربع`', inline: true },
                { name: '✂️ حجر ورق مقص', value: '`!rps`', inline: true },
                { name: '🔢 تخمين الرقم', value: '`!تخمين`', inline: true },
                { name: '⚡ تحدي السرعة', value: '`!سريع`', inline: true },
                { name: '🎰 الحظ السعيد', value: '`!حظ`', inline: true },
                { name: '🐍 لعبة الثعبان', value: '`!ثعبان`', inline: true },
                { name: '❓ لعبة الأسئلة', value: '`!اسئلة`', inline: true },
                { name: '🌍 تخمين الأعلام', value: '`!اعلام`', inline: true },
                { name: '🧩 فكك وتركيب', value: '`!فكك`', inline: true },
                { name: '🔤 لعبة ركب', value: '`!ركب`', inline: true },
                { name: '🧠 لعبة حزر', value: '`!حزر`', inline: true },
                { name: '🧹 مسح الشات', value: '`!clear`', inline: true }
            )
            .setColor(0x5865F2);

        await message.reply({ embeds: [helpEmbed] });
    }

    // الألعاب الأساسية
    if (message.content === '!xo') {
        const Game = new TicTacToe({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'لعبة إكس أو', color: '#5865F2' },
            emojis: { x: '❌', o: '⭕', blank: '◼️' },
            mentionUser: true, timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!اربع') {
        const Game = new ConnectFour({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'لعبة أربع على الحواف', color: '#5865F2' },
            emojis: { board: '⚪', player1: '🔴', player2: '🟡' },
            mentionUser: true, timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!rps') {
        const Game = new RockPaperScissors({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'حجر ورق مقص', color: '#5865F2' },
            buttons: { rock: 'حجر', paper: 'ورق', scissors: 'مقص' },
            mentionUser: true, timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!تخمين') {
        const Game = new GuessTheNumber({
            message: message, isSlashGame: false,
            embed: { title: 'تخمين الرقم', color: '#5865F2' },
            timeoutTime: 60000, mode: 'buttons'
        });
        Game.startGame();
    }

    if (message.content === '!سريع') {
        const Game = new QuickClick({
            message: message, isSlashGame: false,
            embed: { title: 'تحدي السرعة', color: '#5865F2' },
            timeoutTime: 60000, button: { text: 'اضغط بسرعة!', style: 'PRIMARY' },
        });
        Game.startGame();
    }

    if (message.content === '!حظ') {
        const Game = new Slot({
            message: message, isSlashGame: false,
            embed: { title: 'لعبة الحظ (Slot Machine)', color: '#5865F2' },
            timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!ثعبان') {
        const Game = new Snake({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'لعبة الثعبان (Snake)', color: '#5865F2' },
            emojis: { board: '⬛', food: '🍎', up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' },
            timeoutTime: 60000,
        });
        Game.startGame();
    }

    // ❓ لعبة الأسئلة العامة
    if (message.content === '!اسئلة') {
        const randomTrivia = triviaData[Math.floor(Math.random() * triviaData.length)];
        const shuffledOptions = shuffleArray([...randomTrivia.options]);

        const embed = new EmbedBuilder()
            .setTitle('❓ لعبة الأسئلة العامة')
            .setDescription(`**${randomTrivia.question}**`)
            .setColor(0x5865F2)
            .setFooter({ text: `أمامك 30 ثانية للإجابة يا ${message.author.username}` });

        const row = new ActionRowBuilder();
        shuffledOptions.forEach((option, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`trivia_${index}_${option}`)
                    .setLabel(option)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        const gameMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = gameMessage.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: '❌ هذه اللعبة ليست لك!', ephemeral: true });
            }

            const selectedOption = interaction.customId.split('_').slice(2).join('_');
            
            if (selectedOption === randomTrivia.correct) {
                await interaction.update({ content: `🎉 كفو يا ${message.author}! إجابتك صحيحة، الإجابة هي: **${randomTrivia.correct}** 🏆`, components: [] });
            } else {
                await interaction.update({ content: `❌ خطأ! الإجابة الصحيحة هي: **${randomTrivia.correct}**`, components: [] });
            }
            collector.stop();
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await gameMessage.edit({ content: `⏳ انتهى الوقت! الإجابة الصحيحة كانت: **${randomTrivia.correct}**`, components: [] }).catch(() => {});
            }
        });
    }

    // 🌍 لعبة الأعلام
    if (message.content === '!اعلام') {
        const randomData = flagsGameData[Math.floor(Math.random() * flagsGameData.length)];
        const shuffledOptions = shuffleArray([...randomData.options]);

        const embed = new EmbedBuilder()
            .setTitle('🌍 لعبة تخمين أعلام الدول')
            .setDescription(`ما هي الدولة التي يتبع لها هذا العلم?\n\n# ${randomData.flag}`)
            .setColor(0x5865F2);

        const row = new ActionRowBuilder();
        shuffledOptions.forEach((option, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`flag_${index}_${option}`)
                    .setLabel(option)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        const gameMessage = await message.reply({ embeds: [embed], components: [row] });
        const collector = gameMessage.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async interaction => {
            if (interaction.user.id !== message.author.id) {
                return interaction.reply({ content: '❌ هذه اللعبة ليست لك!', ephemeral: true });
            }

            const selectedOption = interaction.customId.split('_').slice(2).join('_');

            if (selectedOption === randomData.country) {
                await interaction.update({ content: `🎉 كفو! إجابتك صحيحة، العلم لـ **${randomData.country}** ${randomData.flag}`, components: [] });
            } else {
                await interaction.update({ content: `❌ خطأ! الإجابة الصحيحة هي: **${randomData.country}** ${randomData.flag}`, components: [] });
            }
            collector.stop();
        });
    }

    // 🧩 لعبة فكك
    if (message.content === '!فكك') {
        const randomWord = fakkData[Math.floor(Math.random() * fakkData.length)];

        const embed = new EmbedBuilder()
            .setTitle('🧩 لعبة فكك الكلمات')
            .setDescription(`رتب الحروف التالية لتكون الكلمة الصحيحة:\n\n# 🔤 ${randomWord.scrambled}\n\n*(اكتب الكلمة الصحيحة في الشات الآن!)*`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomWord.correct) {
                message.channel.send(`🎉 مبروك يا ${message.author} إجابتك صحيحة! الكلمة هي **${randomWord.correct}** 🏆`);
            } else {
                message.channel.send(`❌ للأسف إجابتك خطأ يا ${message.author.username}! الكلمة الصحيحة كانت: **${randomWord.correct}**`);
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                message.channel.send(`⏳ انتهى الوقت يا ${message.author.username}! الكلمة كانت: **${randomWord.correct}**`);
            }
        });
    }

    // 🔤 لعبة ركب
    if (message.content === '!ركب') {
        const randomRakib = rakibData[Math.floor(Math.random() * rakibData.length)];

        const embed = new EmbedBuilder()
            .setTitle('🔤 لعبة ركب الحروف')
            .setDescription(`أمامك حروف مبعثرة، قم بتركيبها لتشكل الكلمة الصحيحة:\n\n# 🔤 ${randomRakib.scrambled}\n\n*(اكتب الكلمة الصحيحة في الشات الآن!)*`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomRakib.correct) {
                message.channel.send(`🎉 كفو يا ${message.author}! ركبت الكلمة صحيحة: **${randomRakib.correct}** 🏆`);
            } else {
                message.channel.send(`❌ خطأ يا ${message.author.username}! الكلمة الصحيحة كانت: **${randomRakib.correct}**`);
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                message.channel.send(`⏳ انتهى الوقت يا ${message.author.username}! الكلمة كانت: **${randomRakib.correct}**`);
            }
        });
    }

    // 🧠 لعبة حزر
    if (message.content === '!حزر') {
        const randomHazir = hazirData[Math.floor(Math.random() * hazirData.length)];

        const embed = new EmbedBuilder()
            .setTitle('🧠 لعبة حزر الألغاز')
            .setDescription(`حل اللغز التالي واكتب الإجابة في الشات:\n\n# 💡 "${randomHazir.riddle}"\n\n*(أمامك 20 ثانية للإجابة!)*`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomHazir.correct) {
                message.channel.send(`🎉 كفو يا ${message.author}! حللت اللغز صح: **${randomHazir.correct}** 🏆`);
            } else {
                message.channel.send(`❌ خطأ يا ${message.author.username}! الإجابة الصحيحة كانت: **${randomHazir.correct}**`);
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                message.channel.send(`⏳ انتهى الوقت يا ${message.author.username}! الإجابة الصحيحة كانت: **${randomHazir.correct}**`);
            }
        });
    }
});

// تشغيل سيرفر وهمي لرضا منصة Render
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

client.login(process.env.TOKEN);
