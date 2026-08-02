import { useCallback, useEffect, useRef } from "react";

const EXTENT = 1.32;
const GRID_SIZE = 42;
const THEME_TRANSITION_MS = 260;

const mix = (from, to, progress) => from + (to - from) * progress;
const clamp = (value, minimum, maximum) =>
    Math.max(minimum, Math.min(maximum, value));

/* A broad loss surface with a shallow local basin and a deeper global basin. */
const loss = (x, y) => {
    const bowl =
        0.34 * (0.72 * x * x + 1.04 * y * y) +
        0.045 * x * y +
        0.025 * x;
    const globalMinimum =
        -0.86 *
        Math.exp(
            -(
                (x - 0.46) ** 2 / 0.04 +
                (y + 0.04) ** 2 / 0.05
            ),
        );
    const localMinimum =
        -0.58 *
        Math.exp(
            -(
                (x + 0.45) ** 2 / 0.05 +
                (y + 0.04) ** 2 / 0.055
            ),
        );

    return bowl + globalMinimum + localMinimum;
};

const gridAxis = Array.from(
    { length: GRID_SIZE + 1 },
    (_, index) => -EXTENT + (2 * EXTENT * index) / GRID_SIZE,
);
const gridHeights = gridAxis.map((x) => gridAxis.map((y) => loss(x, y)));

const CanvasBackground = ({ darkMode }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const yawRef = useRef(-0.58);
    const pitchRef = useRef(0.86);
    const dragRef = useRef(null);
    const themeRef = useRef(darkMode ? 1 : 0);
    const themeTransitionRef = useRef({
        from: darkMode ? 1 : 0,
        to: darkMode ? 1 : 0,
        startedAt: 0,
    });

    const draw = useCallback((timestamp) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

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

        const context = canvas.getContext("2d");
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width <= 768;

        canvas.width = Math.round(width * devicePixelRatio);
        canvas.height = Math.round(height * devicePixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);

        const pitch = pitchRef.current;
        const yaw = yawRef.current;
        const cosinePitch = Math.cos(pitch);
        const sinePitch = Math.sin(pitch);
        const cosineYaw = Math.cos(yaw);
        const sineYaw = Math.sin(yaw);
        const zScale = 0.92;

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
            const rotatedX = x * cosineYaw - y * sineYaw;
            const rotatedY = x * sineYaw + y * cosineYaw;
            const raisedZ = z * zScale;
            const tiltedY = rotatedY * cosinePitch - raisedZ * sinePitch;
            const tiltedZ = rotatedY * sinePitch + raisedZ * cosinePitch;
            const depth = 3.4 + tiltedY;
            const perspective =
                (Math.min(width, height) * cameraScale) / depth;

            return {
                x: originX + rotatedX * perspective,
                y: originY - tiltedZ * perspective,
                depth,
            };
        };

        const lineColour = [
            Math.round(mix(255, 190, themeProgress)),
            Math.round(mix(255, 210, themeProgress)),
            Math.round(mix(255, 230, themeProgress)),
        ].join(",");
        const minimumAlpha = mix(0.07, 0.055, themeProgress);
        const maximumAlpha = mix(0.38, 0.31, themeProgress);
        const depthAlpha = mix(0.28, 0.23, themeProgress);

        context.lineWidth = isMobile ? 0.72 : 0.9;
        context.lineCap = "round";

        for (let axis = 0; axis < 2; axis += 1) {
            for (let line = 0; line <= GRID_SIZE; line += 1) {
                context.beginPath();
                let accumulatedDepth = 0;

                for (let point = 0; point <= GRID_SIZE; point += 1) {
                    const x = axis ? gridAxis[point] : gridAxis[line];
                    const y = axis ? gridAxis[line] : gridAxis[point];
                    const z = axis
                        ? gridHeights[point][line]
                        : gridHeights[line][point];
                    const projected = project(x, y, z);

                    if (point === 0)
                        context.moveTo(projected.x, projected.y);
                    else context.lineTo(projected.x, projected.y);

                    accumulatedDepth += projected.depth;
                }

                const averageDepth = accumulatedDepth / (GRID_SIZE + 1);
                const alpha = clamp(
                    (4.5 - averageDepth) * depthAlpha,
                    minimumAlpha,
                    maximumAlpha,
                );
                context.strokeStyle = `rgba(${lineColour},${alpha})`;
                context.stroke();
            }
        }

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
        vignette.addColorStop(0, `rgba(${backgroundColour},0)`);
        vignette.addColorStop(0.35, `rgba(${backgroundColour},0)`);
        vignette.addColorStop(0.7, `rgba(${backgroundColour},0.42)`);
        vignette.addColorStop(1, `rgba(${backgroundColour},0.9)`);
        context.fillStyle = vignette;
        context.fillRect(0, 0, width, height);

        animationRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        themeTransitionRef.current = {
            from: themeRef.current,
            to: darkMode ? 1 : 0,
            startedAt: performance.now(),
        };
    }, [darkMode]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current !== null)
                cancelAnimationFrame(animationRef.current);
        };
    }, [draw]);

    const beginDrag = useCallback((event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = "true";
        dragRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
        };
    }, []);

    const moveDrag = useCallback((event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        event.preventDefault();
        const deltaX = event.clientX - drag.x;
        const deltaY = event.clientY - drag.y;
        const yawDelta = deltaX * 0.012;
        const pitchDelta = deltaY * 0.006;

        yawRef.current += yawDelta;
        pitchRef.current = clamp(pitchRef.current + pitchDelta, 0.68, 1.28);
        event.currentTarget.dataset.rotationYaw = yawRef.current.toFixed(3);
        event.currentTarget.dataset.rotationPitch = pitchRef.current.toFixed(3);

        drag.x = event.clientX;
        drag.y = event.clientY;
    }, []);

    const finishDrag = useCallback((event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        dragRef.current = null;
        delete event.currentTarget.dataset.dragging;

        if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
    }, []);

    const cancelDrag = useCallback((event) => {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        dragRef.current = null;
        delete event.currentTarget.dataset.dragging;
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
            0.68,
            1.28,
        );
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
                aria-label="Interactive gradient-descent landscape"
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
