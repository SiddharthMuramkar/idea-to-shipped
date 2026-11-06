"""Merge the image agents' credits into content/image-credits.json and set
image/imageAlt in each lesson's and course's header.

    python3 -I apply-images.py [--check]

Reports images without credits, credits without files, duplicate sources,
disallowed licenses and lessons/courses still without an image.
"""
import json, re, sys
from pathlib import Path

SCRATCH = Path("/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad")
import os
REPO = Path(os.environ.get("REPO", "/home/user/idea-to-shipped"))
CONTENT = REPO / "content"
PUBLIC = REPO / "public"
check_only = "--check" in sys.argv

ALLOWED = re.compile(r"^(CC0|CC0 1\.0|Public domain|PD\b.*|CC BY(-SA)? \d\.\d( [A-Za-z-]+)?|CC BY(-SA)? \d\.\d [a-z]{2})$", re.I)

credits = {}
for f in sorted((SCRATCH / "images").glob("credits-*.json")):
    try:
        data = json.loads(f.read_text())
    except json.JSONDecodeError as e:
        print(f"BAD JSON {f.name}: {e}")
        continue
    for path, c in data.items():
        if path in credits and credits[path]["source"] != c.get("source"):
            print(f"CONFLICT {path} in {f.name}")
        credits[path] = c

problems = []
by_source = {}
for path, c in sorted(credits.items()):
    if not (PUBLIC / path.lstrip("/")).exists():
        problems.append(f"credit without file: {path}")
    for key in ("title", "author", "license", "source", "alt"):
        if not str(c.get(key) or "").strip():
            problems.append(f"{path}: missing {key}")
    if c.get("license") and not ALLOWED.match(c["license"].strip()):
        problems.append(f"{path}: license not allowed: {c['license']}")
    if c.get("source") and not c["source"].startswith("https://commons.wikimedia.org/"):
        problems.append(f"{path}: source isn't a Commons page: {c['source']}")
    by_source.setdefault(c.get("source"), []).append(path)
for src, paths in by_source.items():
    if len(paths) > 1:
        problems.append(f"same Commons file used twice: {src}: {paths}")
for f in sorted((PUBLIC / "images").rglob("*.jpg")):
    rel = "/" + str(f.relative_to(PUBLIC))
    if rel not in credits:
        problems.append(f"file without credit: {rel}")
    if f.stat().st_size > 450_000:
        problems.append(f"{rel}: {f.stat().st_size // 1000} KB (over 450 KB)")


def set_header(md_path, image, alt):
    raw = md_path.read_text()
    m = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
    if not m:
        return False
    lines = [l for l in m.group(1).split("\n") if not l.startswith(("image:", "imageAlt:"))]
    lines += [f"image: {image}", f"imageAlt: {alt}"]
    new = "---\n" + "\n".join(lines) + "\n---\n" + raw[m.end():]
    if new != raw and not check_only:
        md_path.write_text(new)
    return True


missing = []
for course_dir in sorted(p for p in CONTENT.iterdir() if p.is_dir()):
    cimg = f"/images/courses/{course_dir.name}.jpg"
    if cimg in credits:
        set_header(course_dir / "course.md", cimg, credits[cimg]["alt"].replace("\n", " "))
    else:
        missing.append(f"course {course_dir.name}")
    for lesson in sorted(course_dir.glob("*.md")):
        if lesson.name == "course.md":
            continue
        img = f"/images/lessons/{lesson.stem}.jpg"
        if img in credits:
            set_header(lesson, img, credits[img]["alt"].replace("\n", " "))
        else:
            missing.append(f"lesson {course_dir.name}/{lesson.stem}")

out = {p: {k: c.get(k) for k in ("title", "author", "license", "licenseUrl", "source")} for p, c in sorted(credits.items())}
if not check_only:
    (CONTENT / "image-credits.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
print(f"{len(credits)} credits; {len(missing)} without an image; {len(problems)} problems")
for p in problems:
    print("  problem:", p)
for m in missing:
    print("  missing:", m)
