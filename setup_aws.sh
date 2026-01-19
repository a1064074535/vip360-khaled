#!/bin/bash

# تحديث النظام
echo "Updating system..."
sudo apt-get update && sudo apt-get upgrade -y

# تثبيت Node.js (الإصدار 18)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت المكتبات الضرورية لمتصفح كروم (Puppeteer)
echo "Installing Chrome dependencies..."
sudo apt-get install -y ca-certificates fonts-liberation libasound2 \
libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 \
libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 \
libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 \
libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

# تثبيت أداة PM2 لإبقاء البوت يعمل 24 ساعة
echo "Installing PM2..."
sudo npm install -g pm2

# تثبيت ملفات مشروع البوت
echo "Installing project dependencies..."
npm install

echo "==========================================="
echo "تم التثبيت بنجاح! (Setup Complete)"
echo "لتشغيل البوت، اكتب الأمر التالي:"
echo "pm2 start index.js --name whatsapp-bot"
echo "ثم امسح الباركود الذي سيظهر لك (قد تحتاج لأمر 'pm2 logs' لرؤية الباركود)"
echo "==========================================="
