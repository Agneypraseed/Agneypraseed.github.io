import { useRef, useEffect } from "react";

const CanvasBackground = ({ darkMode }) => {
    const canvasRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        let time = 0;

        const drawWave = (yBase, amplitude, wavelength, speed, opacity, lineWidth) => {
            ctx.beginPath();
            ctx.strokeStyle = darkMode
                ? `rgba(160, 140, 255, ${opacity})`
                : `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = lineWidth;

            for (let x = 0; x <= canvas.width; x += 2) {
                const y =
                    yBase +
                    Math.sin(x / wavelength + time * speed) * amplitude +
                    Math.sin(x / (wavelength * 0.6) + time * speed * 1.3) * (amplitude * 0.3);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const h = canvas.height;

            // Layer 1 — slow, large, background waves
            drawWave(h * 0.3, 40, 300, 0.4, 0.06, 1.5);
            drawWave(h * 0.5, 50, 350, 0.35, 0.05, 1.5);
            drawWave(h * 0.7, 45, 280, 0.45, 0.06, 1.5);

            // Layer 2 — medium waves
            drawWave(h * 0.25, 30, 200, 0.6, 0.1, 1.2);
            drawWave(h * 0.45, 35, 220, 0.55, 0.08, 1.2);
            drawWave(h * 0.6, 30, 250, 0.5, 0.1, 1.2);
            drawWave(h * 0.8, 25, 180, 0.65, 0.08, 1.2);

            // Layer 3 — foreground accent waves
            drawWave(h * 0.35, 20, 150, 0.8, 0.15, 1);
            drawWave(h * 0.55, 25, 170, 0.7, 0.12, 1);
            drawWave(h * 0.75, 22, 160, 0.75, 0.14, 1);

            time += 0.01;
            animRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [darkMode]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
                pointerEvents: "none",
            }}
        />
    );
};

export default CanvasBackground;
