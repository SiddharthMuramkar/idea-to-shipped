import type { ReactNode } from "react";
// OpenUI's stylesheet, imported once for this route segment only. OpenUI
// documents it as a global-entry import; scoping it here keeps the rest of
// the site's CSS untouched, at the cost of checking the production build
// for ordering differences (done in this PR). Delete with the preview.
import "@openuidev/react-ui/styles/index.css";
import "./preview.css";

export default function OpenUiPreviewLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
