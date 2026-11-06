"""Lay out content/ for the merged site from plan/courses.json and the staged drafts.

    python3 -I build-skeleton.py
"""
import json, re, subprocess
from pathlib import Path

SCRATCH = Path("/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad")
REPO = Path("/home/user/idea-to-shipped")
CONTENT = REPO / "content"
STAGING = SCRATCH / "staging"
courses = json.loads((SCRATCH / "plan/courses.json").read_text())


def plain(md):
    md = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", md)
    md = md.replace("**", "").replace("`", "")
    md = re.sub(r"(^|\W)_(\S.*?\S)_(?=\W|$)", r"\1\2", md)
    return re.sub(r"\s+", " ", md).strip()


def split(raw):
    m = re.match(r"^---\n(.*?)\n---\n?(.*)$", raw, re.S)
    return (m.group(1), m.group(2)) if m else ("", raw)


def summary_from(body, kind):
    if kind == "skills":
        first = body.split("\n## ", 2)
        part = first[1] if len(first) > 1 else body
        m = re.search(r"\*\*([^*]+?[.!?])\*\*", part)
        if m:
            return plain(m.group(1))
    if kind == "lmf":
        m = re.search(r"```goals\n- (.+)", body)
        if m:
            s = plain(m.group(1))
            s = re.sub(r"^You[’']ll be able to ", "", s)
            s = s[0].upper() + s[1:]
            return s.split(". ")[0].rstrip(".") + "."
    # Old lessons: the first intro paragraph.
    for para in body.split("\n\n"):
        p = para.strip()
        if p and not p.startswith(("```", "#", "-", "|", ">")):
            return plain(p)
    return ""


def clip(s, n=200):
    s = s.strip()
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(" ", 1)[0].rstrip(",;:")
    return cut + "…"


def old_lesson(slug):
    return subprocess.run(["git", "show", f"HEAD:content/idea-to-shipped/{slug}.md"], cwd=REPO,
                          capture_output=True, text=True, check=True).stdout


# Remove the old Course's lesson files; the folder stays for the new idea-to-shipped course.
for f in (CONTENT / "idea-to-shipped").glob("*.md"):
    f.unlink()

for course in courses:
    folder = CONTENT / course["slug"]
    folder.mkdir(parents=True, exist_ok=True)
    lines = [
        "---",
        f"title: {course['title']}",
        f"slug: {course['slug']}",
        f"description: {course['description']}",
        f"order: {course['order']}",
        "---",
        "",
    ]
    for part in course["parts"]:
        listed = []
        for lesson in part["lessons"]:
            draft = lesson["draft"]
            if not draft:
                continue
            if draft.startswith("old:"):
                raw = old_lesson(draft[4:])
                kind = "old"
            else:
                raw = (STAGING / draft).read_text()
                kind = draft.split("/")[0]
            header, body = split(raw)
            keep = [l for l in header.split("\n") if l.split(":", 1)[0].strip() not in ("title", "slug", "image", "imageAlt", "imageCredit", "summary")]
            summary = clip(summary_from(body, kind))
            new_header = [f"title: {lesson['title']}", f"slug: {lesson['slug']}", f"summary: {summary}"] + [k for k in keep if k.strip()]
            (folder / f"{lesson['slug']}.md").write_text("---\n" + "\n".join(new_header) + "\n---\n\n" + body.lstrip("\n"))
            listed.append(lesson["slug"])
        if listed:
            lines.append(f"## {part['title']}")
            lines += [f"- {s}" for s in listed]
            lines.append("")
    (folder / "course.md").write_text("\n".join(lines).rstrip() + "\n")
    print(course["slug"], sum(1 for _ in folder.glob("*.md")) - 1, "lessons")
