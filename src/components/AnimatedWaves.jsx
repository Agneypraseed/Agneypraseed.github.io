import { useEffect, useRef } from "react";

const AnimatedWaves = ({ darkMode }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationId;
        let time = 0;

        const colors = darkMode 
            ? ["#8b5cf6", "#6366f1", "#22d3ee", "#a78bfa", "#c4b5fd"]
            : ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];

        // Lissajous curve parameters
        const curves = [
            { a: 3, b: 2, delta: Math.PI / 2 },
            { a: 5, b: 4, delta: Math.PI / 4 },
            { a: 3, b: 4, delta: 0 },
            { a: 5, b: 6, delta: Math.PI / 3 },
            { a: 7, b: 6, delta: Math.PI / 6 },
        ];

        const resize = () => {
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            ctx.scale(2, 2);
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;
            const centerY = height / 2;

            curves.forEach((curve, i) => {
                ctx.beginPath();
                ctx.strokeStyle = colors[i];
                ctx.lineWidth = 2;
                ctx.lineCap = "round";

                for (let j = 0; j <= 200; j++) {
                    const t = (j / 200) * Math.PI * 2;
                    const x = (j / 200) * width;
                    const y = centerY + 20 * Math.sin(curve.b * t + time * 0.02 * (1 + i * 0.2) + curve.delta);
                    
                    if (j === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            });

            time += 1;
            animationId = requestAnimationFrame(animate);
        };

        resize();
        animate();

        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, [darkMode]);

    return (
        <div 
            style={{ 
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                width: "100%",
                maxWidth: "600px",
                marginBottom: "2rem",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    flex: "1",
                    height: "80px",
                }}
            />
            {/* <span style={{
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: "400",
                fontStyle: "italic",
                whiteSpace: "nowrap",
            }}>
                Lissajous
            </span> */}
        </div>
    );
};

export default AnimatedWaves;
