import { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import useIsMobile from "../hooks/useIsMobile";
import books from "../data/books";

/* ── wireframe‑globe SVG for the decorative background ── */
const GlobeSVG = ({ darkMode }) => {
    const stroke = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
    return (
        <svg
            viewBox="0 0 500 500"
            style={{
                position: "absolute",
                bottom: "-10%",
                left: "-8%",
                width: "55%",
                maxWidth: "520px",
                opacity: 1,
                pointerEvents: "none",
                zIndex: 0,
            }}
        >
            {/* main circle */}
            <circle cx="250" cy="250" r="200" fill="none" stroke={stroke} strokeWidth="0.8" />
            {/* horizontal latitude lines */}
            {[-120, -60, 0, 60, 120].map((ry) => (
                <ellipse
                    key={`lat-${ry}`}
                    cx="250"
                    cy="250"
                    rx={Math.sqrt(200 * 200 - ry * ry)}
                    ry={Math.abs(ry) * 0.35 + 15}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="0.6"
                    transform={`translate(0, ${ry * 0.6})`}
                />
            ))}
            {/* vertical longitude lines */}
            {[-80, -40, 0, 40, 80].map((rx) => (
                <ellipse
                    key={`lon-${rx}`}
                    cx="250"
                    cy="250"
                    rx={Math.abs(rx) * 0.35 + 15}
                    ry={200}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="0.6"
                    transform={`rotate(${rx * 0.15}, 250, 250)`}
                />
            ))}
            {/* extra meridian arcs for depth */}
            <ellipse cx="250" cy="250" rx="200" ry="85" fill="none" stroke={stroke} strokeWidth="0.5" />
            <ellipse cx="250" cy="250" rx="85" ry="200" fill="none" stroke={stroke} strokeWidth="0.5" />
            <ellipse cx="250" cy="250" rx="160" ry="55" fill="none" stroke={stroke} strokeWidth="0.4" />
            <ellipse cx="250" cy="250" rx="55" ry="160" fill="none" stroke={stroke} strokeWidth="0.4" />
        </svg>
    );
};

/* ── View toggle component ── */
const ViewToggle = ({ view, setView, darkMode }) => {
    const activeStyle = {
        fontWeight: 700,
        color: darkMode ? "#fff" : "#1a1a1a",
        cursor: "default",
    };
    const inactiveStyle = {
        fontWeight: 400,
        color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)",
        cursor: "pointer",
        transition: "color 0.2s",
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
                userSelect: "none",
            }}
        >
            <span
                onClick={() => setView("image")}
                style={view === "image" ? activeStyle : inactiveStyle}
                onMouseEnter={(e) => {
                    if (view !== "image") e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
                }}
                onMouseLeave={(e) => {
                    if (view !== "image") e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
                }}
            >
                Image
            </span>
            <span style={{ color: darkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)" }}>|</span>
            <span
                onClick={() => setView("list")}
                style={view === "list" ? activeStyle : inactiveStyle}
                onMouseEnter={(e) => {
                    if (view !== "list") e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
                }}
                onMouseLeave={(e) => {
                    if (view !== "list") e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
                }}
            >
                List
            </span>
        </div>
    );
};

