import React from "react";
import Typed from "typed.js";
import myAvatar from "../src/assets/avatar.jpg";
import bg from "../src/assets/bg.png";
import { useState, useEffect, useRef } from "react";

const App = () => {
    const el = useRef(null);

    useEffect(() => {
        const typed = new Typed(el.current, {
            strings: ["AGNEY", "अग्नेय", "АГНЕЙ", "അഗ്നേയ"],
            startDelay: 300,
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 100,
            loop: true,
            cursorChar: "",
        });

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "grid",
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
                <div style={{ padding: "250px", textAlign: "left" }}>
                    <h4>HELLO WORLD! 👋</h4>
                    I'm{" "}
                    <strong style={{ color: "hsl(241.88deg 62.75% 80%)" }}>
                        <span ref={el} style={{ fontSize: "34px" }}></span>
                    </strong>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "100px" }}>
                <img
                    src={myAvatar}
                    alt="home pic"
                    style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        padding: "20px",
                    }}
                />
            </div>
        </div>
    );
};

export default App;
