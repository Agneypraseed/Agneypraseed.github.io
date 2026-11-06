const getSkillNodeId = (categoryId, skillName) =>
  `${categoryId}--${skillName}`;

const GRAPH_COLORS = {
  // Muted accents on cream, softer tints on charcoal.
  red: { light: "#dc2626", dark: "#f87171" },
  charcoal: { light: "#3f3f46", dark: "#e4e4e7" },
  slate: { light: "#52677c", dark: "#a5b4c7" },
  plum: { light: "#80556e", dark: "#d2acc6" },
};

const CATEGORIES = [
  {
    id: "languages",
    label: "LANGUAGES",
    color: GRAPH_COLORS.red.light,
    darkColor: GRAPH_COLORS.red.dark,
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
    color: GRAPH_COLORS.charcoal.light,
    darkColor: GRAPH_COLORS.charcoal.dark,
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
    color: GRAPH_COLORS.slate.light,
    darkColor: GRAPH_COLORS.slate.dark,
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
    color: GRAPH_COLORS.plum.light,
    darkColor: GRAPH_COLORS.plum.dark,
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
