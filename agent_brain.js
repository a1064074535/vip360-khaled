const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Load Store Data
const STORE_FILE = path.join(__dirname, 'store_data.json');

function getProducts() {
    if (fs.existsSync(STORE_FILE)) {
        return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')).products;
    }
    return [];
}

// The AI Logic (Rule-based for now)
async function processCommand(command) {
    const cmd = command.toLowerCase();
    
    // 1. Marketing / Promotion
    if (cmd.includes('تسويق') || cmd.includes('اعلان') || cmd.includes('promo') || cmd.includes('market')) {
        // Identify product
        const products = getProducts();
        const targetProduct = products.find(p => cmd.includes(p.name.toLowerCase()) || cmd.includes(p.category.toLowerCase()));
        
        if (targetProduct) {
            return await generatePromoForProduct(targetProduct);
        } else if (cmd.includes('كل') || cmd.includes('all')) {
            // Pick random product
            const randomProd = products[Math.floor(Math.random() * products.length)];
            return await generatePromoForProduct(randomProd);
        } else {
            return {
                type: 'text',
                message: "أي منتج تريد التسويق له؟ (مثال: 'اعلان للساعة الذكية')"
            };
        }
    }
    
    // 2. Social Media Management
    if (cmd.includes('تيك توك') || cmd.includes('tiktok')) {
        if (cmd.includes('انشر') || cmd.includes('post')) {
            // Trigger Scheduler
            triggerSchedulerReplenish();
            return { type: 'text', message: "جاري توليد محتوى جديد وجدولته على تيك توك... 🎬" };
        }
    }

    // 3. Store Management
    if (cmd.includes('منتجات') || cmd.includes('products')) {
        const prods = getProducts();
        const list = prods.map(p => `- ${p.name} (${p.price} SAR)`).join('\n');
        return { type: 'text', message: `لديك ${prods.length} منتجات في المتجر:\n${list}` };
    }

    // Default AI Response
    return {
        type: 'text',
        message: "أنا مساعدك الشخصي. يمكنني إدارة المتجر، التسويق للمنتجات، ونشر المحتوى. جرب أن تقول: 'اعمل اعلان للساعة الذكية'"
    };
}

async function generatePromoForProduct(product) {
    // Construct a marketing script for this product
    const script = `
        هل تبحث عن ${product.name}؟
        ${product.description}
        بسعر خيالي: ${product.price} ريال فقط!
        اطلبها الآن من متجرنا. الرابط في البايو.
    `;
    
    // Trigger the video generator with this specific text
    // We will use the 'edit existing' or 'generate new' logic
    const pythonScript = path.join(__dirname, 'TikTok-Scheduler', 'video_generator.py');
    const outputName = `promo_${product.id}_${Date.now()}.mp4`;
    
    // Command to generate video
    // We assume video_generator has a CLI arg --text (which we added!)
    const command = `python "${pythonScript}" --generate --text "${script}" --output "${outputName}"`;
    
    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                resolve({ type: 'text', message: `حدث خطأ أثناء إنشاء الفيديو: ${error.message}` });
            } else {
                resolve({ 
                    type: 'video_success', 
                    message: `تم إنشاء فيديو إعلاني لـ ${product.name} بنجاح! ✅\nسيتم نشره قريباً.`,
                    video_path: outputName
                });
                
                // Add to TikTok Schedule automatically
                scheduleVideo(outputName, script);
            }
        });
    });
}

function triggerSchedulerReplenish() {
    const scriptPath = path.join(__dirname, 'TikTok-Scheduler', 'daily_content_manager.py');
    exec(`python "${scriptPath}"`, (err) => {
        if (err) console.error("Scheduler Error:", err);
    });
}

function scheduleVideo(videoName, caption) {
    const postsFile = path.join(__dirname, 'TikTok-Scheduler', 'tiktok_posts.json');
    let posts = {};
    if (fs.existsSync(postsFile)) {
        posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    }
    
    // Schedule for tomorrow at 6 PM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    if (!posts[dateStr]) posts[dateStr] = [];
    if (!Array.isArray(posts[dateStr])) posts[dateStr] = [posts[dateStr]]; // Legacy fix
    
    posts[dateStr].push({
        video_path: path.join(__dirname, 'TikTok-Scheduler', 'generated_videos', videoName),
        caption: caption,
        time: "18:00",
        status: "pending"
    });
    
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 4));
}

module.exports = { processCommand };