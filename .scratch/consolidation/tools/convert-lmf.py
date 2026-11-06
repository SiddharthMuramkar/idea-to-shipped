"""Convert learn-matt-flow HTML lessons, part tests and cheat sheets into
idea-to-shipped Markdown drafts (typed fences) in a staging folder.

    python3 -I convert-lmf.py <staging-dir>

Drafts still need a human/agent pass: Care4Mind specifics, cross-references
like "section 5", and option counts outside 3-6 are flagged in report.json.
"""
import json, re, sys, html
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path("/home/user/learn-matt-flow")
OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)

SLUGS = {
    "0001": "wayfinder-first-session",
    "0002": "reading-a-repository",
    "0003": "working-the-map",
    "0004": "answers-from-other-people",
    "0005": "after-the-map",
    "0006": "branches-and-worktrees",
    "0007": "commits-and-diffs",
    "0008": "pull-requests",
    "0009": "undo-and-conflicts",
    "0010": "what-ci-cd-is",
    "0011": "reading-a-workflow",
    "0012": "gates",
    "0013": "lab-gated-pipeline",
    "0014": "spec-driven-build-loop",
    "0015": "agents-in-github-actions",
    "0016": "your-projects-pipeline",
    "0017": "one-change-start-to-finish",
}


def lesson_link(href):
    m = re.search(r"(\d{4})-[a-z0-9-]+\.html(#[\w-]+)?$", href or "")
    if m and m.group(1) in SLUGS:
        return f"/learn/{SLUGS[m.group(1)]}"
    return None


def inline(node, sources):
    """Inline Markdown for a tag's children."""
    out = []
    for child in node.children:
        if isinstance(child, NavigableString):
            out.append(re.sub(r"\s+", " ", str(child)))
            continue
        name = child.name
        cls = child.get("class") or []
        if name == "sup" and "n" in cls:
            continue
        if name == "aside" and "sidenote" in cls:
            collect_note(child, sources)
            continue
        text = inline(child, sources)
        if name in ("strong", "b"):
            out.append(f"**{text.strip()}**" if text.strip() else "")
        elif name in ("em", "i"):
            out.append(f"_{text.strip()}_" if text.strip() else "")
        elif name == "code":
            t = child.get_text()
            tick = "``" if "`" in t else "`"
            out.append(f"{tick}{t}{tick}")
        elif name == "a":
            href = child.get("href", "")
            target = lesson_link(href) or (href if href.startswith("https://") else None)
            out.append(f"[{text.strip()}]({target})" if target else text)
        elif name == "br":
            out.append(" ")
        else:
            out.append(text)
    return "".join(out)


def collect_note(aside, sources):
    for a in aside.find_all("a"):
        href = a.get("href", "")
        if href.startswith("https://"):
            sources.setdefault(href, a.get_text(" ", strip=True))


def code_block(pre):
    code = pre.find("code") or pre
    has_diff = bool(code.select("span.add, span.del"))
    lines = []
    if has_diff:
        for part in code.decode_contents().split("\n"):
            frag = BeautifulSoup(part, "html.parser")
            text = frag.get_text()
            if frag.select_one("span.add") and not text.startswith("+"):
                text = "+" + text
            elif frag.select_one("span.del") and not text.startswith("-"):
                text = "-" + text
            lines.append(text)
        body = "\n".join(lines)
    else:
        body = code.get_text()
    lang = "diff" if has_diff else "text"
    if re.search(r"^\s*(git|npm|npx|gh|claude|cd|ls|cat|curl|vercel)\b", body, re.M):
        lang = "diff" if has_diff else "sh"
    if re.search(r"^\s*(on|jobs|steps|name):", body, re.M):
        lang = "yaml"
    fence = "````" if "```" in body else "```"
    return f"{fence}{lang}\n{body.rstrip()}\n{fence}"


