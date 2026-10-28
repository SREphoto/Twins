#!/usr/bin/env python3
"""
Gemini Flash 3.8 TTS Universal Audio Stem Synthesizer

Synthesizes high-fidelity spoken voiceover stems for any machine digital twin
using Google's official `gemini-3.8-flash-tts` model via the Gemini API.

Outputs:
  - <twin_dir>/docs/audio/vo_{0..N}.mp3
  - <twin_dir>/docs/audio/chapters_alignment.json
  - <twin_dir>/docs/audio/master_voiceover.wav

Usage:
  python3 scripts/synthesize_gemini_tts.py [twin_dir] [--voice Kore] [--api-key <KEY>]
"""

import sys
import os
import re
import json
import base64
import urllib.request
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

DEFAULT_API_KEY = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY') or ''
DEFAULT_VOICE = os.environ.get('GEMINI_TTS_VOICE') or 'Kore'

def extract_chapters(script_path: Path):
    if not script_path.exists():
        raise FileNotFoundError(f"Script not found: {script_path}")
    
    content = script_path.read_text(encoding='utf-8')
    sections = re.split(r'\n(?=#{2,3}\s+(?:Stage|Chapter))', content)
    
    chapters = []
    for sec in sections:
        badge_match = re.search(r'\*\s*\*\*Chapter Badge\*\*:\s*`([^`]+)`', sec) or re.search(r'`(STAGE[^`]+)`', sec)
        spoken_match = re.search(r'>\s*"([^"]+)"', sec, re.DOTALL)
        
        if spoken_match:
            title_match = re.search(r'#{2,3}\s+([^:\n]+:[^\n]+)', sec)
            title = title_match.group(1).strip() if title_match else f"Chapter {len(chapters)}"
            badge = badge_match.group(1).strip() if badge_match else f"STAGE {len(chapters)}"
            text = spoken_match.group(1).strip().replace('\n', ' ')
            text = re.sub(r'\s+', ' ', text)
            chapters.append({
                'idx': len(chapters),
                'badge': badge,
                'title': title,
                'text': text
            })
    return chapters

def synthesize_text(text: str, api_key: str, voice_name: str) -> bytes:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": text}]}],
        "generationConfig": {
            "speechConfig": {
                "voiceConfig": {
                    "prebuiltVoiceConfig": {"voiceName": voice_name}
                }
            }
        }
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))
        cand = res_data.get('candidates', [{}])[0]
        part = cand.get('content', {}).get('parts', [{}])[0]
        if 'inlineData' in part and 'data' in part['inlineData']:
            return base64.b64decode(part['inlineData']['data'])
        else:
            raise RuntimeError(f"No audio inlineData returned: {res_data}")

def main():
    twin_dir = 'centrifuge_twin'
    api_key = DEFAULT_API_KEY
    voice_name = DEFAULT_VOICE

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == '--api-key' and i + 1 < len(args):
            api_key = args[i+1]
            i += 2
        elif args[i] == '--voice' and i + 1 < len(args):
            voice_name = args[i+1]
            i += 2
        elif not args[i].startswith('--'):
            twin_dir = args[i]
            i += 1
        else:
            i += 1

    twin_path = ROOT / twin_dir
    script_path = twin_path / 'docs' / 'presentation_voiceover_script.md'
    out_dir = twin_path / 'docs' / 'audio'
    out_dir.mkdir(parents=True, exist_ok=True)

    print("=" * 64)
    print(f"🎙️  Gemini Flash 3.8 TTS Universal Voice Synthesizer")
    print(f"   Model:        models/gemini-3.8-flash-tts")
    print(f"   Voice:        {voice_name}")
    print(f"   Target Twin:  {twin_dir}")
    print(f"   Output Dir:   {out_dir}")
    print("=" * 64)

    chapters = extract_chapters(script_path)
    print(f"📖 Loaded {len(chapters)} chapters from {script_path.name}\n")

    alignment = []
    current_time = 0.0

    wav_files = []

    for ch in chapters:
        idx = ch['idx']
        badge = ch['badge']
        text = ch['text']
        raw_wav_path = out_dir / f"vo_{idx}_raw.wav"
        final_mp3_path = out_dir / f"vo_{idx}.mp3"

        print(f"🎙️  Synthesizing Chapter {idx}: [{badge}] ({len(text)} chars)...")
        raw_audio = synthesize_text(text, api_key, voice_name)
        raw_wav_path.write_bytes(raw_audio)

        # Get audio duration via ffprobe
        probe_cmd = [
            '/usr/local/bin/ffprobe', '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            str(raw_wav_path)
        ]
        duration = float(subprocess.check_output(probe_cmd, text=True).strip())
        wav_files.append(raw_wav_path)

        # Convert to high-fidelity MP3 with soft in/out fades
        cmd = [
            '/usr/local/bin/ffmpeg', '-y',
            '-i', str(raw_wav_path),
            '-af', f'afade=t=in:st=0:d=0.03,afade=t=out:st={max(0, duration - 0.05):.3f}:d=0.05',
            '-c:a', 'libmp3lame',
            '-b:a', '192k',
            '-ar', '44100',
            '-ac', '2',
            str(final_mp3_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        start_time = round(current_time, 2)
        end_time = round(current_time + duration, 2)
        alignment.append({
            'idx': idx,
            'badge': badge,
            'title': ch['title'],
            'start': start_time,
            'end': end_time,
            'duration': round(duration, 2),
            'filename': f"vo_{idx}.mp3"
        })
        current_time = end_time + 0.35  # small 350ms natural pause between chapters
        print(f"   ✅ Saved: {final_mp3_path.name} ({duration:.2f}s)")

    # Save alignment metadata
    align_file = out_dir / 'chapters_alignment.json'
    align_file.write_text(json.dumps(alignment, indent=2), encoding='utf-8')
    print(f"\n📋 Alignment metadata saved: {align_file}")

    # Concatenate all raw wavs into master_voiceover.wav
    concat_list_file = out_dir / 'concat_list.txt'
    with open(concat_list_file, 'w') as f:
        for p in wav_files:
            f.write(f"file '{p.name}'\n")

    master_wav = out_dir / 'master_voiceover.wav'
    subprocess.run([
        '/usr/local/bin/ffmpeg', '-y',
        '-f', 'concat', '-safe', '0',
        '-i', str(concat_list_file),
        '-c', 'copy',
        str(master_wav)
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    concat_list_file.unlink(missing_ok=True)

    # Clean up intermediate raw stems
    for p in wav_files:
        p.unlink(missing_ok=True)

    print(f"🎉 Master voiceover concatenated: {master_wav} ({current_time:.2f}s total)")
    print(f"✅ All {len(chapters)} Gemini Flash 3.8 TTS stems ready in {out_dir}")

if __name__ == '__main__':
    main()
