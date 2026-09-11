import CheckUnderstanding from './CheckUnderstanding';

export function getMDXComponents(darkMode, isMobile) {
  const getColors = () => ({
    text: darkMode ? '#fff' : '#1a1a1a',
    muted: darkMode ? 'rgba(255, 255, 255, 0.85)' : '#374151',
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
    accent: darkMode ? '#a78bfa' : '#6366f1',
    codeBg: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    preBg: darkMode ? '#111' : '#f5f5f5',
  });

  const colors = getColors();

  return {
    h1: (props) => <h1 style={{
      fontFamily: 'Georgia, serif',
      fontSize: isMobile ? '1.8rem' : '2.2rem',
      fontWeight: '700',
      color: colors.text,
      marginBottom: '1rem',
      lineHeight: '1.3'
    }} {...props} />,
    
    h2: (props) => <h2 style={{
      fontFamily: 'Georgia, serif',
      fontSize: isMobile ? '1.3rem' : '1.5rem',
      fontWeight: '600',
      color: colors.text,
      marginTop: '3rem',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: colors.border
    }} {...props} />,
    
    h3: (props) => <h3 style={{
      fontFamily: 'Georgia, serif',
      fontSize: '1.2rem',
      fontWeight: '600',
      color: colors.text,
      marginTop: '2rem',
      marginBottom: '1rem'
    }} {...props} />,
    
    p: (props) => <p style={{
      fontSize: isMobile ? '0.95rem' : '1.05rem',
      lineHeight: '1.85',
      color: colors.muted,
      marginBottom: '1.5rem'
    }} {...props} />,
    
    a: (props) => <a style={{
      color: colors.accent,
      textDecoration: 'underline',
      textUnderlineOffset: '3px'
    }} {...props} />,
    
    ul: (props) => <ul style={{
      lineHeight: '1.85',
      color: colors.muted,
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem'
    }} {...props} />,
    
    ol: (props) => <ol style={{
      lineHeight: '1.85',
      color: colors.muted,
      marginBottom: '1.5rem',
      paddingLeft: '1.5rem'
    }} {...props} />,
    
    li: (props) => <li style={{
      marginBottom: '0.5rem'
    }} {...props} />,
    
    blockquote: (props) => <blockquote style={{
      borderLeft: `3px solid ${colors.accent}`,
      paddingLeft: '1.25rem',
      margin: '1.5rem 0',
      fontStyle: 'italic',
      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
    }} {...props} />,
    
    code: (props) => <code style={{
      backgroundColor: colors.codeBg,
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.9em',
      fontFamily: 'monospace'
    }} {...props} />,
    
    pre: (props) => <pre style={{
      backgroundColor: colors.preBg,
      padding: '1.25rem',
      borderRadius: '12px',
      overflow: 'auto',
      marginBottom: '1.5rem',
      border: colors.border
    }} {...props} />,
    
    hr: (props) => <hr style={{
      border: 'none',
      borderTop: colors.border,
      margin: '2.5rem 0'
    }} {...props} />,
    
    table: (props) => <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '1.5rem',
      fontSize: '0.95rem'
    }} {...props} />,
    
    th: (props) => <th style={{
      textAlign: 'left',
      padding: '0.75rem',
      borderBottom: colors.border,
      fontWeight: '600',
      color: colors.text
    }} {...props} />,
    
    td: (props) => <td style={{
      padding: '0.75rem',
      borderBottom: colors.border,
      color: colors.muted
    }} {...props} />,

    CheckUnderstanding: (props) => <CheckUnderstanding darkMode={darkMode} {...props} />
  };
}
