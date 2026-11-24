import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const THEME_TRANSITION_MS = 260;
const FRAME_MS = 1000 / 60;

const mix = (from, to, progress) => from + (to - from) * progress;
const clamp = (value, minimum, maximum) =>
    Math.max(minimum, Math.min(maximum, value));

/* ── Loss surface ─ matches k-a.in exactly ── */
const f = (x, y) =>
    0.55 * (x * x + y * y) -
    0.55 *
        Math.exp(
            -(
                Math.pow(x - 0.45, 2) / 0.085 +
                Math.pow(y - 0.3, 2) / 0.085
            ),
        ) -
    0.4 *
        Math.exp(
            -(
                Math.pow(x + 0.5, 2) / 0.11 +
                Math.pow(y + 0.35, 2) / 0.11
            ),
        );

const grad = (x, y) => {
    const e1 = Math.exp(
        -(Math.pow(x - 0.45, 2) / 0.085 + Math.pow(y - 0.3, 2) / 0.085),
    );
    const e2 = Math.exp(
        -(Math.pow(x + 0.5, 2) / 0.11 + Math.pow(y + 0.35, 2) / 0.11),
    );
    return [
        1.1 * x +
            0.55 * e1 * 2 * (x - 0.45) / 0.085 +
            0.4 * e2 * 2 * (x + 0.5) / 0.11,
        1.1 * y +
            0.55 * e1 * 2 * (y - 0.3) / 0.085 +
            0.4 * e2 * 2 * (y + 0.35) / 0.11,
    ];
};

/* ── Grid ── */
const N = 28;
const EXT = 1.15;
const gridAxis = Array.from(
    { length: N + 1 },
    (_, i) => -EXT + (2 * EXT * i) / N,
);
const gridHeights = gridAxis.map((x) =>
    gridAxis.map((y) => f(x, y)),
);

/* ── Walker factory ── */
const makeWalker = (kind) => ({
    kind,
    p: [0, 0],
    v: [0, 0],
    m: [0, 0],
    s: [0, 0],
    t: 0,
    trail: [],
    settle: 0,
});

