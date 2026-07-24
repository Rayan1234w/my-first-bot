const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { TicTacToe, ConnectFour, RockPaperScissors, GuessTheNumber, QuickClick, Slot } = require('discord-gamecord');

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
    { scrambled: "م k ت بة", correct: "مكتبة" },
    { scrambled: "ح ا س ب", correct: "حاسب" },
    { scrambled: "ب ر م ج ة", correct: "برمجة" },
    { scrambled: "د ي س ك و ر د", correct: "ديسكورد" },
    { scrambled: "ق ه و ة", correct: "قهوة" }
];

// لعبة ركب
const rakibData = [
    { scrambled: "س م ك", correct: "سمك" },
    { scrambled: "ق م ر", correct: "قمر" },
    { scrambled: "ش م س", correct: "شمس" },
    { scrambled: "ك ت ا ب", correct: "كتاب" },
    { scrambled: "ق ل م", correct: "قلم" }
];

// لعبة حزر
const hazirData = [
    { riddle: "ما هو الشيء الذي أبيض من السن وأسود من الليل؟", correct: "خط القران" },
    { riddle: "له عين واحدة ولا يرى بها فما هو؟", correct: "الإبرة" },
    { riddle: "ما هو الشيء الذي يوجد وسط مكة؟", correct: "حرف الكاف" },
    { riddle: "يتحرك بلا رجليْن ولا يدخل إلا للأذنين فما هو؟", correct: "الصوت" },
    { riddle: "ما هو الشيء الذي كلما أخذت منه كبر وكلما وضعت فيه صغر؟", correct: "الحفرة" }
];

// قاعدة بيانات الأسئلة العامة
const triviaData = [
    { question: "ما هو أعلى حزام يمكن الوصول إليه في رياضة التايكوندو؟", correct: "الأسود", options: ["الأخضر", "الأحمر", "الأبيض", "الأسود"] },
    { question: "ما هي عاصمة جمهورية مصر العربية؟", correct: "القاهرة", options: ["الإسكندرية", "القاهرة", "الجيزة", "أسوان"] },
    { question: "كم عدد سور القرآن الكريم؟", correct: "114", options: ["110", "112", "114", "120"] },
    { question: "أي كوكب يسمى بالكوكب الأحمر؟", correct: "المريخ", options: ["الزهرة", "المريخ", "المشتري", "زحل"] },
    { question: "ما هو العنصر الكيميائي الذي يرمز له بالرمز (Au)؟", correct: "الذهب", options: ["الفضة", "الحديد", "الذهب", "النحاس"] }
];

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

client.once('ready', () => {
    console.log(`تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

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
                { name: '❓ لعبة الأسئلة', value: '`!اسئلة`', inline: true },
                { name: '🌍 تخمين الأعلام', value: '`!اعلام`', inline: true },
                { name: '🧩 فكك وتركيب', value: '`!فكك`', inline: true },
                { name: '🔤 لعبة ركب', value: '`!ركب`', inline: true },
                { name: '🧠 لعبة حزر', value: '`!حزر`', inline: true }
            )
            .setColor(0x5865F2);

        await message.reply({ embeds: [helpEmbed] });
    }

    if (message.content === '!xo') {
        const Game = new TicTacToe({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'لعبة إكس أو', color: '#5865F2' },
            mentionUser: true, timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!اربع') {
        const Game = new ConnectFour({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'لعبة أربع على الحواف', color: '#5865F2' },
            mentionUser: true, timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!rps') {
        const Game = new RockPaperScissors({
            message: message, isSlashGame: false,
            opponent: message.mentions.users.first() || message.author,
            embed: { title: 'حجر ورق مقص', color: '#5865F2' },
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
            timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!حظ') {
        const Game = new Slot({
            message: message, isSlashGame: false,
            embed: { title: 'لعبة الحظ', color: '#5865F2' },
            timeoutTime: 60000,
        });
        Game.startGame();
    }

    if (message.content === '!اسئلة') {
        const randomTrivia = triviaData[Math.floor(Math.random() * triviaData.length)];
        const shuffledOptions = shuffleArray([...randomTrivia.options]);

        const embed = new EmbedBuilder()
            .setTitle('❓ لعبة الأسئلة العامة')
            .setDescription(`**${randomTrivia.question}**`)
            .setColor(0x5865F2);

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
                await interaction.update({ content: `🎉 كفو يا ${message.author}! إجابتك صحيحة: **${randomTrivia.correct}** 🏆`, components: [] });
            } else {
                await interaction.update({ content: `❌ خطأ! الإجابة الصحيحة هي: **${randomTrivia.correct}**`, components: [] });
            }
            collector.stop();
        });
    }

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

   if (message.content === '!فكك') {
        const randomWord = fakkData[Math.floor(Math.random() * fakkData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🧩 لعبة ركب الكلمات')
            .setDescription(`رتب الحروف المفرقة التالية لتكون الكلمة الصحيحة:\n\n# 🔤 ${randomWord.scrambled}`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomWord.correct) {
                message.channel.send(`🎉 مبروك يا ${message.author}! الكلمة صحيحة: **${randomWord.correct}** 🏆`);
            } else {
                message.channel.send(`❌ خطأ! الكلمة الصحيحة كانت: **${randomWord.correct}**`);
            }
        });
    }

    if (message.content === '!ركب') {
        const randomRakib = rakibData[Math.floor(Math.random() * rakibData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🔤 لعبة ركب الحروف')
            .setDescription(`تركيب الحروف التالية:\n\n# 🔤 ${randomRakib.scrambled}`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomRakib.correct) {
                message.channel.send(`🎉 كفو يا ${message.author}! الكلمة صحيحة: **${randomRakib.correct}** 🏆`);
            } else {
                message.channel.send(`❌ خطأ! الكلمة الصحيحة كانت: **${randomRakib.correct}**`);
            }
        });
    }

    if (message.content === '!حزر') {
        const randomHazir = hazirData[Math.floor(Math.random() * hazirData.length)];
        const embed = new EmbedBuilder()
            .setTitle('🧠 لعبة حزر الألغاز')
            .setDescription(`حل اللغز:\n\n# 💡 "${randomHazir.riddle}"`)
            .setColor(0x5865F2);

        await message.reply({ embeds: [embed] });

        const filter = response => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 20000, max: 1 });

        collector.on('collect', response => {
            if (response.content.trim() === randomHazir.correct) {
                message.channel.send(`🎉 كفو يا ${message.author}! الحل صحيح: **${randomHazir.correct}** 🏆`);
            } else {
                message.channel.send(`❌ خطأ! الإجابة الصحيحة كانت: **${randomHazir.correct}**`);
            }
        });
    }
});

client.login(process.env.TOKEN);
