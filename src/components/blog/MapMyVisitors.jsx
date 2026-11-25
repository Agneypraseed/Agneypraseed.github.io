import { useEffect, useRef } from "react";
import "./MapMyVisitors.css";

export default function MapMyVisitors({ src }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const observer = new MutationObserver(() => {
            const widget = container.querySelector("#mapmyvisitors-widget");
            if (!widget) return;
            widget.setAttribute("aria-label", "Visitor map statistics");
            observer.disconnect();
        });
        observer.observe(container, { childList: true, subtree: true });

        // Defer insertion so React's development remount doesn't request the map twice.
        const frame = requestAnimationFrame(() => {
            const script = document.createElement("script");
            script.id = "mapmyvisitors";
            script.src = src;
            container.appendChild(script);
        });

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            container.replaceChildren();
        };
    }, [src]);

    return <div ref={containerRef} className="mapmyvisitors-embed" />;
}
