import os
import json
import time
import datetime
import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configure Logging
logging.basicConfig(
    filename='tiktok_scheduler.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
console = logging.StreamHandler()
console.setLevel(logging.INFO)
logging.getLogger('').addHandler(console)

import sys
# Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from daily_content_manager import generate_daily_batch

class TikTokScheduler:
    def __init__(self):
        self.scheduler = BlockingScheduler()
        self.driver = None
        self.posts_file = os.path.join(os.path.dirname(__file__), 'tiktok_posts.json')
        
    def check_and_replenish(self):
        """Checks if content exists for today and tomorrow, generates if missing."""
        logging.info("Checking content inventory...")
        today = datetime.date.today().strftime("%Y-%m-%d")
        tomorrow = (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        
        if os.path.exists(self.posts_file):
            with open(self.posts_file, 'r', encoding='utf-8') as f:
                posts = json.load(f)
        else:
            posts = {}
            
        # Check Today
        current_today_count = 0
        if today in posts:
            if isinstance(posts[today], list):
                current_today_count = len(posts[today])
            else:
                current_today_count = 1
        
        if current_today_count < 10:
            needed = 10 - current_today_count
            logging.info(f"Today ({today}) has {current_today_count}/10 posts. Generating {needed} more...")
            try:
                generate_daily_batch(today, needed)
                logging.info("✅ Replenished content for today.")
            except Exception as e:
                logging.error(f"Failed to generate content for today: {e}")

        # Check Tomorrow
        current_tomorrow_count = 0
        if tomorrow in posts:
            if isinstance(posts[tomorrow], list):
                current_tomorrow_count = len(posts[tomorrow])
            else:
                current_tomorrow_count = 1
                
        if current_tomorrow_count < 10:
            needed = 10 - current_tomorrow_count
            logging.info(f"Tomorrow ({tomorrow}) has {current_tomorrow_count}/10 posts. Generating {needed} more...")
            try:
                generate_daily_batch(tomorrow, needed)
                logging.info("✅ Replenished content for tomorrow.")
            except Exception as e:
                logging.error(f"Failed to generate content for tomorrow: {e}")

    def setup_driver(self):
        logging.info("Setting up Undetected Chrome Driver...")
        options = uc.ChromeOptions()
        # options.add_argument('--headless') # TikTok doesn't work well in headless usually
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        options.add_argument("--mute-audio")
        options.add_argument("--start-maximized")
        
        # Save session in current directory
        user_data_dir = os.path.join(os.getcwd(), "chrome_profile")
        options.add_argument(f"--user-data-dir={user_data_dir}")
        
        # UC initializes differently
        self.driver = uc.Chrome(options=options, use_subprocess=True)
        
    def check_login(self):
        logging.info("Checking login status...")
        try:
            self.driver.get("https://www.tiktok.com/upload?lang=en")
            time.sleep(5)
            
            # Simple check: if URL redirects to login or contains login elements
            if "login" in self.driver.current_url:
                logging.warning("⚠️ Not logged in! Please log in manually in the browser window.")
                logging.info("Waiting 60 seconds for manual login...")
                time.sleep(60)
            
            # Check again
            if "login" not in self.driver.current_url:
                logging.info("✅ Logged in successfully.")
                return True
            else:
                logging.error("❌ Failed to log in.")
                return False
        except Exception as e:
            logging.error(f"Error checking login: {e}")
            return False

    def upload_video(self, video_path, caption):
        if not os.path.exists(video_path):
            logging.error(f"Video file not found: {video_path}")
            return False

        try:
            logging.info(f"🚀 Starting upload for: {video_path}")
            if self.driver.current_url != "https://www.tiktok.com/upload?lang=en":
                self.driver.get("https://www.tiktok.com/upload?lang=en")
                time.sleep(5)

            # 1. Upload File
            # Find the file input element. It's usually hidden but we can send keys to it.
            # XPath: //input[@type='file']
            file_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='file']"))
            )
            file_input.send_keys(os.path.abspath(video_path))
            logging.info("Video uploading...")
            
            # Wait for upload to complete (Increased to 30s)
            time.sleep(30) 
            
            # 2. Set Caption
            # Remove non-BMP characters (emojis) to avoid ChromeDriver errors
            clean_caption = ''.join(c for c in caption if c <= '\uFFFF')
            if len(clean_caption) != len(caption):
                logging.warning("⚠️ Removed emojis from caption due to ChromeDriver limitation.")
            
            try:
                caption_area = self.driver.find_element(By.XPATH, "//div[@contenteditable='true']")
                caption_area.click()
                caption_area.send_keys(clean_caption)
                logging.info("Caption set.")
            except Exception as e:
                logging.warning(f"Could not set caption (might need manual adjustment): {e}")

            time.sleep(2)
            
            # Debug: List all buttons
            buttons = self.driver.find_elements(By.TAG_NAME, "button")
            button_texts = [b.text for b in buttons if b.is_displayed()]
            logging.info(f"Visible buttons on page: {button_texts}")

            # 3. Click Post
            # Try multiple selectors (English and Arabic)
            post_btn = None
            selectors = [
                "//button[div[text()='Post']]", 
                "//button[text()='Post']",
                "//button[contains(., 'Post')]",
                "//div[text()='Post']",
                "//button[div[text()='نشر']]", 
                "//button[text()='نشر']",
                "//button[contains(., 'نشر')]",
                "//div[text()='نشر']"
            ]
            
            for selector in selectors:
                try:
                    elems = self.driver.find_elements(By.XPATH, selector)
                    for elem in elems:
                        if elem.is_displayed():
                            post_btn = elem
                            break
                    if post_btn:
                        logging.info(f"Found Post button with selector: {selector}")
                        break
                except:
                    continue
            
            if not post_btn:
                 # Fallback: Look for the big red/primary button at the bottom
                 # This is risky but might work if text varies
                 pass

            # Ensure it's clickable
            if post_btn:
                if post_btn.is_enabled():
                    self.driver.execute_script("arguments[0].scrollIntoView();", post_btn)
                    time.sleep(1)
                    post_btn.click()
                    logging.info("✅ Post button clicked.")
                    
                    # Wait for "Your video is being uploaded" modal or redirect
                    time.sleep(10)
                    return True
                else:
                    logging.error("Post button found but is disabled.")
                    return False
            else:
                logging.error("Could not find Post button.")
                return False

        except Exception as e:
            logging.error(f"❌ Error during upload: {e}")
            self.driver.save_screenshot(f"error_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.png")
            return False

    def check_and_post(self):
        today = datetime.date.today().strftime("%Y-%m-%d")
        current_time = datetime.datetime.now().time()
        logging.info(f"Checking schedule for {today} at {current_time.strftime('%H:%M')}...")
        
        if not os.path.exists(self.posts_file):
            logging.warning("No posts file found.")
            return

        with open(self.posts_file, 'r', encoding='utf-8') as f:
            posts = json.load(f)
            
        if today in posts:
            daily_content = posts[today]
            
            # Normalize to list to support legacy single-post format
            if isinstance(daily_content, dict):
                daily_content = [daily_content]
                # Add status if missing
                if 'status' not in daily_content[0]:
                    daily_content[0]['status'] = 'pending'
            
            posts_modified = False
            
            for post in daily_content:
                # Check status
                if post.get('status') == 'uploaded':
                    continue
                
                # Check time
                post_time_str = post.get('time', '09:00')
                try:
                    post_hour, post_minute = map(int, post_time_str.split(':'))
                    post_time = datetime.time(post_hour, post_minute)
                except:
                    logging.warning(f"Invalid time format: {post_time_str}")
                    continue
                
                # If current time is past post time (and within reason, e.g. same day)
                if current_time >= post_time:
                    logging.info(f"Found pending post for {post_time_str}: {post['caption']}")
                    
                    if not self.driver:
                        self.setup_driver()
                    
                    if self.check_login():
                        success = self.upload_video(post['video_path'], post['caption'])
                        if success:
                            logging.info("🎉 Post completed successfully!")
                            post['status'] = 'uploaded'
                            posts_modified = True
                        else:
                            logging.error("Failed to post.")
                            # Optional: retry count?
                    else:
                        logging.error("Skipping post due to login failure.")
                        # Don't mark as uploaded so it retries next loop
                        
            if posts_modified:
                # Save changes (status updates)
                # If it was a dict originally, we now save it as a list. This upgrades the format.
                posts[today] = daily_content
                with open(self.posts_file, 'w', encoding='utf-8') as f:
                    json.dump(posts, f, indent=4)
                
        else:
            logging.info("No post scheduled for today.")

    def start(self):
        logging.info("Starting TikTok Scheduler...")
        
        # Initial replenishment check
        self.check_and_replenish()
        
        # Schedule to run every 30 minutes to catch hourly posts
        self.scheduler.add_job(self.check_and_post, CronTrigger(minute='0,30'))
        
        # Schedule replenishment every 6 hours
        self.scheduler.add_job(self.check_and_replenish, CronTrigger(hour='*/6'))
        
        logging.info("📅 Scheduler is running. Waiting for jobs...")
        try:
            self.scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            logging.info("Stopping scheduler...")

import sys

if __name__ == "__main__":
    bot = TikTokScheduler()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == '--start':
            bot.start()
        elif sys.argv[1] == '--test':
            bot.check_and_post()
        elif sys.argv[1] == '--login':
            bot.setup_driver()
            bot.check_login()
            input("Press Enter to close browser after you finish logging in...")
        sys.exit()

    print("TikTok Automation System")
    print("1. Start Scheduler (Daily 9:00 AM)")
    print("2. Run Once Now (Test)")
    print("3. Login Only (Setup Session)")
    
    choice = input("Enter choice (1-3): ")
    
    if choice == '1':
        bot.start()
    elif choice == '2':
        bot.check_and_post()
    elif choice == '3':
        bot.setup_driver()
        bot.check_login()
        input("Press Enter to close browser after you finish logging in...")
