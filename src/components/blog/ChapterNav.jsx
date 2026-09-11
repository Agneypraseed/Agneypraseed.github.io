/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const ChapterNav = ({ darkMode, prevChapter, nextChapter, seriesId }) => {
  if (!prevChapter && !nextChapter) return null;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '3rem',
    paddingTop: '1.5rem',
    borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)'
  };

  const linkStyle = {
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
    maxWidth: '45%'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

  const titleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: darkMode ? '#fff' : '#1a1a1a',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const emptyDivStyle = {
    width: '45%'
  };

  return (
    <div style={containerStyle}>
      {prevChapter ? (
        <Link 
          to={`/blog/${seriesId}/${prevChapter.slug}`}
          style={linkStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={labelStyle}>← Previous</span>
          <p style={titleStyle}>{prevChapter.title}</p>
        </Link>
      ) : <div style={emptyDivStyle} />}
      
      {nextChapter ? (
        <Link 
          to={`/blog/${seriesId}/${nextChapter.slug}`}
          style={{...linkStyle, alignItems: 'flex-end', textAlign: 'right'}}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{...labelStyle, flexDirection: 'row-reverse'}}>→ Next</span>
          <p style={titleStyle}>{nextChapter.title}</p>
        </Link>
      ) : <div style={emptyDivStyle} />}
    </div>
  );
};

export default ChapterNav;
