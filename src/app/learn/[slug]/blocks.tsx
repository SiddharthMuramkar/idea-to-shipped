import type { Block } from "@/lessons/lessons";
import { htmlToText } from "@/lessons/markdown";
import { CopyButton } from "./copy-button";
import { Icon, type IconName } from "./icons";
import { Checkpoint, FinalTest } from "./question";
import { SceneRun } from "./scene";

// What every block on a Lesson page may need to know about the page.
export type LessonContext = {
  slug: string;
  // Each Checkpoint's place in the Lesson ("Checkpoint 2 of 5").
  checkpoints: Map<string, number>;
};

const CALLOUTS: Record<"tip" | "watch-out" | "big-idea", { label: string; icon: IconName }> = {
  tip: { label: "Tip", icon: "tip" },
  "watch-out": { label: "Watch out", icon: "watch-out" },
  "big-idea": { label: "Big idea", icon: "big-idea" },
};

// The small label at the top of a box: an icon and a word.
function BlockLabel({ icon, children }: { icon: IconName; children: string }) {
  return (
    <p className="block-label">
      <Icon name={icon} />
      {children}
    </p>
  );
}

type Part = { type: "html"; html: string } | { type: "code"; html: string; text: string };

const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

// Splits rendered Markdown into its top-level code blocks and the HTML
// between them, so each code block can get a Copy button. Only top-level
// <pre>s are split out (a code block inside a list item stays where it is,
// without a button), so the HTML around them is never cut in half.
function splitCodeBlocks(html: string): Part[] {
  const parts: Part[] = [];
  const tags = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g;
  let depth = 0;
  let from = 0;
  const push = (part: Part) => {
    if (part.type === "code" || part.html.trim() !== "") parts.push(part);
  };
  for (let match = tags.exec(html); match; match = tags.exec(html)) {
    const [tag, closing, rawName] = match;
    const name = rawName.toLowerCase();
    if (VOID_TAGS.has(name) || tag.endsWith("/>")) continue;
    if (closing) {
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (name !== "pre" || depth > 0) {
      depth++;
      continue;
    }
    const end = html.indexOf("</pre>", match.index);
    if (end === -1) break;
    const stop = end + "</pre>".length;
    const pre = html.slice(match.index, stop);
    push({ type: "html", html: html.slice(from, match.index) });
    // marked escapes code as HTML entities; the clipboard wants the text.
    const code = /<code[^>]*>([\s\S]*?)<\/code>/.exec(pre)?.[1] ?? pre;
    push({ type: "code", html: pre, text: htmlToText(code).replace(/\n$/, "") });
    from = stop;
    tags.lastIndex = stop;
  }
  push({ type: "html", html: html.slice(from) });
  return parts;
}

function Goals({ itemsHtml, slug }: { itemsHtml: string[]; slug: string }) {
  const headingId = `${slug}--goals`;
  return (
    <section className="goals" aria-labelledby={headingId} data-goals data-reveal-children>
      <BlockLabel icon="check">Your goals</BlockLabel>
      <h2 id={headingId} className="goals-title">
        By the end of this Lesson
      </h2>
      <ul className="goals-list" data-reveal-children>
        {itemsHtml.map((html, i) => (
          <li key={i} className="goal">
            {/* An empty circle now; ticket 05 draws the tick once the Final
                test is passed. */}
            <svg className="goal-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10" />
              <path className="goal-tick" d="m7.5 12.5 3 3 6-6.5" pathLength={1} />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Callout({ tone, html }: { tone: keyof typeof CALLOUTS; html: string }) {
  const { label, icon } = CALLOUTS[tone];
  return (
    <aside className={`callout callout--${tone}`} data-reveal>
      <BlockLabel icon={icon}>{label}</BlockLabel>
      <div className="prose callout-body" dangerouslySetInnerHTML={{ __html: html }} />
    </aside>
  );
}

// "Your turn": an exercise, with a Copy button on each of its code blocks.
function Try({ html }: { html: string }) {
  return (
    <div className="try" data-reveal>
      <BlockLabel icon="try">Your turn</BlockLabel>
      <div className="prose try-body">
        {splitCodeBlocks(html).map((part, i) =>
          part.type === "html" ? (
            <div key={i} className="html-part" dangerouslySetInnerHTML={{ __html: part.html }} />
          ) : (
            <div key={i} className="code-block">
              <div className="html-part" dangerouslySetInnerHTML={{ __html: part.html }} />
              <CopyButton text={part.text} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function SiteStory({ html }: { html: string }) {
  return (
    <aside className="site-story" data-reveal>
      <BlockLabel icon="story">How I used it building this site</BlockLabel>
      <div className="prose site-story-body" dangerouslySetInnerHTML={{ __html: html }} />
    </aside>
  );
}

function Sources({ html }: { html: string }) {
  return (
    <aside className="sources" aria-label="Sources">
      <BlockLabel icon="sources">Sources</BlockLabel>
      <div className="sources-list" dangerouslySetInnerHTML={{ __html: html }} />
    </aside>
  );
}

// One block, in its final state. `sceneId` names the Section's Scene (a
// Section has at most one), so its ids are unique on the page.
export function BlockView({ block, ctx, sceneId }: { block: Block; ctx: LessonContext; sceneId: string }) {
  switch (block.type) {
    case "prose":
      // Each paragraph, list and table fades in on its own (see reveal.tsx).
      return <div className="prose" data-reveal-children dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "goals":
      return <Goals itemsHtml={block.itemsHtml} slug={ctx.slug} />;
    case "scene":
      return <SceneRun scene={block.scene} id={sceneId} />;
    case "checkpoint":
      return (
        <Checkpoint
          question={block.question}
          slug={ctx.slug}
          number={ctx.checkpoints.get(block.question.id) ?? 1}
          total={ctx.checkpoints.size}
        />
      );
    case "finalTest":
      return <FinalTest questions={block.questions} slug={ctx.slug} id={`${ctx.slug}--final-test`} titleHtml="Final test" />;
    case "callout":
      return <Callout tone={block.tone} html={block.html} />;
    case "try":
      return <Try html={block.html} />;
    case "siteStory":
      return <SiteStory html={block.html} />;
    case "sources":
      return <Sources html={block.html} />;
  }
}
