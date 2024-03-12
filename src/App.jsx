import React from "react";
import Typed from "typed.js";
import myAvatar from "../src/assets/avatar.jpg";
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100vh" }}>
            <div style={{ flex: "0 0 auto", padding: "0 20px" }}>
                <div style={{ padding: 250, textAlign: "left" }}>
                    <h4>HELLO WORLD! 👋</h4>
                    I'm{" "}
                    <strong style={{ color: "lightpink" }}>
                        <span ref={el} style={{ fontSize: "34px" }}></span>
                    </strong>
                </div>
            </div>
            <div style={{ flex: "0 0 auto", marginRight: "100px" }}>
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
