import { technicalDebtGroups, toReadBooks } from "../data/technicalDebt";
import ReadingShelf from "./ReadingShelf";
import "./TechnicalDebtSection.css";

const TechnicalDebtSection = ({ darkMode }) => (
    <>
        <section
            className={`technical-debt-section${darkMode ? " technical-debt-section--dark" : ""}`}
            aria-labelledby="technical-debt-heading"
        >
            <h2 id="technical-debt-heading">Technical Debt</h2>
            {technicalDebtGroups.map((group) => (
                <ReadingShelf key={group.id} title={group.title} books={group.books} nested />
            ))}
        </section>
        <ReadingShelf title="To Read" books={toReadBooks} darkMode={darkMode} />
    </>
);

export default TechnicalDebtSection;