def table(tbl, sources):
    rows = []
    for tr in tbl.find_all("tr"):
        cells = [inline(c, sources).strip().replace("|", "\\|") for c in tr.find_all(["th", "td"])]
        rows.append(cells)
    if not rows:
        return ""
    width = max(len(r) for r in rows)
    rows = [r + [""] * (width - len(r)) for r in rows]
    lines = ["| " + " | ".join(rows[0]) + " |", "|" + "---|" * width]
    lines += ["| " + " | ".join(r) + " |" for r in rows[1:]]
    return "\n".join(lines)


def listing(lst, sources, depth=0):
    out = []
    ordered = lst.name == "ol"
    for i, li in enumerate(lst.find_all("li", recursive=False), 1):
        nested = [c for c in li.children if isinstance(c, Tag) and c.name in ("ul", "ol")]
        for n in nested:
            n.extract()
        text = inline(li, sources).strip()
        bullet = f"{i}." if ordered else "-"
        out.append("  " * depth + f"{bullet} {text}")
        for n in nested:
            out.append(listing(n, sources, depth + 1))
    return "\n".join(out)


def quiz_blocks(div, kind, prefix, counter, report):
    script = div.find("script")
    data = json.loads(script.string)
    shared = data.get("options")
    blocks = []
    for q in data["questions"]:
        opts = q.get("options") or shared
        counter[0] += 1
        qid = f"{prefix}-{counter[0]}"
        if not (3 <= len(opts) <= 6):
            report.setdefault("option_counts", []).append(f"{qid}: {len(opts)} options")
        def clean(t):
            t = BeautifulSoup(t, "html.parser")
            return inline(t, {}).strip()
        lines = ["```" + f"{kind} {qid}", clean(q["q"])]
        for i, o in enumerate(opts):
            lines.append(f"- [{'x' if i == q['answer'] else ' '}] {clean(o)}")
        lines.append(f"Why: {clean(q['why'])}")
        lines.append("```")
        blocks.append("\n".join(lines))
    return blocks


def stages(div, sources):
    out = []
    for i, st in enumerate(div.select("section.stage"), 1):
        when = st.select_one(".when")
        title = st.find("h3")
        cmd = st.select_one(".stage-head pre")
        head = f"{i}. **{inline(title, sources).strip()}**" if title else f"{i}."
        if when:
            head += f" ({inline(when, sources).strip()})"
        if cmd:
            head += f": `{cmd.get_text().strip()}`"
        out.append(head)
        body = st.select_one(".stage-body")
        if body:
            for li in body.find_all("li"):
                out.append(f"   - {inline(li, sources).strip()}")
            for p in body.find_all("p", recursive=False):
                out.append(f"   - {inline(p, sources).strip()}")
    return "\n".join(out)


