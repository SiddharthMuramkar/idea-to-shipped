import type { CSSProperties } from "react";
import type { Scene } from "@/lessons/lessons";
import { Icon } from "./icons";

// A Scene, rendered on the server in its FINAL state: every item of every
// step is in the HTML and visible, so with no JavaScript the picture is
// complete and a screen reader reads all of it.
//
// The contract with the scene stepper (lesson-engine ticket 04, deferred):
// - Steps are numbered from 1, in caption order. Step 0 is the empty frame.
// - Every item carries data-step="<n>": the step that adds it. Items added by
//   the last step carry data-new, the "just arrived" highlight.
// - Caption rows are <li data-step="<n>"> in .scene-steps, in the reading
//   column. The figure and its captions share one .scene-run wrapper.
// - Press builds no stepper: no CSS hides items by step and nothing pins.
//   The hooks above stay so a future stepper (under ADR 0007) can still set
//   data-stepper="on" / data-active-step on the figure and update the
//   kind-specific state: flow nodes' data-state and aria-current, files
//   rows' data-change, the meter's --fill, data-zone and the reading marked
//   data-current, and the terminal command marked data-cursor.
//
// Final-state invariants (what the markup below guarantees):
// - SceneRun is the only export: <div class="scene-run" data-scene-run>
//   wrapping SceneFigure, then <ol class="scene-steps"> whose
//   <li class="scene-step" data-step="<n>"> rows carry the step number
//   again in .scene-step-num and the caption as captionHtml.
// - SceneFigure is <figure id data-scene="<kind>" data-steps="<count>">
//   (plus data-zone on a meter with a zone: "smart" at or below the zone,
//   "dumb" strictly past it), a <figcaption id="<id>--title"> title
//   (DEFAULT_TITLES when the Scene has none), and .scene-frame around
//   the kind body. Meter gauges point aria-labelledby at that title id.
// - Every kind flattens steps with itemsOf (1-based, caption order) and
//   renders all items at once: chat messages and terminal lines flag the
//   last step with data-new; the terminal also flags its last command
//   with data-cursor and sets --chars. Flow nodes carry data-node,
//   data-step (first reached), data-at (every landing) and data-state
//   (current = last visit, else done/idle) with aria-current="step" on
//   current only; an edge is data-drawn once both ends are reached, at
//   the later first-reached step. Files collapse to one row per path in
//   first-appearance order: data-step is the first step, data-change the
//   latest change, data-changes the full "step:change" history, and
//   data-new when any change lands in the last step. The meter renders
//   only its last reading as --fill / aria-valuenow (an all-empty Scene
//   falls back to 0 / "Empty", never a crash), with every reading kept
//   as a notch and list row and only the last marked data-current.
// - Flags use `flag`: present as "" when on, omitted when off. Nothing
//   here reads step state back; changing a Scene means changing its
//   steps in the Lesson source, not patching this output.

type SceneOf<K extends Scene["kind"]> = Extract<Scene, { kind: K }>;

// Data attributes that are either present (empty) or left out.
const flag = (on: boolean) => (on ? "" : undefined);

// A Scene with no title: still a named figure.
const DEFAULT_TITLES: Record<Scene["kind"], string> = {
  chat: "Conversation",
  terminal: "Terminal",
  flow: "Flow",
  files: "Files",
  meter: "Meter",
};

const titleOf = (scene: Scene) => scene.title ?? DEFAULT_TITLES[scene.kind];

// Every item of every step, in order, tagged with its step number.
function itemsOf<I>(steps: { items: I[] }[]): (I & { step: number })[] {
  return steps.flatMap((step, i) => step.items.map((item) => ({ ...item, step: i + 1 })));
}

function Chat({ scene }: { scene: SceneOf<"chat"> }) {
  const last = scene.steps.length;
  const items = itemsOf(scene.steps);
  return (
    <ol className="chat-log">
      {items.map((message, i) => (
        <li
          key={i}
          className={`chat-msg chat-msg--${message.from}`}
          data-step={message.step}
          data-new={flag(message.step === last)}
          data-first={flag(i === 0 || items[i - 1].from !== message.from)}
        >
          <span className="chat-avatar" aria-hidden="true">
            {message.from === "you" ? "You" : <Icon name="big-idea" />}
          </span>
          <p className="chat-bubble">
            <span className="visually-hidden">{message.from === "you" ? "You: " : "Agent: "}</span>
            <span dangerouslySetInnerHTML={{ __html: message.html }} />
          </p>
        </li>
      ))}
    </ol>
  );
}

