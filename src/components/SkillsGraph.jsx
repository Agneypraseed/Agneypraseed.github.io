import { useRef, useEffect, useCallback, useState } from "react";
import {
    forceSimulation,
    forceLink,
    forceManyBody,
    forceCenter,
    forceCollide,
    forceX,
    forceY,
} from "d3-force";

// ── Skill data organized by category ──
const CATEGORIES = [
    {
        id: "languages",
        label: "LANGUAGES",
        color: "#66d4cf",
        darkColor: "#66d4cf",
        skills: [
            { name: "Java", size: 1.0 },
            { name: "Python", size: 1.0 },
            { name: "JavaScript", size: 0.85 },
            { name: "C++", size: 0.7 },
            { name: "SQL", size: 0.8 },
            { name: "TypeScript", size: 0.7 },
            { name: "Bash", size: 0.5 },
        ],
    },
    {
        id: "frameworks",
        label: "FRAMEWORKS & TOOLS",
        color: "#8b5cf6",
        darkColor: "#a78bfa",
        skills: [
            { name: "Spring Boot", size: 0.9 },
            { name: "React", size: 0.85 },
            { name: "Angular", size: 0.65 },
            { name: "Node.js", size: 0.75 },
            { name: "Express.js", size: 0.65 },
            { name: "Docker", size: 0.7 },
            { name: "Git", size: 0.8 },
            { name: "REST APIs", size: 0.75 },
        ],
    },
    {
        id: "data-cloud",
        label: "DATA & CLOUD",
        color: "#6366f1",
        darkColor: "#818cf8",
        skills: [
            { name: "PostgreSQL", size: 0.75 },
            { name: "MongoDB", size: 0.7 },
            { name: "MySQL", size: 0.65 },
            { name: "AWS", size: 0.8 },
            { name: "Azure", size: 0.75 },
            { name: "Elasticsearch", size: 0.55 },
        ],
    },
    {
        id: "ai-ml",
        label: "AI & ML",
        color: "#f472b6",
        darkColor: "#f9a8d4",
        skills: [
            { name: "PyTorch", size: 0.95 },
            { name: "TensorFlow", size: 0.7 },
            { name: "OpenCV", size: 0.65 },
            { name: "Hugging Face", size: 0.75 },
            { name: "Scikit-learn", size: 0.7 },
            { name: "LangChain", size: 0.65 },
            { name: "Pandas", size: 0.7 },
            { name: "NumPy", size: 0.65 },
        ],
    },
];

// ── Build graph data ──
function buildGraph() {
    const nodes = [];
    const links = [];

    CATEGORIES.forEach((cat) => {
        // Hub node
        nodes.push({
            id: cat.id,
            label: cat.label,
            isHub: true,
            color: cat.color,
            darkColor: cat.darkColor,
            radius: 28,
            categoryId: cat.id,
        });

        cat.skills.forEach((skill) => {
            const skillId = `${cat.id}--${skill.name}`;
            nodes.push({
                id: skillId,
                label: skill.name,
                isHub: false,
                color: cat.color,
                darkColor: cat.darkColor,
                radius: 6 + skill.size * 12,
                categoryId: cat.id,
            });
            links.push({ source: cat.id, target: skillId });
        });
    });

    // Inter-category links for connected feel
    const interLinks = [
        ["languages--Python", "ai-ml--PyTorch"],
        ["languages--Python", "ai-ml--Pandas"],
        ["languages--JavaScript", "frameworks--React"],
        ["languages--JavaScript", "frameworks--Node.js"],
        ["languages--TypeScript", "frameworks--Angular"],
        ["languages--SQL", "data-cloud--PostgreSQL"],
        ["frameworks--Docker", "data-cloud--AWS"],
        ["ai-ml--Hugging Face", "ai-ml--LangChain"],
    ];

    interLinks.forEach(([s, t]) => {
        if (nodes.find((n) => n.id === s) && nodes.find((n) => n.id === t)) {
            links.push({ source: s, target: t, inter: true });
        }
    });

    return { nodes, links };
}

