# Workflow: Generate Digital Twin Voiceover & Walkthrough Video

Follow this workflow whenever a user provides a voiceover audio file (or Google Drive link) or requests a completed social media video walkthrough for any machine.

---

## Step 1: Verify Machine Script Exists
Ensure `<twin_dir>/docs/presentation_voiceover_script.md` contains clean, direct, real-world spoken text for each chapter, free of AI buzzwords or awkward acronym spelling.

## Step 2: Ingest & Slice Audio Stems
Run the universal audio processor to download, transcribe with Whisper, and cut the file into synchronized stems:
```bash
uv run scripts/process_voiceover_audio.py <twin_dir> --audio "<file_path_or_gdrive_url>"
```
Verify that `<twin_dir>/docs/audio/vo_{0..N}.mp3` and `chapters_alignment.json` are created.

## Step 3: Render 1080p Walkthrough Video
Master the 1080p MP4 video with Chrome CDP motion kinematics and audio multiplexing:
```bash
node scripts/generate_walkthrough_video.mjs <twin_dir>
```

## Step 4: Validate Video Output
Verify output file duration and size:
```bash
ls -lh <twin_dir>/docs/*_Social_Walkthrough.mp4
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 <twin_dir>/docs/*_Social_Walkthrough.mp4
```

## Step 5: Verify Mechanical Validator Gate Pass
Confirm that the twin passes all OGA checks:
```bash
node scripts/oga_validator.mjs <twin_dir>
```
