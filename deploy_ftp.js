const ftp = require("basic-ftp")
const path = require("path")
require('dotenv').config()

async function deployToHostinger() {
    const client = new ftp.Client()
    client.ftp.verbose = true

    // Check for credentials
    if (!process.env.FTP_HOST || !process.env.FTP_USER || !process.env.FTP_PASSWORD) {
        console.error("❌ Error: FTP credentials missing in .env file.")
        console.error("Please add FTP_HOST, FTP_USER, and FTP_PASSWORD to your .env file.")
        return
    }

    try {
        console.log("🔌 Connecting to Hostinger FTP...")
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false // Hostinger often uses plain FTP or explicit TLS. Try false first or true if fails.
        })
        
        console.log("✅ Connected!")
        
        const localDir = path.join(__dirname, "public_html")
        const remoteDir = "/public_html" // Standard path for Hostinger

        console.log(`📂 Uploading files from ${localDir} to ${remoteDir}...`)
        
        // Ensure remote directory exists (usually it does)
        await client.ensureDir(remoteDir)
        
        // Upload the whole directory
        await client.uploadFromDir(localDir, remoteDir)
        
        console.log("🚀 Deployment Complete! Your site should be live.")
        
    } catch(err) {
        console.error("❌ Deployment Failed:", err)
    }
    client.close()
}

deployToHostinger()
