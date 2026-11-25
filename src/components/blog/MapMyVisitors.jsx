import { useEffect, useRef } from "react";

export default function MapMyVisitors({ src }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        // Defer insertion so React's development remount doesn't request the map twice.
        const frame = requestAnimationFrame(() => {
            const script = document.createElement("script");
            script.id = "mapmyvisitors";
            script.src = src;
            container.appendChild(script);
        });

        return () => {
            cancelAnimationFrame(frame);
            container.replaceChildren();
        };
    }, [src]);

    return <div ref={containerRef} style={{ marginTop: "2rem", maxWidth: "100%" }} />;
}
