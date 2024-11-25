import React, { useRef, useEffect } from "react";
import p5 from "p5";

const CanvasBackground = () => {
    const canvasRef = useRef();

    useEffect(() => {
        const sketch = (p) => {
            let phase = 0;            
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent(canvasRef.current);                
            };

            p.draw = () => {
                p.clear();                
                p.noFill();
                p.stroke(255, 255, 255, 60); // White lines with low opacity
                p.strokeWeight(1.5);

                // Draw multiple wave lines
                for (let i = 0; i < 60; i++) { // Increased number of lines
                    p.beginShape();
                    for (let x = 0; x < p.width + 100; x += 5) { // Smaller step for smoother curves
                        // Calculate y position using sine wave and noise
                        const baseY = i * 10; // Spacing between lines
                        const noiseVal = p.noise(x * 0.002 + phase, i * 0.002, phase);
                        const y = baseY + p.sin(x * 0.01 + phase) * 50 + noiseVal * 100;
                        
                        p.vertex(x, y);
                    }
                    p.endShape();
                }
                
                phase += 1.003; // Faster Fan like movement
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
