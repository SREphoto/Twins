"""
LCD canvas renderer for MICRO 5424-R digital twin.
Works with Pillow if available; otherwise pure report string.
"""

from __future__ import annotations

from typing import Any, Dict, Optional, Tuple


BG = (5, 12, 22, 255)
CYAN = (0, 243, 255, 255)
GREEN = (0, 255, 136, 255)
AMBER = (255, 183, 0, 255)
RED = (255, 51, 85, 255)
MUTED = (140, 170, 200, 255)
WHITE = (220, 220, 220, 255)
PANEL = (10, 20, 35, 255)


def format_time(seconds: float) -> str:
    s = int(max(0, seconds))
    h, rem = divmod(s, 3600)
    m, sec = divmod(rem, 60)
    if h:
        return f"{h}:{m:02d}:{sec:02d}"
    return f"{m:02d}:{sec:02d}"


def draw_lcd_png(snapshot: Dict[str, Any], path: str, size: Tuple[int, int] = (1024, 512)) -> str:
    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError as e:
        raise RuntimeError("Pillow required for PNG LCD: pip install pillow") from e

    w, h = size
    img = Image.new("RGBA", (w, h), BG)
    draw = ImageDraw.Draw(img)

    try:
        font_lg = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
        font_val = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 56)
        font_sm = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
    except Exception:
        font_lg = font_val = font_sm = ImageFont.load_default()

    # grid
    for x in range(0, w, 32):
        draw.line([(x, 0), (x, h)], fill=(10, 25, 40, 255), width=1)
    for y in range(0, h, 32):
        draw.line([(0, y), (w, y)], fill=(10, 25, 40, 255), width=1)

    draw.rectangle([(20, 20), (w - 20, h - 20)], outline=CYAN, width=3)
    draw.rectangle([(20, 20), (w - 20, 70)], fill=(0, 243, 255, 40))
    draw.text(
        (40, 32),
        "MICRO 5424-R  |  ROTOR FA-45-24-11  |  REFRIGERATED",
        fill=CYAN,
        font=font_lg,
    )

    fault = snapshot.get("led_fault") or (snapshot.get("error") is not None)
    border_speed = RED if fault else CYAN
    status = snapshot.get("state", "—")
    if snapshot.get("error"):
        status = snapshot["error"]

    # Speed panel
    draw.rectangle([(40, 90), (500, 280)], fill=PANEL, outline=border_speed, width=2)
    mode = snapshot.get("display_mode", "RPM")
    draw.text((60, 105), "SPEED / RCF", fill=MUTED, font=font_sm)
    rpm = int(snapshot.get("rpm_actual", 0))
    rcf = int(snapshot.get("rcf_actual", 0))
    if mode == "RCF":
        draw.text((60, 150), f"{rcf:,} x g", fill=CYAN, font=font_val)
        draw.text((60, 230), f"{rpm:,} RPM", fill=GREEN, font=font_sm)
    else:
        draw.text((60, 150), f"{rpm:,} RPM", fill=CYAN, font=font_val)
        draw.text((60, 230), f"{rcf:,} x g", fill=GREEN, font=font_sm)

    # Time panel
    draw.rectangle([(530, 90), (984, 280)], fill=PANEL, outline=AMBER, width=2)
    draw.text((550, 105), "TIME SET / ELAPSED", fill=MUTED, font=font_sm)
    draw.text(
        (550, 150),
        format_time(snapshot.get("time_set_s", 0)),
        fill=AMBER,
        font=font_val,
    )
    draw.text(
        (550, 230),
        f"ELAPSED {format_time(snapshot.get('time_elapsed_s', 0))}",
        fill=WHITE,
        font=font_sm,
    )

    # Temp / status
    draw.rectangle([(40, 300), (984, 470)], fill=PANEL, outline=GREEN if not fault else RED, width=2)
    tset = snapshot.get("temp_set_c", 4.0)
    tact = snapshot.get("temp_actual_c", 22.0)
    draw.text((60, 320), "REFRIGERATION / STATUS", fill=MUTED, font=font_sm)
    draw.text((60, 360), f"{tset:+.1f} °C", fill=GREEN, font=font_val)
    draw.text((320, 380), f"ACT {tact:+.1f} °C", fill=WHITE, font=font_sm)
    draw.text((60, 430), f"STATUS: {status}", fill=RED if fault else CYAN, font=font_sm)

    # progress bar from elapsed/set if running
    tset_s = max(1, float(snapshot.get("time_set_s") or 1))
    tel = float(snapshot.get("time_elapsed_s") or 0)
    frac = min(1.0, tel / tset_s) if snapshot.get("state") in ("RUN", "ACCEL", "DECEL", "END") else 0.0
    draw.rectangle([(500, 420), (960, 445)], fill=(20, 40, 60, 255))
    draw.rectangle([(500, 420), (500 + int(460 * frac), 445)], fill=CYAN)

    img.save(path)
    return path


def snapshot_text(snapshot: Dict[str, Any]) -> str:
    return (
        f"[{snapshot.get('state')}] "
        f"{int(snapshot.get('rpm_actual', 0))} RPM | "
        f"{int(snapshot.get('rcf_actual', 0))} xg | "
        f"t={format_time(snapshot.get('time_elapsed_s', 0))}/"
        f"{format_time(snapshot.get('time_set_s', 0))} | "
        f"{snapshot.get('temp_actual_c', 0):+.1f}°C "
        f"(set {snapshot.get('temp_set_c', 0):+.1f}) "
        f"{snapshot.get('error') or ''}"
    ).strip()
