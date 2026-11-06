import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { gitLayout, parseDiagram } from "./diagrams";

// Diagrams (content/<course>/<lesson>.md, ```diagram blocks): parseDiagram
// reads one block's YAML, checks it against its type's shape and limits, and
// renders its strings to HTML.

const FILE = "content/course/lesson.md";

// The message parseDiagram throws for this YAML.
function problemWith(yaml: string): string {
  try {
    parseDiagram(FILE, yaml);
  } catch (error) {
    return (error as Error).message;
  }
  throw new Error(`expected a problem with:\n${yaml}`);
}

// Every ```diagram block in content/, with where it is, so each one is its own
// test and a broken one names its file and line.
function contentDiagrams(): { where: string; file: string; yaml: string }[] {
  const root = path.join(process.cwd(), "content");
  const found: { where: string; file: string; yaml: string }[] = [];
  for (const entry of readdirSync(root, { recursive: true, encoding: "utf8" }).sort()) {
    if (!entry.endsWith(".md")) continue;
    const file = path.join("content", entry);
    const text = readFileSync(path.join(root, entry), "utf8");
    for (const match of text.matchAll(/^```diagram[ \t]*\n([\s\S]*?)^```[ \t]*$/gm)) {
      const line = text.slice(0, match.index).split("\n").length;
      found.push({ where: `${file}:${line}`, file, yaml: match[1] });
    }
  }
  return found;
}

const inContent = contentDiagrams();
if (inContent.length > 0) {
  test.each(inContent.map((block) => [block.where, block] as const))("the diagram at %s parses", (_, { file, yaml }) => {
    expect(() => parseDiagram(file, yaml)).not.toThrow();
  });
}

// One valid Diagram of each type, using every field (the skills site's own
// examples).
const VALID = {
  chain: {
    caption: "all in one window",
    yaml: `type: chain
caption: "all in one window"
steps:
  - "the grilling"
  - label: "the Spec"
    note: "at the same time"
  - parallel: ["Standards", "Spec"]
  - "a fresh window for each Ticket"
groups:
  - from: 1
    to: 2
    label: "in one window"`,
  },
  compare: {
    caption: "Mechanical or a judgement call?",
    yaml: `type: compare
caption: "Mechanical or a judgement call?"
columns: ["mechanical", "judgement call"]
rows:
  - label: "A check"
    cells: ["yes", "no"]
  - label: "a written standard"
    cells: ["", "a judgement call"]
footer: "When in doubt, build the check."`,
  },
  tree: {
    caption: "Close #12, and #13 is next.",
    yaml: `type: tree
caption: "Close #12, and #13 is next."
root:
  label: "The Booking API"
  note: "two Tickets"
nodes:
  - label: "#12 adds the bookings table"
    state: closed
  - label: "#13 adds the endpoint"
    state: frontier
    children:
      - label: "#13 is next"
        state: settled
links:
  - from: "#13 adds the endpoint"
    to: "#12 adds the bookings table"
    label: "blocked by"`,
  },
  layers: {
    caption: "A workflow is a list of jobs",
    yaml: `type: layers
caption: "A workflow is a list of jobs"
mode: nested
layers:
  - label: "GitHub Actions"
    children:
      - label: "a workflow"
        note: "a list of jobs"
        children:
          - label: "each job"
            children:
              - label: "a list of steps"`,
  },
  git: {
    caption: "Each Ticket gets its own branch",
    yaml: `type: git
caption: "Each Ticket gets its own branch"
branches:
  - name: "\`main\`"
    commits: 2
  - name: "its own branch"
    from: { branch: "\`main\`", after: 1 }
    commits: 2
    merge: { into: "\`main\`", label: "through a pull request" }
worktrees:
  - branch: "its own branch"
    label: "linked worktree"`,
  },
  cycle: {
    caption: "the next test",
    yaml: `type: cycle
caption: "the next test"
steps: ["Red: write one test that fails", "Green: make it pass", "Then the next test."]
outside: "Refactoring"`,
  },
};

type Type = keyof typeof VALID;

// A valid Diagram of this type with one piece of its YAML changed.
function changed(type: Type, from: string | RegExp, to: string): string {
  const { yaml } = VALID[type];
  if (!yaml.match(from)) throw new Error(`The valid ${type} has no ${from}`);
  return yaml.replace(from, to);
}

