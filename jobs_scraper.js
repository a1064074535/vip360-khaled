const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const JOBS_FILE = path.join(__dirname, 'public_html', 'daily_jobs.json');
// Changed to all-jobs to ensure we get enough items
const TARGET_URL = 'https://www.ewdifh.com/category/all-jobs';

async function scrapeJobs() {
    try {
        console.log(`Scraping jobs from ${TARGET_URL}...`);
        const { data } = await axios.get(TARGET_URL);
        const $ = cheerio.load(data);
        
        const jobs = [];
        
        // Select job cards based on the structure we saw
        // The container seems to be: div.bg-white.rounded-md.shadow.p-3.w-full
        $('.bg-white.rounded-md.shadow.p-3.w-full').each((i, el) => {
            if (jobs.length >= 15) return false; // Stop after 15 jobs

            const titleElement = $(el).find('.text-base.font-semibold a');
            const title = titleElement.text().trim();
            const link = titleElement.attr('href');
            
            // Sometimes the link might be relative, though in the curl output it was absolute
            // Let's handle just in case
            const fullLink = link && !link.startsWith('http') ? `https://www.ewdifh.com${link}` : link;

            // Company/Org name
            const orgElement = $(el).find('i.fa-building').parent().find('a');
            const company = orgElement.text().trim();

            // Time posted
            const timeElement = $(el).find('i.fa-clock').parent().find('span');
            const time = timeElement.text().trim();

            if (title && fullLink) {
                jobs.push({
                    title,
                    link: fullLink,
                    company,
                    time
                });
            }
        });

        console.log(`Found ${jobs.length} jobs.`);
        
        // Check if we need more jobs from page 2
        if (jobs.length < 20) {
            console.log('Not enough jobs, fetching page 2...');
            try {
                const page2Url = `${TARGET_URL}?page=2`;
                const { data: data2 } = await axios.get(page2Url);
                const $2 = cheerio.load(data2);
                
                $2('.bg-white.rounded-md.shadow.p-3.w-full').each((i, el) => {
                    if (jobs.length >= 20) return false;

                    const titleElement = $2(el).find('.text-base.font-semibold a');
                    const title = titleElement.text().trim();
                    const link = titleElement.attr('href');
                    const fullLink = link && !link.startsWith('http') ? `https://www.ewdifh.com${link}` : link;
                    const orgElement = $2(el).find('i.fa-building').parent().find('a');
                    const company = orgElement.text().trim();
                    const timeElement = $2(el).find('i.fa-clock').parent().find('span');
                    const time = timeElement.text().trim();

                    if (title && fullLink) {
                        jobs.push({
                            title,
                            link: fullLink,
                            company,
                            time
                        });
                    }
                });
            } catch (err) {
                console.error('Error fetching page 2:', err);
            }
        }

        console.log(`Total jobs found: ${jobs.length}`);
        
        if (jobs.length > 0) {
            fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2), 'utf8');
            console.log(`Saved jobs to ${JOBS_FILE}`);
            return jobs;
        } else {
            console.log('No jobs found. Check selectors.');
            return [];
        }

    } catch (error) {
        console.error('Error scraping jobs:', error);
        return [];
    }
}

// Allow running directly
if (require.main === module) {
    scrapeJobs();
}

module.exports = { scrapeJobs, JOBS_FILE };
