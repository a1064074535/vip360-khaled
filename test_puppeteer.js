const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('Browser launched!');
        await browser.close();
        console.log('Browser closed!');
    } catch (err) {
        console.error('Puppeteer error:', err);
    }
})();
