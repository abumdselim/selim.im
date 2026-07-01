import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools",
  robots: { index: false, follow: false },
};

export default function ToolsPage() {
  return (
    <iframe
      src="/tools/id-card/index.html"
      title="NID Card Generator"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}
