import { useCallback, useEffect, useRef } from "react";

const THEME_TRANSITION_MS = 260;
const FLOOR_Z = -0.62;

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
    const yawRef = useRef(-0.5);
    const pitchRef = useRef(1.02);
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
        if (w.trail.length > 200) w.trail.shift();
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
            const canvas = canvasRef.current;
            if (!canvas) return;

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

            const context = canvas.getContext("2d");
            const devicePixelRatio = Math.min(
                window.devicePixelRatio || 1,
                2,
            );
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isMobile = width <= 768;

            canvas.width = Math.round(width * devicePixelRatio);
            canvas.height = Math.round(height * devicePixelRatio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
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

            for (let axis = 0; axis < 2; axis++) {
                for (let i = 0; i <= N; i++) {
                    context.beginPath();
                    let pd = 0;
                    for (let j = 0; j <= N; j++) {
                        const x = axis ? gridAxis[j] : gridAxis[i];
                        const y = axis ? gridAxis[i] : gridAxis[j];
                        const z = axis
                            ? gridHeights[j][i]
                            : gridHeights[i][j];
                        const pr = project(x, y, z);
                        j
                            ? context.lineTo(pr[0], pr[1])
                            : context.moveTo(pr[0], pr[1]);
                        pd += pr[2];
                    }
                    const avg = pd / (N + 1);
                    const a = clamp(
                        (4.5 - avg) * 0.28,
                        0.06,
                        0.38,
                    );
                    context.strokeStyle = `rgba(${LINE},${a})`;
                    context.stroke();
                }
            }

            /* ── Walkers: trail + drop line + ball ── */
            const walkers = walkersRef.current;
            const fade = fadeRef.current;

            walkers.forEach((w, wi) => {
                const col = wi === 0 ? ACCENT : INK_DARK;

                /* Trail */
                if (w.trail.length > 1) {
                    context.lineWidth = wi === 0 ? 1.4 : 1.2;
                    for (let i = 1; i < w.trail.length; i++) {
                        const t0 = w.trail[i - 1];
                        const t1 = w.trail[i];
                        const p0 = project(
                            t0[0],
                            t0[1],
                            t0[2] + 0.015,
                        );
                        const p1 = project(
                            t1[0],
                            t1[1],
                            t1[2] + 0.015,
                        );
                        context.strokeStyle = `rgba(${col},${(i / w.trail.length) * 0.85 * fade})`;
                        context.beginPath();
                        context.moveTo(p0[0], p0[1]);
                        context.lineTo(p1[0], p1[1]);
                        context.stroke();
                    }
                }

                const z = f(w.p[0], w.p[1]);
                const pr = project(w.p[0], w.p[1], z + 0.02);
                const fl = project(w.p[0], w.p[1], FLOOR_Z);

                /* Drop line to the floor — depth cue */
                context.strokeStyle = `rgba(${col},${0.14 * fade})`;
                context.lineWidth = 1;
                context.setLineDash([2, 4]);
                context.beginPath();
                context.moveTo(pr[0], pr[1]);
                context.lineTo(fl[0], fl[1]);
                context.stroke();
                context.setLineDash([]);

                /* Shadow ellipse on floor */
                context.fillStyle = `rgba(${col},${0.2 * fade})`;
                context.beginPath();
                context.ellipse(fl[0], fl[1], 4, 1.6, 0, 0, Math.PI * 2);
                context.fill();

                /* Ball glow + solid ball */
                const r =
                    Math.min(width, height) * 0.01 +
                    (wi === 0 ? 1.5 : 1.1);
                const glow = context.createRadialGradient(
                    pr[0],
                    pr[1],
                    0,
                    pr[0],
                    pr[1],
                    r * 4,
                );
                glow.addColorStop(
                    0,
                    `rgba(${col},${0.3 * fade})`,
                );
                glow.addColorStop(1, `rgba(${col},0)`);
                context.fillStyle = glow;
                context.beginPath();
                context.arc(pr[0], pr[1], r * 4, 0, Math.PI * 2);
                context.fill();

                context.fillStyle = `rgba(${col},${fade})`;
                context.beginPath();
                context.arc(pr[0], pr[1], r, 0, Math.PI * 2);
                context.fill();
            });

            /* ── Vignette overlay ── */
            const vignette = context.createRadialGradient(
                originX,
                originY,
                Math.min(width, height) * (isMobile ? 0.14 : 0.2),
                originX,
                originY,
                Math.max(width, height) * (isMobile ? 0.52 : 0.5),
            );
            const backgroundColour = [
                Math.round(mix(100, 26, themeProgress)),
                Math.round(mix(82, 26, themeProgress)),
                Math.round(mix(168, 26, themeProgress)),
            ].join(",");
            vignette.addColorStop(
                0,
                `rgba(${backgroundColour},0)`,
            );
            vignette.addColorStop(
                0.35,
                `rgba(${backgroundColour},0)`,
            );
            vignette.addColorStop(
                0.7,
                `rgba(${backgroundColour},0.42)`,
            );
            vignette.addColorStop(
                1,
                `rgba(${backgroundColour},0.9)`,
            );
            context.fillStyle = vignette;
            context.fillRect(0, 0, width, height);


            /* ── Auto-rotation when idle ── */
            if (!dragRef.current) {
                idleRef.current++;
                if (idleRef.current >= 90) {
                    yawRef.current += 0.0016;
                }
            }

            /* ── Step the optimizers ── */
            stepAll();

            animationRef.current = requestAnimationFrame(draw);
        },
        [stepAll],
    );

    useEffect(() => {
        themeTransitionRef.current = {
            from: themeRef.current,
            to: darkMode ? 1 : 0,
            startedAt: performance.now(),
        };
    }, [darkMode]);

    useEffect(() => {
        respawnAll();
        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current !== null)
                cancelAnimationFrame(animationRef.current);
        };
    }, [draw, respawnAll]);

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