def convert(path, slug, kind_of_file="lesson"):
    soup = BeautifulSoup(path.read_text(), "html.parser")
    main = soup.find("main") or soup.body
    sources = {}
    report = {}
    parts = []
    title = soup.find("h1").get_text(" ", strip=True)
    counter = [0]
    section = ""
    sub = ""

    def walk(el):
        nonlocal section, sub
        if not isinstance(el, Tag):
            return
        name = el.name
        cls = el.get("class") or []
        if name in ("nav", "footer", "script", "h1") or "kicker" in cls or "arrow" in cls:
            return
        if "dek" in cls:
            parts.append(inline(el, sources).strip())
        elif "goal" in cls:
            g = inline(el, sources).strip()
            g = re.sub(r"^\*\*By the end\*\*\s*", "", g)
            parts.append("```goals\n- " + g[0].upper() + g[1:] + "\n```")
        elif name == "h2":
            section = el.get_text(" ", strip=True)
            sub = ""
            parts.append(f"## {inline(el, sources).strip()}")
        elif name == "h3":
            sub = el.get_text(" ", strip=True)
            if sub.lower().startswith("check this section"):
                return
            parts.append(f"### {inline(el, sources).strip()}")
        elif name == "p":
            t = inline(el, sources).strip()
            if t:
                parts.append(t)
        elif name in ("ul", "ol"):
            parts.append(listing(el, sources))
        elif name == "pre":
            parts.append(code_block(el))
        elif name == "dl":
            for dt in el.find_all("dt"):
                dd = dt.find_next_sibling("dd")
                parts.append(f"**{inline(dt, sources).strip()}**: {inline(dd, sources).strip() if dd else ''}")
        elif name == "table":
            parts.append(table(el, sources))
        elif name == "aside" and "sidenote" in cls:
            collect_note(el, sources)
        elif "callout" in cls:
            if "ask" in cls:
                return
            label = el.find(class_="label")
            label_text = label.get_text(" ", strip=True) if label else ""
            if label:
                label.extract()
            tone = "remember" if "remember" in cls else "watch-out"
            inner = []
            for c in el.children:
                if isinstance(c, Tag):
                    if c.name == "p":
                        inner.append(inline(c, sources).strip())
                    elif c.name in ("ul", "ol"):
                        inner.append(listing(c, sources))
                    elif c.name == "pre":
                        inner.append(code_block(c))
            if tone == "watch-out" and label_text and label_text.lower() not in ("heads-up",):
                inner.insert(0, f"**{label_text}.**")
            parts.append(f"```callout {tone}\n" + "\n\n".join(inner) + "\n```")
        elif "quiz" in cls:
            low = (sub or section).lower()
            if "check yourself" in low or kind_of_file == "test":
                kind, prefix = "final-test", "final"
            elif "practice" in low:
                kind, prefix = "checkpoint", "practice"
            else:
                kind, prefix = "checkpoint", "check"
            parts.extend(quiz_blocks(el, kind, prefix, counter, report))
        elif "stages" in cls:
            parts.append(stages(el, sources))
        elif "copy-block" in cls or "table-wrap" in cls or "with-note" in cls or name in ("div", "section", "article", "main"):
            for c in el.children:
                walk(c)
        else:
            t = inline(el, sources).strip()
            if t:
                parts.append(t)
                report.setdefault("unknown_tags", []).append(name)

    for child in main.children:
        walk(child)

    body = "\n\n".join(p for p in parts if p.strip())
    if sources:
        body += "\n\n```sources\n" + "\n".join(f"- [{t or u}]({u})" for u, t in sources.items()) + "\n```"
    header = f"---\ntitle: {title}\nslug: {slug}\n---\n\n"
    flags = sorted(set(re.findall(r"Care4Mind|project1|care4mind|Desktop|SiddharthMuramkar", body)))
    report["private_mentions"] = flags
    report["words"] = len(re.sub(r"```.*?```", " ", body, flags=re.S).split())
    return header + body + "\n", report


reports = {}
for f in sorted((ROOT / "lessons").glob("*.html")):
    num = f.name[:4]
    text, rep = convert(f, SLUGS[num])
    (OUT / "lessons").mkdir(exist_ok=True)
    (OUT / "lessons" / f"{num}-{SLUGS[num]}.md").write_text(text)
    reports[f.name] = rep
for f in sorted((ROOT / "tests").glob("*.html")):
    text, rep = convert(f, f.stem, "test")
    (OUT / "tests").mkdir(exist_ok=True)
    (OUT / "tests" / f"{f.stem}.md").write_text(text)
    reports[f.name] = rep
for f in sorted((ROOT / "reference").glob("*.html")):
    text, rep = convert(f, f.stem, "reference")
    (OUT / "reference").mkdir(exist_ok=True)
    (OUT / "reference" / f"{f.stem}.md").write_text(text)
    reports[f.name] = rep
(OUT / "report.json").write_text(json.dumps(reports, indent=2))
for k, v in reports.items():
    print(k, v.get("words"), "opts:", len(v.get("option_counts", [])), "unknown:", sorted(set(v.get("unknown_tags", []))), "private:", v.get("private_mentions"))
