import { createLibrary, defineComponent } from "@openuidev/react-lang";
import { openuiLibrary } from "@openuidev/react-ui/genui-lib";
import { z } from "zod/v4";

// The brand-fit proof: a component the model (or here, hand-built Lang) can
// compose that renders with this site's own globals.css classes, next to
// OpenUI's stock components. Created once at module scope — a fresh library
// per render makes the Renderer re-parse from scratch.
const SiteLessonCard = defineComponent({
  name: "SiteLessonCard",
  description: "A Lesson link styled like this site's lesson cards.",
  props: z.object({
    title: z.string(),
    meta: z.string(),
    href: z.string(),
  }),
  component: ({ props }) => (
    <a href={props.href} className="lesson-card">
      <span className="lesson-card-body">
        <span className="eyebrow">{props.meta}</span>
        <span className="lesson-card-title">{props.title}</span>
      </span>
    </a>
  ),
});

export const previewLibrary = createLibrary({
  root: openuiLibrary.root ?? "Stack",
  componentGroups: openuiLibrary.componentGroups,
  components: [...Object.values(openuiLibrary.components), SiteLessonCard],
});