function Terminal({ scene }: { scene: SceneOf<"terminal"> }) {
  const last = scene.steps.length;
  const lines = itemsOf(scene.steps);
  const cursorAt = lines.findLastIndex((line) => line.type === "command");
  return (
    <div className="term-screen">
      {lines.map((line, i) =>
        line.type === "command" ? (
          <div
            key={i}
            className="term-line term-cmd"
            data-step={line.step}
            data-new={flag(line.step === last)}
            data-cursor={flag(i === cursorAt)}
            style={{ "--chars": line.text.length } as CSSProperties}
          >
            <span className="term-prompt" aria-hidden="true">
              $
            </span>
            <kbd>{line.text}</kbd>
            <span className="term-cursor" aria-hidden="true" />
          </div>
        ) : (
          <samp key={i} className="term-line term-out" data-step={line.step} data-new={flag(line.step === last)}>
            {line.text}
          </samp>
        ),
      )}
    </div>
  );
}

type FlowNode = SceneOf<"flow">["nodes"][number];

// Where a flow stands in its final state: when each node is first reached,
// every step that lands on it, and the node reached last.
type FlowState = { firstReached: Map<string, number>; landings: Map<string, number[]>; current: string | null };

// An edge is drawn once both of its ends have been reached.
function FlowEdge({ from, to, side = false, state }: { from: string; to: string; side?: boolean; state: FlowState }) {
  const a = state.firstReached.get(from);
  const b = state.firstReached.get(to);
  const drawnAt = a !== undefined && b !== undefined ? Math.max(a, b) : undefined;
  return (
    <span
      className={`flow-edge${side ? " flow-edge--side" : ""}`}
      data-from={from}
      data-to={to}
      data-step={drawnAt}
      data-drawn={flag(drawnAt !== undefined)}
      aria-hidden="true"
    >
      <svg viewBox={side ? "0 0 10 2" : "0 0 2 10"} preserveAspectRatio="none" focusable="false">
        {side ? (
          <line x1="0" y1="1" x2="10" y2="1" pathLength={1} />
        ) : (
          <line x1="1" y1="0" x2="1" y2="10" pathLength={1} />
        )}
      </svg>
    </span>
  );
}

function FlowNodeBox({ node, state }: { node: FlowNode; state: FlowState }) {
  const { id, label, side } = node;
  const progress = id === state.current ? "current" : state.firstReached.has(id) ? "done" : "idle";
  return (
    <div
      className={`flow-node${side ? " flow-node--side" : ""}`}
      data-node={id}
      data-step={state.firstReached.get(id)}
      data-at={state.landings.get(id)?.join(" ")}
      data-state={progress}
      aria-current={progress === "current" ? "step" : undefined}
    >
      <span className="flow-mark" aria-hidden="true">
        <Icon name="check" />
      </span>
      <span className="flow-node-text">
        {state.firstReached.has(id) && (
          <span className="flow-when">Step {state.firstReached.get(id)}</span>
        )}
        <span className="flow-label">{label}</span>
      </span>
    </div>
  );
}

