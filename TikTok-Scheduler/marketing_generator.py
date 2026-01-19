import os
import random
import json
import asyncio
import textwrap
import edge_tts
from moviepy import VideoFileClip, ImageClip, CompositeVideoClip, AudioFileClip, ColorClip, vfx, TextClip
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

# Configuration
ASSETS_DIR = os.path.join(os.path.dirname(__file__), 'assets')
BACKGROUNDS_DIR = os.path.join(ASSETS_DIR, 'backgrounds')
MUSIC_DIR = os.path.join(ASSETS_DIR, 'music')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'marketing_campaign_50')
TEMP_DIR = os.path.join(os.path.dirname(__file__), 'temp')

# Ensure directories exist
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# Marketing Scripts Database (Simulated)
MARKETING_TEMPLATES = [
    {
        "niche": "Digital Marketing",
        "hook": "Stop wasting money on ads!",
        "body": "Our new AI tool optimizes your campaigns in seconds, not hours.",
        "cta": "Click the link in bio to start free.",
        "voice": "en-US-ChristopherNeural" # Deep, professional male
    },
    {
        "niche": "Fitness",
        "hook": "Want abs in 30 days?",
        "body": "Join the challenge that's changing lives worldwide. No equipment needed.",
        "cta": "Sign up now. Link in bio!",
        "voice": "en-US-AriaNeural" # Energetic female
    },
    {
        "niche": "E-commerce",
        "hook": "Flash Sale Alert!",
        "body": "Get 50% off everything in store. Only for the next 24 hours.",
        "cta": "Shop now before it's gone!",
        "voice": "en-US-GuyNeural" # Casual male
    },
    {
        "niche": "Motivation",
        "hook": "Do you feel stuck?",
        "body": "Success is waiting for you. You just need to take the first step today.",
        "cta": "Follow for daily motivation.",
        "voice": "en-US-BrianNeural" # Calm male
    },
    {
        "niche": "Tech",
        "hook": "This gadget is viral!",
        "body": "Experience the future of smart home technology. It connects everything.",
        "cta": "Check the review in bio.",
        "voice": "en-US-MichelleNeural" # Professional female
    }
]

def create_dynamic_text_image(text, size=(1080, 1920), font_size=80, color="white", bg_color="black"):
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype("arialbd.ttf", font_size) # Bold
    except:
        font = ImageFont.load_default()
        
    wrapped_text = textwrap.fill(text, width=20)
    
    # Calculate text size
    lines = wrapped_text.split('\n')
    line_heights = []
    max_w = 0
    for line in lines:
        try:
            l, t, r, b = draw.textbbox((0,0), line, font=font)
            w, h = r-l, b-t
        except:
            w, h = draw.textsize(line, font=font)
        max_w = max(max_w, w)
        line_heights.append(h)
        
    total_h = sum(line_heights) + (len(lines)*20)
    
    # Draw flashy background box
    pad = 40
    box_w = max_w + pad*2
    box_h = total_h + pad*2
    start_x = (size[0] - box_w) // 2
    start_y = (size[1] - box_h) // 2
    
    # Yellow highlight style for marketing
    if bg_color == "yellow":
        fill_color = (255, 255, 0, 255)
        text_color = "black"
    elif bg_color == "red":
        fill_color = (200, 0, 0, 255)
        text_color = "white"
    else:
        fill_color = (0, 0, 0, 200)
        text_color = "white"
        
    draw.rounded_rectangle(
        [start_x, start_y, start_x+box_w, start_y+box_h],
        radius=30,
        fill=fill_color
    )
    
    cur_y = start_y + pad
    for i, line in enumerate(lines):
        try:
            l, t, r, b = draw.textbbox((0,0), line, font=font)
            w = r-l
        except:
            w, h = draw.textsize(line, font=font)
        
        x = (size[0] - w) // 2
        draw.text((x, cur_y), line, font=font, fill=text_color)
        cur_y += line_heights[i] + 20
        
    return np.array(img)

async def generate_voiceover(text, voice, filename):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(filename)
    return filename

