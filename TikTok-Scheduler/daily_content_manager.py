import os
import json
import datetime
import argparse
from video_generator import generate_video

# Configuration
BASE_DIR = os.path.dirname(__file__)
POSTS_FILE = os.path.join(BASE_DIR, 'tiktok_posts.json')

def load_posts():
    if os.path.exists(POSTS_FILE):
        with open(POSTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_posts(posts):
    with open(POSTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=4)

def generate_daily_batch(target_date_str=None, count=10):
    if not target_date_str:
        # Default to tomorrow
        tomorrow = datetime.date.today() + datetime.timedelta(days=1)
        target_date_str = tomorrow.strftime("%Y-%m-%d")
    
    print(f"Starting batch generation for {target_date_str} ({count} videos)...")
    
    posts = load_posts()
    
    # Initialize list for the date if not exists
    day_posts = []
    current_count = 0
    
    if target_date_str in posts:
        if isinstance(posts[target_date_str], list):
            day_posts = posts[target_date_str]
            current_count = len(day_posts)
        else:
            # Convert legacy single dict to list
            day_posts = [posts[target_date_str]]
            current_count = 1
    
    videos_needed = count
    print(f"Date {target_date_str} has {current_count} posts. Generating {videos_needed} more...")

    # Define time slots (e.g., every hour starting 10:00)
    # Start after the last post's time if possible, or just append
    start_hour = 10
    
    for i in range(videos_needed):
        try:
            print(f"Generating video {i+1}/{videos_needed}...")
            video_path = generate_video(current_count + i + 1, target_date_str)
            
            # Calculate time
            hour = start_hour + current_count + i
            # Wrap around 24h format
            hour_normalized = hour % 24
            time_str = f"{hour_normalized:02d}:00"
            
            post_data = {
                "video_path": video_path,
                "caption": f"Daily Motivation #{current_count + i + 1} #motivation #quotes #fyp",
                "time": time_str,
                "status": "pending"
            }
            
            day_posts.append(post_data)
            
        except Exception as e:
            print(f"Error generating video {i+1}: {e}")
            continue

    # Update global posts
    posts[target_date_str] = day_posts
    save_posts(posts)
    print(f"✅ Generated and scheduled {videos_needed} new videos for {target_date_str}. Total: {len(day_posts)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", help="Target date YYYY-MM-DD")
    parser.add_argument("--count", type=int, default=10, help="Number of videos")
    args = parser.parse_args()
    
    generate_daily_batch(args.date, args.count)
