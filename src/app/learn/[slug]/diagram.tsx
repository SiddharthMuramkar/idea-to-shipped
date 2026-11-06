import { useId, type CSSProperties, type ReactNode } from "react";
import type { ChainStep, CompareCell, Diagram, DiagramOf, Layer, TreeNode } from "@/lessons/diagrams";
import { htmlToText } from "@/lessons/markdown";
import styles from "./diagram.module.css";

// A Diagram, drawn on the server as plain HTML and CSS, with no JavaScript:
// a figure named by its caption. Every word in it is real text (lists and a
// table, which screen readers read in order); only lines, arrows and dots
// are drawn, and those are hidden from screen readers. Its strings arrive as
// HTML that parseDiagram rendered from their inline Markdown.

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

const html = (markup: string) => ({ __html: markup });

/**
 * The drawing sits in a box of its own that scrolls sideways if a wide
 * Diagram can't fit, so the page never does. Each type lays itself out for
 * the box's width (container queries in diagram.module.css).
 */
export function DiagramView({ diagram }: { diagram: Diagram }) {
  const captionId = useId();
  return (
    <figure className={styles.figure} aria-labelledby={captionId} data-diagram={diagram.type} data-reveal>
      <div className={styles.canvas}>
        <Drawing diagram={diagram} />
      </div>
      <figcaption id={captionId} className={styles.caption} dangerouslySetInnerHTML={html(diagram.captionHtml)} />
    </figure>
  );
}

function Drawing({ diagram }: { diagram: Diagram }) {
  switch (diagram.type) {
    case "chain":
      return <Chain chain={diagram} />;
    case "compare":
      return <Compare compare={diagram} />;
    case "tree":
      return <Tree tree={diagram} />;
    case "layers":
      return <Layers layers={diagram} />;
    case "git":
      return <Git git={diagram} />;
    case "cycle":
      return <Cycle cycle={diagram} />;
  }
}

// The marks a Diagram draws: compare's check, cross and dash, a done tree
// node's check, and a tree link's arrow. Each is hidden from screen readers,
// which get a word for it instead.
const MARKS = {
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  cross: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  dash: <path d="M6 12h12" />,
  arrow: <path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" />,
} as const;

