import { useId, useState } from "react";
import "./TechnicalDebtSection.css";
import "./ReadingShelf.css";

const currentBooks = [
    { id: "atomic", title: "Atomic Habits", author: "James Clear" },
    {
        id: "machines",
        title: "Why Machines Learn",
        subtitle: "The Elegant Math Behind Modern AI",
        author: "Anil Ananthaswamy",
    },
];

const ReadingShelf = ({ darkMode, books = currentBooks, title = "Reading", nested = false }) => {
    const id = useId();
    const Heading = nested ? "h3" : "h2";
    const [flow, setFlow] = useState(false);
    const [active, setActive] = useState(0);
    const select = (index) => {
        setActive(index);
        setFlow(true);
    };
    const step = (direction) => {
        setActive((index) => Math.max(0, Math.min(books.length - 1, index + direction)));
    };
    const book = books[active];

    return (
        <section
            className={`${nested ? "technical-debt-group" : "technical-debt-section"} reading-shelf${darkMode ? " technical-debt-section--dark" : ""}`}
            aria-labelledby={`${id}-heading`}
            onKeyDown={(event) => {
                if (!flow || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
                event.preventDefault();
                step(event.key === "ArrowLeft" ? -1 : 1);
            }}
        >
            <div className="reading-header">
                <Heading id={`${id}-heading`}>{title}</Heading>
                <button
                    type="button"
                    className="reading-control reading-flow-toggle"
                    aria-label={`Cover Flow for ${title}`}
                    aria-controls={`${id}-stage`}
                    aria-pressed={flow}
                    title={flow ? "Return to bookshelf" : "Show Cover Flow"}
                    onClick={() => setFlow((value) => !value)}
                >
                    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <rect x="3" y="1.5" width="16" height="23" rx="3.5" />
                        <rect x="6" y="4.5" width="10" height="7" rx="1" />
                        <circle cx="11" cy="17.5" r="3.5" />
                        <circle cx="11" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
                    </svg>
                </button>
            </div>
            <div className={flow ? undefined : "reading-rail"}>
                <div id={`${id}-stage`} className={`reading-stage${flow ? " reading-stage--flow" : ""}`} style={{ "--rack-width": `${books.length * 55 + 20}px` }}>
                    {books.map(({ id, title, subtitle, author }, index) => {
                        const offset = index - active;
                        const distant = flow && Math.abs(offset) > 1;
                        return (
                            <button
                                type="button"
                                key={id}
                                className={`reading-book reading-book--${id} reading-book--palette-${index % 6}${distant ? " reading-book--distant" : ""}`}
                                aria-label={[title, subtitle, author].filter(Boolean).join(", ")}
                                aria-pressed={flow && active === index}
                                tabIndex={distant ? -1 : undefined}
                                aria-hidden={distant || undefined}
                                title={title}
                                style={{
                                    "--shelf-position": `${(index - (books.length - 1) / 2) * 55}px`,
                                    "--offset": offset,
                                    "--angle": `${-Math.sign(offset) * 54}deg`,
                                    "--depth": `${-Math.abs(offset) * 92}px`,
                                    zIndex: books.length - Math.abs(offset),
                                }}
                                onClick={() => select(index)}
                            >
                                <span className="reading-spine" aria-hidden="true"><span>{title}</span><small>{author}</small></span>
                                <span className="reading-cover" aria-hidden="true">
                                    <strong>{title}</strong>
                                    {subtitle && <small>{subtitle}</small>}
                                    <span>{author}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            {flow && (
                <div className="reading-controls">
                    <button type="button" className="reading-control" aria-label="Previous book" onClick={() => step(-1)} disabled={active === 0}>←</button>
                    <p aria-live="polite"><strong>{book.title}{book.subtitle && `: ${book.subtitle}`}</strong><br />{book.author}{book.notes && <><br />{book.notes}</>}</p>
                    <button type="button" className="reading-control" aria-label="Next book" onClick={() => step(1)} disabled={active === books.length - 1}>→</button>
                </div>
            )}
        </section>
    );
};

export default ReadingShelf;