const SkillsGraph = ({ darkMode }) => {
    const canvasRef = useRef(null);
    const simRef = useRef(null);
    const nodesRef = useRef([]);
    const linksRef = useRef([]);
    const frameRef = useRef(null);
    const dragRef = useRef(null);
    const hoveredRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
    const containerRef = useRef(null);

    // ── Measure container ──
    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: Math.max(rect.width, 300),
                    height: Math.max(Math.min(rect.width * 0.75, 640), 380),
                });
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // ── Initialize simulation ──
    useEffect(() => {
        const { nodes, links } = buildGraph();
        nodesRef.current = nodes;
        linksRef.current = links;

        const sim = forceSimulation(nodes)
            .force(
                "link",
                forceLink(links)
                    .id((d) => d.id)
                    .distance((d) => (d.inter ? 120 : d.source.isHub ? 65 : 45))
                    .strength((d) => (d.inter ? 0.15 : 0.7))
            )
            .force("charge", forceManyBody().strength((d) => (d.isHub ? -300 : -50)))
            .force("center", forceCenter(dimensions.width / 2, dimensions.height / 2))
            .force("collide", forceCollide().radius((d) => d.radius + 4).strength(0.8))
            .force("x", forceX(dimensions.width / 2).strength(0.06))
            .force("y", forceY(dimensions.height / 2).strength(0.06))
            .alpha(1)
            .alphaDecay(0.015)
            .velocityDecay(0.35);

        simRef.current = sim;

        return () => {
            sim.stop();
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [dimensions.width, dimensions.height]);

    // ── Draw loop ──
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const w = dimensions.width;
        const h = dimensions.height;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Clear
        ctx.clearRect(0, 0, w, h);

        const nodes = nodesRef.current;
        const links = linksRef.current;
        const hovered = hoveredRef.current;

        // Find highlighted set
        const highlightedNodes = new Set();
        const highlightedLinks = new Set();
        if (hovered) {
            highlightedNodes.add(hovered.id);
            links.forEach((l, i) => {
                const sid = typeof l.source === "object" ? l.source.id : l.source;
                const tid = typeof l.target === "object" ? l.target.id : l.target;
                if (sid === hovered.id || tid === hovered.id) {
                    highlightedLinks.add(i);
                    highlightedNodes.add(sid);
                    highlightedNodes.add(tid);
                }
            });
        }

        // ── Draw links ──
        links.forEach((l, i) => {
            const sx = l.source.x, sy = l.source.y;
            const tx = l.target.x, ty = l.target.y;
            if (sx == null || tx == null) return;

            const isHighlighted = highlightedLinks.has(i);
            const dimmed = hovered && !isHighlighted;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(tx, ty);

            if (l.inter) {
                ctx.strokeStyle = dimmed
                    ? (darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)")
                    : (darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)");
                ctx.setLineDash([4, 4]);
            } else {
                ctx.strokeStyle = dimmed
                    ? (darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)")
                    : isHighlighted
                        ? (darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)")
                        : (darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)");
                ctx.setLineDash([]);
            }
            ctx.lineWidth = isHighlighted ? 1.8 : 1;
            ctx.stroke();
            ctx.setLineDash([]);
        });

        // ── Draw nodes ──
        nodes.forEach((node) => {
            if (node.x == null) return;

            const isHighlighted = highlightedNodes.has(node.id);
            const dimmed = hovered && !isHighlighted;
            const color = darkMode ? node.darkColor : node.color;

            // Glow for hubs or hovered
            if ((node.isHub || isHighlighted) && !dimmed) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius + 8, 0, Math.PI * 2);
                const grad = ctx.createRadialGradient(
                    node.x, node.y, node.radius * 0.5,
                    node.x, node.y, node.radius + 12
                );
                grad.addColorStop(0, color + "30");
                grad.addColorStop(1, color + "00");
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.restore();
            }

            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = dimmed ? (darkMode ? "#333" : "#ddd") : color;
            ctx.globalAlpha = dimmed ? 0.3 : 1;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Outline for hubs
            if (node.isHub) {
                ctx.strokeStyle = dimmed
                    ? (darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")
                    : color + "60";
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // ── Labels ──
            const fontSize = node.isHub ? 11 : 10;
            ctx.font = `${node.isHub ? "700" : "500"} ${fontSize}px Inter, system-ui, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = dimmed
                ? (darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)")
                : (darkMode ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.7)");

            if (node.isHub) {
                ctx.fillText(node.label, node.x, node.y + node.radius + 6);
            } else {
                ctx.fillText(node.label, node.x, node.y + node.radius + 3);
            }
        });

        frameRef.current = requestAnimationFrame(draw);
    }, [darkMode, dimensions]);

    // ── Start draw loop ──
    useEffect(() => {
        frameRef.current = requestAnimationFrame(draw);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [draw]);

    // ── Hit test ──
    const hitTest = useCallback((x, y) => {
        const nodes = nodesRef.current;
        for (let i = nodes.length - 1; i >= 0; i--) {
            const n = nodes[i];
            const dx = x - n.x, dy = y - n.y;
            if (dx * dx + dy * dy <= (n.radius + 4) * (n.radius + 4)) {
                return n;
            }
        }
        return null;
    }, []);

    const getCanvasCoords = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    // ── Mouse handlers ──
    const handleMouseDown = useCallback((e) => {
        const { x, y } = getCanvasCoords(e);
        const node = hitTest(x, y);
        if (node) {
            dragRef.current = node;
            node.fx = node.x;
            node.fy = node.y;
            simRef.current?.alphaTarget(0.3).restart();
        }
    }, [hitTest, getCanvasCoords]);

    const handleMouseMove = useCallback((e) => {
        const { x, y } = getCanvasCoords(e);
        const canvas = canvasRef.current;

        if (dragRef.current) {
            dragRef.current.fx = x;
            dragRef.current.fy = y;
        }

        const node = hitTest(x, y);
        hoveredRef.current = node;
        if (canvas) canvas.style.cursor = node ? "grab" : "default";
        if (dragRef.current && canvas) canvas.style.cursor = "grabbing";
    }, [hitTest, getCanvasCoords]);

    const handleMouseUp = useCallback(() => {
        if (dragRef.current) {
            dragRef.current.fx = null;
            dragRef.current.fy = null;
            dragRef.current = null;
            simRef.current?.alphaTarget(0);
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        hoveredRef.current = null;
        handleMouseUp();
    }, [handleMouseUp]);

    // ── Touch handlers ──
    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const { x, y } = getCanvasCoords(touch);
        const node = hitTest(x, y);
        if (node) {
            dragRef.current = node;
            node.fx = node.x;
            node.fy = node.y;
            simRef.current?.alphaTarget(0.3).restart();
        }
    }, [hitTest, getCanvasCoords]);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        if (dragRef.current) {
            const touch = e.touches[0];
            const { x, y } = getCanvasCoords(touch);
            dragRef.current.fx = x;
            dragRef.current.fy = y;
        }
    }, [getCanvasCoords]);

    const handleTouchEnd = useCallback((e) => {
        e.preventDefault();
        handleMouseUp();
    }, [handleMouseUp]);

    return (
        <div ref={containerRef} style={{ width: "100%", position: "relative" }}>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    width: "100%",
                    height: dimensions.height,
                    borderRadius: "12px",
                    touchAction: "none",
                }}
            />
        </div>
    );
};

export { CATEGORIES };
export default SkillsGraph;
