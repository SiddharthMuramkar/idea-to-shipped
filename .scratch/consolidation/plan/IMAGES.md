# Brief for every image agent

The site **Idea to Shipped** (a free public learning library, repo `/home/user/idea-to-shipped`) needs one **relevant, openly licensed** image per lesson (shown as the lesson's hero band and on its card), from **Wikimedia Commons only**. Lessons and their topics: `/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/plan/course-map.md`, and each lesson's `title:`/`summary:` header in `/home/user/idea-to-shipped/content/<course>/<slug>.md` (read-only for you; other agents are editing those files).

## Searching (one call per lesson, two at most)

Direct API calls from this machine get HTTP 429, so search through the **Firecrawl scrape tool** (`mcp__Firecrawl__firecrawl_scrape`, load it with ToolSearch `select:mcp__Firecrawl__firecrawl_scrape`), with `formats: ["rawHtml"]` and `maxAge: 0`, on this URL (put your terms in `gsrsearch`, URL-encoded):

```
https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=<terms>%20filetype:bitmap&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiextmetadatafilter=LicenseShortName|Artist|LicenseUrl|ImageDescription|Restrictions|Categories&iiurlwidth=330
```

Each call costs a credit, so make queries concrete (e.g. `relay race baton`, `traffic light red`, `architectural blueprint`, `compass map`, `Rosetta Stone`, `magnifying glass`, `kanban board`, `server room`, `assembly line`).

## Choosing

Keep only candidates that are:
- **Licensed** CC0, Public domain (any "PD…"/"Public domain"), CC BY (any version) or CC BY-SA (any version). Nothing else (no GFDL-only, no "fair use", no unknown).
- **Big and wide enough**: original width ≥ 1200 px and landscape (width/height ≥ 1.25).
- **Safe**: no `Restrictions` value (trademarked, personality rights…), not a logo, not a screenshot of non-free software, no watermark or big text, not AI-generated (skip anything mentioning AI-generated, Stable Diffusion, DALL-E, Midjourney in title, description or categories), and no identifiable private person as the main subject (historic public-domain pictures are fine).
- **Relevant**: it should clearly suggest the lesson's idea, literally (a real git branch diagram, a server rack, a code editor of free software) or as a clear metaphor (a relay baton for a handoff, red/green traffic lights for red→green tests, a blueprint for a spec, ticket stubs for Tickets, a map and compass for wayfinding, the Rosetta Stone for a shared language, triage tags for triage). It must read well both as a wide hero and as a small card thumbnail.

Look before you pick: download the best 2 or 3 candidates' 330 px previews and view them with the Read tool:

```sh
/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/tools/fetch-image.sh "<thumburl>" /tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/images/previews/<slug>-1.jpg 330
```

(The helper retries when Wikimedia rate-limits; downloads one at a time, not in parallel.) No file may be used twice across the whole site: check `ls /home/user/idea-to-shipped/public/images/**` and the other agents' credits files in `/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/images/` before you save.

## Saving

```sh
/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/tools/fetch-image.sh "<thumburl or url>" /home/user/idea-to-shipped/public/images/lessons/<slug>.jpg 1280
```

(Courses: `public/images/courses/<course-slug>.jpg`; home page: `public/images/home/<name>.jpg`, both at 1920 when the original is that wide, else 1280.) The result should be ≤ 400 KB; if bigger, re-run `convert <file> -quality 72 <file>`.

Record every saved image in **your own** credits file, `/tmp/claude-0/-home-user/74a692da-26dd-57ab-b4f9-90621aaa7a8a/scratchpad/images/credits-<your-agent-name>.json`, as one JSON object keyed by the public path:

```json
{
  "/images/lessons/tdd.jpg": {
    "title": "Traffic lights in Hong Kong",
    "author": "Jane Doe",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Traffic_lights_in_Hong_Kong.jpg",
    "alt": "A traffic light showing red above green against a grey sky."
  }
}
```

- `title`: the file name without `File:` and extension, underscores as spaces.
- `author`: the `Artist` value as plain text (strip HTML tags; for public-domain works with an unknown author write "Unknown author").
- `license`: `LicenseShortName` exactly; `licenseUrl`: `LicenseUrl` or null.
- `alt`: what the image shows, for screen readers, ≤ 120 characters, no "image of".

Write the JSON file after every image, so nothing is lost if you stop. Don't edit any lesson file, `content/`, or anything outside `public/images/` and your credits file. Final report (≤ 250 words): count saved, any lesson without a good image, and the total size of your images.
