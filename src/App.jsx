import React from "react";
import Typist from "react-typist";
import { useState } from "react";

const translations = {
    hindi: "मैं जॉन हूँ",
    spanish: "Soy Juan",
};

const handleTranslation = (lang) => {
    setText(translations[lang]);
};

const App = () => {
    const [text, setText] = useState("I am John");

    return (
        <div>
            <h4>HELLO WORLD!</h4>
            👋 Hello. I'm AGNEY
            <div>
                <Typist
                    avgTypingDelay={100}
                    onTypingDone={() => {
                        setTimeout(() => {
                            handleTranslation("hindi");
                        }, 1000); // Change the delay according to your needs
                    }}
                >
                    {text}
                </Typist>
            </div>
        </div>
    );
};

export default App;
