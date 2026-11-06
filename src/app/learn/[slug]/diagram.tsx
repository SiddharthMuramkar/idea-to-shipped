import type { Diagram } from "@/lessons/lessons";

// A stub until the real renderer lands: the Diagram's YAML as written, with
// its caption under it as the figure's name. The renderer that draws each
// type replaces this whole file and keeps the name DiagramView.
export function DiagramView({ diagram }: { diagram: Diagram }) {
  return (
    <figure className="diagram" data-diagram={diagram.type}>
      <pre>{diagram.source}</pre>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}
