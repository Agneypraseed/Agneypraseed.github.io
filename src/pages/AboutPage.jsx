import { useState } from "react";
import Footer from "../components/Footer";
import resume from "../assets/resume.pdf";

const AboutPage = ({ darkMode }) => {
    const [copied, setCopied] = useState(false);
    const email = "agneysince2000@gmail.com";
    const displayEmail = "agneysince2000[at]gmail[dot]com";

    const copyEmail = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                padding: "120px 40px 40px",
                transition: "background-color 0.3s ease",
            }}
        >
            <div
                style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    maxWidth: "900px",
                }}
            >
                {/* Header Row - Name/Contact on left, Download CV on right */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "2rem",
                    flexWrap: "wrap",
                    gap: "1.5rem",
                }}>
                    {/* Left Side - Name & Contact */}
                    <div>
                        <h1 style={{ 
                            color: darkMode ? "#ffffff" : "#1a1a1a",
                            marginBottom: "0.5rem",
                            fontSize: "2.8rem",
                            fontWeight: "700",
                            margin: 0,
                        }}>
                            Agney Praseed
                        </h1>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "0.5rem",
                        }}>
                            <span style={{
                                color: darkMode ? "rgba(255,255,255,0.7)" : "#6b7280",
                                fontSize: "0.95rem",
                            }}>
                                Contact: <span style={{ fontFamily: "monospace" }}>{displayEmail}</span>
                            </span>
                            <button
                                onClick={copyEmail}
                                title="Copy email"
                                style={{
                                    background: darkMode ? "rgba(255,255,255,0.1)" : "#f3f4f6",
                                    border: darkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb",
                                    borderRadius: "6px",
                                    padding: "6px",
                                    cursor: "pointer",
                                    color: darkMode ? "#fff" : "#374151",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.2s ease",
                                    minWidth: "28px",
                                    minHeight: "28px",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.2)" : "#e5e7eb";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.1)" : "#f3f4f6";
                                }}
                            >
                                {copied ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Side - CV Buttons */}
                    <div style={{ 
                        display: "flex", 
                        alignItems: "stretch",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
                    }}>
                        {/* View CV - Opens in new tab */}
                        <a
                            href={resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                background: darkMode 
                                    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4))" 
                                    : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                                color: "#ffffff",
                                textDecoration: "none",
                                padding: "12px 20px",
                                fontSize: "0.95rem",
                                fontWeight: "600",
                                border: darkMode ? "1px solid rgba(139, 92, 246, 0.3)" : "none",
                                borderRight: "none",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = darkMode 
                                    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5))"
                                    : "linear-gradient(135deg, #7c3aed, #4f46e5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = darkMode 
                                    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4))"
                                    : "linear-gradient(135deg, #8b5cf6, #6366f1)";
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            CV
                        </a>
                        {/* Divider */}
                        <div style={{
                            width: "1px",
                            background: "rgba(255,255,255,0.3)",
                        }}></div>
                        {/* Download button */}
                        <a
                            href={resume}
                            download="Agney_Praseed_CV.pdf"
                            title="Download CV"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: darkMode 
                                    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4))" 
                                    : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                                color: "#ffffff",
                                textDecoration: "none",
                                padding: "12px 14px",
                                border: darkMode ? "1px solid rgba(139, 92, 246, 0.3)" : "none",
                                borderLeft: "none",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = darkMode 
                                    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5))"
                                    : "linear-gradient(135deg, #7c3aed, #4f46e5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = darkMode 
                                    ? "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4))"
                                    : "linear-gradient(135deg, #8b5cf6, #6366f1)";
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Social Links */}
                <div style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "2rem",
                }}>
                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/in/agney-praseed/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: darkMode ? "rgba(255,255,255,0.1)" : "#f3f4f6",
                            border: darkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb",
                            color: darkMode ? "#ffffff" : "#374151",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#0077b5";
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.1)" : "#f3f4f6";
                            e.currentTarget.style.color = darkMode ? "#ffffff" : "#374151";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>

                    {/* GitHub */}
                    <a
                        href="https://github.com/Agneypraseed"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            background: darkMode ? "rgba(255,255,255,0.1)" : "#f3f4f6",
                            border: darkMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e5e7eb",
                            color: darkMode ? "#ffffff" : "#374151",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#333";
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.1)" : "#f3f4f6";
                            e.currentTarget.style.color = darkMode ? "#ffffff" : "#374151";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                    </a>
                </div>

                {/* Bio */}
                <div style={{
                    background: darkMode ? "rgba(30, 30, 30, 0.6)" : "#f9fafb",
                    backdropFilter: darkMode ? "blur(12px)" : "none",
                    borderRadius: "16px",
                    padding: "2rem",
                    border: darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
                }}>
                    <p style={{
                        color: darkMode ? "#ffffff" : "#1a1a1a",
                        fontSize: "1.2rem",
                        lineHeight: "1.8",
                        margin: 0,
                    }}>
                        Hi, I'm <strong>Agney</strong> (he/him), based in Berlin, Germany. 🇩🇪
                    </p>
                    <p style={{
                        color: darkMode ? "rgba(255,255,255,0.8)" : "#4b5563",
                        fontSize: "1.1rem",
                        lineHeight: "1.8",
                        marginTop: "1rem",
                        marginBottom: 0,
                    }}>
                        I'm currently an <strong>MS student in AI</strong>. I'm a software developer interested in training deep neural networks. 🧠
                    </p>
                </div>
            </div>
            <Footer darkMode={darkMode} isHomePage={false} />
        </div>
    );
};

export default AboutPage;
