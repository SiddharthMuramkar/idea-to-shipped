import { renderInline, type Fail } from "./markdown";

// Each step lists only what it ADDS to the picture.
type SceneStep<I> = { captionHtml: string; items: I[] };

export type Scene =
  | { kind: "chat"; title: string | null; steps: SceneStep<{ from: "you" | "agent"; html: string }>[] }
  | { kind: "terminal"; title: string | null; steps: SceneStep<{ type: "command" | "output"; text: string }>[] }
  | {
      kind: "flow";
      title: string | null;
      nodes: { id: string; label: string; side: boolean }[];
      steps: SceneStep<{ at: string }>[];
    }
  | { kind: "files"; title: string | null; steps: SceneStep<{ path: string; change: "added" | "changed" }>[] }
  | { kind: "meter"; title: string | null; zone: number | null; steps: SceneStep<{ fill: number; label: string }>[] };

const SCENE_KINDS = ["chat", "terminal", "flow", "files", "meter"] as const;
type SceneKind = Scene["kind"];

function percent(value: string): number | null {
  if (!/^\d{1,3}(?:\.\d+)?$/.test(value)) return null;
  const n = Number(value);
  return n <= 100 ? n : null;
}

// `itemKeys` are "word:" items, so they're never read as settings.
function parseSteps<I>(
  lines: string[],
  fail: Fail,
  grammar: {
    itemKeys: string[];
    setting: (key: string, value: string) => void;
    item: (line: string) => I | null;
    describe: string;
    bareHashIsItem?: boolean;
  },
): SceneStep<I>[] {
  const steps: SceneStep<I>[] = [];
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === "") continue;
    const step = grammar.bareHashIsItem && raw === "#" ? null : /^#(?: (.*))?$/.exec(line);
    if (step) {
      const caption = (step[1] ?? "").trim();
      if (caption === "") throw fail('a step needs a caption after the "# "');
      steps.push({ captionHtml: renderInline(caption, fail), items: [] });
      continue;
    }
    if (steps.length === 0) {
      const setting = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
      if (setting && !grammar.itemKeys.includes(setting[1])) {
        grammar.setting(setting[1], setting[2].trim());
        continue;
      }
      throw fail(`"${line.trim()}" comes before the first "# " step: put a "# <caption>" line above it`);
    }
    const item = grammar.item(line);
    if (item === null) throw fail(`"${line.trim()}" isn't a ${grammar.describe}`);
    steps[steps.length - 1].items.push(item);
  }
  if (steps.length === 0) throw fail('needs at least one "# " step');
  return steps;
}

