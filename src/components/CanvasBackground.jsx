import React, { useRef, useEffect } from "react";
import p5 from "p5";

const CanvasBackground = () => {
    const canvasRef = useRef();

    useEffect(() => {
        const sketch = (p) => {
            let waveY = [];
            let waveCount = 1000;

            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent(canvasRef.current);
                for (let i = 0; i < waveCount; i++) {
                    waveY.push(p.height / 2);
                }
            };

            p.draw = () => {
                p.clear();
                p.noFill();
                p.stroke(255, 255, 255, 100); // White lines with transparency
                p.strokeWeight(0.5);

                // Draw waves
                for (let i = 0; i < waveCount; i++) {
                    let yOffset = i * 50; // Vertical offset for each wave
                    p.beginShape();
                    for (let x = 0; x <= p.width; x += 10) {
                        const y = p.noise(x * 0.005, p.frameCount * 0.01 + i) * 100 + yOffset;
                        p.vertex(x, p.height / 2 + y - waveY[i]);
                    }
                    p.endShape();
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        };

        const p5Instance = new p5(sketch);
        return () => {
            p5Instance.remove();
        };
    }, []);

    return <div ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 10, pointerEvents: "none" }} />;
};

export default CanvasBackground;
