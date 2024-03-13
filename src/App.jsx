import React from "react";
import myAvatar from "../src/assets/avatar.jpg";
import bg from "../src/assets/bg.png";
import TypedText from "./components/TypedText";
import { useState, useEffect } from "react";
import Skills from "./components/Skills";

const App = () => {
    return (
        <>
            <div
                style={{
                    position: "relative",
                    margin: "-0.5em",
                    height: "100vh",
                    display: "grid",
                    color: "rgba(255, 255, 255, 0.87)",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "center",
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                }}
            >
                <div style={{ padding: "0 20px", overflow: "hidden" }}>
                    <div style={{ padding: "120px", textAlign: "left" }}>
                        <h4>HELLO WORLD! 👋</h4>
                        I'm{" "}
                        <strong style={{ color: "#66d4cf" }}>
                            <TypedText
                                strings={["AGNEY", "अग्नेय", "АГНЕЙ", "അഗ്നെയ്"]}
                                startDelay={300}
                                typeSpeed={100}
                                backSpeed={100}
                                backDelay={100}
                                loop={true}
                                cursorChar={""}
                                fontSize={34}
                            />
                        </strong>
                        <h3>
                            <TypedText
                                strings={["FULL STACK DEVELOPER", "Passionate About Deep Learning "]}
                                startDelay={300}
                                typeSpeed={100}
                                backSpeed={100}
                                backDelay={100}
                                loop={true}
                                cursorChar={"|"}
                                fontSize={54}
                            />
                        </h3>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "340px" }}>
                    <img
                        src={myAvatar}
                        alt="home pic"
                        style={{ width: "200px", height: "200px", borderRadius: "50%" }}
                    />
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <Skills />
            </div>
        </>
    );
};

export default App;
