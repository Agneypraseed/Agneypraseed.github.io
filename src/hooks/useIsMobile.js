import { useState, useEffect } from "react";

const useIsMobile = (mobileBreakpoint = 768, tabletBreakpoint = 1024) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWindowWidth(window.innerWidth);
            }, 100);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return {
        isMobile: windowWidth <= mobileBreakpoint,
        isTablet: windowWidth > mobileBreakpoint && windowWidth <= tabletBreakpoint,
        windowWidth,
    };
};

export default useIsMobile;
