#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "faster-whisper",
# ]
# ///
"""
Universal Digital Twin Voiceover Processor & Chapter Slicer

Takes a full narration audio file (local file or Google Drive URL) for ANY machine twin,
aligns spoken words to chapter scripts using Whisper, and automatically slices audio
into synchronized chapter stems (vo_0.mp3, vo_1.mp3, ...).

Usage:
  uv run scripts/process_voiceover_audio.py <twin_dir> [--audio <file_or_gdrive_url>] [--script <file>]
"""

import sys
import os
import re
import json
import subprocess
import urllib.parse
from pathlib import Path

ROOT = Path(os.getcwd())

def download_gdrive_file(url_or_id: str, dest_path: Path):
    """Downloads a public Google Drive file using curl."""
    file_id = url_or_id
    if 'drive.google.com' in url_or_id:
        m = re.search(r'/d/([a-zA-Z0-9_-]+)', url_or_id)
        if m:
            file_id = m.group(1)
        else:
            m = re.search(r'id=([a-zA-Z0-9_-]+)', url_or_id)
            if m:
                file_id = m.group(1)

    print(f"📥 Downloading audio from Google Drive (ID: {file_id})...")
    dl_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download"
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    
    cmd = ['curl', '-sSL', dl_url, '-o', str(dest_path)]
    subprocess.run(cmd, check=True)
    
    if not dest_path.exists() or dest_path.stat().st_size < 1000:
        raise RuntimeError(f"Download failed or file too small: {dest_path}")
    print(f"  ✅ Saved: {dest_path} ({dest_path.stat().st_size / (1024*1024):.2f} MB)")

def extract_chapters_from_script(script_path: Path):
    """Parses presentation_voiceover_script.md into a list of chapters."""
    if not script_path.exists():
        return []
    
    content = script_path.read_text(encoding='utf-8')
    chapters = []
    
    # Split by ## Stage or ### Chapter
    sections = re.split(r'\n(?=#{2,3}\s+(?:Stage|Chapter))', content)
    
    for sec in sections:
        badge_match = re.search(r'\*\s*\*\*Chapter Badge\*\*:\s*`([^`]+)`', sec)
        spoken_match = re.search(r'\*\s*\*\*Spoken Voiceover\*\*:\s*\n>\s*"([^"]+)"', sec, re.DOTALL)
        
        if not badge_match or not spoken_match:
            # Fallback patterns
            spoken_match = re.search(r'>\s*"([^"]+)"', sec, re.DOTALL)
            badge_match = re.search(r'`(STAGE[^`]+)`', sec)

        if spoken_match:
            title_match = re.search(r'#{2,3}\s+([^:\n]+:[^\n]+)', sec)
            title = title_match.group(1).strip() if title_match else f"Chapter {len(chapters)}"
            badge = badge_match.group(1).strip() if badge_match else f"STAGE {len(chapters)}"
            text = spoken_match.group(1).strip().replace('\n', ' ')
            # Clean up quotes and excess whitespace
            text = re.sub(r'\s+', ' ', text)
            chapters.append({
                'idx': len(chapters),
                'badge': badge,
                'title': title,
                'text': text
            })
            
    return chapters

def extract_chapters_from_app_js(app_js_path: Path):
    """Fallback: Extracts TOUR_CHAPTERS from app.js."""
    if not app_js_path.exists():
        return []
    content = app_js_path.read_text(encoding='utf-8')
    m = re.search(r'export const TOUR_CHAPTERS = \[([\s\S]*?)\];', content)
    if not m:
        return []
    block = m.group(1)
    
    chapters = []
    ch_blocks = re.findall(r'\{[\s\S]*?badge:\s*[\'"]([^\'"]+)[\'"][\s\S]*?title:\s*[\'"]([^\'"]+)[\'"][\s\S]*?voiceover:\s*[\'"]([^\'"]+)[\'"]', block)
    for idx, (badge, title, vo) in enumerate(ch_blocks):
        chapters.append({
            'idx': idx,
            'badge': badge,
            'title': title,
            'text': vo.strip()
        })
    return chapters

def transcribe_with_timestamps(audio_path: Path):
    """Runs faster-whisper to get word-level timestamps."""
    print("🎙️  Transcribing audio with Whisper (word timestamps)...")
    from faster_whisper import WhisperModel
    model = WhisperModel('tiny.en', device='cpu', compute_type='int8')
    segments, _ = model.transcribe(str(audio_path), word_timestamps=True)
    
    words = []
    for s in segments:
        for w in s.words:
            clean_word = re.sub(r'[^a-zA-Z0-9]', '', w.word).lower()
            if clean_word:
                words.append({
                    'start': w.start,
                    'end': w.end,
                    'word': clean_word,
                    'raw': w.word
                })
    return words