// The whole message for a problem in a valid Diagram of this type.
const message = (type: Type, problem: string) => `${FILE}: diagram ${type} "${VALID[type].caption}": ${problem}`;

describe("a valid Diagram", () => {
  test.each(Object.keys(VALID) as Type[])("of type %s parses", (type) => {
    expect(parseDiagram(FILE, VALID[type].yaml).type).toBe(type);
  });

  test("chain: its steps, a note, a parallel step and a group", () => {
    expect(parseDiagram(FILE, VALID.chain.yaml)).toEqual({
      type: "chain",
      caption: "all in one window",
      captionHtml: "all in one window",
      steps: [
        { kind: "box", labelHtml: "the grilling", noteHtml: null },
        { kind: "box", labelHtml: "the Spec", noteHtml: "at the same time" },
        { kind: "parallel", boxesHtml: ["Standards", "Spec"] },
        { kind: "box", labelHtml: "a fresh window for each Ticket", noteHtml: null },
      ],
      groups: [{ from: 1, to: 2, labelHtml: "in one window" }],
    });
  });

  test('compare: "yes", "no" and "" are marks, every other cell is text', () => {
    expect(parseDiagram(FILE, VALID.compare.yaml)).toEqual({
      type: "compare",
      caption: "Mechanical or a judgement call?",
      captionHtml: "Mechanical or a judgement call?",
      columnsHtml: ["mechanical", "judgement call"],
      rows: [
        {
          labelHtml: "A check",
          cells: [
            { kind: "mark", mark: "yes" },
            { kind: "mark", mark: "no" },
          ],
        },
        {
          labelHtml: "a written standard",
          cells: [
            { kind: "mark", mark: "" },
            { kind: "text", html: "a judgement call" },
          ],
        },
      ],
      footerHtml: "When in doubt, build the check.",
    });
  });

  test("tree: the root holds the nodes, and a link hangs under the node it's from", () => {
    expect(parseDiagram(FILE, VALID.tree.yaml)).toEqual({
      type: "tree",
      caption: "Close #12, and #13 is next.",
      captionHtml: "Close #12, and #13 is next.",
      root: {
        labelHtml: "The Booking API",
        noteHtml: "two Tickets",
        state: null,
        links: [],
        children: [
          { labelHtml: "#12 adds the bookings table", noteHtml: null, state: "closed", links: [], children: [] },
          {
            labelHtml: "#13 adds the endpoint",
            noteHtml: null,
            state: "frontier",
            links: [{ labelHtml: "blocked by", toHtml: "#12 adds the bookings table" }],
            children: [{ labelHtml: "#13 is next", noteHtml: null, state: "settled", links: [], children: [] }],
          },
        ],
      },
    });
  });

  test("layers: boxes inside boxes", () => {
    const leaf = (labelHtml: string, noteHtml: string | null = null) => ({ labelHtml, noteHtml, children: [] });
    expect(parseDiagram(FILE, VALID.layers.yaml)).toMatchObject({
      type: "layers",
      mode: "nested",
      layers: [
        {
          labelHtml: "GitHub Actions",
          noteHtml: null,
          children: [
            { labelHtml: "a workflow", noteHtml: "a list of jobs", children: [{ labelHtml: "each job", children: [leaf("a list of steps")] }] },
          ],
        },
      ],
    });
  });

  test("git: one lane per branch, with its worktree, and where its commits, forks and merges sit", () => {
    expect(parseDiagram(FILE, VALID.git.yaml)).toEqual({
      type: "git",
      caption: "Each Ticket gets its own branch",
      captionHtml: "Each Ticket gets its own branch",
      lanes: [
        { nameHtml: "<code>main</code>", worktreeHtml: null, commits: [1, 2] },
        { nameHtml: "its own branch", worktreeHtml: "linked worktree", commits: [2, 3] },
      ],
      forks: [{ slot: 1, from: 0, to: 1 }],
      merges: [{ slot: 4, from: 1, to: 0, labelHtml: "through a pull request" }],
      slots: 4,
    });
  });

  test("cycle: its steps and the box outside the loop", () => {
    expect(parseDiagram(FILE, VALID.cycle.yaml)).toEqual({
      type: "cycle",
      caption: "the next test",
      captionHtml: "the next test",
      stepsHtml: ["Red: write one test that fails", "Green: make it pass", "Then the next test."],
      outsideHtml: "Refactoring",
    });
  });

  test("renders each string's inline Markdown, and keeps the caption as plain text too", () => {
    const diagram = parseDiagram(
      FILE,
      changed("chain", /caption: .*\nsteps:\n {2}- "the grilling"/, 'caption: "The **red** step"\nsteps:\n  - "Run `npm test` and read [the loop](/learn/tdd), _twice_"'),
    );
    expect(diagram).toMatchObject({
      caption: "The red step",
      captionHtml: "The <strong>red</strong> step",
      steps: [
        {
          kind: "box",
          labelHtml: 'Run <code>npm test</code> and read <a href="/learn/tdd">the loop</a>, <em>twice</em>',
        },
        {},
        {},
        {},
      ],
    });
  });
});

