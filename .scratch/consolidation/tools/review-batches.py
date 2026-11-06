"""Build the review workflows' inputs: batches of lessons with their sources
(from plan/course-map.md) and the flagged claims (from plan/review-notes.md).

    python3 -I review-batches.py > plan/review-batches.json
"""
import json, re
from pathlib import Path

PLAN = Path("/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/plan")
courses = json.loads((PLAN / "courses.json").read_text())
cmap = (PLAN / "course-map.md").read_text()
notes = (PLAN / "review-notes.md").read_text().splitlines()

lessons = []
for course in courses:
    for part in course["parts"]:
        for lesson in part["lessons"]:
            slug = lesson["slug"]
            line = next((l for l in cmap.splitlines() if l.startswith(f"- `{slug}` —")), "")
            flagged = [n.lstrip("- ").strip() for n in notes if re.search(rf"(?<![a-z-]){re.escape(slug)}(?![a-z-])", n)]
            lessons.append({
                "course": course["slug"],
                "courseTitle": course["title"],
                "part": part["title"],
                "slug": slug,
                "file": f"content/{course['slug']}/{slug}.md",
                "sources": line.split("—", 1)[1].strip() if "—" in line else "",
                "flagged": flagged,
            })

# Batches of at most 9, never mixing Courses.
batches = []
for course in courses:
    group = [l for l in lessons if l["course"] == course["slug"]]
    n = max(1, -(-len(group) // 9))
    size = -(-len(group) // n)
    for i in range(0, len(group), size):
        batches.append({"name": f"{course['slug']}-{i // size + 1}", "lessons": group[i:i + size]})
print(json.dumps(batches, indent=1, ensure_ascii=False))