function Flow({ scene }: { scene: SceneOf<"flow"> }) {
  const visits = itemsOf(scene.steps);
  const state: FlowState = { firstReached: new Map(), landings: new Map(), current: visits.at(-1)?.at ?? null };
  for (const { at, step } of visits) {
    if (!state.firstReached.has(at)) state.firstReached.set(at, step);
    state.landings.set(at, [...(state.landings.get(at) ?? []), step]);
  }

  // Main nodes stack top to bottom. A side node hangs off the main node
  // declared just before it (a fork, such as "Small job? Skip the spec").
  const stops: { node: FlowNode; sides: FlowNode[] }[] = [];
  for (const node of scene.nodes) {
    if (node.side && stops.length > 0) stops[stops.length - 1].sides.push(node);
    else stops.push({ node, sides: [] });
  }
  const branched = stops.some((stop) => stop.sides.length > 0);

  return (
    <ol className={`flow-map${branched ? " flow-map--branched" : ""}`}>
      {stops.map(({ node, sides }, i) => (
        <li key={node.id} className="flow-stop">
          {i > 0 && <FlowEdge from={stops[i - 1].node.id} to={node.id} state={state} />}
          <FlowNodeBox node={node} state={state} />
          {sides.length > 0 && (
            <ul className="flow-sides">
              {sides.map((side) => (
                <li key={side.id} className="flow-side">
                  <FlowEdge from={node.id} to={side.id} side state={state} />
                  <FlowNodeBox node={side} state={state} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}

type FileChange = SceneOf<"files">["steps"][number]["items"][number]["change"];

function Files({ scene }: { scene: SceneOf<"files"> }) {
  const last = scene.steps.length;
  // One row per path, in the order paths first appear. A later "~" (or "+")
  // for a path that's already there re-badges its row instead of adding one.
  const rows = new Map<string, { step: number; history: { step: number; change: FileChange }[] }>();
  for (const { path, change, step } of itemsOf(scene.steps)) {
    const row = rows.get(path);
    if (row) row.history.push({ step, change });
    else rows.set(path, { step, history: [{ step, change }] });
  }
  return (
    <ul className="file-list">
      {[...rows].map(([path, { step, history }]) => {
        const slash = path.replace(/\/$/, "").lastIndexOf("/");
        const dir = path.slice(0, slash + 1);
        const name = path.slice(slash + 1);
        return (
          <li
            key={path}
            className="file-row"
            data-step={step}
            data-change={history.at(-1)!.change}
            data-changes={history.map((h) => `${h.step}:${h.change}`).join(" ")}
            data-new={flag(history.some((h) => h.step === last))}
          >
            <Icon name="file" className="icon file-icon" />
            <span className="file-path">
              {dir && <span className="file-dir">{dir}</span>}
              <span className="file-name">{name}</span>
            </span>
            <span className="file-badge file-badge--added">added</span>
            <span className="file-badge file-badge--changed">changed</span>
          </li>
        );
      })}
    </ul>
  );
}

// The meter's reading in the final state: its last one. The parser insists
// on at least one; an empty gauge is the fallback if one ever slips through,
// never a crashed page.
function latestReading(scene: SceneOf<"meter">) {
  return itemsOf(scene.steps).at(-1) ?? { fill: 0, label: "Empty", step: 0 };
}

function Meter({ scene, titleId }: { scene: SceneOf<"meter">; titleId: string }) {
  const readings = itemsOf(scene.steps);
  const now = latestReading(scene);
  const { zone } = scene;
  return (
    <div
      className="meter"
      style={{ "--fill": now.fill / 100, "--zone": (zone ?? 0) / 100 } as CSSProperties}
    >
      <div className="meter-track">
        {zone !== null && (
          <>
            <span className="meter-region meter-region--smart">Smart zone</span>
            <span className="meter-region meter-region--dumb">Dumb zone</span>
          </>
        )}
        <div
          className="meter-gauge"
          role="meter"
          aria-labelledby={titleId}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={now.fill}
          aria-valuetext={`${now.fill}%: ${now.label}`}
        >
          <span className="meter-fill" />
          {readings.map((reading, i) => (
            <span
              key={i}
              className="meter-notch"
              data-step={reading.step}
              data-current={flag(i === readings.length - 1)}
              style={{ "--at": reading.fill / 100 } as CSSProperties}
            />
          ))}
        </div>
        {zone !== null && <span className="meter-zone" aria-hidden="true" />}
      </div>
      <ol className="meter-readings">
        {readings.map((reading, i) => (
          <li
            key={i}
            className="meter-reading"
            data-step={reading.step}
            data-fill={reading.fill}
            data-current={flag(i === readings.length - 1)}
          >
            <span className="meter-value">{reading.fill}%</span>
            <span className="meter-label">{reading.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SceneBody({ scene, titleId }: { scene: Scene; titleId: string }) {
  switch (scene.kind) {
    case "chat":
      return <Chat scene={scene} />;
    case "terminal":
      return <Terminal scene={scene} />;
    case "flow":
      return <Flow scene={scene} />;
    case "files":
      return <Files scene={scene} />;
    case "meter":
      return <Meter scene={scene} titleId={titleId} />;
  }
}

function zoneOf(scene: Scene): "smart" | "dumb" | undefined {
  if (scene.kind !== "meter" || scene.zone === null) return undefined;
  return latestReading(scene).fill > scene.zone ? "dumb" : "smart";
}

// The picture itself: a figure with its title as the figcaption.
function SceneFigure({ scene, id }: { scene: Scene; id: string }) {
  const titleId = `${id}--title`;
  return (
    <figure
      id={id}
      className={`scene scene--${scene.kind}`}
      data-scene={scene.kind}
      data-steps={scene.steps.length}
      data-zone={zoneOf(scene)}
    >
      <figcaption id={titleId} className="scene-title">
        {scene.kind === "terminal" && (
          <span className="scene-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        )}
        {titleOf(scene)}
      </figcaption>
      <div className="scene-frame">
        <SceneBody scene={scene} titleId={titleId} />
      </div>
    </figure>
  );
}

// A Scene where it was written, in the reading column: its figure, then its
// step captions as an ordered list explaining the complete picture.
export function SceneRun({ scene, id }: { scene: Scene; id: string }) {
  return (
    <div className="scene-run" data-scene-run>
      <SceneFigure scene={scene} id={id} />
      <ol className="scene-steps" aria-label={`${titleOf(scene)}, step by step`}>
        {scene.steps.map((step, i) => (
          <li key={i} className="scene-step" data-step={i + 1}>
            <span className="scene-step-num" aria-hidden="true">
              {i + 1}
            </span>
            <p dangerouslySetInnerHTML={{ __html: step.captionHtml }} />
          </li>
        ))}
      </ol>
    </div>
  );
}