function Mark({ name, className }: { name: keyof typeof MARKS; className?: string }) {
  return (
    <svg
      className={cx(styles.mark, className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {MARKS[name]}
    </svg>
  );
}

// Words only screen readers get, for what a drawing shows without words.
function Hidden({ children }: { children: ReactNode }) {
  return <span className="visually-hidden">{children}</span>;
}

/** A box's label, with its note under it if it has one. */
function Words({ labelHtml, noteHtml = null }: { labelHtml: string; noteHtml?: string | null }) {
  return (
    <>
      <span className={styles.label} dangerouslySetInnerHTML={html(labelHtml)} />
      {noteHtml === null ? null : <span className={styles.note} dangerouslySetInnerHTML={html(noteHtml)} />}
    </>
  );
}

// ---------------------------------------------------------------------------
// chain: steps in order, joined by arrows. A group's steps are a list of their
// own, with the group's label on a bracket beside them.
// ---------------------------------------------------------------------------

// Left to right when there are at most 4 steps and every label is at most 24
// characters as shown (a link's target isn't), once the box is wide enough;
// otherwise top to bottom.
function goesAcross({ steps }: DiagramOf<"chain">): boolean {
  const labels = steps.flatMap((step) => (step.kind === "box" ? [step.labelHtml] : step.boxesHtml));
  return steps.length <= 4 && labels.every((label) => htmlToText(label).length <= 24);
}

function Chain({ chain }: { chain: DiagramOf<"chain"> }) {
  const items: ReactNode[] = [];
  for (let number = 1; number <= chain.steps.length; number += 1) {
    const group = chain.groups.find(({ from }) => from === number);
    if (!group) {
      items.push(<ChainItem key={number} step={chain.steps[number - 1]} first={number === 1} />);
      continue;
    }
    items.push(
      <li
        key={number}
        className={cx(styles.item, styles.group)}
        style={{ "--group-span": group.to - group.from + 1 } as CSSProperties}
      >
        <ol className={cx(styles.list, styles.groupSteps)}>
          {chain.steps.slice(group.from - 1, group.to).map((step, index) => (
            <ChainItem key={index} step={step} first={group.from + index === 1} />
          ))}
        </ol>
        <span className={styles.bracket}>
          <span dangerouslySetInnerHTML={html(group.labelHtml)} />
        </span>
      </li>,
    );
    number = group.to;
  }
  return (
    <ol
      className={cx(
        styles.list,
        styles.chain,
        goesAcross(chain) && styles.across,
        chain.groups.length > 0 && styles.grouped,
      )}
      style={{ "--chain-steps": chain.steps.length } as CSSProperties}
    >
      {items}
    </ol>
  );
}

// One step: a box, or a parallel step's 2–3 boxes sharing its place. Every
// step but the first has an arrow into it.
function ChainItem({ step, first }: { step: ChainStep; first: boolean }) {
  if (step.kind === "parallel") {
    return (
      <li className={cx(styles.item, styles.step, !first && styles.arrowed)}>
        <ul className={cx(styles.list, styles.parallel)}>
          {step.boxesHtml.map((box, index) => (
            <li key={index} className={cx(styles.item, styles.node)}>
              <Words labelHtml={box} />
            </li>
          ))}
        </ul>
      </li>
    );
  }
  return (
    <li className={cx(styles.item, styles.node, styles.step, !first && styles.arrowed)}>
      <Words labelHtml={step.labelHtml} noteHtml={step.noteHtml} />
    </li>
  );
}

// ---------------------------------------------------------------------------
// compare: things side by side, row by row, as a real table. If any row has a
// label, the header starts with a blank cell over the labels.
// ---------------------------------------------------------------------------

function Compare({ compare }: { compare: DiagramOf<"compare"> }) {
  const labelled = compare.rows.some((row) => row.labelHtml !== null);
  return (
    <table className={cx(styles.table, labelled && styles.labelled)}>
      <thead>
        <tr>
          {labelled ? <td /> : null}
          {compare.columnsHtml.map((column, index) => (
            <th key={index} scope="col" dangerouslySetInnerHTML={html(column)} />
          ))}
        </tr>
      </thead>
      <tbody>
        {compare.rows.map((row, index) => (
          <tr key={index}>
            {labelled ? <th scope="row" dangerouslySetInnerHTML={html(row.labelHtml ?? "")} /> : null}
            {row.cells.map((cell, at) => (
              <CompareCellView key={at} cell={cell} />
            ))}
          </tr>
        ))}
      </tbody>
      {compare.footerHtml === null ? null : (
        <tfoot>
          <tr>
            <td colSpan={compare.columnsHtml.length + (labelled ? 1 : 0)} dangerouslySetInnerHTML={html(compare.footerHtml)} />
          </tr>
        </tfoot>
      )}
    </table>
  );
}

// "yes", "no" and "" draw a check, a cross and a dash; screen readers get the
// word, or nothing for an empty cell.
function CompareCellView({ cell }: { cell: CompareCell }) {
  if (cell.kind === "text") return <td dangerouslySetInnerHTML={html(cell.html)} />;
  if (cell.mark === "") {
    return (
      <td>
        <Mark name="dash" className={styles.blank} />
      </td>
    );
  }
  return (
    <td>
      <Mark name={cell.mark === "yes" ? "check" : "cross"} className={cell.mark === "yes" ? styles.yes : styles.no} />
      <Hidden>{cell.mark}</Hidden>
    </td>
  );
}

// ---------------------------------------------------------------------------
// tree: a hierarchy, as nested lists drawn like a file tree.
// ---------------------------------------------------------------------------

function Tree({ tree }: { tree: DiagramOf<"tree"> }) {
  return (
    <ul className={cx(styles.list, styles.tree)}>
      <TreeItem node={tree.root} />
    </ul>
  );
}

// A node, its links, then the nodes under it. A node's state shows as its
// outline or fill (and a check), and screen readers get it as a word.
function TreeItem({ node }: { node: TreeNode }) {
  const done = node.state === "settled" || node.state === "closed";
  return (
    <li className={styles.item}>
      <span
        className={cx(styles.node, styles.treeNode, node.state === "frontier" && styles.frontier, done && styles.done)}
      >
        {done ? <Mark name="check" className={styles.treeCheck} /> : null}
        <span>
          <Words labelHtml={node.labelHtml} noteHtml={node.noteHtml} />
          {node.state === null ? null : <Hidden> ({node.state})</Hidden>}
        </span>
      </span>
      {node.links.length === 0 ? null : (
        <span className={styles.links}>
          {node.links.map((link, index) => (
            <span key={index} className={styles.link}>
              <Mark name="arrow" className={styles.linkArrow} />
              <span>
                {link.labelHtml === null ? null : (
                  <>
                    <span dangerouslySetInnerHTML={html(link.labelHtml)} />{" "}
                  </>
                )}
                <span className={styles.linkTo} dangerouslySetInnerHTML={html(link.toHtml)} />
              </span>
            </span>
          ))}
        </span>
      )}
      {node.children.length === 0 ? null : (
        <ul className={cx(styles.list, styles.children)}>
          {node.children.map((child, index) => (
            <TreeItem key={index} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// layers: boxes inside boxes (nested), or a vertical stack (stacked), as
// nested lists. A stack is in order, so it's an ordered list.
// ---------------------------------------------------------------------------

function Layers({ layers }: { layers: DiagramOf<"layers"> }) {
  const List = layers.mode === "stacked" ? "ol" : "ul";
  return (
    <List className={cx(styles.list, layers.mode === "stacked" ? styles.stacked : styles.nested)}>
      {layers.layers.map((layer, index) => (
        <LayerItem key={index} layer={layer} />
      ))}
    </List>
  );
}

function LayerItem({ layer }: { layer: Layer }) {
  return (
    <li className={cx(styles.item, styles.node, styles.layer)}>
      <Words labelHtml={layer.labelHtml} noteHtml={layer.noteHtml} />
      {layer.children.length === 0 ? null : (
        <ul className={cx(styles.list, styles.inside)}>
          {layer.children.map((child, index) => (
            <LayerItem key={index} layer={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// git: branches, commits and merges, one lane per branch, the first being the
// trunk. Each lane is a row: its name (and worktree, if it has one) at its
// start, then its line and commits. Only the lines and dots are SVG; screen
// readers get each lane's name, where it branches off and what it merges into.
// ---------------------------------------------------------------------------

// The line's height in each lane's row: lines and dots sit this far down.
const LINE_Y = 12;

function Git({ git }: { git: DiagramOf<"git"> }) {
  const { lanes, forks, merges, slots } = git;
  const x = (slot: number) => `${((slot - 0.5) / slots) * 100}%`;
  const joins = [...forks, ...merges];
  const nameOf = (lane: number) => htmlToText(lanes[lane].nameHtml);
  return (
    <div className={styles.git} style={{ "--git-line-y": `${LINE_Y}px`, "--git-slots": slots } as CSSProperties}>
      <ol className={cx(styles.list, styles.lanes)}>
        {lanes.map((lane, index) => {
          const trunk = index === 0 ? styles.trunk : styles.branch;
          const fork = forks.find((join) => join.to === index);
          const merge = merges.find((join) => join.from === index);
          const ends = [
            ...lane.commits,
            ...merges.filter((join) => join.to === index || join.from === index).map((join) => join.slot),
          ];
          const start = fork?.slot ?? lane.commits[0];
          const relations = [
            fork && `branches off ${nameOf(fork.from)}`,
            merge && `merges into ${nameOf(merge.to)}`,
          ].filter(Boolean);
          return (
            <li key={index} className={cx(styles.item, styles.lane, trunk)}>
              <span className={styles.laneName}>
                <span>
                  <span dangerouslySetInnerHTML={html(lane.nameHtml)} />
                  {relations.length > 0 ? <Hidden> ({relations.join(", ")})</Hidden> : null}
                </span>
                {lane.worktreeHtml === null ? null : (
                  <span className={styles.worktree} dangerouslySetInnerHTML={html(lane.worktreeHtml)} />
                )}
              </span>
              <span className={styles.track}>
                <svg className={styles.lines} width="100%" height="100%" aria-hidden="true" focusable="false">
                  {joins.map((join, at) => {
                    const top = Math.min(join.from, join.to);
                    const bottom = Math.max(join.from, join.to);
                    if (index < top || index > bottom) return null;
                    // Every fork and merge belongs to a branch after the trunk, so it's in the branch colour.
                    return (
                      <line
                        key={at}
                        className={styles.branch}
                        x1={x(join.slot)}
                        x2={x(join.slot)}
                        y1={index === top ? LINE_Y : 0}
                        y2={index === bottom ? LINE_Y : "100%"}
                      />
                    );
                  })}
                  <line className={trunk} x1={x(start)} x2={x(Math.max(...ends))} y1={LINE_Y} y2={LINE_Y} />
                  {lane.commits.map((slot) => (
                    <circle key={slot} className={trunk} cx={x(slot)} cy={LINE_Y} r={4.5} />
                  ))}
                  {merges
                    .filter((join) => join.to === index)
                    .map((join) => (
                      <circle key={`merge-${join.from}`} className={styles.merged} cx={x(join.slot)} cy={LINE_Y} r={4.5} />
                    ))}
                </svg>
                {merges
                  .filter((join) => join.to === index && join.labelHtml !== null)
                  .map((join) => {
                    const at = (join.slot - 0.5) / slots;
                    return (
                      <span
                        key={join.from}
                        className={cx(styles.mergeLabel, at > 0.5 && styles.endsAtMerge)}
                        style={{ "--merge-at": at } as CSSProperties}
                        dangerouslySetInnerHTML={html(join.labelHtml!)}
                      />
                    );
                  })}
              </span>
            </li>
          );
        })}
      </ol>
      <p className={styles.gitNote}>(commit counts are illustrative)</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// cycle: a loop, its steps top to bottom like a chain, with one return arrow
// from the last back up to the first. Each step draws its own piece of the
// return arrow beside it, so the arrow fits steps of any height.
// ---------------------------------------------------------------------------

function Cycle({ cycle }: { cycle: DiagramOf<"cycle"> }) {
  const last = cycle.stepsHtml.length - 1;
  return (
    <div className={styles.cycle}>
      <ol className={cx(styles.list, styles.loop)}>
        {cycle.stepsHtml.map((step, index) => (
          <li key={index} className={cx(styles.item, styles.node, styles.cycleStep)}>
            <Words labelHtml={step} />
            {index === last ? <Hidden> (then back to the first step)</Hidden> : null}
            <span className={styles.back} aria-hidden="true" />
          </li>
        ))}
      </ol>
      {cycle.outsideHtml === null ? null : (
        <div className={cx(styles.node, styles.outside)}>
          <Hidden>Outside the loop: </Hidden>
          <Words labelHtml={cycle.outsideHtml} />
        </div>
      )}
    </div>
  );
}
