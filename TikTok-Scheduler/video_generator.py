import os
import random
import json
import textwrap
import requests
from moviepy import VideoFileClip, ImageClip, CompositeVideoClip, AudioFileClip, ColorClip, vfx, TextClip
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

# Configuration
ASSETS_DIR = os.path.join(os.path.dirname(__file__), 'assets')
BACKGROUNDS_DIR = os.path.join(ASSETS_DIR, 'backgrounds')
MUSIC_DIR = os.path.join(ASSETS_DIR, 'music')
QUOTES_FILE = os.path.join(ASSETS_DIR, 'quotes.json')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'generated_videos')

# Ensure directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_random_quote():
    """Fetches a random quote from an online API or falls back to local file."""
    try:
        # Try fetching from DummyJSON (reliable free API)
        response = requests.get("https://dummyjson.com/quotes/random", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return f"{data['quote']}\n\n- {data['author']}"
    except Exception as e:
        print(f"API Error (using local): {e}")
    
    # Fallback to local
    if os.path.exists(QUOTES_FILE):
        with open(QUOTES_FILE, 'r', encoding='utf-8') as f:
            quotes = json.load(f)
            if quotes:
                return random.choice(quotes)
    
    return "Success is not final, failure is not fatal: it is the courage to continue that counts.\n\n- Winston Churchill"

def create_text_image(text, size=(1080, 1920), font_size=65, watermark="@DailyMotivation"):
    # Create a transparent image
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Load a font
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
        watermark_font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font = ImageFont.load_default()
        watermark_font = ImageFont.load_default()
    
    # Wrap text
    wrapped_text = textwrap.fill(text, width=25)
    
    # Calculate text block size
    line_heights = []
    max_line_width = 0
    lines = wrapped_text.split('\n')
    
    for line in lines:
        try:
            left, top, right, bottom = draw.textbbox((0, 0), line, font=font)
            w = right - left
            h = bottom - top
        except AttributeError:
            w, h = draw.textsize(line, font=font)
        
        if w > max_line_width:
            max_line_width = w
        line_heights.append(h)
    
    total_text_height = sum(line_heights) + (len(lines) - 1) * 20
    
    # Draw semi-transparent background box
    box_padding = 40
    box_width = max_line_width + (box_padding * 2)
    box_height = total_text_height + (box_padding * 2)
    
    start_y = (size[1] - box_height) // 2
    start_x = (size[0] - box_width) // 2
    
    # Rounded rectangle background
    draw.rounded_rectangle(
        [start_x, start_y, start_x + box_width, start_y + box_height],
        radius=20,
        fill=(0, 0, 0, 150) # Black with opacity
    )
    
    # Draw Text
    current_y = start_y + box_padding
    
    for i, line in enumerate(lines):
        try:
            left, top, right, bottom = draw.textbbox((0, 0), line, font=font)
            w = right - left
        except AttributeError:
            w, h = draw.textsize(line, font=font)
            
        x = (size[0] - w) // 2
        
        # Main text
        draw.text((x, current_y), line, font=font, fill="white")
        current_y += line_heights[i] + 20

    # Draw Watermark
    try:
        left, top, right, bottom = draw.textbbox((0, 0), watermark, font=watermark_font)
        w_mark = right - left
    except:
        w_mark, h_mark = draw.textsize(watermark, font=watermark_font)
        
    draw.text(
        ((size[0] - w_mark) // 2, size[1] - 150),
        watermark,
        font=watermark_font,
        fill=(255, 255, 255, 128)
    )
        
    return np.array(img)

def generate_video(index, date_str):
    quote = get_random_quote()
    
    duration = 10 # seconds
    
    # 1. Background
    background_files = [f for f in os.listdir(BACKGROUNDS_DIR) if f.endswith(('.mp4', '.mov'))]
    if background_files:
        bg_path = os.path.join(BACKGROUNDS_DIR, random.choice(background_files))
        clip = VideoFileClip(bg_path)
        # Loop or trim
        if clip.duration < duration:
            clip = clip.looped(duration=duration)
        else:
            # Random start time for variety
            max_start = clip.duration - duration
            start = random.uniform(0, max_start)
            clip = clip.subclipped(start, start + duration)
            
        # Resize to vertical 9:16 if needed
        # Simple center crop strategy
        if clip.w / clip.h > 9/16:
            # Too wide, crop width
            new_w = int(clip.h * 9/16)
            clip = clip.cropped(x1=clip.w//2 - new_w//2, width=new_w, height=clip.h)
        elif clip.w / clip.h < 9/16:
             # Too tall (rare), resize
             pass
        
        clip = clip.resized(height=1920)
        # Ensure exact dimensions
        if clip.w != 1080:
             clip = clip.resized(width=1080)
             
        # Darken background for better text visibility
        clip = clip.with_effects([vfx.MultiplyColor(0.6)])
             
    else:
        # Create a dynamic color background
        # Gradient-like effect by stacking two colors? No, keep it simple for now.
        # Random vivid color
        color = (random.randint(20,100), random.randint(20,100), random.randint(50,150))
        clip = ColorClip(size=(1080, 1920), color=color, duration=duration)

    # 2. Text Overlay
    txt_img = create_text_image(quote)
    txt_clip = ImageClip(txt_img).with_duration(duration)
    
    # Fade in text
    txt_clip = txt_clip.with_effects([vfx.CrossFadeIn(1)])
    
    # Composite
    final_clip = CompositeVideoClip([clip, txt_clip])
    
    # Fade in/out video
    final_clip = final_clip.with_effects([vfx.FadeIn(1), vfx.FadeOut(1)])
    
    # 3. Audio
    music_files = [f for f in os.listdir(MUSIC_DIR) if f.endswith(('.mp3', '.wav'))]
    if music_files:
        music_path = os.path.join(MUSIC_DIR, random.choice(music_files))
        audio = AudioFileClip(music_path)
        if audio.duration < duration:
            audio = audio.looped(duration=duration)
        else:
            audio = audio.subclipped(0, duration)
            
        # Fade in/out audio
        audio = audio.with_effects([vfx.AudioFadeIn(1), vfx.AudioFadeOut(1)])
        final_clip = final_clip.with_audio(audio)
    
    # 4. Write File
    output_filename = f"video_{date_str}_{index}.mp4"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    # Use 'libx264' codec for compatibility
    final_clip.write_videofile(output_path, fps=24, codec='libx264', audio_codec='aac', threads=4)
    
    return output_path

def edit_existing_video(input_path, text=None, duration=None, watermark="@DailyMotivation", music_path=None, output_name=None):
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input video not found: {input_path}")
    base_clip = VideoFileClip(input_path)
    if duration:
        if base_clip.duration < duration:
            base_clip = base_clip.looped(duration=duration)
        else:
            base_clip = base_clip.subclipped(0, duration)
    target_h = 1920
    target_w = 1080
    if base_clip.w / base_clip.h > 9/16:
        new_w = int(base_clip.h * 9/16)
        base_clip = base_clip.cropped(x1=base_clip.w//2 - new_w//2, width=new_w, height=base_clip.h)
    base_clip = base_clip.resized(height=target_h)
    if base_clip.w != target_w:
        base_clip = base_clip.resized(width=target_w)
    base_clip = base_clip.with_effects([vfx.MultiplyColor(0.6)])
    overlay_text = text or get_random_quote()
    txt_img = create_text_image(overlay_text, size=(target_w, target_h), watermark=watermark)
    txt_clip = ImageClip(txt_img).with_duration(base_clip.duration)
    txt_clip = txt_clip.with_effects([vfx.CrossFadeIn(1)])
    final_clip = CompositeVideoClip([base_clip, txt_clip])
    final_clip = final_clip.with_effects([vfx.FadeIn(0.8), vfx.FadeOut(0.8)])
    if music_path:
        if os.path.exists(music_path):
            audio = AudioFileClip(music_path)
            if audio.duration < final_clip.duration:
                audio = audio.looped(duration=final_clip.duration)
            else:
                audio = audio.subclipped(0, final_clip.duration)
            audio = audio.with_effects([vfx.AudioFadeIn(0.8), vfx.AudioFadeOut(0.8)])
            final_clip = final_clip.with_audio(audio)
    out_name = output_name or f"edited_{os.path.splitext(os.path.basename(input_path))[0]}.mp4"
    out_path = os.path.join(OUTPUT_DIR, out_name)
    final_clip.write_videofile(out_path, fps=24, codec='libx264', audio_codec='aac', threads=4)
    return out_path

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=str, help="Path to existing video to edit")
    parser.add_argument("--text", type=str, help="Overlay text")
    parser.add_argument("--duration", type=int, help="Target duration in seconds")
    parser.add_argument("--watermark", type=str, default="@DailyMotivation")
    parser.add_argument("--music", type=str, help="Background music path")
    parser.add_argument("--output", type=str, help="Output filename")
    parser.add_argument("--generate", action="store_true", help="Generate a sample video")
    args = parser.parse_args()
    try:
        if args.input:
            out = edit_existing_video(
                input_path=args.input,
                text=args.text,
                duration=args.duration,
                watermark=args.watermark,
                music_path=args.music,
                output_name=args.output
            )
            print(f"Edited video: {out}")
        else:
            idx = 1
            d = "test" if args.generate else "auto"
            out = generate_video(idx, d)
            print(f"Video generated: {out}")
    except Exception as e:
        print(f"Error: {e}")