/* ── Book detail panel (right side) ── */
const BookDetail = ({ book, darkMode, isMobile }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Reset states when book changes
    useEffect(() => {
        setImgLoaded(false);
        setImgError(false);
    }, [book?.id]);

    if (!book) return null;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMobile ? "center" : "flex-start",
                gap: "1rem",
                animation: "fadeInBook 0.4s ease",
                maxWidth: isMobile ? "100%" : "340px",
            }}
        >
            {/* Cover */}
            <div
                style={{
                    width: isMobile ? "220px" : "280px",
                    height: isMobile ? "330px" : "420px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    boxShadow: darkMode
                        ? "0 12px 40px rgba(0,0,0,0.5)"
                        : "0 8px 30px rgba(0,0,0,0.12)",
                    background: darkMode ? "#2a2a2a" : "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >

                {(imgError || !book.cover) ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            padding: "2rem",
                            textAlign: "center",
                            color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                        }}
                    >
                        <span style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📖</span>
                        <span style={{ fontSize: "0.85rem", fontStyle: "italic" }}>{book.title}</span>
                    </div>
                ) : (
                    <img
                        src={book.cover}
                        alt={book.title}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: imgLoaded ? 1 : 0,
                            transition: "opacity 0.4s ease",
                        }}
                    />
                )}
            </div>
            {/* Title & Description */}
            <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <h3
                    style={{
                        margin: "0 0 0.25rem 0",
                        fontSize: isMobile ? "1rem" : "1.15rem",
                        fontWeight: 700,
                        color: darkMode ? "#fff" : "#1a1a1a",
                        fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                >
                    {book.title}
                </h3>
                <p
                    style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.8rem",
                        color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
                        fontStyle: "italic",
                    }}
                >
                    by {book.author}
                </p>
                <p
                    style={{
                        margin: 0,
                        fontSize: isMobile ? "0.85rem" : "0.9rem",
                        lineHeight: 1.6,
                        color: darkMode ? "rgba(255,255,255,0.65)" : "#4b5563",
                    }}
                >
                    {book.description}
                </p>
            </div>
        </div>
    );
};


