/* eslint-disable react/prop-types */
import { useId, useState } from 'react';

const CheckUnderstanding = ({ question, answer, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = useId();

  const containerStyle = {
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    margin: '1.5rem 0',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
    display: 'block'
  };

  const questionRowStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: 0,
    border: 0,
    background: 'transparent',
    font: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
    gap: '10px'
  };

  const chevronStyle = {
    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease',
    fontSize: '0.85rem',
    color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
  };

  const questionStyle = {
    fontWeight: '600',
    fontSize: '0.95rem',
    color: darkMode ? '#fff' : '#1a1a1a',
    margin: 0
  };

  const answerContainerStyle = {
    maxHeight: isOpen ? '1000px' : '0px',
    opacity: isOpen ? 1 : 0,
    overflow: 'hidden',
    transition: 'all 0.4s ease-in-out',
    marginTop: isOpen ? '1rem' : '0'
  };

  const answerStyle = {
    borderLeft: darkMode ? '3px solid #8b5cf6' : '3px solid #6366f1',
    paddingLeft: '1rem',
    fontWeight: '400',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: darkMode ? 'rgba(255, 255, 255, 0.85)' : '#374151',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>Check your understanding</span>
      <button
        type="button"
        className="check-understanding-trigger"
        style={questionRowStyle}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span style={chevronStyle} aria-hidden="true">▶</span>
        <span style={questionStyle}>{question}</span>
      </button>
      <div
        id={answerId}
        role="region"
        aria-hidden={!isOpen}
        style={answerContainerStyle}
      >
        <div style={answerStyle}>{answer}</div>
      </div>
    </div>
  );
};

export default CheckUnderstanding;
