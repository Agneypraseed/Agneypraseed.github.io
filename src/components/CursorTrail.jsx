import { useEffect, useRef } from "react";
import useIsMobile from "../hooks/useIsMobile";

const CursorTrail = () => {
    const canvasRef = useRef(null);
    const { isMobile } = useIsMobile();

    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let mouse = { x: -100, y: -100 };
        const numDots = 8;
        let dots = [];
        for (let i = 0; i < numDots; i++) {
            dots.push({ x: -100, y: -100 });
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const onMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // First dot follows the actual mouse with easing
            // Lower values stretch out the trail so it's less clumpy
            dots[0].x += (mouse.x - dots[0].x) * 0.3;
            dots[0].y += (mouse.y - dots[0].y) * 0.3;

            // Subsequent dots follow the dot ahead of them with easing
            for (let i = 1; i < numDots; i++) {
                dots[i].x += (dots[i-1].x - dots[i].x) * 0.3;
                dots[i].y += (dots[i-1].y - dots[i].y) * 0.3;
            }

            // Draw all dots
            for (let i = 0; i < numDots; i++) {
                // Exponential opacity fade (0.7 decay rate as observed)
                const opacity = Math.pow(0.7, i); 
                
                ctx.beginPath();
                // Fixed 6px diameter (3px radius) as observed
                ctx.arc(dots[i].x, dots[i].y, 3, 0, Math.PI * 2);
                
                // Vibrant red #dc2626 matching the reference page exactly
                ctx.fillStyle = `rgba(220, 38, 38, ${opacity})`;
                ctx.fill();
            }

            requestAnimationFrame(animate);
        };

        let frameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameId);
        };
    }, [isMobile]);

    if (isMobile) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9998,
            }}
        />
    );
};

export default CursorTrail;
