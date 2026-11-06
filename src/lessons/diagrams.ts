import { parse, YAMLParseError } from "yaml";
import * as z from "zod";
import { htmlToText, renderInline, type Fail } from "./markdown";

// A Diagram: a picture in a Lesson that shows how its ideas connect, written
// as a fenced ```diagram block holding a little YAML in one of six types:
// chain, compare, tree, layers, git or cycle. parseDiagram checks the YAML
// against its type's shape and limits, then renders every string it shows
// to HTML, like the rest of a Lesson. DiagramView
// (src/app/learn/[slug]/diagram.tsx) draws it on the server.
//
// Ported from the skills site (its content/README.md, "Diagrams"), with every
// limit kept but one: a Diagram here may say words its Lesson doesn't.

// ---------------------------------------------------------------------------
// The YAML's shape. Every string a Diagram shows is inline Markdown, capped in
// characters as YAML reads it (Markdown marks and link targets included), so
// new content can't break the layout.
// ---------------------------------------------------------------------------

const overCap = (length: number, most: number) => `has ${length} characters; the most is ${most}.`;

function capped(most: number) {
  return z.string().max(most, { error: (issue) => overCap(String(issue.input).length, most) });
}

// The figure's visible caption and its name for screen readers, so it can't
// be blank.
const caption = capped(120).refine((text) => text.trim() !== "", {
  error: "is blank; every Diagram needs a caption, which screen readers read as its name.",
});

