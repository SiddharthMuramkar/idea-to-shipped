import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { parseDiagram } from "@/lessons/diagrams";
import { DiagramView } from "./diagram";

// DiagramView draws a parsed Diagram as server HTML: a figure named by its
// caption, its words as real lists and tables, and its lines, arrows and dots
// hidden from screen readers, which get words for them instead.

const render = (yaml: string) => renderToStaticMarkup(<DiagramView diagram={parseDiagram("lesson.md", yaml)} />);

const count = (html: string, pattern: RegExp) => html.match(new RegExp(pattern, "g"))?.length ?? 0;

// A CSS module class, which Vitest names `_<class>_<hash>`.
const withClass = (name: string) => new RegExp(`class="[^"]*\\b_${name}_\\w+`);

// The words only screen readers get.
const hidden = (html: string) =>
  [...html.matchAll(/<span class="visually-hidden">([^<]*)<\/span>/g)].map(([, words]) => words);

describe("every Diagram", () => {
  const html = render('type: cycle\ncaption: "The **red** loop"\nsteps: ["Red", "Green", "Refactor"]');

  test("is a figure whose caption is its accessible name", () => {
    const labelledBy = /<figure [^>]*aria-labelledby="([^"]+)"/.exec(html)?.[1];
    expect(labelledBy).toBeTruthy();
    expect(html).toContain(`<figcaption id="${labelledBy}"`);
    expect(html).toMatch(/<figcaption [^>]*>The <strong>red<\/strong> loop<\/figcaption>/);
  });

  test("fades in like the Lesson's other boxes, and says its type", () => {
    expect(html).toMatch(/<figure [^>]*data-diagram="cycle"[^>]*data-reveal="true"/);
  });

  test("gives each figure on a page its own caption id", () => {
    const yaml = 'type: cycle\ncaption: "Loop"\nsteps: ["Red", "Green", "Refactor"]';
    const diagram = parseDiagram("lesson.md", yaml);
    const page = renderToStaticMarkup(
      <>
        <DiagramView diagram={diagram} />
        <DiagramView diagram={diagram} />
      </>,
    );
    const ids = [...page.matchAll(/<figcaption id="([^"]+)"/g)].map(([, id]) => id);
    expect(new Set(ids).size).toBe(2);
  });
});

describe("chain", () => {
  const SHORT = `type: chain
caption: "Grill the plan first."
steps:
  - "Grill the plan first."
  - "[to-spec](/learn/to-spec)"
  - "[to-tickets](/learn/to-tickets)"
  - label: "Each Ticket"
    note: "starts in a fresh session"
groups:
  - from: 1
    to: 3
    label: "all in the same session"`;

  test("is an ordered list of its steps, a group's steps a list of their own beside its bracket", () => {
    const html = render(SHORT);
    expect(html).toMatch(/^<figure [^>]*><div [^>]*><ol /);
    expect(count(html, /<li /)).toBe(5); // the group, its 3 steps, then the last step
    expect(html).toMatch(/<span class="[^"]*_bracket_\w+"><span>all in the same session<\/span><\/span>/);
    expect(html).toContain("starts in a fresh session");
  });

  test("draws an arrow into every step but the first", () => {
    expect(count(render(SHORT), withClass("arrowed"))).toBe(3);
  });

  test("keeps a step's link to its Lesson", () => {
    expect(render(SHORT)).toContain('<a href="/learn/to-spec">to-spec</a>');
  });

  test("goes across with at most 4 steps of at most 24 characters as shown, and down otherwise", () => {
    expect(render(SHORT)).toMatch(withClass("across"));
    const fiveSteps = SHORT.replace('  - label: "Each Ticket"', '  - "Then review"\n  - label: "Each Ticket"');
    expect(render(fiveSteps)).not.toMatch(withClass("across"));
    const longLabel = SHORT.replace('"Grill the plan first."\n  -', '"Grill the plan first, all of it."\n  -');
    expect(render(longLabel)).not.toMatch(withClass("across"));
  });

  test("draws a parallel step's boxes as a list in one step's place", () => {
    const html = render('type: chain\ncaption: "Both at once"\nsteps:\n  - "Start"\n  - parallel: ["Standards", "Spec"]');
    expect(html).toMatch(/<ul class="[^"]*_parallel_\w+"><li [^>]*>.*Standards.*<\/li><li [^>]*>.*Spec.*<\/li><\/ul>/);
  });
});

describe("compare", () => {
  const html = render(`type: compare
caption: "Mechanical or a judgement call?"
columns: ["A mechanical rule", "A judgement call"]
rows:
  - label: "becomes"
    cells: ["a check that runs on every change", "a written standard"]
  - label: "a check"
    cells: ["yes", "no"]
  - label: "a reviewer"
    cells: ["", "yes"]
footer: "When in doubt, build the check."`);

  test("is a table with a header per column and a header per labelled row", () => {
    expect(html).toContain("<table");
    expect(count(html, /<th scope="col">/)).toBe(2);
    expect(count(html, /<th scope="row">/)).toBe(3);
    expect(html).toMatch(/<thead><tr><td><\/td><th scope="col">A mechanical rule<\/th>/);
  });

  test('draws "yes" and "no" as a check and a cross that screen readers hear as words, and "" as a silent dash', () => {
    expect(count(html, /<svg [^>]*aria-hidden="true"/)).toBe(4);
    expect(hidden(html)).toEqual(["yes", "no", "yes"]);
  });

  test("puts its footer under every column", () => {
    expect(html).toContain('<tfoot><tr><td colSpan="3">When in doubt, build the check.</td></tr></tfoot>');
  });

  test("has no row headers when no row has a label", () => {
    const three = render(
      'type: compare\ncaption: "Three"\ncolumns: ["one", "two", "three"]\nrows:\n  - cells: ["a", "b", "c"]',
    );
    expect(count(three, /<th scope="row">/)).toBe(0);
    expect(three).toMatch(/<thead><tr><th scope="col">one<\/th>/);
  });
});

