const getSkillNodeId = (categoryId, skillName) => `${categoryId}--${skillName}`;

const GRAPH_COLORS = {
  red: "#dc2626",
  blue: "#2563eb",
  charcoal: "#171717",
  zinc: "#a1a1aa",
  zincLight: "#e4e4e7",
};

const CATEGORIES = [
  {
    id: "languages",
    label: "LANGUAGES",
    color: GRAPH_COLORS.red,
    darkColor: "#f87171",
    lightColor: GRAPH_COLORS.red,
    hubTone: "charcoal",
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
    color: GRAPH_COLORS.blue,
    darkColor: "#60a5fa",
    lightColor: GRAPH_COLORS.blue,
    hubTone: "zinc",
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
    color: GRAPH_COLORS.charcoal,
    darkColor: GRAPH_COLORS.zincLight,
    lightColor: GRAPH_COLORS.charcoal,
    hubTone: "charcoal",
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
    color: GRAPH_COLORS.zinc,
    darkColor: GRAPH_COLORS.zinc,
    lightColor: GRAPH_COLORS.zinc,
    hubTone: "zinc",
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

export { CATEGORIES, GRAPH_COLORS, getSkillNodeId };
