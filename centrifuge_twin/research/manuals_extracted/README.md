# Extracted manual text

Generated with `pypdf` (+ `cryptography` for encrypted PDFs) from files in `../manuals/`.

Regenerate:

```bash
cd centrifuge_twin
source .venv/bin/activate   # or: .venv/bin/python
python - <<'PY'
from pathlib import Path
from pypdf import PdfReader

manuals = Path("research/manuals")
out = Path("research/manuals_extracted")
out.mkdir(exist_ok=True)
for p in manuals.glob("*.pdf"):
    r = PdfReader(str(p))
    if r.is_encrypted:
        r.decrypt("")
    text = "\n".join(
        f"\n===== PAGE {i+1} =====\n{(page.extract_text() or '')}"
        for i, page in enumerate(r.pages)
    )
    (out / f"{p.stem}.txt").write_text(text, encoding="utf-8")
    print(p.name, len(r.pages), "pages")
PY
```
