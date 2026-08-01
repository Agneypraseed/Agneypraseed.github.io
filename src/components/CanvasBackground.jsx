import { useEffect, useRef, useCallback } from "react";

/* ── loss landscape ── */
const EXT = 1.15;
const N = 32;
const THEME_TRANSITION_MS = 260;

const mix = (from, to, progress) => from + (to - from) * progress;

const f = (x, y) =>
    0.55 * (x * x + y * y) -
    0.55 * Math.exp(-((x - 0.45) ** 2 + (y - 0.3) ** 2) / 0.085) -
    0.4 * Math.exp(-((x + 0.5) ** 2 + (y + 0.35) ** 2) / 0.11);

/* pre-compute grid heights once */
const gx = [];
for (let i = 0; i <= N; i++) gx.push(-EXT + (2 * EXT * i) / N);
const gz = [];
for (let i = 0; i <= N; i++) {
    gz.push([]);
    for (let j = 0; j <= N; j++) gz[i].push(f(gx[i], gx[j]));
}

/* ══════════════════════════════════════════ */

const CanvasBackground = ({ darkMode }) => {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const yawRef = useRef(-0.5);
    const themeRef = useRef(darkMode ? 1 : 0);
    const themeTransitionRef = useRef({
        from: darkMode ? 1 : 0,
        to: darkMode ? 1 : 0,
        startedAt: 0,
    });

    const draw = useCallback((timestamp) => {
        const cvs = canvasRef.current;
        if (!cvs) return;

        const transition = themeTransitionRef.current;
        const elapsed = Math.max(0, timestamp - transition.startedAt);
        const linearProgress = Math.min(1, elapsed / THEME_TRANSITION_MS);
        const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
        const themeProgress = mix(
            transition.from,
            transition.to,
            easedProgress,
        );
        themeRef.current = themeProgress;

        const ctx = cvs.getContext("2d");
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = window.innerWidth;
        const H = window.innerHeight;
        const mob = W <= 768;

        cvs.width = Math.round(W * dpr);
        cvs.height = Math.round(H * dpr);
        cvs.style.width = `${W}px`;
        cvs.style.height = `${H}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);

        /* ── camera ── */
        const pitch = mob ? 0.92 : 1.02;
        const zScale = 0.85;
        const yaw = yawRef.current;
        yawRef.current += mob ? 0.0012 : 0.0016;

        const cp = Math.cos(pitch),
            sp = Math.sin(pitch);
        const cy = Math.cos(yaw),
            sy = Math.sin(yaw);

        /* surface origin — left-center on desktop, top-center on mobile */
        const originX = mob ? W * 0.5 : W * 0.28;
        const originY = mob ? Math.min(H * 0.27, W * 0.55) : H * 0.48;
        const camScale = mob ? 0.44 : 0.56;

        const proj = (x, y, z) => {
            const rx = x * cy - y * sy;
            const ry = x * sy + y * cy;
            const rz = z * zScale;
            const ty = ry * cp - rz * sp;
            const tz = ry * sp + rz * cp;
            const depth = 3.4 + ty;
            const k = (Math.min(W, H) * camScale) / depth;
            return {
                sx: originX + rx * k,
                sy: originY - tz * k,
                depth,
            };
        };

        /* ── wireframe colour ── */
        const LINE = [
            Math.round(mix(255, 190, themeProgress)),
            Math.round(mix(255, 210, themeProgress)),
            Math.round(mix(255, 230, themeProgress)),
        ].join(",");
        const minAlpha = mix(0.06, 0.04, themeProgress);
        const maxAlpha = mix(0.32, 0.26, themeProgress);
        const depthAlpha = mix(0.25, 0.2, themeProgress);

        ctx.lineWidth = mob ? 0.7 : 1;
        ctx.lineCap = "round";

        /* draw both axis directions */
        for (let axis = 0; axis < 2; axis++) {
            for (let i = 0; i <= N; i++) {
                ctx.beginPath();
                let pd = 0;

                for (let j = 0; j <= N; j++) {
                    const x = axis ? gx[j] : gx[i];
                    const y = axis ? gx[i] : gx[j];
                    const z = axis ? gz[j][i] : gz[i][j];
                    const p = proj(x, y, z);

                    j === 0
                        ? ctx.moveTo(p.sx, p.sy)
                        : ctx.lineTo(p.sx, p.sy);
                    pd += p.depth;
                }

                const avg = pd / (N + 1);
                const a = Math.max(
                    minAlpha,
                    Math.min(maxAlpha, (4.5 - avg) * depthAlpha),
                );
                ctx.strokeStyle = `rgba(${LINE},${a})`;
                ctx.stroke();
            }
        }

        /* ── edge vignette (centered on the surface origin) ── */
        const fg = ctx.createRadialGradient(
            originX,
            originY,
            Math.min(W, H) * (mob ? 0.14 : 0.18),
            originX,
            originY,
            Math.max(W, H) * (mob ? 0.52 : 0.48),
        );
        const bg = [
            Math.round(mix(100, 26, themeProgress)),
            Math.round(mix(82, 26, themeProgress)),
            Math.round(mix(168, 26, themeProgress)),
        ].join(",");
        fg.addColorStop(0, `rgba(${bg},0)`);
        fg.addColorStop(0.35, `rgba(${bg},0)`);
        fg.addColorStop(0.7, `rgba(${bg},0.55)`);
        fg.addColorStop(1, `rgba(${bg},0.97)`);
        ctx.fillStyle = fg;
        ctx.fillRect(0, 0, W, H);

        animRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        themeTransitionRef.current = {
            from: themeRef.current,
            to: darkMode ? 1 : 0,
            startedAt: performance.now(),
        };
    }, [darkMode]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(draw);
        return () => {
            if (animRef.current !== null)
                cancelAnimationFrame(animRef.current);
        };
    }, [draw]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                pointerEvents: "none",
            }}
        />
    );
};

export default CanvasBackground;
