import { useEffect, useRef, useState } from "react";
import "./EventPhotoDialog.css";

const EventPhotoDialog = ({ event, darkMode, onClose }) => {
    const dialogRef = useRef(null);
    const [index, setIndex] = useState(0);
    const photo = event.photos[index];
    const move = (direction) => setIndex((current) => (
        (current + direction + event.photos.length) % event.photos.length
    ));

    useEffect(() => {
        const trigger = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        const dialog = dialogRef.current;
        dialog.showModal();
        document.body.style.overflow = "hidden";
        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            trigger?.focus();
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            className={`event-dialog${darkMode ? " event-dialog--dark" : ""}`}
            aria-labelledby="event-photo-title"
            aria-describedby="event-photo-description"
            onCancel={(e) => { e.preventDefault(); onClose(); }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                    e.preventDefault();
                    move(e.key === "ArrowLeft" ? -1 : 1);
                }
            }}
        >
            <div className="event-dialog__panel">
                <header className="event-dialog__header">
                    <div>
                        <p className="event-dialog__eyebrow">NemoDoc · On stage</p>
                        <h2 id="event-photo-title">{event.title}</h2>
                        <p id="event-photo-description" className="event-dialog__description">
                            Presenting NemoDoc and sharing what I built.
                        </p>
                    </div>
                    <button type="button" className="event-dialog__close" onClick={onClose} aria-label="Close event photos">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path d="m6 6 12 12M6 18 18 6" />
                        </svg>
                    </button>
                </header>
                <figure className="event-dialog__figure">
                    <img className="event-dialog__photo" src={photo.src} alt={photo.alt} />
                    <figcaption className="event-dialog__caption">
                        <span>{photo.alt}</span>
                        <span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, "0")} / {String(event.photos.length).padStart(2, "0")}</span>
                    </figcaption>
                </figure>
                <div className="event-dialog__navigation">
                    <button type="button" className="event-dialog__arrow" onClick={() => move(-1)} aria-label="Previous photo">←</button>
                    <div className="event-dialog__thumbnails" aria-label="Choose an event photo">
                        {event.photos.map((item, photoIndex) => (
                            <button
                                key={item.src}
                                type="button"
                                className="event-dialog__thumbnail"
                                aria-label={`View photo ${photoIndex + 1}: ${item.alt}`}
                                aria-pressed={index === photoIndex}
                                onClick={() => setIndex(photoIndex)}
                            >
                                <img src={item.src} alt="" loading="lazy" />
                            </button>
                        ))}
                    </div>
                    <button type="button" className="event-dialog__arrow" onClick={() => move(1)} aria-label="Next photo">→</button>
                </div>
            </div>
        </dialog>
    );
};

export default EventPhotoDialog;
