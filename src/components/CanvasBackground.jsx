import { useEffect, useRef } from "react";

const SURFACE_RANGE = 2.8;

const lossSurface = (x, y) => {
    const bowl = 0.105 * (0.82 * x * x + y * y) + 0.018 * x * y;
    const globalMinimum =
        -0.9 *
        Math.exp(
            -1.7 * (x + 0.72) * (x + 0.72) -
            1.85 * (y + 0.18) * (y + 0.18),
        );
    const localMinimum =
        -0.56 *
        Math.exp(
            -2.35 * (x - 1.12) * (x - 1.12) -
            2.1 * (y - 0.12) * (y - 0.12),
        );
    const saddle =
        0.16 *
        Math.exp(
            -2.6 * (x - 0.18) * (x - 0.18) -
            1.7 * (y + 0.02) * (y + 0.02),
        );

    return bowl + globalMinimum + localMinimum + saddle;
};

const CanvasBackground = ({ darkMode }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const context = canvas.getContext("2d");
        let resizeFrameId = null;

        const drawSurface = () => {
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const isMobile = viewportWidth <= 768;

            canvas.width = Math.round(viewportWidth * pixelRatio);
            canvas.height = Math.round(viewportHeight * pixelRatio);
            canvas.style.width = `${viewportWidth}px`;
            canvas.style.height = `${viewportHeight}px`;
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            context.clearRect(0, 0, viewportWidth, viewportHeight);

            const columns = isMobile ? 24 : 64;
            const rows = isMobile ? 18 : 42;
            const points = [];
            let minimumHeight = Number.POSITIVE_INFINITY;
            let maximumHeight = Number.NEGATIVE_INFINITY;

            for (let row = 0; row <= rows; row += 1) {
                const pointRow = [];
                const y =
                    -SURFACE_RANGE +
                    (row / rows) * SURFACE_RANGE * 2;

                for (let column = 0; column <= columns; column += 1) {
                    const x =
                        -SURFACE_RANGE +
                        (column / columns) * SURFACE_RANGE * 2;
                    const z = lossSurface(x, y);

                    minimumHeight = Math.min(minimumHeight, z);
                    maximumHeight = Math.max(maximumHeight, z);
                    pointRow.push({ x, y, z });
                }

                points.push(pointRow);
            }

            const heightRange = maximumHeight - minimumHeight;
            const scaleX = viewportWidth / (isMobile ? 13 : 15);
            const scaleY = scaleX * (isMobile ? 0.34 : 0.4);
            const heightScale =
                viewportHeight * (isMobile ? 0.16 : 0.23);
            const centerX = viewportWidth * 0.5;
            const centerY =
                viewportHeight * (isMobile ? 0.81 : 0.66);

            const projectPoint = ({ x, y, z }) => {
                const normalizedHeight =
                    (z - minimumHeight) / heightRange;

                if (isMobile) {
                    return {
                        x: centerX + (x - y) * scaleX,
                        y:
                            centerY +
                            (x + y) * scaleY -
                            normalizedHeight * heightScale,
                    };
                }

                const depth =
                    (y + SURFACE_RANGE) / (SURFACE_RANGE * 2);
                const perspective = 0.88 + depth * 0.16;

                return {
                    x:
                        centerX +
                        x * scaleX * perspective -
                        y * scaleX * 0.55,
                    y:
                        centerY +
                        x * scaleY * 0.18 +
                        y * scaleY -
                        normalizedHeight * heightScale,
                };
            };

            const rowOpacity = isMobile
                ? darkMode
                    ? 0.14
                    : 0.2
                : darkMode
                  ? 0.12
                  : 0.16;
            const columnOpacity = isMobile
                ? darkMode
                    ? 0.105
                    : 0.145
                : darkMode
                  ? 0.09
                  : 0.115;

            context.lineCap = "round";
            context.lineJoin = "round";
            context.lineWidth = isMobile ? 0.5 : 0.55;

            points.forEach((pointRow, rowIndex) => {
                const depthFade = isMobile
                    ? 0.52 + (rowIndex / rows) * 0.48
                    : 0.7 + (rowIndex / rows) * 0.3;

                context.beginPath();
                pointRow.forEach((point, index) => {
                    const projected = projectPoint(point);

                    if (index === 0) {
                        context.moveTo(projected.x, projected.y);
                    } else {
                        context.lineTo(projected.x, projected.y);
                    }
                });
                context.strokeStyle = `rgba(255, 255, 255, ${
                    rowOpacity * depthFade
                })`;
                context.stroke();
            });

            for (let column = 0; column <= columns; column += 1) {
                context.beginPath();

                points.forEach((pointRow, rowIndex) => {
                    const projected = projectPoint(pointRow[column]);

                    if (rowIndex === 0) {
                        context.moveTo(projected.x, projected.y);
                    } else {
                        context.lineTo(projected.x, projected.y);
                    }
                });
                context.strokeStyle = `rgba(255, 255, 255, ${columnOpacity})`;
                context.stroke();
            }
        };

        const handleResize = () => {
            if (resizeFrameId !== null) {
                window.cancelAnimationFrame(resizeFrameId);
            }

            resizeFrameId = window.requestAnimationFrame(() => {
                drawSurface();
                resizeFrameId = null;
            });
        };

        drawSurface();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);

            if (resizeFrameId !== null) {
                window.cancelAnimationFrame(resizeFrameId);
            }
        };
    }, [darkMode]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
                pointerEvents: "none",
            }}
        />
    );
};

export default CanvasBackground;
