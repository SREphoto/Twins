#!/usr/bin/env python3
"""
Slices erweka_full_voice.wav into exactly 10 synchronized chapter stems:
  vo_0.wav -> Overview (0.00s -> 92.10s)
  vo_1.wav -> Stage 1: Power & Continuity (92.40s -> 104.60s)
  vo_2.wav -> Stage 2: Product & Media Setup (105.00s -> 122.00s)
  vo_3.wav -> Stage 3: Physical Insertion & Safety (122.20s -> 135.50s)
  vo_4.wav -> Stage 4: Console & Software Setup (135.80s -> 149.80s)
  vo_5.wav -> Stage 5: Active Run & Disintegration Physics (150.00s -> 165.80s)
  vo_6.wav -> Stage 6: End-of-Run Inspection & Report (166.00s -> 180.00s)
  vo_7.wav -> Stage 7A: Internal Power Supply & Routing (180.20s -> 199.20s)
  vo_8.wav -> Stage 7B: All 5 Motors & Actuators (199.60s -> 218.40s)
  vo_9.wav -> Stage 7C: Motherboard, Storage & Ports (218.60s -> 235.80s)
"""

import os
import subprocess

AUDIO_IN = 'disintegration_tester_twin/docs/audio/erweka_full_voice.wav'
OUT_DIR = 'disintegration_tester_twin/docs/audio'

CUTS = [
    (0.00, 92.10, 'STAGE 0 · OVERVIEW & OPERATION', 'vo_0.wav'),
    (92.40, 104.60, 'STAGE 1 · POWER & CONTINUITY', 'vo_1.wav'),
    (105.00, 122.00, 'STAGE 2 · PRODUCT & MEDIA SETUP', 'vo_2.wav'),
    (122.20, 135.50, 'STAGE 3 · INSERTION & SAFETY INTERLOCKS', 'vo_3.wav'),
    (135.80, 149.80, 'STAGE 4 · CONSOLE & SOFTWARE SETUP', 'vo_4.wav'),
    (150.00, 165.80, 'STAGE 5 · ACTIVE RUN & DISINTEGRATION PHYSICS', 'vo_5.wav'),
    (166.00, 180.00, 'STAGE 6 · END-OF-RUN INSPECTION & REPORT', 'vo_6.wav'),
    (180.20, 199.20, 'STAGE 7A · INTERNAL POWER SUPPLY & ROUTING', 'vo_7.wav'),
    (199.60, 218.40, 'STAGE 7B · ALL 5 MOTORS & ACTUATORS', 'vo_8.wav'),
    (218.60, 235.80, 'STAGE 7C · MOTHERBOARD, STORAGE & PORTS', 'vo_9.wav'),
]

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print("✂️  Slicing master Gemini voiceover into 10 synchronized chapter stems...")
    
    for start, end, label, fname in CUTS:
        out_path = os.path.join(OUT_DIR, fname)
        dur = end - start
        print(f"  Exporting [{label}]: {start:6.2f}s -> {end:6.2f}s ({dur:5.2f}s) -> {fname}")
        
        cmd = [
            '/usr/local/bin/ffmpeg', '-y',
            '-i', AUDIO_IN,
            '-ss', f'{start:.3f}',
            '-t', f'{dur:.3f}',
            '-af', f'afade=t=in:st=0:d=0.04,afade=t=out:st={dur-0.05:.3f}:d=0.05',
            out_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        
    print("✅ All 10 audio stems successfully sliced and saved in:", OUT_DIR)

if __name__ == '__main__':
    main()