describe("a Diagram that breaks its type's rules", () => {
  test.each([
    ["chain", "a step that's no kind of step", '  - "the grilling"', "  - 42", 'steps.0: should be a string in double quotes, a "label:" with an optional "note:", or a "parallel:" list of 2 or 3 strings.'],
    ["chain", "a group that doesn't end after it starts", "    to: 2", "    to: 1", "groups.0: starts at step 1 and ends at step 1; a group ends after it starts."],
    ["chain", "a group past the last step", "    to: 2", "    to: 5", "groups.0.to: is step 5, but the chain has 4 steps."],
    ["chain", "groups that overlap", '    label: "in one window"', '    label: "in one window"\n  - from: 2\n    to: 3\n    label: "the Spec"', "groups.1: overlaps groups.0; groups don't overlap."],
    ["compare", "a row without one cell per column", '["yes", "no"]', '["yes"]', "rows.0.cells: has 1 cell for 2 columns; a row has one cell per column."],
    ["compare", "a row label with 3 columns", /columns:[\s\S]*(?=footer)/, 'columns: ["mechanical", "judgement call", "A check"]\nrows:\n  - label: "A check"\n    cells: ["yes", "no", "yes"]\n', "rows.0.label: a compare with 3 columns has no row labels."],
    ["compare", "no rows", /rows:[\s\S]*(?=footer)/, "", "rows: is missing."],
    ["tree", "a state that isn't frontier, settled or closed", "state: closed", "state: done", 'nodes.0.state: is "done"; it must be frontier, settled or closed.'],
    ["tree", "a link to a label no node has", '    to: "#12 adds the bookings table"', '    to: "#12"', 'links.0.to: "#12" isn\'t the label of a node in this tree.'],
    ["tree", "two nodes with one label", '      - label: "#13 is next"', '      - label: "#12 adds the bookings table"', 'nodes.1.children.0.label: "#12 adds the bookings table" is already a node\'s label; each node\'s label is its own.'],
    ["tree", "a root written as a string", /root:\n.*\n.*\n/, 'root: "The Booking API"\n', 'root: should be a mapping of keys to values, not "The Booking API".'],
    ["layers", "a mode that isn't nested or stacked", "mode: nested", "mode: inside", 'mode: is "inside"; it must be nested or stacked.'],
    ["layers", "an empty list of children", /\n {12}children:\n.*$/, "\n            children: []", "layers.0.children.0.children.0.children: has 0 children; the fewest is 1."],
    ["git", "a branch from a branch that isn't before it", 'from: { branch: "`main`"', 'from: { branch: "its own branch"', 'branches.1.from.branch: "its own branch" isn\'t a branch before this one.'],
    ["git", "a start after a commit its branch doesn't have", "after: 1", "after: 3", 'branches.1.from.after: is commit 3, but "`main`" has 2 commits.'],
    ["git", "a merge into a branch that isn't there", 'into: "`main`"', 'into: "release"', 'branches.1.merge.into: "release" isn\'t a branch before this one.'],
    ["git", "two branches with one name", "worktrees:", '  - name: "its own branch"\n    commits: 1\nworktrees:', 'branches.2.name: "its own branch" is already a branch\'s name.'],
    ["git", "a worktree on a branch that isn't there", '  - branch: "its own branch"', '  - branch: "release"', 'worktrees.0.branch: "release" isn\'t a branch in this Diagram.'],
    ["git", "two worktrees on one branch", '    label: "linked worktree"', '    label: "linked worktree"\n  - branch: "its own branch"\n    label: "linked worktree"', 'worktrees.1.branch: "its own branch" already has a worktree; a branch is checked out in one worktree at a time.'],
    ["git", "a commit count that isn't a whole number", "commits: 2", "commits: 1.5", "branches.0.commits: should be a whole number, not 1.5."],
    ["cycle", "a field its type doesn't have", 'outside: "Refactoring"', 'outside: "Refactoring"\nloops: 2', 'has a key it doesn\'t take, "loops": check its spelling, or take it out.'],
    ["cycle", "a step that isn't a string", '"Green: make it pass"', "true", "steps.1: should be a string in double quotes, not true."],
  ] as const)("fails a %s with %s", (type, _what, from, to, problem) => {
    expect(problemWith(changed(type, from, to))).toBe(message(type, problem));
  });

  const steps = (count: number, step: string) => Array.from({ length: count }, () => `  - "${step}"`).join("\n");
  test.each([
    ["chain", "9 steps", '  - "the grilling"', steps(6, "the grilling"), "steps: has 9 steps; the most is 8."],
    ["chain", "1 step", /steps:[\s\S]*/, 'steps: ["the grilling"]', "steps: has 1 step; the fewest is 2."],
    ["chain", "a parallel step of 4", '["Standards", "Spec"]', '["Standards", "Spec", "Standards", "Spec"]', "steps.2.parallel: has 4 boxes; the most is 3."],
    ["compare", "7 rows", '  - label: "A check"', '  - label: "A check"\n    cells: ["yes", "no"]\n'.repeat(5) + '  - label: "A check"', "rows: has 7 rows; the most is 6."],
    ["compare", "4 columns", /columns:[\s\S]*(?=footer)/, 'columns: ["mechanical", "judgement call", "A check", "a written standard"]\nrows:\n  - cells: ["yes", "no", "yes", "no"]\n', "columns: has 4 columns; the most is 3."],
    ["git", "5 branches", "worktrees:", '  - name: "#3"\n    commits: 1\n  - name: "#4"\n    commits: 1\n  - name: "#5"\n    commits: 1\nworktrees:', "branches: has 5 branches; the most is 4."],
    ["git", "7 commits on a branch", "    commits: 2\n    merge", "    commits: 7\n    merge", "branches.1.commits: is 7; the most is 6."],
    ["cycle", "5 steps", '"Then the next test."]', '"Then the next test.", "Refactoring", "Then the next test."]', "steps: has 5 steps; the most is 4."],
    ["cycle", "2 steps", '"Green: make it pass", ', "", "steps: has 2 steps; the fewest is 3."],
  ] as const)("fails a %s with %s", (type, _what, from, to, problem) => {
    expect(problemWith(changed(type, from, to))).toBe(message(type, problem));
  });

  // Each string a Diagram shows has a cap, in characters as written: the
  // valid Diagram gets a string of `length` characters in place of one of
  // its own.
  const withLength = (type: Type, quoted: string, length: number) =>
    changed(type, quoted, `"${"a".repeat(length)}"`).replaceAll(quoted, `"${"a".repeat(length)}"`);

  test.each([
    ["git", "caption", '"Each Ticket gets its own branch"', 120, "caption"],
    ["chain", "step", '"the grilling"', 80, "steps.0.label"],
    ["chain", "note", '"at the same time"', 80, "steps.1.note"],
    ["chain", "parallel box", '"Standards"', 80, "steps.2.parallel.0"],
    ["chain", "group label", '"in one window"', 80, "groups.0.label"],
    ["compare", "column", '"mechanical"', 120, "columns.0"],
    ["compare", "row label", '"A check"', 32, "rows.0.label"],
    ["compare", "cell", '"a judgement call"', 120, "rows.1.cells.1"],
    ["compare", "footer", '"When in doubt, build the check."', 120, "footer"],
    ["tree", "node label", '"#13 is next"', 60, "nodes.1.children.0.label"],
    ["tree", "note", '"two Tickets"', 100, "root.note"],
    ["tree", "link label", '"blocked by"', 60, "links.0.label"],
    ["layers", "label", '"a list of steps"', 60, "layers.0.children.0.children.0.children.0.label"],
    ["layers", "note", '"a list of jobs"', 100, "layers.0.children.0.note"],
    ["git", "branch name", '"its own branch"', 24, "branches.1.name"],
    ["git", "merge label", '"through a pull request"', 40, "branches.1.merge.label"],
    ["git", "worktree label", '"linked worktree"', 40, "worktrees.0.label"],
    ["cycle", "step", '"Red: write one test that fails"', 40, "steps.0"],
    ["cycle", "outside", '"Refactoring"', 40, "outside"],
  ] as const)("fails a %s %s over its cap", (type, _field, quoted, cap, at) => {
    expect(() => parseDiagram(FILE, withLength(type, quoted, cap))).not.toThrow();
    expect(problemWith(withLength(type, quoted, cap + 1))).toMatch(
      new RegExp(`: ${at.replaceAll(".", "\\.")}: has ${cap + 1} characters; the most is ${cap}\\.$`),
    );
  });

  test("fails a cell over 60 characters when a compare has 3 columns", () => {
    const threeColumns = (cell: string) =>
      changed("compare", /columns:[\s\S]*(?=footer)/, `columns: ["mechanical", "judgement call", "A check"]\nrows:\n  - cells: ["yes", "no", "${cell}"]\n`);
    expect(() => parseDiagram(FILE, threeColumns("a".repeat(60)))).not.toThrow();
    expect(problemWith(threeColumns("a".repeat(61)))).toBe(
      message("compare", "rows.0.cells.2: has 61 characters; the most is 60."),
    );
  });

  // Labels "#1" to "#n": all on one level under the first, or each holding the next.
  const numbered = (count: number) => Array.from({ length: count }, (_, i) => `#${i + 1}`);
  const wide = (boxes: number, indent: string) =>
    numbered(boxes)
      .slice(1)
      .map((label) => `${indent}- label: "${label}"`)
      .join("\n");
  const deep = (boxes: number, indent: string) =>
    numbered(boxes)
      .slice(1)
      .map((label, i) => {
        const at = indent + "    ".repeat(i);
        return `${at}- label: "${label}"` + (i < boxes - 2 ? `\n${at}  children:` : "");
      })
      .join("\n");
  const tree = (nodes: string) => `type: tree\ncaption: "#1"\nroot:\n  label: "#1"\nnodes:\n${nodes}`;
  const layers = (children: string) =>
    `type: layers\ncaption: "#1"\nmode: stacked\nlayers:\n  - label: "#1"\n    children:\n${children}`;

  test("fails a tree with more than 12 nodes, its root included, or more than 3 levels below its root", () => {
    expect(() => parseDiagram(FILE, tree(wide(12, "  ")))).not.toThrow();
    expect(() => parseDiagram(FILE, tree(deep(4, "  ")))).not.toThrow();
    expect(problemWith(tree(wide(13, "  ")))).toBe(
      `${FILE}: diagram tree "#1": has 13 nodes, its root included; the most is 12.`,
    );
    expect(problemWith(tree(deep(5, "  ")))).toBe(
      `${FILE}: diagram tree "#1": nodes.0.children.0.children.0.children.0: is 4 levels below the root; the most is 3.`,
    );
  });

  test("fails layers with more than 8 boxes, or more than 4 levels", () => {
    expect(() => parseDiagram(FILE, layers(wide(8, "      ")))).not.toThrow();
    expect(() => parseDiagram(FILE, layers(deep(4, "      ")))).not.toThrow();
    expect(problemWith(layers(wide(9, "      ")))).toBe(`${FILE}: diagram layers "#1": has 9 boxes; the most is 8.`);
    expect(problemWith(layers(deep(5, "      ")))).toBe(
      `${FILE}: diagram layers "#1": layers.0.children.0.children.0.children.0.children.0: is on level 5; the most is 4.`,
    );
  });

  test("lists every problem it has, field by field", () => {
    expect(problemWith('type: chain\nsteps: ["one"]\nloops: 2')).toBe(
      `${FILE}: diagram chain: caption: is missing. steps: has 1 step; the fewest is 2. has a key it doesn't take, "loops": check its spelling, or take it out.`,
    );
  });
});

