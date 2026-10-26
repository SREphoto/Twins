---
name: twin-voiceover-video-pipeline
description: Ingest full narration audio files (local or Google Drive links), transcribe with Whisper, slice into synchronized chapter stems, and master 1080p narrated walkthrough videos for all digital twin machines.
---

# Digital Twin Voiceover & Video Pipeline

This skill provides an automated, universal pipeline for converting single-file voiceover recordings into synchronized chapter stems and mastering complete 1080p narrated walkthrough videos for **any digital twin machine** in the repository.

---

## 1. Pipeline Architecture

```
Single Raw Narration Audio (Local File or Google Drive URL)
                           │
                           ▼
          [scripts/process_voiceover_audio.py]
          ├── Google Drive Auto-Downloader (curl)
          ├── Whisper Speech-to-Text with Word Timestamps
          ├── Script Anchor Alignment (fuzzy matching)
          └── Zero-Crossing Silence Slicing + Soft Edge Fades
                           │
                           ▼
              Sliced Audio Stems in <twin>/docs/audio/
              ├── vo_0.mp3 (Overview / Stage 0)
              ├── vo_1.mp3 (Stage 1: Powering On)
              ├── vo_2.mp3 (Stage 2: Media Setup)
              ├── ...
              └── chapters_alignment.json
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
   [In-App Guided Tour]      [scripts/generate_walkthrough_video.mjs]
   Played live in browser    Headless Chrome CDP 3D WebGL Motion
   via app.js (#btnGuidedTour)  Synchronized Kinematics & Audio Multiplexing
                                        │
                                        ▼
                             Master 1080p MP4 Walkthrough Video
                             (<twin>/docs/<TWIN>_Social_Walkthrough.mp4)
```

---

## 2. Universal CLI Commands

### Option A: The One-Command Master Runner (`scripts/build_twin_video.mjs`)

To process audio and generate the complete video in a single command:

```bash
# Using a Google Drive link
node scripts/build_twin_video.mjs <twin_dir> --audio "https://drive.google.com/file/d/<FILE_ID>/view"

# Using a local audio file
node scripts/build_twin_video.mjs <twin_dir> --audio /path/to/voiceover.wav
```

### Option B: Slicing Audio Only (`scripts/process_voiceover_audio.py`)

When you have a narration audio file and need to slice it into chapter stems:

```bash
# Auto-downloads from Google Drive and slices into <twin_dir>/docs/audio/vo_{idx}.mp3
uv run scripts/process_voiceover_audio.py <twin_dir> --audio "https://drive.google.com/file/d/<FILE_ID>/view"

# Or from local file:
uv run scripts/process_voiceover_audio.py <twin_dir> --audio docs/audio/my_voice.wav
```

### Option C: Video Rendering Only (`scripts/generate_walkthrough_video.mjs`)

When audio stems are already sliced in `<twin_dir>/docs/audio/`:

```bash
node scripts/generate_walkthrough_video.mjs <twin_dir>
```

---

## 3. Chapter Script Contract (`presentation_voiceover_script.md`)

The audio processor automatically matches spoken words to the machine's script in `<twin_dir>/docs/presentation_voiceover_script.md` (or `TOUR_CHAPTERS` in `<twin_dir>/software/viewer/app.js`).

Ensure the script contains clearly delimited stages:

```markdown
### Chapter 1: Powering On & Electrical Continuity
* **Chapter Badge**: `STAGE 1 / 10 · POWER & CONTINUITY`
* **Spoken Voiceover**:
> "To start, the operator plugs the power cord into the bench outlet and turns on the rear power switch..."
```

---

## 4. In-App Guided Tour Integration

In `<twin>/software/viewer/app.js`, the in-app guided tour automatically streams the sliced stems:

```javascript
// Played automatically when the operator clicks "🎬 Guided Tour"
const audioUrl = `../../docs/audio/vo_${this.tourIndex}.mp3`;
const audio = new Audio(audioUrl);
audio.onended = advance;
audio.play().catch(() => /* Fallback to SpeechSynthesis */);
```

---

## 5. Validation Checklist

Before marking any digital twin video complete:
- [ ] Raw audio is cleanly split at silence boundaries into `docs/audio/vo_{0..N}.mp3`.
- [ ] No stem has cut-off words, clicks, or awkward overlaps.
- [ ] Output video is full 1080p H.264/AAC with synchronized camera motion and active kinematics.
- [ ] `node scripts/oga_validator.mjs <twin_dir>` passes Gate 5 checks.