async def create_marketing_video(index):
    # Select Template
    template = random.choice(MARKETING_TEMPLATES)
    
    # Combine script
    full_script = f"{template['hook']} {template['body']} {template['cta']}"
    
    # Generate Audio
    audio_file = os.path.join(TEMP_DIR, f"audio_{index}.mp3")
    await generate_voiceover(full_script, template['voice'], audio_file)
    
    audio_clip = AudioFileClip(audio_file)
    duration = audio_clip.duration + 0.5 # Add padding
    
    # Visuals
    # 1. Background
    background_files = [f for f in os.listdir(BACKGROUNDS_DIR) if f.endswith(('.mp4', '.mov'))]
    if background_files:
        bg_path = os.path.join(BACKGROUNDS_DIR, random.choice(background_files))
        clip = VideoFileClip(bg_path)
        if clip.duration < duration:
            clip = clip.looped(duration=duration)
        else:
            max_start = clip.duration - duration
            start = random.uniform(0, max_start)
            clip = clip.subclipped(start, start + duration)
            
        if clip.w / clip.h > 9/16:
            new_w = int(clip.h * 9/16)
            clip = clip.cropped(x1=clip.w//2 - new_w//2, width=new_w, height=clip.h)
        clip = clip.resized(height=1920)
        if clip.w != 1080:
             clip = clip.resized(width=1080)
    else:
        clip = ColorClip(size=(1080, 1920), color=(0,0,100), duration=duration)

    # 2. Dynamic Text Overlay (Timed)
    # Split duration into 3 parts: Hook, Body, CTA
    t1 = duration * 0.25
    t2 = duration * 0.5
    t3 = duration * 0.25
    
    # Hook Text (Red/Impact)
    hook_img = create_dynamic_text_image(template['hook'], bg_color="red")
    hook_clip = ImageClip(hook_img).with_duration(t1).with_start(0).with_position('center')
    hook_clip = hook_clip.with_effects([vfx.CrossFadeIn(0.2)])
    
    # Body Text (Black/Info)
    body_img = create_dynamic_text_image(template['body'], bg_color="black", font_size=60)
    body_clip = ImageClip(body_img).with_duration(t2).with_start(t1).with_position('center')
    
    # CTA Text (Yellow/Action)
    cta_img = create_dynamic_text_image(template['cta'], bg_color="yellow", font_size=70)
    cta_clip = ImageClip(cta_img).with_duration(t3).with_start(t1+t2).with_position('center')
    
    final_clip = CompositeVideoClip([clip, hook_clip, body_clip, cta_clip])
    final_clip = final_clip.with_audio(audio_clip)
    
    # Add background music (low volume)
    music_files = [f for f in os.listdir(MUSIC_DIR) if f.endswith(('.mp3', '.wav'))]
    if music_files:
        music_path = os.path.join(MUSIC_DIR, random.choice(music_files))
        bg_music = AudioFileClip(music_path)
        if bg_music.duration < duration:
            bg_music = bg_music.looped(duration=duration)
        else:
            bg_music = bg_music.subclipped(0, duration)
        
        # Lower volume for bg music
        bg_music = bg_music.with_effects([vfx.MultiplyVolume(0.1)])
        
        # Composite Audio
        comp_audio = CompositeAudioClip([audio_clip, bg_music]) # Error check: CompositeAudioClip needed import? No, it's usually CompositeAudioClip
        # Actually MoviePy 2.x changes: let's stick to set_audio if composite is tricky or use CompositeAudioClip
        from moviepy import CompositeAudioClip
        final_audio = CompositeAudioClip([audio_clip, bg_music])
        final_clip = final_clip.with_audio(final_audio)

    output_path = os.path.join(OUTPUT_DIR, f"marketing_video_{index}.mp4")
    final_clip.write_videofile(output_path, fps=24, codec='libx264', audio_codec='aac', threads=4, logger=None)
    
    # Cleanup
    try:
        os.remove(audio_file)
    except:
        pass
        
    return output_path

async def main():
    print("Starting Marketing Video Production Batch (50 videos)...")
    print("This may take some time. Please wait.")
    
    # For demo, generate 5 to start, then loop
    # In real scenario 50 takes ~10-20 mins depending on CPU
    for i in range(1, 51):
        print(f"Generating video {i}/50...")
        try:
            path = await create_marketing_video(i)
            print(f"✅ Created: {path}")
        except Exception as e:
            print(f"❌ Error on {i}: {e}")

if __name__ == "__main__":
    asyncio.run(main())