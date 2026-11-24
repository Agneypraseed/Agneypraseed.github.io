import { useId, useLayoutEffect, useRef, useState } from "react";
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

const MAX_SPINES_PER_SIDE = 8;
const SWIPE_START_DISTANCE = 8;
const SWIPE_DISTANCE = 48;
const FLICK_DISTANCE = 24;
const FLICK_DURATION_MS = 250;

const ReadingShelf = ({ darkMode, books = currentBooks, title = "Reading", nested = false }) => {
    const id = useId();
    const Heading = nested ? "h3" : "h2";
    const [flow, setFlow] = useState(false);
    const [position, setPosition] = useState(0);
    const [dragOffset, setDragOffset] = useState(null);
    const selectedButton = useRef(null);
    const focusOnSelection = useRef(false);
    const swipe = useRef(null);
    const suppressClick = useRef(false);
    const bookCount = books.length;
    const wrapSpines = flow && bookCount > 2;
    const bookIndex = (slot) => ((slot % bookCount) + bookCount) % bookCount;
    const book = bookCount ? books[bookIndex(position)] : undefined;

    useLayoutEffect(() => {
        if (!flow || !focusOnSelection.current) return;
        focusOnSelection.current = false;
        selectedButton.current?.focus({ preventScroll: true });
    }, [flow, position]);

    const select = (slot, focusBook) => {
        const next = bookCount === 2 ? bookIndex(slot) : slot;
        if (focusBook) {
            if (flow && next === position) selectedButton.current?.focus({ preventScroll: true });
            else focusOnSelection.current = true;
        }
        setPosition(next);
        setFlow(true);
    };

    const toggleFlow = (event) => {
        // A tap does not always focus a button in Safari on iPad.
        event.currentTarget.focus({ preventScroll: true });
        if (flow) {
            setFlow(false);
            return;
        }

        setPosition(0);
        setFlow(true);
    };

    const stepFromButton = (event, direction) => {
        event.currentTarget.focus({ preventScroll: true });
        select(position + direction);
    };

    const startSwipe = (event) => {
        suppressClick.current = false;
        if (!flow || bookCount < 2 || !event.isPrimary || event.button !== 0) return;

        swipe.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            startedAt: event.timeStamp,
            dragging: false,
        };
    };

    const moveSwipe = (event) => {
        const gesture = swipe.current;
        if (gesture?.pointerId !== event.pointerId) return;

        const dx = event.clientX - gesture.x;
        const dy = event.clientY - gesture.y;
        if (!gesture.dragging) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_START_DISTANCE) return;
            if (Math.abs(dy) >= Math.abs(dx)) {
                swipe.current = null;
                return;
            }

            gesture.dragging = true;
            suppressClick.current = true;
            // Capture only once a swipe starts so ordinary taps still reach the book.
            event.currentTarget.setPointerCapture(event.pointerId);
        }
        setDragOffset(Math.max(-96, Math.min(96, dx)));
    };

    const endSwipe = (event) => {
        const gesture = swipe.current;
        if (gesture?.pointerId !== event.pointerId) return;
        swipe.current = null;
        setDragOffset(null);
        if (!gesture.dragging || event.type !== "pointerup") return;

        const dx = event.clientX - gesture.x;
        const isFlick = Math.abs(dx) >= FLICK_DISTANCE && event.timeStamp - gesture.startedAt <= FLICK_DURATION_MS;
        if (Math.abs(dx) >= SWIPE_DISTANCE || isFlick) {
            select(position + (dx < 0 ? 1 : -1), event.currentTarget.contains(document.activeElement));
        }
    };

    // Keep each occurrence at a stable slot while the row slides across the center.
    const flankSize = Math.max(0, Math.min(MAX_SPINES_PER_SIDE, bookCount - 1));
    const slots = wrapSpines
        ? Array.from({ length: flankSize * 2 + 1 }, (_, index) => position - flankSize + index)
        : books.map((_, index) => index);

    return (
        <section
            className={`${nested ? "technical-debt-group" : "technical-debt-section"} reading-shelf${darkMode ? " technical-debt-section--dark" : ""}`}
            aria-labelledby={`${id}-heading`}
            onKeyDown={(event) => {
                if (!flow || bookCount < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
                event.preventDefault();
                select(position + (event.key === "ArrowLeft" ? -1 : 1), event.target === selectedButton.current);
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
                    disabled={!bookCount}
                    onClick={toggleFlow}
                >
                    <svg width="22" height="26" viewBox="0 0 22 26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <rect x="3" y="1.5" width="16" height="23" rx="3.5" />
                        <rect x="6" y="4.5" width="10" height="7" rx="1" />
                        <circle cx="11" cy="17.5" r="3.5" />
                        <circle cx="11" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
                    </svg>
                </button>
            </div>
            <div className={flow ? "reading-flow-viewport" : "reading-rail"}>
                <div
                    id={`${id}-stage`}
                    className={`reading-stage${flow ? " reading-stage--flow" : ""}${dragOffset !== null ? " reading-stage--dragging" : ""}`}
                    style={{
                        "--rack-width": `${bookCount * 55 + 20}px`,
                        "--drag-offset": `${dragOffset ?? 0}px`,
                    }}
                    onPointerDown={startSwipe}
                    onPointerMove={moveSwipe}
                    onPointerUp={endSwipe}
                    onPointerCancel={endSwipe}
                    onLostPointerCapture={endSwipe}
                    onPointerLeave={(event) => {
                        if (!swipe.current?.dragging) endSwipe(event);
                    }}
                    onClickCapture={(event) => {
                        if (!suppressClick.current || event.detail === 0) return;
                        suppressClick.current = false;
                        event.stopPropagation();
                    }}
                >
                    {slots.map((slot) => {
                        const index = bookIndex(slot);
                        const { id, title, subtitle, author } = books[index];
                        const offset = slot - position;
                        const selected = flow && offset === 0;
                        const duplicate = wrapSpines && (offset <= -bookCount / 2 || offset > bookCount / 2);
                        return (
                            <button
                                type="button"
                                key={slot}
                                ref={selected ? selectedButton : undefined}
                                className={`reading-book reading-book--${id} reading-book--palette-${index % 6}`}
                                aria-label={[title, subtitle, author].filter(Boolean).join(", ")}
                                aria-pressed={selected}
                                aria-hidden={duplicate || undefined}
                                tabIndex={flow && !selected ? -1 : undefined}
                                title={title}
                                style={{
                                    "--shelf-position": `${(index - (bookCount - 1) / 2) * 55}px`,
                                    "--offset": offset,
                                    "--side": Math.sign(offset),
                                }}
                                onClick={() => select(slot, true)}
                            >
                                <span className="reading-spine" aria-hidden="true">
                                    <span className="reading-spine-number">{String(index + 1).padStart(2, "0")}</span>
                                    <span className="reading-spine-title">{title}</span>
                                    <small>{author}</small>
                                </span>
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
            {flow && book && (
                <div className="reading-controls">
                    <button type="button" className="reading-control" aria-label="Previous book" onClick={(event) => stepFromButton(event, -1)} disabled={bookCount < 2}>←</button>
                    <p aria-live="polite"><strong>{book.title}{book.subtitle && `: ${book.subtitle}`}</strong><br />{book.author}{book.notes && <><br />{book.notes}</>}</p>
                    <button type="button" className="reading-control" aria-label="Next book" onClick={(event) => stepFromButton(event, 1)} disabled={bookCount < 2}>→</button>
                </div>
            )}
        </section>
    );
};

export default ReadingShelf;