describe("a Diagram that isn't one", () => {
  const CHAIN = 'type: chain\ncaption: "Then the next test."\nsteps: ["Red: write one test that fails", "Green: make it pass"]';

  test("fails a type that isn't one of the six, naming them", () => {
    expect(problemWith(CHAIN.replace("type: chain", "type: flowchart"))).toBe(
      `${FILE}: diagram "Then the next test.": type: is "flowchart"; it must be chain, compare, tree, layers, git or cycle.`,
    );
  });

  test("fails a Diagram with no type", () => {
    expect(problemWith(CHAIN.replace("type: chain\n", ""))).toBe(
      `${FILE}: diagram "Then the next test.": type: is missing; it must be chain, compare, tree, layers, git or cycle.`,
    );
  });

  test("fails a Diagram with no caption, a blank one, or one that isn't a string", () => {
    expect(problemWith(CHAIN.replace('caption: "Then the next test."\n', ""))).toBe(
      `${FILE}: diagram chain: caption: is missing.`,
    );
    expect(problemWith(CHAIN.replace('"Then the next test."', '"  "'))).toBe(
      `${FILE}: diagram chain: caption: is blank; every Diagram needs a caption, which screen readers read as its name.`,
    );
    expect(problemWith(CHAIN.replace('"Then the next test."', "42"))).toBe(
      `${FILE}: diagram chain: caption: should be a string in double quotes, not 42.`,
    );
  });

  test("fails YAML that doesn't parse, naming the line in the block and saying to quote strings", () => {
    // Unquoted, a string starting with "[" is YAML's own list syntax.
    expect(problemWith(CHAIN.replace('"Then the next test."', "[the next test](/learn/tdd)"))).toMatch(
      /^content\/course\/lesson\.md: diagram: its YAML doesn't parse: .+ \(line 2 of the block, column \d+\)\. Write every string in double quotes\.$/,
    );
    // Unquoted, "Red: write…" is a key and a value.
    expect(problemWith(CHAIN.replace('"Then the next test."', "Red: write one test"))).toMatch(
      /^content\/course\/lesson\.md: diagram: its YAML doesn't parse: .+ \(line 2 of the block, column \d+\)\./,
    );
  });

  test("fails an empty block, and text that isn't YAML keys", () => {
    expect(problemWith("")).toBe(
      `${FILE}: diagram: is empty: write its "type:", its "caption:" and the fields its type takes, as YAML.`,
    );
    expect(problemWith("A chain of steps")).toBe(
      `${FILE}: diagram: should be YAML "key: value" lines, starting with "type:" and "caption:", not "A chain of steps".`,
    );
  });

  test("fails raw HTML in a string, as everywhere in a Lesson", () => {
    expect(problemWith(CHAIN.replace('"Green: make it pass"', '"Green: make it <b>pass</b>"'))).toBe(
      `${FILE}: diagram chain "Then the next test.": steps.1.label: raw HTML isn't allowed in a Lesson (found "<b>"): write it in Markdown, or put it in backticks to show it as code`,
    );
  });

  test("shortens a long caption where it names the Diagram", () => {
    const caption = "a".repeat(121);
    expect(problemWith(CHAIN.replace('"Then the next test."', `"${caption}"`))).toBe(
      `${FILE}: diagram chain "${"a".repeat(59)}…": caption: has 121 characters; the most is 120.`,
    );
  });
});

