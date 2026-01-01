import Skill from "./Skill";
import python from "../assets/skills/python.png";
import java from "../assets/skills/java.jpg";
import js from "../assets/skills/javascript.png";
import cpp from "../assets/skills/c++.png";
import bash from "../assets/skills/bash.png";
import docker from "../assets/skills/docker.png";
import git from "../assets/skills/git.png";
import mongodb from "../assets/skills/mongodb.jpeg";
import nodejs from "../assets/skills/nodejs.png";
import opencv from "../assets/skills/opencv.png";

const Skills = ({ darkMode }) => (
    <div style={{ 
        padding: "2rem", 
        margin: "2rem",
        backgroundColor: darkMode ? "rgba(30, 30, 30, 0.6)" : "rgba(255, 255, 255, 0.25)", 
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "20px",
        border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: darkMode ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease" 
    }}>
        <h2 style={{ color: darkMode ? "#ffffff" : "#333333", transition: "color 0.3s ease" }}>Skills</h2>
        {/* <span>Languages, Frameworks and Tools</span> */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Skill logo={java} title="Java" darkMode={darkMode} />
            <Skill logo={python} title="Python" darkMode={darkMode} />
            <Skill logo={js} title="JavaScript" darkMode={darkMode} />
            <Skill logo={cpp} title="C++" darkMode={darkMode} />
            <Skill logo={bash} title="Bash" darkMode={darkMode} />
            <Skill logo={docker} title="Docker" darkMode={darkMode} />
            <Skill logo={git} title="Git" darkMode={darkMode} />
            <Skill logo={mongodb} title="MongoDB" darkMode={darkMode} />
            <Skill logo={nodejs} title="Node.js" darkMode={darkMode} />
            <Skill logo={opencv} title="OpenCV" darkMode={darkMode} />
        </div>
    </div>
);

export default Skills;
