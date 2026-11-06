// A Diagram: a drawing made from the little YAML in a ```diagram block.
//
// A stub until the real parser lands: it reads only the two lines every
// Diagram has, its type and its caption, and keeps the YAML as written. The
// real parser, which checks each type's shape and limits, replaces this whole
// file and keeps the names Diagram and parseDiagram.
export type Diagram = { type: string; caption: string; source: string };

// A YAML scalar as written on one line: in double quotes (the format asks
// for them), in single quotes, or bare.
function unquote(value: string): string {
  if (/^".*"$/.test(value)) return value.slice(1, -1).replace(/\\(["\\])/g, "$1");
  if (/^'.*'$/.test(value)) return value.slice(1, -1).replaceAll("''", "'");
  return value;
}

export function parseDiagram(file: string, source: string): Diagram {
  const fail = (problem: string) => new Error(`${file}: diagram: ${problem}`);
  // A top-level "key: value" line; indented lines belong to other keys.
  const field = (key: string) => {
    const match = new RegExp(`^${key}:[ \\t]*(.*)$`, "m").exec(source);
    return match ? unquote(match[1].trim()) : "";
  };
  const type = field("type");
  if (type === "") throw fail('needs a "type: …" line: chain, compare, tree, layers, git or cycle');
  const caption = field("caption");
  if (caption === "") {
    throw fail('needs a "caption: …" line saying what it shows: it\'s shown under the drawing, and screen readers read it as its name');
  }
  return { type, caption, source };
}