// git has no layout engine: commits sit in slots every lane shares, so a
// drawing that would put a merge on another dot, or run a line through a
// branch's commit, is refused rather than moved. It would show a relation
// the text doesn't state.
describe("git", () => {
  const GIT_BRANCHES = VALID.git.yaml.match(/branches:[\s\S]*(?=worktrees:)/)![0];
  const gitBranches = (...branches: string[]) =>
    `branches:\n${branches.map((branch) => `  - { ${branch} }`).join("\n")}\n`;

  test.each([
    [
      "a merge into a branch after it",
      gitBranches(
        'name: "`main`", commits: 2, merge: { into: "its own branch" }',
        'name: "its own branch", from: { branch: "`main`", after: 1 }, commits: 2',
      ),
      'branches.0.merge.into: "its own branch" isn\'t a branch before this one.',
    ],
    [
      "a merge onto a commit its branch already has",
      gitBranches(
        'name: "`main`", commits: 4',
        'name: "its own branch", from: { branch: "`main`", after: 1 }, commits: 2, merge: { into: "`main`" }',
      ),
      'branches.1.merge: lands on a commit "`main`" already has; change a commit count so the merge has a place of its own.',
    ],
    [
      "two merges onto one place",
      gitBranches(
        'name: "`main`", commits: 2',
        'name: "its own branch", from: { branch: "`main`", after: 1 }, commits: 2, merge: { into: "`main`" }',
        'name: "Each Ticket", from: { branch: "`main`", after: 1 }, commits: 2, merge: { into: "`main`" }',
      ),
      'branches.2.merge: lands where "its own branch" also merges into "`main`"; change a commit count so each merge has a place of its own.',
    ],
    [
      "a merge before its branch's first commit",
      gitBranches(
        'name: "`main`", commits: 3',
        'name: "its own branch", from: { branch: "`main`", after: 3 }, commits: 2, merge: { into: "`main`" }',
        'name: "Each Ticket", from: { branch: "`main`", after: 1 }, commits: 1, merge: { into: "its own branch" }',
      ),
      'branches.2.merge: lands before the first commit on "its own branch"; change a commit count so the merge lands after it.',
    ],
    [
      "a branch's line that runs through another branch's commit",
      gitBranches(
        'name: "`main`", commits: 2',
        'name: "its own branch", from: { branch: "`main`", after: 1 }, commits: 2, merge: { into: "`main`" }',
        'name: "Each Ticket", from: { branch: "`main`", after: 2 }, commits: 1',
      ),
      'branches.2.from: its line from "`main`" runs through a commit on "its own branch", as if it started there; change a commit count so the line passes between commits.',
    ],
    [
      "a merge's line that runs through another branch's commit",
      gitBranches(
        'name: "`main`", commits: 2',
        'name: "its own branch", from: { branch: "`main`", after: 1 }, commits: 4, merge: { into: "`main`" }',
        'name: "Each Ticket", from: { branch: "`main`", after: 1 }, commits: 2, merge: { into: "`main`" }',
      ),
      'branches.2.merge: its line into "`main`" runs through a commit on "its own branch", as if it merged there; change a commit count so the line passes between commits.',
    ],
  ])("fails a git with %s", (_what, branches, problem) => {
    expect(problemWith(changed("git", GIT_BRANCHES, branches))).toBe(message("git", problem));
  });

  // A Ticket's branch merges into a shared branch, which then merges into
  // main. A merge lands after the branch's last commit, the merges into it
  // included.
  test("passes a git whose branch merges after the merges into it", () => {
    const branches = gitBranches(
      'name: "`main`", commits: 3',
      'name: "its own branch", from: { branch: "`main`", after: 1 }, commits: 1, merge: { into: "`main`", label: "through a pull request" }',
      'name: "Each Ticket", from: { branch: "its own branch", after: 1 }, commits: 2, merge: { into: "its own branch" }',
    );
    expect(() => parseDiagram(FILE, changed("git", GIT_BRANCHES, branches))).not.toThrow();
  });

  test("a trunk alone takes a slot per commit", () => {
    expect(gitLayout([{ name: "main", commits: 3 }])).toEqual({
      commits: [[1, 2, 3]],
      forks: [],
      merges: [],
      slots: 3,
    });
  });

  test("a branch starts one slot after the commit it starts after, and merges one slot after its last", () => {
    expect(
      gitLayout([
        { name: "main", commits: 3 },
        { name: "feature", from: { branch: "main", after: 2 }, commits: 2, merge: { into: "main", label: "merged" } },
      ]),
    ).toEqual({
      commits: [
        [1, 2, 3],
        [3, 4],
      ],
      forks: [{ slot: 2, from: 0, to: 1 }],
      merges: [{ slot: 5, from: 1, to: 0, label: "merged" }],
      slots: 5,
    });
  });

  test("a branch merges after the merges into it, and merges are listed left to right", () => {
    const { commits, forks, merges, slots } = gitLayout([
      { name: "main", commits: 2 },
      { name: "shared", from: { branch: "main", after: 1 }, commits: 1, merge: { into: "main" } },
      { name: "ticket", from: { branch: "shared", after: 1 }, commits: 2, merge: { into: "shared" } },
    ]);
    expect(commits).toEqual([[1, 2], [2], [3, 4]]);
    expect(forks).toEqual([
      { slot: 1, from: 0, to: 1 },
      { slot: 2, from: 1, to: 2 },
    ]);
    expect(merges).toEqual([
      { slot: 5, from: 2, to: 1, label: undefined },
      { slot: 6, from: 1, to: 0, label: undefined },
    ]);
    expect(slots).toBe(6);
  });

  test("two branches from one commit start in the same slot", () => {
    const { commits, forks } = gitLayout([
      { name: "main", commits: 3 },
      { name: "13", from: { branch: "main", after: 2 }, commits: 2 },
      { name: "14", from: { branch: "main", after: 2 }, commits: 2 },
    ]);
    expect(commits).toEqual([
      [1, 2, 3],
      [3, 4],
      [3, 4],
    ]);
    expect(forks).toEqual([
      { slot: 2, from: 0, to: 1 },
      { slot: 2, from: 0, to: 2 },
    ]);
  });
});