/* ── Full detail view (for image grid click) ── */
const BookDetailView = ({ book, darkMode, isMobile, onClose }) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        setImgLoaded(false);
        setImgError(false);
    }, [book?.id]);

    if (!book) return null;

    return (
        <div
            onClick={(e) => {
                // Click outside the content box → go back
                if (contentRef.current && !contentRef.current.contains(e.target)) {
                    onClose();
                }
            }}
            style={{
                position: "relative",
                width: "100%",
                minHeight: isMobile ? "auto" : "500px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "2rem 1rem" : "3rem 2rem",
                overflow: "hidden",
                animation: "fadeInBook 0.5s ease",
                cursor: "default",
            }}
        >
            {/* Back button */}
            <button
                onClick={onClose}
                style={{
                    alignSelf: "flex-start",
                    background: "none",
                    border: "none",
                    color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    padding: "0.5rem 0",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontFamily: "'Courier New', Courier, monospace",
                    letterSpacing: "0.04em",
                    transition: "color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = darkMode ? "#fff" : "#000"}
                onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
            >
                <span style={{ fontSize: "1.1rem" }}>←</span> Back
            </button>

            {/* Content area */}
            <div
                ref={contentRef}
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: isMobile ? "2rem" : "4rem",
                }}
            >
                {/* Cover image */}
                <div
                    style={{
                        width: isMobile ? "200px" : "280px",
                        height: isMobile ? "300px" : "420px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        boxShadow: darkMode
                            ? "0 20px 60px rgba(0,0,0,0.6)"
                            : "0 15px 50px rgba(0,0,0,0.15)",
                        flexShrink: 0,
                        background: darkMode ? "#2a2a2a" : "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {(imgError || !book.cover) ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "2rem", textAlign: "center", color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>
                            <span style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📖</span>
                            <span style={{ fontSize: "0.9rem", fontStyle: "italic" }}>{book.title}</span>
                        </div>
                    ) : (
                        <img
                            src={book.cover}
                            alt={book.title}
                            onLoad={() => setImgLoaded(true)}
                            onError={() => setImgError(true)}
                            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
                        />
                    )}
                </div>

                {/* Text info */}
                <div
                    style={{
                        maxWidth: isMobile ? "100%" : "400px",
                        textAlign: isMobile ? "center" : "left",
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            fontSize: isMobile ? "1.6rem" : "2.2rem",
                            fontWeight: 400,
                            fontStyle: "italic",
                            color: darkMode ? "#fff" : "#1a1a1a",
                            margin: "0 0 1rem 0",
                            lineHeight: 1.3,
                        }}
                    >
                        {book.title}
                    </h2>
                    <p
                        style={{
                            margin: 0,
                            fontSize: isMobile ? "0.9rem" : "1rem",
                            lineHeight: 1.7,
                            color: darkMode ? "rgba(255,255,255,0.65)" : "#4b5563",
                        }}
                    >
                        {book.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ── Image grid view ── */
const ImageGridView = ({ books: bookList, darkMode, isMobile }) => {
    const [selectedBook, setSelectedBook] = useState(null);

    if (selectedBook) {
        return (
            <BookDetailView
                book={selectedBook}
                darkMode={darkMode}
                isMobile={isMobile}
                onClose={() => setSelectedBook(null)}
            />
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: isMobile
                    ? "repeat(auto-fill, minmax(120px, 1fr))"
                    : "repeat(auto-fill, minmax(160px, 1fr))",
                gap: isMobile ? "1rem" : "1.5rem",
                width: "100%",
                maxWidth: "1100px",
            }}
        >
            {bookList.map((book) => (
                <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    style={{
                        cursor: "pointer",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: darkMode
                            ? "0 4px 16px rgba(0,0,0,0.3)"
                            : "0 2px 12px rgba(0,0,0,0.08)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        background: darkMode ? "#2a2a2a" : "#f5f5f5",
                        aspectRatio: "2/3",
                        position: "relative",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                        e.currentTarget.style.boxShadow = darkMode
                            ? "0 8px 24px rgba(0,0,0,0.5)"
                            : "0 6px 20px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = darkMode
                            ? "0 4px 16px rgba(0,0,0,0.3)"
                            : "0 2px 12px rgba(0,0,0,0.08)";
                    }}
                >
                    <img
                        src={book.cover}
                        alt={book.title}
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    <div
                        style={{
                            display: "none",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            inset: 0,
                            padding: "1rem",
                            textAlign: "center",
                            color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
                        }}
                    >
                        <span style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📖</span>
                        <span style={{ fontSize: "0.75rem" }}>{book.title}</span>
                    </div>
                    {/* Title overlay on hover */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: "2rem 0.75rem 0.75rem",
                            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                            color: "#fff",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            pointerEvents: "none",
                        }}
                        className="book-card-overlay"
                    >
                        {book.title}
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ── Main page ── */
const BooksPage = ({ darkMode }) => {
    const { isMobile } = useIsMobile();
    const [view, setView] = useState("list");
    const [hoveredBook, setHoveredBook] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const detailRef = useRef(null);

    const [activeTag, setActiveTag] = useState("All");

    // Extract unique tags (excluding "All")
    const allTags = [...new Set(books.flatMap((b) => b.tags || []))].filter(Boolean);
    const filteredBooks = activeTag === "All" ? books : books.filter((b) => b.tags?.includes(activeTag));

    // Click pins a book (toggle on/off), works on both desktop and mobile
    const handleBookClick = (book) => {
        setSelectedBook(selectedBook?.id === book.id ? null : book);
    };

    // Selected book takes priority over hovered book
    const activeBook = selectedBook || hoveredBook;

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
                transition: "background-color 0.3s ease",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Keyframe animation */}
            <style>{`
                @keyframes fadeInBook {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .book-title-item {
                    transition: color 0.2s ease, font-style 0.2s ease;
                }
                .book-card-overlay {
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                div:hover > .book-card-overlay {
                    opacity: 1;
                }
            `}</style>



            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    padding: isMobile ? "80px 20px 16px" : "100px 60px 20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header row: title + toggle */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: isMobile ? "flex-start" : "flex-end",
                        marginBottom: isMobile ? "2rem" : "3rem",
                        flexDirection: isMobile ? "column" : "row",
                        gap: isMobile ? "1rem" : "0",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            fontSize: isMobile ? "2.5rem" : "4rem",
                            fontWeight: 400,
                            color: darkMode ? "#ffffff" : "#1a1a1a",
                            margin: 0,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Pretrain-text
                    </h1>
                    <ViewToggle view={view} setView={setView} darkMode={darkMode} />
                </div>

                {/* Body */}
                {/* Filter Tags */}
                {allTags.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            gap: "0.8rem",
                            marginBottom: "2rem",
                            flexWrap: "wrap",
                        }}
                    >
                        {allTags.map((tag) => {
                            const isActive = activeTag === tag;
                            return (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        // Toggle off if already active
                                        setActiveTag(isActive ? "All" : tag);
                                        setSelectedBook(null); 
                                        setHoveredBook(null);
                                    }}
                                    style={{
                                        background: isActive
                                            ? darkMode
                                                ? "rgba(255,255,255,0.1)"
                                                : "rgba(0,0,0,0.05)"
                                            : "transparent",
                                        border: `1px solid ${
                                            isActive
                                                ? darkMode
                                                    ? "rgba(255,255,255,0.8)"
                                                    : "rgba(0,0,0,0.8)"
                                                : darkMode
                                                ? "rgba(255,255,255,0.2)"
                                                : "rgba(0,0,0,0.2)"
                                        }`,
                                        color: isActive
                                            ? darkMode
                                                ? "#fff"
                                                : "#000"
                                            : darkMode
                                            ? "rgba(255,255,255,0.6)"
                                            : "rgba(0,0,0,0.5)",
                                        borderRadius: "4px", // Square box
                                        padding: "0.3rem 0.8rem",
                                        fontSize: "0.85rem",
                                        fontFamily: "'Courier New', Courier, monospace",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <span>{tag}</span>
                                    {isActive && (
                                        <span style={{ fontSize: "0.9rem", lineHeight: 1 }}>×</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {view === "list" ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: isMobile ? "2rem" : "2.5rem",
                            flex: 1,
                            maxWidth: "900px",
                        }}
                    >
                        {/* Book list */}
                        <div
                            style={{
                                flex: isMobile ? "none" : "1",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.15rem",
                            }}
                        >
                            {filteredBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="book-title-item"
                                    onClick={() => handleBookClick(book)}
                                    onMouseEnter={() => !isMobile && setHoveredBook(book)}
                                    onMouseLeave={() => !isMobile && setHoveredBook(null)}
                                    style={{
                                        fontFamily: "'Georgia', 'Times New Roman', serif",
                                        fontSize: isMobile ? "1rem" : "1.15rem",
                                        fontWeight: 600,
                                        lineHeight: 2.2,
                                        color:
                                            activeBook?.id === book.id
                                                ? darkMode
                                                    ? "rgba(255,255,255,0.5)"
                                                    : "rgba(0,0,0,0.4)"
                                                : darkMode
                                                ? "#ffffff"
                                                : "#1a1a1a",
                                        fontStyle: activeBook?.id === book.id ? "italic" : "normal",
                                        cursor: "pointer",
                                        padding: "0 0.25rem",
                                        borderRadius: "4px",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {book.title}
                                </div>
                            ))}
                        </div>

                        {/* Detail panel — desktop: sticky on right; mobile: shown below selected */}
                        {!isMobile && (
                            <div
                                ref={detailRef}
                                style={{
                                    position: "sticky",
                                    top: "120px",
                                    alignSelf: "flex-start",
                                    minWidth: "300px",
                                    maxWidth: "340px",
                                    minHeight: "200px",
                                }}
                            >
                                {activeBook && (
                                    <BookDetail book={activeBook} darkMode={darkMode} isMobile={isMobile} />
                                )}
                            </div>
                        )}

                        {/* Mobile: show selected book detail */}
                        {isMobile && selectedBook && (
                            <div style={{ padding: "0 0.5rem" }}>
                                <BookDetail book={selectedBook} darkMode={darkMode} isMobile={isMobile} />
                            </div>
                        )}
                    </div>
                ) : (
                    /* Image grid view */
                    <ImageGridView books={filteredBooks} darkMode={darkMode} isMobile={isMobile} />
                )}

                {/* Footer */}
                <div style={{ marginTop: "auto", paddingTop: "3rem" }}>
                    <Footer darkMode={darkMode} isHomePage={false} />
                </div>
            </div>
        </div>
    );
};

export default BooksPage;