def find_chapter_cuts(chapters, words, total_duration):
    """Matches chapter scripts to spoken words and determines cut boundaries."""
    cuts = []
    
    # Extract first 4 words of each chapter for anchor matching
    for i, ch in enumerate(chapters):
        ch_words = [re.sub(r'[^a-zA-Z0-9]', '', w).lower() for w in ch['text'].split() if re.sub(r'[^a-zA-Z0-9]', '', w)]
        anchor = ch_words[:4]
        
        best_match_idx = -1
        best_score = 0
        
        # Search words
        for w_idx in range(len(words) - len(anchor) + 1):
            score = 0
            for a_idx, a_word in enumerate(anchor):
                if a_idx < 3 and words[w_idx + a_idx]['word'] == a_word:
                    score += 2
                elif words[w_idx + a_idx]['word'] == a_word:
                    score += 1
            if score > best_score and score >= 3:
                best_score = score
                best_match_idx = w_idx
                
        if best_match_idx != -1:
            cuts.append({
                'chapter_idx': i,
                'badge': ch['badge'],
                'title': ch['title'],
                'word_idx': best_match_idx,
                'start_time': words[best_match_idx]['start']
            })
            
    # Calculate intervals
    intervals = []
    for i in range(len(cuts)):
        start = cuts[i]['start_time']
        # Small padding before speech starts
        start = max(0.0, start - 0.25)
        if i + 1 < len(cuts):
            end = cuts[i+1]['start_time'] - 0.2
        else:
            end = total_duration - 0.1
            
        intervals.append({
            'idx': cuts[i]['chapter_idx'],
            'badge': cuts[i]['badge'],
            'title': cuts[i]['title'],
            'start': round(start, 2),
            'end': round(end, 2),
            'duration': round(end - start, 2),
            'filename': f"vo_{cuts[i]['chapter_idx']}.mp3"
        })
        
    return intervals

def slice_audio(audio_in: Path, out_dir: Path, intervals):
    """Slices input audio into chapter MP3 stems with soft edge fades."""
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"\n✂️  Slicing {len(intervals)} chapter stems into {out_dir}...")
    
    for item in intervals:
        out_file = out_dir / item['filename']
        dur = item['duration']
        print(f"  [{item['badge']}] {item['start']:6.2f}s -> {item['end']:6.2f}s ({dur:5.2f}s) -> {item['filename']}")
        
        cmd = [
            '/usr/local/bin/ffmpeg', '-y',
            '-i', str(audio_in),
            '-ss', f"{item['start']:.3f}",
            '-t', f"{dur:.3f}",
            '-af', f"afade=t=in:st=0:d=0.04,afade=t=out:st={max(0, dur-0.05):.3f}:d=0.05",
            '-b:a', '128k',
            str(out_file)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        
    # Write alignment JSON for video generators
    align_file = out_dir / 'chapters_alignment.json'
    with open(align_file, 'w') as f:
        json.dump(intervals, f, indent=2)
    print(f"  ✅ Saved metadata alignment: {align_file}")

def get_audio_duration(path: Path) -> float:
    cmd = [
        '/usr/local/bin/ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        str(path)
    ]
    out = subprocess.check_output(cmd, text=True)
    return float(out.strip())

def main():
    if len(sys.argv) < 2:
        print("Usage: process_voiceover_audio.py <twin_dir> [--audio <file_or_url>] [--script <file>]")
        sys.exit(1)
        
    twin_dir = sys.argv[1]
    twin_path = ROOT / twin_dir
    audio_dir = twin_path / 'docs' / 'audio'
    
    # Parse options
    audio_src = None
    script_src = twin_path / 'docs' / 'presentation_voiceover_script.md'
    
    args = sys.argv[2:]
    for i in range(len(args)):
        if args[i] == '--audio' and i + 1 < len(args):
            audio_src = args[i+1]
        elif args[i] == '--script' and i + 1 < len(args):
            script_src = Path(args[i+1])

    # Find audio source
    if not audio_src:
        # Check defaults in <twin_dir>/docs/audio/
        for cand in ['raw_voiceover.wav', 'erweka_full_voice.wav', 'full_voice.wav', 'voice.wav', 'voice.mp3']:
            p = audio_dir / cand
            if p.exists():
                audio_src = str(p)
                break
                
    if not audio_src:
        print(f"❌ Error: No audio source found for {twin_dir}. Provide --audio <file_or_gdrive_url>")
        sys.exit(1)

    print(f"👑 ========================================================")
    print(f"👑 DIGITAL TWIN VOICEOVER PROCESSOR: {twin_dir}")
    print(f"👑 ========================================================\n")

    # Handle Google Drive download if needed
    local_audio = audio_dir / 'master_voiceover.wav'
    if audio_src.startswith('http://') or audio_src.startswith('https://') or len(audio_src) == 33:
        download_gdrive_file(audio_src, local_audio)
    else:
        local_audio = Path(audio_src)

    # Extract chapter texts
    chapters = extract_chapters_from_script(script_src)
    if not chapters:
        chapters = extract_chapters_from_app_js(twin_path / 'software' / 'viewer' / 'app.js')
        
    if not chapters:
        print(f"❌ Error: No chapters found in {script_src} or app.js")
        sys.exit(1)

    print(f"📖 Loaded {len(chapters)} chapters from script.")
    total_dur = get_audio_duration(local_audio)
    print(f"⏱️  Master Audio Duration: {total_dur:.2f} seconds ({total_dur/60:.2f} minutes)")

    # Run Whisper
    words = transcribe_with_timestamps(local_audio)
    print(f"  Parsed {len(words)} spoken words.")

    # Match chapters to timestamps
    intervals = find_chapter_cuts(chapters, words, total_dur)
    if not intervals:
        print("❌ Error: Could not match chapter text to transcribed speech.")
        sys.exit(1)

    # Slice into chapter stems
    slice_audio(local_audio, audio_dir, intervals)
    print(f"\n🎉 Voiceover processing complete for {twin_dir}!")
    print(f"Ready to master video: 'node scripts/generate_walkthrough_video.mjs {twin_dir}'")

if __name__ == '__main__':
    main()