export function parseScene(file: string, type: string | undefined, body: string): Scene {
  if (!(SCENE_KINDS as readonly (string | undefined)[]).includes(type)) {
    throw new Error(
      `${file}: scene: the type must be chat, terminal, flow, files or meter (got "${type ?? ""}")`,
    );
  }
  const kind = type as SceneKind;
  const fail: Fail = (problem) => new Error(`${file}: scene ${kind}: ${problem}`);
  const lines = body.split("\n");

  let title: string | null = null;
  const nodes: { id: string; label: string; side: boolean }[] = [];
  let zone: number | null = null;

  // Settings every kind shares, then the extras one kind allows.
  const setting = (extra: Record<string, (value: string) => void> = {}) =>
    (key: string, value: string) => {
      if (key === "title") {
        if (title !== null) throw fail('"title" is set twice: keep one');
        if (value === "") throw fail('"title" needs a value');
        title = value;
      } else if (extra[key]) {
        extra[key](value);
      } else {
        const known = ["title", ...Object.keys(extra)].join(", ");
        throw fail(`unknown setting "${key}": remove it (a ${kind} Scene's settings are ${known})`);
      }
    };

  switch (kind) {
    case "chat": {
      const steps = parseSteps(lines, fail, {
        itemKeys: ["you", "agent"],
        setting: setting(),
        describe: 'chat line ("you: …" or "agent: …")',
        item(line) {
          const match = /^(you|agent):\s*(.*)$/.exec(line);
          if (!match) return null;
          if (match[2].trim() === "") throw fail(`"${line.trim()}" has nothing to say: write the message after the colon`);
          return { from: match[1] as "you" | "agent", html: renderInline(match[2].trim(), fail) };
        },
      });
      return { kind, title, steps };
    }

    case "terminal": {
      const steps = parseSteps(lines, fail, {
        itemKeys: [],
        setting: setting(),
        describe: "terminal line",
        bareHashIsItem: true,
        // A plain "# " line starts the next step, so output that starts with
        // "# " (a shell comment) is written "\# ", and shown without the "\".
        item(line) {
          const command = /^\$(?: (.*))?$/.exec(line);
          if (!command) return { type: "output" as const, text: line.replace(/^\\#/, "#") };
          if (!command[1]?.trim()) throw fail('"$" needs a command after it');
          return { type: "command" as const, text: command[1].trim() };
        },
      });
      return { kind, title, steps };
    }

    case "flow": {
      const steps = parseSteps(lines, fail, {
        itemKeys: ["at"],
        setting: setting({
          node(value) {
            const [id, label, side, ...rest] = value.split("|").map((part) => part.trim());
            if (!id || /\s/.test(id) || !label || (side !== undefined && side !== "side") || rest.length) {
              throw fail(`"node: ${value}" should read "node: <id> | <label>" or "node: <id> | <label> | side"`);
            }
            if (nodes.some((node) => node.id === id)) throw fail(`node "${id}" is declared twice: give each node its own id`);
            // A side node is drawn beside the main node before it.
            if (side === "side" && !nodes.some((node) => !node.side)) {
              throw fail(`"node: ${value}": a side node needs a main node declared before it`);
            }
            nodes.push({ id, label, side: side === "side" });
          },
        }),
        describe: 'flow line ("at: <node id>")',
        item(line) {
          const match = /^at:\s*(\S*)\s*$/.exec(line);
          if (!match) return null;
          if (!nodes.some((node) => node.id === match[1])) {
            throw fail(`"${line.trim()}": no node "${match[1]}" (add "node: ${match[1]} | Label")`);
          }
          return { at: match[1] };
        },
      });
      return { kind, title, nodes, steps };
    }

    case "files": {
      const steps = parseSteps(lines, fail, {
        itemKeys: [],
        setting: setting(),
        describe: 'files line ("+ path" or "~ path")',
        item(line) {
          const match = /^([+~])\s+(\S.*)$/.exec(line);
          if (!match) return null;
          return { path: match[2].trim(), change: match[1] === "+" ? ("added" as const) : ("changed" as const) };
        },
      });
      return { kind, title, steps };
    }

    case "meter": {
      const steps = parseSteps(lines, fail, {
        itemKeys: ["fill"],
        // The zone is where the Smart zone ends and the meter turns to the
        // warning colour.
        setting: setting({
          zone(value) {
            if (zone !== null) throw fail('"zone" is set twice: keep one');
            zone = percent(value.replace(/%$/, ""));
            if (zone === null) throw fail(`"zone: ${value}" needs a number from 0 to 100`);
          },
        }),
        describe: 'meter line ("fill: <0-100>% | label")',
        item(line) {
          const match = /^fill:\s*(\S+?)%\s*\|\s*(.+)$/.exec(line);
          if (!match) return null;
          const fill = percent(match[1]);
          if (fill === null) throw fail(`"${line.trim()}": the fill must be a number from 0 to 100`);
          return { fill, label: match[2].trim() };
        },
      });
      // A step may leave the fill where it was, but the gauge needs a reading
      // to show at all.
      if (steps.every((step) => step.items.length === 0)) {
        throw fail('needs at least one "fill: <0-100>% | label" line');
      }
      return { kind, title, zone, steps };
    }
  }
}
