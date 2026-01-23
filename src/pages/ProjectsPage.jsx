import blue_bg from "../assets/blue_bg.png";
import Footer from "../components/Footer";

// Project data
const projects = [
    {
        id: 1,
        title: "Neural Style Transfer",
        description: "Implemented artistic style transfer using CNNs. Combines content from one image with the style of another using VGG19 network and custom loss functions.",
        tags: ["Python", "TensorFlow", "CNN", "Computer Vision"],
        github: "https://github.com/Agneypraseed/DL",
    },
    {
        id: 2,
        title: "RNN & LSTM Language Model",
        description: "Built recurrent neural networks for sequence modeling including character-level language models and LSTM networks for text generation.",
        tags: ["Python", "TensorFlow", "RNN", "LSTM", "NLP"],
        github: "https://github.com/Agneypraseed/DL",
    },
    {
        id: 3,
        title: "Vision Transformer Image Captioning",
        description: "Developed an image captioning model using Vision Transformers (ViT) that generates natural language descriptions for images.",
        tags: ["Python", "PyTorch", "Transformers", "ViT", "NLP"],
        github: "https://github.com/Agneypraseed/Notebooks/blob/main/vision-transformer-image-captioning.ipynb",
    },
    {
        id: 4,
        title: "LangChain Agents with Gemini",
        description: "Built AI agents using LangChain and Crew library integrated with Google's Gemini model for autonomous task execution.",
        tags: ["Python", "LangChain", "Gemini", "AI Agents", "LLM"],
        github: "https://github.com/Agneypraseed/Notebooks/blob/main/LangChain_Agents_with_Crew_Lib_%2B_Gemini.ipynb",
    },
    {
        id: 5,
        title: "Transformer Architecture from Scratch",
        description: "Implemented the Transformer architecture from scratch following the 'Attention is All You Need' paper for NLP tasks.",
        tags: ["Python", "PyTorch", "Transformers", "Attention", "NLP"],
        github: "https://github.com/Agneypraseed/Notebooks/blob/main/transformer.ipynb",
    },
];

import catCursor from "../assets/cat-cursor.svg";

const ProjectsPage = ({ darkMode }) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "transparent",
                backgroundImage: darkMode ? "none" : `url(${blue_bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                padding: "100px 20px 20px",
                cursor: `url(${catCursor}) 16 16, auto`,
            }}
        >
            {/* Title */}
            <h1 style={{ 
                color: "#ffffff",
                textAlign: "center",
                marginBottom: "0.75rem",
                fontSize: "2.5rem",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}>
                Projects
            </h1>
            <span style={{
                display: "inline-block",
                background: "rgba(255, 193, 7, 0.2)",
                color: "#ffc107",
                fontSize: "0.75rem",
                fontWeight: "600",
                padding: "4px 12px",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: "1px solid rgba(255, 193, 7, 0.3)",
            }}>
                🚧 Work in Progress
            </span>

            {/* Project Cards Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.5rem",
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "0 1rem",
                width: "100%",
            }}>
                {projects.map((project) => (
                    <div
                        key={project.id}
                        style={{
                            background: darkMode ? "rgba(30, 30, 30, 0.7)" : "rgba(255, 255, 255, 0.25)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            borderRadius: "16px",
                            border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.3)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                            padding: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.15)";
                        }}
                    >
                        {/* Title */}
                        <h3 style={{
                            color: darkMode ? "#ffffff" : "#333",
                            margin: "0 0 0.75rem 0",
                            fontSize: "1.25rem",
                            fontWeight: "600",
                        }}>
                            {project.title}
                        </h3>

                        {/* Course badge if applicable */}
                        {project.course && (
                            <span style={{
                                display: "inline-block",
                                background: darkMode ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.2)",
                                color: darkMode ? "#c4b5fd" : "#7c3aed",
                                fontSize: "0.7rem",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                marginBottom: "0.75rem",
                                alignSelf: "flex-start",
                            }}>
                                📜 {project.course}
                            </span>
                        )}

                        {/* Description */}
                        <p style={{
                            color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
                            fontSize: "0.9rem",
                            lineHeight: "1.5",
                            margin: "0 0 1rem 0",
                            flex: "1",
                        }}>
                            {project.description}
                        </p>

                        {/* Tags */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                        }}>
                            {project.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                                        color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
                                        fontSize: "0.75rem",
                                        padding: "4px 10px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* GitHub Button */}
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                background: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.8)",
                                color: darkMode ? "#ffffff" : "#ffffff",
                                textDecoration: "none",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.9)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.8)";
                            }}
                        >
                            <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                            </svg>
                            View on GitHub
                        </a>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
                <Footer darkMode={darkMode} />
            </div>
        </div>
    );
};

export default ProjectsPage;
