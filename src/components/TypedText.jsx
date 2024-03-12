import React, { useRef, useEffect } from "react";
import Typed from "typed.js";
import "./TypedText.css";

const TypedText = ({ strings, startDelay, typeSpeed, backSpeed, backDelay, loop, cursorChar, fontSize }) => {
    const typedRef = useRef(null);

    useEffect(() => {
        const options = {
            strings,
            startDelay,
            typeSpeed,
            backSpeed,
            backDelay,
            loop,
            cursorChar,
        };

        if (typedRef.current) {
            const typedInstance = new Typed(typedRef.current, options);

            return () => {
                typedInstance.destroy();
            };
        }
    }, [strings, startDelay, typeSpeed, backSpeed, backDelay, loop, cursorChar]);

    return <span ref={typedRef} style={{ fontSize: fontSize }}></span>;
};

export default TypedText;