describe("tree", () => {
  const html = render(`type: tree
caption: "Close #12, and #13 is next."
root:
  label: "Booking API"
  note: "Its sub-issues show which Tickets are closed."
nodes:
  - label: "#12 adds the bookings table"
    state: closed
  - label: "#13 adds the endpoint"
    state: frontier
    children:
      - label: "a pull request that closes #13"
links:
  - from: "#13 adds the endpoint"
    to: "#12 adds the bookings table"
    label: "blocked by"`);

  test("is nested lists, from the root down", () => {
    expect(count(html, /<ul /)).toBe(3);
    expect(count(html, /<li /)).toBe(4);
  });

  test("says each node's state in words, and ticks the done ones", () => {
    expect(hidden(html)).toEqual([" (closed)", " (frontier)"]);
    expect(html).toMatch(withClass("frontier"));
    expect(count(html, withClass("treeCheck"))).toBe(1);
  });

  test("hangs a link under its from node: an arrow, its label and the node it points to", () => {
    expect(html).toMatch(
      /<span class="[^"]*_link_\w+"><svg [^>]*aria-hidden="true".*?<\/svg><span><span>blocked by<\/span> <span class="[^"]*_linkTo_\w+">#12 adds the bookings table<\/span><\/span><\/span>/,
    );
  });
});

describe("layers", () => {
  const LAYERS = `type: layers
caption: "These names nest inside each other."
mode: nested
layers:
  - label: "GitHub Actions"
    children:
      - label: "A workflow"
        note: "one automated process"`;

  test("nested: boxes in boxes, as lists in lists", () => {
    const html = render(LAYERS);
    expect(html).toMatch(/<ul class="[^"]*_nested_\w+"><li [^>]*>.*GitHub Actions.*<ul class="[^"]*_inside_\w+"><li /);
    expect(html).toContain("one automated process");
  });

  test("stacked: an ordered list, top to bottom", () => {
    expect(render(LAYERS.replace("mode: nested", "mode: stacked"))).toMatch(/<ol class="[^"]*_stacked_\w+">/);
  });
});

describe("git", () => {
  const html = render(`type: git
caption: "one draft PR from the shared branch"
branches:
  - name: "\`main\`"
    commits: 2
  - name: "one shared branch"
    from: { branch: "\`main\`", after: 1 }
    commits: 1
    merge: { into: "\`main\`", label: "when that PR merges into main" }
  - name: "each Ticket's branch"
    from: { branch: "one shared branch", after: 1 }
    commits: 2
    merge: { into: "one shared branch", label: "Those merges close nothing." }
worktrees:
  - branch: "each Ticket's branch"
    label: "its own worktree"`);

  test("is a list of lanes, one per branch, with its name and worktree", () => {
    expect(count(html, withClass("lane"))).toBe(3);
    expect(html).toContain("<code>main</code>");
    expect(html).toMatch(/<span class="[^"]*_worktree_\w+">its own worktree<\/span>/);
  });

  test("draws its lines and dots in SVG that screen readers skip, a dot per commit and per merge", () => {
    expect(count(html, /<svg [^>]*aria-hidden="true"/)).toBe(3);
    expect(count(html, /<circle /)).toBe(2 + 1 + 2 + 2);
  });

  test("tells screen readers where each branch starts and what it merges into", () => {
    expect(hidden(html)).toEqual([
      " (branches off main, merges into main)",
      " (branches off one shared branch, merges into one shared branch)",
    ]);
  });

  test("labels its merges, and says its commit counts are illustrative", () => {
    expect(html).toContain("when that PR merges into main");
    expect(html).toContain("Those merges close nothing.");
    expect(html).toContain("(commit counts are illustrative)");
  });
});

describe("cycle", () => {
  const html = render(`type: cycle
caption: "Refactoring happens outside the loop"
steps: ["Red: write one test that fails", "Green: write only enough code to pass", "Then the next test."]
outside: "Refactoring"`);

  test("is an ordered list of its steps, with the way back said in words", () => {
    expect(count(html, /<li /)).toBe(3);
    expect(hidden(html)).toEqual([" (then back to the first step)", "Outside the loop: "]);
  });

  test("draws the return arrow beside each step, hidden from screen readers", () => {
    expect(count(html, /<span class="[^"]*_back_\w+" aria-hidden="true">/)).toBe(3);
  });

  test("puts the box outside the loop after it", () => {
    expect(html).toMatch(/<\/ol><div class="[^"]*_outside_\w+">.*Refactoring/);
  });
});
