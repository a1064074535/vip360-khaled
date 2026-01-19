import json
import datetime
import os
from datetime import timedelta

def generate_schedule(days=30, start_date=None):
    if start_date is None:
        start_date = datetime.date.today()
    
    schedule = {}
    
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        date_str = current_date.strftime("%Y-%m-%d")
        
        schedule[date_str] = {
            "video_path": f"./videos/video_{i+1}.mp4",
            "caption": f"Daily TikTok Post #{i+1} 🚀 #fyp #tiktok",
            "upload_time": "09:00",
            "hashtags": ["fyp", "viral", "trending"]
        }
    
    return schedule

def save_schedule(schedule, filename="tiktok_posts.json"):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(schedule, f, indent=4, ensure_ascii=False)
    print(f"✅ Schedule saved to {filename}")

def main():
    print("TikTok Post Generator")
    print("1. Generate Monthly Schedule (30 days)")
    print("2. Generate Yearly Schedule (365 days)")
    print("3. Generate Test Schedule (7 days)")
    
    # Default to 30 days if running non-interactively, or prompt
    # Since I'm running this via tool, I'll default to 7 days for safety/demo
    days = 7 
    # In a real CLI user would input. I'll just generate a 30 day schedule by default.
    days = 30
    
    schedule = generate_schedule(days)
    save_schedule(schedule)
    
    # Create videos directory
    if not os.path.exists("videos"):
        os.makedirs("videos")
        print("✅ Created 'videos' directory")
        
    print(f"ℹ️  Generated schedule for {days} days.")
    print(f"ℹ️  Please place your video files in the 'videos' folder (video_1.mp4, etc).")

if __name__ == "__main__":
    main()