function issue(ctx: z.RefinementCtx, path: PropertyKey[], message: string) {
  ctx.addIssue({ code: "custom", path, message });
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

// A chain step is a string, {label, note?} or {parallel: [2–3 strings]}. Each
// is read as a labelled step or a parallel one (a string is a step with only a
// label), so a problem always names the field it's in.
const ChainStep = z.preprocess(
  (step) => {
    if (typeof step === "string") return { kind: "label", label: step };
    if (typeof step !== "object" || step === null || Array.isArray(step)) return step;
    return { ...step, kind: "parallel" in step ? "parallel" : "label" };
  },
  z.discriminatedUnion(
    "kind",
    [
      z.strictObject({ kind: z.literal("label"), label: capped(80), note: capped(80).optional() }),
      z.strictObject({ kind: z.literal("parallel"), parallel: z.array(capped(80)).min(2).max(3) }),
    ],
    { error: 'should be a string in double quotes, a "label:" with an optional "note:", or a "parallel:" list of 2 or 3 strings.' },
  ),
);

// chain: steps in order, joined by arrows. A parallel step's 2–3 boxes share
// one step's place. A group is a bracket beside the steps it spans, from and
// to being 1-based step numbers.
const Chain = z
  .strictObject({
    type: z.literal("chain"),
    caption,
    steps: z.array(ChainStep).min(2).max(8),
    groups: z.array(z.strictObject({ from: z.int().min(1), to: z.int().min(1), label: capped(80) })).optional(),
  })
  .superRefine(({ steps, groups = [] }, ctx) => {
    groups.forEach(({ from, to }, index) => {
      if (from >= to) {
        issue(ctx, ["groups", index], `starts at step ${from} and ends at step ${to}; a group ends after it starts.`);
      } else if (to > steps.length) {
        issue(ctx, ["groups", index, "to"], `is step ${to}, but the chain has ${plural(steps.length, "step")}.`);
      } else {
        const other = groups.findIndex((earlier, before) => before < index && earlier.from <= to && from <= earlier.to);
        if (other !== -1) issue(ctx, ["groups", index], `overlaps groups.${other}; groups don't overlap.`);
      }
    });
  });

// compare: things side by side, row by row, as a table. A cell of "yes", "no"
// or "" draws a check, a cross or a dash. With 2 columns, a row may have a
// label; with 3, cells and columns are shorter and rows have no labels.
const Compare = z
  .strictObject({
    type: z.literal("compare"),
    caption,
    columns: z.array(capped(120)).min(2).max(3),
    rows: z.array(z.strictObject({ label: capped(32).optional(), cells: z.array(capped(120)) })).min(1).max(6),
    footer: capped(120).optional(),
  })
  .superRefine(({ columns, rows }, ctx) => {
    // Longer than 120, a text already fails its own cap.
    const overThreeColumnCap = (text: string, path: PropertyKey[]) => {
      if (columns.length === 3 && text.length > 60 && text.length <= 120) issue(ctx, path, overCap(text.length, 60));
    };
    columns.forEach((column, index) => overThreeColumnCap(column, ["columns", index]));
    rows.forEach(({ label, cells }, index) => {
      cells.forEach((cell, at) => overThreeColumnCap(cell, ["rows", index, "cells", at]));
      if (cells.length !== columns.length) {
        issue(
          ctx,
          ["rows", index, "cells"],
          `has ${plural(cells.length, "cell")} for ${columns.length} columns; a row has one cell per column.`,
        );
      }
      if (columns.length === 3 && label !== undefined) {
        issue(ctx, ["rows", index, "label"], "a compare with 3 columns has no row labels.");
      }
    });
  });

// tree: a hierarchy. The root's children are its nodes. A link is a line
// under its from node naming its to node, both given by their labels.
const NodeState = z.enum(["frontier", "settled", "closed"]);

const TreeNodeData = z.strictObject({
  label: capped(60),
  note: capped(100).optional(),
  state: NodeState.optional(),
  get children() {
    return z.array(TreeNodeData).min(1).optional();
  },
});

type TreeNodeData = z.infer<typeof TreeNodeData>;

// Every node in a list and the lists inside it, in the order they're written,
// with its path in the Diagram and its depth (1 for the list's own nodes).
function* nodesBelow<Node extends { children?: Node[] }>(
  nodes: Node[],
  path: PropertyKey[],
  depth = 1,
): Generator<{ node: Node; path: PropertyKey[]; depth: number }> {
  for (const [index, node] of nodes.entries()) {
    yield { node, path: [...path, index], depth };
    yield* nodesBelow(node.children ?? [], [...path, index, "children"], depth + 1);
  }
}

const Tree = z
  .strictObject({
    type: z.literal("tree"),
    caption,
    root: z.strictObject({ label: capped(60), note: capped(100).optional(), state: NodeState.optional() }),
    nodes: z.array(TreeNodeData).min(1),
    links: z.array(z.strictObject({ from: z.string(), to: z.string(), label: capped(60).optional() })).optional(),
  })
  .superRefine(({ root, nodes, links = [] }, ctx) => {
    const below = [...nodesBelow(nodes, ["nodes"])];
    if (below.length + 1 > 12) issue(ctx, [], `has ${below.length + 1} nodes, its root included; the most is 12.`);
    const labels = new Set([root.label]);
    for (const { node, path, depth } of below) {
      if (depth > 3) issue(ctx, path, `is ${depth} levels below the root; the most is 3.`);
      if (labels.has(node.label)) {
        issue(ctx, [...path, "label"], `"${node.label}" is already a node's label; each node's label is its own.`);
      }
      labels.add(node.label);
    }
    links.forEach((link, index) => {
      for (const end of ["from", "to"] as const) {
        if (!labels.has(link[end])) {
          issue(ctx, ["links", index, end], `"${link[end]}" isn't the label of a node in this tree.`);
        }
      }
    });
  });

// layers: boxes inside boxes (nested), or a vertical stack (stacked).
const LayerData = z.strictObject({
  label: capped(60),
  note: capped(100).optional(),
  get children() {
    return z.array(LayerData).min(1).optional();
  },
});

type LayerData = z.infer<typeof LayerData>;

const Layers = z
  .strictObject({
    type: z.literal("layers"),
    caption,
    mode: z.enum(["nested", "stacked"]),
    layers: z.array(LayerData).min(1),
  })
  .superRefine(({ layers }, ctx) => {
    const boxes = [...nodesBelow(layers, ["layers"])];
    if (boxes.length > 8) issue(ctx, [], `has ${boxes.length} boxes; the most is 8.`);
    for (const { path, depth } of boxes) {
      if (depth > 4) issue(ctx, path, `is on level ${depth}; the most is 4.`);
    }
  });

// git: branches, commits and merges, one lane per branch. The first branch is
// the trunk. A branch starts after the 1-based commit `after` on an earlier
// branch, and merges into an earlier branch one commit after its last, the
// merges into it included.
const GitBranch = z.strictObject({
  name: capped(24),
  from: z.strictObject({ branch: z.string(), after: z.int().min(1) }).optional(),
  commits: z.int().min(1).max(6),
  merge: z.strictObject({ into: z.string(), label: capped(40).optional() }).optional(),
});

/** One branch of a git Diagram, as its YAML gives it. */
export type GitBranchSpec = z.infer<typeof GitBranch>;

/** A line between two lanes at one slot: a fork down to a branch's first commit, or a merge into its commit on another lane. */
export type GitJoin = { slot: number; from: number; to: number };

/**
 * Where a git Diagram's commits sit, for branches that start and merge where
 * they can. Commits take slots 1, 2, 3… left to right, shared by every lane: a
 * branch's first commit is one slot after the commit it starts after, and its
 * merge commit lands one slot after its last, the merges into it included.
 * The check and the drawing both place them here, so they never disagree.
 */
export function gitLayout(branches: GitBranchSpec[]) {
  const names = branches.map((branch) => branch.name);
  const commits: number[][] = [];
  const forks: GitJoin[] = [];
  branches.forEach(({ from, commits: count }, lane) => {
    let first = 1;
    if (from) {
      const parent = names.indexOf(from.branch);
      const slot = commits[parent][from.after - 1];
      forks.push({ slot, from: parent, to: lane });
      first = slot + 1;
    }
    commits[lane] = Array.from({ length: count }, (_, index) => first + index);
  });
  // A branch merges into an earlier one, so going from the last lane up places
  // every merge into a branch before that branch's own.
  const merges: (GitJoin & { label?: string })[] = [];
  for (let lane = branches.length - 1; lane >= 0; lane--) {
    const { merge } = branches[lane];
    if (merge === undefined) continue;
    const into = merges.filter((other) => other.to === lane).map((other) => other.slot);
    const last = Math.max(commits[lane].at(-1)!, ...into);
    merges.push({ slot: last + 1, from: lane, to: names.indexOf(merge.into), label: merge.label });
  }
  // Left to right, so their labels read in the order they happen.
  merges.sort((one, other) => one.slot - other.slot);
  const slots = Math.max(...commits.flat(), ...merges.map((merge) => merge.slot));
  return { commits, forks, merges, slots };
}

// The drawing has no layout engine, so it can't move a dot out of another's
// way. The check refuses a drawing that would show a relation the text
// doesn't state: a merge on another dot, or a line through a commit.
function refuseClashes(ctx: z.RefinementCtx, branches: GitBranchSpec[]) {
  const { commits, forks, merges } = gitLayout(branches);
  // A lane's dots are its commits and the merges into it.
  const hasDot = (lane: number, slot: number) =>
    commits[lane].includes(slot) || merges.some((merge) => merge.to === lane && merge.slot === slot);
  // The first lane strictly between a line's two ends with a dot where the line passes.
  const crossed = ({ slot, from, to }: GitJoin) =>
    Array.from({ length: Math.abs(to - from) - 1 }, (_, index) => Math.min(from, to) + 1 + index).find((lane) =>
      hasDot(lane, slot),
    );
  for (const fork of forks) {
    const lane = crossed(fork);
    if (lane !== undefined) {
      issue(
        ctx,
        ["branches", fork.to, "from"],
        `its line from "${branches[fork.from].name}" runs through a commit on "${branches[lane].name}", as if it started there; change a commit count so the line passes between commits.`,
      );
    }
  }
  // What's wrong with where a merge lands, if anything.
  const mergeClash = (merge: GitJoin) => {
    const into = branches[merge.to].name;
    if (merge.slot < commits[merge.to][0]) {
      return `lands before the first commit on "${into}"; change a commit count so the merge lands after it.`;
    }
    if (commits[merge.to].includes(merge.slot)) {
      return `lands on a commit "${into}" already has; change a commit count so the merge has a place of its own.`;
    }
    const earlier = merges.find(
      (other) => other.to === merge.to && other.slot === merge.slot && other.from < merge.from,
    );
    if (earlier) {
      return `lands where "${branches[earlier.from].name}" also merges into "${into}"; change a commit count so each merge has a place of its own.`;
    }
    const lane = crossed(merge);
    if (lane !== undefined) {
      return `its line into "${into}" runs through a commit on "${branches[lane].name}", as if it merged there; change a commit count so the line passes between commits.`;
    }
    return undefined;
  };
  for (const merge of merges) {
    const problem = mergeClash(merge);
    if (problem) issue(ctx, ["branches", merge.from, "merge"], problem);
  }
}

const Git = z
  .strictObject({
    type: z.literal("git"),
    caption,
    branches: z.array(GitBranch).min(1).max(4),
    worktrees: z.array(z.strictObject({ branch: z.string(), label: capped(40) })).optional(),
  })
  .superRefine(({ branches, worktrees = [] }, ctx) => {
    const names = branches.map((branch) => branch.name);
    const before = ctx.issues.length;
    branches.forEach(({ name, from, merge }, index) => {
      if (names.indexOf(name) < index) issue(ctx, ["branches", index, "name"], `"${name}" is already a branch's name.`);
      if (from) {
        const parent = names.indexOf(from.branch);
        if (parent === -1 || parent >= index) {
          issue(ctx, ["branches", index, "from", "branch"], `"${from.branch}" isn't a branch before this one.`);
        } else if (from.after > branches[parent].commits) {
          issue(
            ctx,
            ["branches", index, "from", "after"],
            `is commit ${from.after}, but "${from.branch}" has ${plural(branches[parent].commits, "commit")}.`,
          );
        }
      }
      if (merge) {
        const into = names.indexOf(merge.into);
        if (into === -1 || into >= index) {
          issue(ctx, ["branches", index, "merge", "into"], `"${merge.into}" isn't a branch before this one.`);
        }
      }
    });
    // Only branches that all start and merge where they can be drawn can be placed.
    if (ctx.issues.length === before) refuseClashes(ctx, branches);
    worktrees.forEach(({ branch }, index) => {
      if (!names.includes(branch)) {
        issue(ctx, ["worktrees", index, "branch"], `"${branch}" isn't a branch in this Diagram.`);
      } else if (worktrees.findIndex((worktree) => worktree.branch === branch) < index) {
        issue(
          ctx,
          ["worktrees", index, "branch"],
          `"${branch}" already has a worktree; a branch is checked out in one worktree at a time.`,
        );
      }
    });
  });

// cycle: a loop, drawn as its steps top to bottom with one return arrow from
// the last back up to the first. outside is a dashed box beside the loop.
const Cycle = z.strictObject({
  type: z.literal("cycle"),
  caption,
  steps: z.array(capped(40)).min(3).max(4),
  outside: capped(40).optional(),
});

const DiagramData = z.discriminatedUnion("type", [Chain, Compare, Tree, Layers, Git, Cycle]);

type DiagramData = z.infer<typeof DiagramData>;

export const DIAGRAM_TYPES = ["chain", "compare", "tree", "layers", "git", "cycle"] as const;

// ---------------------------------------------------------------------------
// The parsed Diagram: what DiagramView draws. Every string it shows is HTML
// rendered from its inline Markdown, so links (/learn/<slug>) and code in a
// Diagram are checked like the rest of the Lesson's.
// ---------------------------------------------------------------------------

/** One chain step: a box, or 2–3 boxes sharing one step's place. */
export type ChainStep =
  | { kind: "box"; labelHtml: string; noteHtml: string | null }
  | { kind: "parallel"; boxesHtml: string[] };

/** The compare cells drawn as marks (a check, a cross, a dash) instead of text. */
export const COMPARE_MARKS = ["yes", "no", ""] as const;

export type CompareMark = (typeof COMPARE_MARKS)[number];

export type CompareCell = { kind: "mark"; mark: CompareMark } | { kind: "text"; html: string };

export type TreeState = z.infer<typeof NodeState>;

/** A tree node with the links drawn under it, each naming the node it points at. */
export type TreeNode = {
  labelHtml: string;
  noteHtml: string | null;
  state: TreeState | null;
  links: { labelHtml: string | null; toHtml: string }[];
  children: TreeNode[];
};

export type Layer = { labelHtml: string; noteHtml: string | null; children: Layer[] };

/** One lane of a git Diagram: its branch's name, its worktree's tag and the slots of its commits. */
export type GitLane = { nameHtml: string; worktreeHtml: string | null; commits: number[] };

type Captioned = {
  /** The caption as plain text. */
  caption: string;
  /** The caption shown under the drawing, which screen readers read as the figure's name. */
  captionHtml: string;
};

export type Diagram = Captioned &
  (
    | { type: "chain"; steps: ChainStep[]; groups: { from: number; to: number; labelHtml: string }[] }
    | {
        type: "compare";
        columnsHtml: string[];
        rows: { labelHtml: string | null; cells: CompareCell[] }[];
        footerHtml: string | null;
      }
    | { type: "tree"; root: TreeNode }
    | { type: "layers"; mode: "nested" | "stacked"; layers: Layer[] }
    | {
        type: "git";
        lanes: GitLane[];
        forks: GitJoin[];
        merges: (GitJoin & { labelHtml: string | null })[];
        slots: number;
      }
    | { type: "cycle"; stepsHtml: string[]; outsideHtml: string | null }
  );

/** One type of Diagram, like DiagramOf<"chain">. */
export type DiagramOf<Type extends Diagram["type"]> = Extract<Diagram, { type: Type }>;

// ---------------------------------------------------------------------------
// Reading a block.
// ---------------------------------------------------------------------------

/**
 * Reads a ```diagram block's YAML into a Diagram, or throws an Error that
 * starts with the file, names the Diagram (its type and caption) and says
 * what to fix, field by field, like
 * `content/x/y.md: diagram chain "Then the next test.": steps: has 9 steps; the most is 8.`
 */
export function parseDiagram(file: string, source: string): Diagram {
  let yaml: unknown;
  try {
    yaml = parse(source);
  } catch (error) {
    throw new Error(`${file}: diagram: ${yamlProblem(error)}`);
  }
  const where = `${file}: ${nameOf(yaml)}`;
  const result = DiagramData.safeParse(yaml, { error: explain });
  if (!result.success) {
    const problems = result.error.issues.map(({ path, message }) => {
      const sentence = /[.!?]$/.test(message) ? message : `${message}.`;
      return path.length > 0 ? `${path.join(".")}: ${sentence}` : sentence;
    });
    throw new Error(`${where}: ${problems.join(" ")}`);
  }
  return toDiagram(result.data, (path) => (problem) => new Error(`${where}: ${path.join(".")}: ${problem}`));
}

// "diagram", then its type and caption when the YAML has them, so a message
// says which of a Lesson's Diagrams it's about.
function nameOf(yaml: unknown): string {
  const { type, caption: text } = (typeof yaml === "object" && yaml !== null ? yaml : {}) as Record<string, unknown>;
  let name = "diagram";
  if ((DIAGRAM_TYPES as readonly unknown[]).includes(type)) name += ` ${type}`;
  if (typeof text === "string" && text.trim() !== "") name += ` ${shown(text, 60)}`;
  return name;
}

// What the YAML parser says is wrong, counting lines from the block's first.
function yamlProblem(error: unknown): string {
  const hint = "Write every string in double quotes.";
  if (error instanceof YAMLParseError) {
    const reason = error.message.split("\n")[0].replace(/ at line \d+, column \d+:?$/, "");
    const at = error.linePos?.[0];
    const place = at ? ` (line ${at.line} of the block, column ${at.col})` : "";
    return `its YAML doesn't parse: ${reason}${place}. ${hint}`;
  }
  const reason = error instanceof Error ? error.message.split("\n")[0] : String(error);
  return `its YAML doesn't parse: ${reason}. ${hint}`;
}

// How a value YAML read shows in a message: a long string is cut short.
function shown(value: unknown, most = 40): string {
  if (typeof value === "string") return `"${value.length > most ? `${value.slice(0, most - 1)}…` : value}"`;
  if (Array.isArray(value)) return "a list";
  if (typeof value === "object" && value !== null) return "a mapping";
  return String(value);
}

const orList = (words: readonly string[]) =>
  words.length === 1 ? words[0] : `${words.slice(0, -1).join(", ")} or ${words.at(-1)}`;

const EXPECTED: Record<string, string> = {
  string: "a string in double quotes",
  number: "a number",
  int: "a whole number",
  array: "a list",
  object: "a mapping of keys to values",
};

// What to call the things in a list, by the list's key.
const NOUNS: Record<string, [one: string, many: string]> = {
  steps: ["step", "steps"],
  parallel: ["box", "boxes"],
  groups: ["group", "groups"],
  columns: ["column", "columns"],
  rows: ["row", "rows"],
  nodes: ["node", "nodes"],
  children: ["child", "children"],
  links: ["link", "links"],
  layers: ["layer", "layers"],
  branches: ["branch", "branches"],
  worktrees: ["worktree", "worktrees"],
};

function counted(count: number, key: PropertyKey | undefined): string {
  const [one, many] = NOUNS[String(key)] ?? ["item", "items"];
  return `${count} ${count === 1 ? one : many}`;
}

// zod's messages, said for someone fixing a Lesson. Messages the schemas give
// themselves (caps, overlaps, clashes) win over these.
function explain(issue: z.core.$ZodRawIssue): string | undefined {
  const path = issue.path ?? [];
  switch (issue.code) {
    case "invalid_type":
      if (path.length === 0) {
        return issue.input === null
          ? 'is empty: write its "type:", its "caption:" and the fields its type takes, as YAML.'
          : `should be YAML "key: value" lines, starting with "type:" and "caption:", not ${shown(issue.input)}.`;
      }
      if (issue.input === undefined) return "is missing.";
      if (issue.input === null) return "is empty.";
      return `should be ${EXPECTED[issue.expected] ?? issue.expected}, not ${shown(issue.input)}.`;
    case "too_big":
    case "too_small": {
      const most = issue.code === "too_big";
      const limit = String(issue.code === "too_big" ? issue.maximum : issue.minimum);
      if (Array.isArray(issue.input)) {
        return `has ${counted(issue.input.length, path.at(-1))}; the ${most ? "most" : "fewest"} is ${limit}.`;
      }
      if (typeof issue.input === "number") return `is ${issue.input}; the ${most ? "most" : "least"} is ${limit}.`;
      return undefined;
    }
    case "unrecognized_keys": {
      const keys = issue.keys.map((key) => `"${key}"`).join(", ");
      return issue.keys.length === 1
        ? `has a key it doesn't take, ${keys}: check its spelling, or take it out.`
        : `has keys it doesn't take, ${keys}: check their spelling, or take them out.`;
    }
    case "invalid_value":
      return `is ${shown(issue.input)}; it must be ${orList(issue.values.map(String))}.`;
    case "invalid_union": {
      if (issue.discriminator !== "type") return undefined;
      const type = (issue.input as Record<string, unknown>).type;
      return `${type === undefined ? "is missing" : `is ${shown(type)}`}; it must be ${orList(DIAGRAM_TYPES)}.`;
    }
    default:
      return undefined;
  }
}

// The checked YAML as a Diagram, with every string it shows rendered to HTML.
// `failAt` builds the error for raw HTML found at a path.
function toDiagram(data: DiagramData, failAt: (path: PropertyKey[]) => Fail): Diagram {
  const html = (path: PropertyKey[], text: string) => renderInline(text, failAt(path));
  const optional = (path: PropertyKey[], text: string | undefined) => (text === undefined ? null : html(path, text));
  const captionHtml = html(["caption"], data.caption);
  const captioned: Captioned = { caption: htmlToText(captionHtml), captionHtml };

  switch (data.type) {
    case "chain":
      return {
        ...captioned,
        type: "chain",
        steps: data.steps.map((step, index) =>
          step.kind === "label"
            ? {
                kind: "box",
                labelHtml: html(["steps", index, "label"], step.label),
                noteHtml: optional(["steps", index, "note"], step.note),
              }
            : { kind: "parallel", boxesHtml: step.parallel.map((box, at) => html(["steps", index, "parallel", at], box)) },
        ),
        groups: (data.groups ?? []).map(({ from, to, label }, index) => ({
          from,
          to,
          labelHtml: html(["groups", index, "label"], label),
        })),
      };
    case "compare":
      return {
        ...captioned,
        type: "compare",
        columnsHtml: data.columns.map((column, index) => html(["columns", index], column)),
        rows: data.rows.map(({ label, cells }, index) => ({
          labelHtml: optional(["rows", index, "label"], label),
          cells: cells.map((cell, at): CompareCell => {
            const mark = COMPARE_MARKS.find((one) => one === cell);
            return mark === undefined
              ? { kind: "text", html: html(["rows", index, "cells", at], cell) }
              : { kind: "mark", mark };
          }),
        })),
        footerHtml: optional(["footer"], data.footer),
      };
    case "tree": {
      const links = data.links ?? [];
      const node = (from: TreeNodeData, path: PropertyKey[], children: TreeNodeData[], childPath: PropertyKey[]): TreeNode => ({
        labelHtml: html([...path, "label"], from.label),
        noteHtml: optional([...path, "note"], from.note),
        state: from.state ?? null,
        links: links.flatMap((link, index) =>
          link.from === from.label
            ? [{ labelHtml: optional(["links", index, "label"], link.label), toHtml: html(["links", index, "to"], link.to) }]
            : [],
        ),
        children: children.map((child, index) =>
          node(child, [...childPath, index], child.children ?? [], [...childPath, index, "children"]),
        ),
      });
      // The root's children are the tree's nodes.
      return { ...captioned, type: "tree", root: node(data.root, ["root"], data.nodes, ["nodes"]) };
    }
    case "layers": {
      const layer = (from: LayerData, path: PropertyKey[]): Layer => ({
        labelHtml: html([...path, "label"], from.label),
        noteHtml: optional([...path, "note"], from.note),
        children: (from.children ?? []).map((child, index) => layer(child, [...path, "children", index])),
      });
      return {
        ...captioned,
        type: "layers",
        mode: data.mode,
        layers: data.layers.map((from, index) => layer(from, ["layers", index])),
      };
    }
    case "git": {
      const { commits, forks, merges, slots } = gitLayout(data.branches);
      const worktrees = data.worktrees ?? [];
      return {
        ...captioned,
        type: "git",
        lanes: data.branches.map((branch, lane) => {
          const at = worktrees.findIndex((worktree) => worktree.branch === branch.name);
          return {
            nameHtml: html(["branches", lane, "name"], branch.name),
            worktreeHtml: at === -1 ? null : html(["worktrees", at, "label"], worktrees[at].label),
            commits: commits[lane],
          };
        }),
        forks,
        merges: merges.map(({ label, ...join }) => ({
          ...join,
          labelHtml: optional(["branches", join.from, "merge", "label"], label),
        })),
        slots,
      };
    }
    case "cycle":
      return {
        ...captioned,
        type: "cycle",
        stepsHtml: data.steps.map((step, index) => html(["steps", index], step)),
        outsideHtml: optional(["outside"], data.outside),
      };
  }
}
