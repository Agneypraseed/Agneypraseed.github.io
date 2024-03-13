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

const Skills = () => (
    <div>
        <h2>Skills</h2>
        {/* <span>Languages, Frameworks and Tools</span> */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Skill logo={java} title="Java" />
            <Skill logo={python} title="Python" />
            <Skill logo={js} title="JavaScript" />
            <Skill logo={cpp} title="C++" />
            <Skill logo={bash} title="Bash" />
            <Skill logo={docker} title="Docker" />
            <Skill logo={git} title="Git" />
            <Skill logo={mongodb} title="MongoDB" />
            <Skill logo={nodejs} title="Node.js" />
            <Skill logo={opencv} title="OpenCV" />
        </div>
    </div>
);

export default Skills;
