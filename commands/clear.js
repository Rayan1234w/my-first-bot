client.on('messageCreate', async message => {
    // التأكد أن الرسالة تبدأ بعلامة ! والبوت ليس هو المرسل
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // أمر الحذف
    if (command === 'clear') {
        // التحقق إذا كان العضو يمتلك صلاحية إدارة الرسائل
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('ما عندك صلاحية لإستخدام هذا الأمر! (يحتاج صلاحية إدارة الرسائل)');
        }

        try {
            let fetched;
            do {
                fetched = await message.channel.messages.fetch({ limit: 100 });
                // تصفية الرسائل: استثناء الرسائل المثبتة والرسائل القديمة أكثر من 14 يوم
                const messagesToDelete = fetched.filter(msg => !msg.pinned && (Date.now() - msg.createdTimestamp < 1209600000));

                if (messagesToDelete.size === 0) break;

                await message.channel.bulkDelete(messagesToDelete, true);

                if (fetched.size < 100) break;
            } while (true);

            const reply = await message.channel.send('تم تنظيف الروم بنجاح! تم حذف الرسائل غير المثبتة.');
            setTimeout(() => reply.delete().catch(() => {}), 4000); // حذف رسالة النجاح تلقائياً بعد 4 ثوانٍ
        } catch (error) {
            console.error(error);
            message.channel.send('حدث خطأ أثناء محاولة مسح الرسائل.');
        }
    }
});