import { technicalDebtGroups, toReadBooks } from "../data/technicalDebt";
import "./TechnicalDebtSection.css";

const TechnicalDebtSection = ({ darkMode }) => (
    <>
        <section
            className={`technical-debt-section${darkMode ? " technical-debt-section--dark" : ""}`}
            aria-labelledby="technical-debt-heading"
        >
            <h2 id="technical-debt-heading">Technical Debt</h2>
            {technicalDebtGroups.map((group) => (
                <section className="technical-debt-group" key={group.id} aria-labelledby={`debt-${group.id}`}>
                    <h3 id={`debt-${group.id}`}>{group.title}</h3>
                    <ol className="technical-debt-list">
                        {group.books.map((book) => (
                            <li key={book.id}>
                                <h4>{book.title}</h4>
                                {book.author && <p className="technical-debt-author">{book.author}</p>}
                                {book.notes && <p>{book.notes}</p>}
                            </li>
                        ))}
                    </ol>
                </section>
            ))}
        </section>
        <section
            className={`technical-debt-section technical-debt-section--to-read${darkMode ? " technical-debt-section--dark" : ""}`}
            aria-labelledby="to-read-heading"
        >
            <h2 id="to-read-heading">To Read</h2>
            <ol className="technical-debt-list">
                {toReadBooks.map((book) => (
                    <li key={book.id}>
                        <h4>{book.title}</h4>
                        {book.author && <p className="technical-debt-author">{book.author}</p>}
                        {book.notes && <p>{book.notes}</p>}
                    </li>
                ))}
            </ol>
        </section>
    </>
);

export default TechnicalDebtSection;
