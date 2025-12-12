import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidRenderer({ chart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    // Generate a unique ID for this render
    const uniqueId = "mermaid-" + Math.random().toString(36).substr(2, 9);

    mermaid.initialize({ startOnLoad: false, theme: "default" });

    mermaid.render(uniqueId, chart)
      .then((svgCode) => {
        containerRef.current.innerHTML = svgCode;
      })
      .catch((err) => {
        console.error("Mermaid rendering error:", err);
        containerRef.current.innerHTML = "<p class='text-red-500'>Failed to render ER Diagram.</p>";
      });
  }, [chart]);

  return <div ref={containerRef} />;
}
