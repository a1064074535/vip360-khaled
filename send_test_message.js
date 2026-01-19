const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: 'khaled-bot',
        dataPath: './.auth_new_v3'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

const targetNumber = '966507866885@c.us'; 
const message = 'تجربة: هذه رسالة اختبار من البوت الخاص بك.\nTest message from your bot.';

client.on('qr', (qr) => {
    console.log('QR RECEIVED');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client is ready!');
    try {
        console.log(`Attempting to send message to ${targetNumber}...`);
        await client.sendMessage(targetNumber, message);
        console.log(`Message sent successfully to ${targetNumber}`);
        setTimeout(() => {
            console.log('Closing client...');
            client.destroy();
            process.exit(0);
        }, 5000);
    } catch (err) {
        console.error('Failed to send message:', err);
        process.exit(1);
    }
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
    process.exit(1);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
    process.exit(1);
});

console.log('Initializing client for test message...');
client.initialize().catch(err => {
    console.error('Initialization failed:', err);
    process.exit(1);
});