const CanvasBackground = ({ darkMode }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const viewportRef = useRef(null);
    const requestDrawRef = useRef(() => {});
    const yawRef = useRef(-0.62);
    const pitchRef = useRef(0.58);
    const dragRef = useRef(null);
    const idleRef = useRef(0);
    const themeRef = useRef(darkMode ? 1 : 0);
    const themeTransitionRef = useRef({
        from: darkMode ? 1 : 0,
        to: darkMode ? 1 : 0,
        startedAt: 0,
    });
    const walkersRef = useRef([makeWalker("momentum"), makeWalker("adam")]);
    const fadeRef = useRef(1);

    /* ── Respawn both walkers at a random edge point ── */
    const respawnAll = useCallback(() => {
        const a = Math.random() * Math.PI * 2;
        const start = [
            Math.cos(a) * (0.85 + Math.random() * 0.2),
            Math.sin(a) * (0.85 + Math.random() * 0.2),
        ];
        walkersRef.current.forEach((w) => {
            w.p = start.slice();
            w.v = [0, 0];
            w.m = [0, 0];
            w.s = [0, 0];
            w.t = 0;
            w.trail = [];
            w.settle = 0;
        });
        fadeRef.current = 1;
    }, []);

    /* ── Step a single walker ── */
    const stepWalker = useCallback((w) => {
        const g = grad(w.p[0], w.p[1]);
        if (w.kind === "momentum") {
            const LR = 0.0045;
            const MU = 0.92;
            w.v[0] = MU * w.v[0] - LR * g[0];
            w.v[1] = MU * w.v[1] - LR * g[1];
            w.p[0] += w.v[0];
            w.p[1] += w.v[1];
        } else {
            /* adam */
            const lr = 0.011;
            const b1 = 0.9;
            const b2 = 0.999;
            const eps = 1e-8;
            w.t++;
            for (let d = 0; d < 2; d++) {
                w.m[d] = b1 * w.m[d] + (1 - b1) * g[d];
                w.s[d] = b2 * w.s[d] + (1 - b2) * g[d] * g[d];
                const mh = w.m[d] / (1 - Math.pow(b1, w.t));
                const sh = w.s[d] / (1 - Math.pow(b2, w.t));
                const dlt = lr * mh / (Math.sqrt(sh) + eps);
                w.p[d] -= dlt;
                w.v[d] = -dlt;
            }
        }
        w.trail.push([w.p[0], w.p[1], f(w.p[0], w.p[1])]);
        if (w.trail.length > 80) w.trail.shift();
        if (Math.hypot(w.v[0], w.v[1]) < 0.0006) w.settle++;
    }, []);

    /* ── Step all walkers + handle convergence/respawn ── */
    const stepAll = useCallback(() => {
        const walkers = walkersRef.current;
        walkers.forEach(stepWalker);
        if (walkers[0].settle > 140 && walkers[1].settle > 140) {
            fadeRef.current -= 0.012;
            if (fadeRef.current <= 0) respawnAll();
        }
    }, [stepWalker, respawnAll]);

    /* ── Main draw loop ── */
    const draw = useCallback(
        (timestamp) => {
            const viewport = viewportRef.current;
            if (!viewport) return;
            const { context, width, height, devicePixelRatio, isMobile } = viewport;

            /* Theme transition */
            const transition = themeTransitionRef.current;
            const elapsed = Math.max(0, timestamp - transition.startedAt);
            const linearProgress = Math.min(
                1,
                elapsed / THEME_TRANSITION_MS,
            );
            const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
            const themeProgress = mix(
                transition.from,
                transition.to,
                easedProgress,
            );
            themeRef.current = themeProgress;

            context.setTransform(
                devicePixelRatio,
                0,
                0,
                devicePixelRatio,
                0,
                0,
            );
            context.clearRect(0, 0, width, height);

            const pitch = pitchRef.current;
            const yaw = yawRef.current;
            const Z_SCALE = 0.85;
            const cp = Math.cos(pitch);
            const sp = Math.sin(pitch);
            const cy = Math.cos(yaw);
            const sy = Math.sin(yaw);

            const originX = isMobile ? width * 0.5 : width * 0.28;
            const originY = isMobile
                ? Math.min(height * 0.25, width * 0.5)
                : height * 0.47;
            const cameraScale = isMobile
                ? 0.47
                : width <= 1100
                  ? 0.61
                  : 0.7;

            const project = (x, y, z) => {
                const rx = x * cy - y * sy;
                const ry = x * sy + y * cy;
                const rz = z * Z_SCALE;
                const ty = ry * cp - rz * sp;
                const tz = ry * sp + rz * cp;
                const depth = 3.4 + ty;
                const k =
                    (Math.min(width, height) * cameraScale) / depth;
                return [originX + rx * k, originY + 14 - tz * k, depth];
            };

            /* ── Line colour based on theme ── */
            /* Light mode: clean white, reads well on purple/blue bg */
            /* Dark mode: soft warm grey for subtlety on dark bg */
            const lineR = Math.round(mix(255, 210, themeProgress));
            const lineG = Math.round(mix(255, 215, themeProgress));
            const lineB = Math.round(mix(255, 230, themeProgress));
            const LINE = `${lineR},${lineG},${lineB}`;

            /* Walker colours — muted, elegant tones that complement both themes */
            const ACCENT = "255,240,230"; /* soft pearl white — momentum */
            const INK_DARK = "180,190,210"; /* cool silver — adam */

            /* ── Wireframe ── */
            context.lineWidth = isMobile ? 0.72 : 1;
            context.lineCap = "round";

            // Each vertex is shared by a row and column; project it only once.
            const projectedGrid = gridAxis.map((x, i) =>
                gridAxis.map((y, j) => project(x, y, gridHeights[i][j])),
            );

            for (let axis = 0; axis < 2; axis++) {
                for (let i = 0; i <= N; i++) {
                    context.beginPath();
                    let pd = 0;
                    for (let j = 0; j <= N; j++) {
                        const pr = axis ? projectedGrid[j][i] : projectedGrid[i][j];
                        j
                            ? context.lineTo(pr[0], pr[1])
                            : context.moveTo(pr[0], pr[1]);
                        pd += pr[2];
                    }
                    const avg = pd / (N + 1);
                    const a = clamp(
                        (4.5 - avg) * 0.22,
                        0.06,
                        0.3,
                    );
                    context.strokeStyle = `rgba(${LINE},${a})`;
                    context.stroke();
                }
            }

            /* ── Understated paths and matte markers ── */
            const walkers = walkersRef.current;
            const fade = fadeRef.current;

            walkers.forEach((w, wi) => {
                const col = wi === 0 ? ACCENT : INK_DARK;

                /* Trail */
                if (w.trail.length > 1) {
                    context.lineWidth = 1.1;
                    context.strokeStyle = `rgba(${col},${0.42 * fade})`;
                    context.beginPath();
                    for (let i = 0; i < w.trail.length; i++) {
                        const point = w.trail[i];
                        const pr = project(point[0], point[1], point[2] + 0.015);
                        if (i === 0) context.moveTo(pr[0], pr[1]);
                        else context.lineTo(pr[0], pr[1]);
                    }
                    context.stroke();
                }

                const z = f(w.p[0], w.p[1]);
                const pr = project(w.p[0], w.p[1], z + 0.02);
                const r = clamp(Math.min(width, height) * 0.007, 3, 5.5);
                context.fillStyle = `rgba(${col},${0.92 * fade})`;
                context.beginPath();
                context.arc(pr[0], pr[1], r, 0, Math.PI * 2);
                context.fill();
            });

        },
        [],
    );

    useLayoutEffect(() => {
        themeTransitionRef.current = {
            from: themeRef.current,
            to: darkMode ? 1 : 0,
            startedAt: performance.now(),
        };
        requestDrawRef.current();
    }, [darkMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { colorSpace: "srgb" });
        if (!context) return;
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let visible = true;
        let lastFrame = null;
        let accumulator = 0;

        const stop = () => {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
            lastFrame = null;
            accumulator = 0;
        };
        const requestDraw = () => {
            if (visible && !document.hidden && animationRef.current === null) {
                animationRef.current = requestAnimationFrame(frame);
            }
        };
        const frame = (timestamp) => {
            animationRef.current = null;
            if (!visible || document.hidden) return;
            accumulator += lastFrame === null ? FRAME_MS : Math.min(timestamp - lastFrame, 50);
            lastFrame = timestamp;
            if (accumulator >= FRAME_MS - 0.1) {
                // Fixed simulation steps keep the same speed on 60/120 Hz displays.
                const steps = Math.max(1, Math.floor((accumulator + 0.1) / FRAME_MS));
                accumulator = Math.max(0, accumulator - steps * FRAME_MS);
                if (!motionQuery.matches) {
                    for (let i = 0; i < steps; i++) {
                        if (!dragRef.current && ++idleRef.current >= 90) yawRef.current += 0.0016;
                        stepAll();
                    }
                }
                draw(timestamp);
            }
            if (!motionQuery.matches || themeRef.current !== themeTransitionRef.current.to) {
                requestDraw();
            } else {
                lastFrame = null;
            }
        };
        const resize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const pixelWidth = Math.round(width * devicePixelRatio);
            const pixelHeight = Math.round(height * devicePixelRatio);
            if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
            if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
            viewportRef.current = { context, width, height, devicePixelRatio, isMobile: window.innerWidth <= 768 };
            requestDraw();
        };
        const resume = () => { stop(); requestDraw(); };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            resume();
        });
        const resizeObserver = new ResizeObserver(resize);
        requestDrawRef.current = requestDraw;
        respawnAll();
        resize();
        observer.observe(canvas);
        resizeObserver.observe(canvas);
        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", resume);
        motionQuery.addEventListener("change", resume);

        return () => {
            stop();
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", resume);
            motionQuery.removeEventListener("change", resume);
            requestDrawRef.current = () => {};
            viewportRef.current = null;
        };
    }, [draw, respawnAll, stepAll]);

    const beginDrag = useCallback((event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = "true";
        event.currentTarget.style.cursor = "grabbing";
        dragRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
        };
        idleRef.current = 0;
        requestDrawRef.current();
    }, []);

    const moveDrag = useCallback((event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        event.preventDefault();
        yawRef.current += (event.clientX - drag.x) * 0.006;
        pitchRef.current = clamp(
            pitchRef.current + (event.clientY - drag.y) * 0.005,
            0.35,
            1.45,
        );
        drag.x = event.clientX;
        drag.y = event.clientY;
        idleRef.current = 0;
        requestDrawRef.current();
    }, []);

    const finishDrag = useCallback((event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        dragRef.current = null;
        delete event.currentTarget.dataset.dragging;
        event.currentTarget.style.cursor = "grab";

        if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
    }, []);

    const cancelDrag = useCallback((event) => {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        dragRef.current = null;
        delete event.currentTarget.dataset.dragging;
        event.currentTarget.style.cursor = "grab";
    }, []);

    const handleKeyDown = useCallback((event) => {
        const keyRotation = {
            ArrowLeft: [-0.12, 0],
            ArrowRight: [0.12, 0],
            ArrowUp: [0, -0.08],
            ArrowDown: [0, 0.08],
        }[event.key];
        if (!keyRotation) return;

        event.preventDefault();
        yawRef.current += keyRotation[0];
        pitchRef.current = clamp(
            pitchRef.current + keyRotation[1],
            0.35,
            1.45,
        );
        idleRef.current = 0;
        requestDrawRef.current();
    }, []);

    return (
        <>
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
            <div
                className="home-gd-interaction"
                role="application"
                tabIndex={0}
                aria-label="Interactive gradient-descent landscape — drag to orbit"
                onPointerDown={beginDrag}
                onPointerMove={moveDrag}
                onPointerUp={finishDrag}
                onPointerCancel={cancelDrag}
                onKeyDown={handleKeyDown}
            />
        </>
    );
};

export default CanvasBackground;
