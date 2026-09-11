/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import '../../pages/BlogPost.css';
import useIsMobile from '../../hooks/useIsMobile';
import Footer from '../Footer';

const BlogLayout = ({ 
  darkMode, 
  children, 
  backLink = "/blog", 
  backLabel = "Writing", 
  breadcrumb 
}) => {
  const { isMobile } = useIsMobile();

  const outerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: darkMode ? '#1a1a1a' : '#F5F0E8',
    transition: 'background-color 0.3s ease'
  };

  const contentStyle = {
    maxWidth: '720px',
    margin: '0 auto',
    width: '100%',
    padding: isMobile ? '92px 1.25rem 2rem' : '120px 2rem 3rem',
    flex: '1 0 auto'
  };

  const backLinkStyle = {
    display: 'inline-block',
    textDecoration: 'none',
    color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    marginBottom: breadcrumb ? '0.5rem' : '2rem',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease'
  };

  const breadcrumbStyle = {
    fontSize: '0.85rem',
    color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    marginBottom: '2rem'
  };

  return (
    <div style={outerStyle}>
      <main style={contentStyle}>
        <Link 
          to={backLink} 
          style={backLinkStyle}
          onMouseOver={(e) => e.currentTarget.style.color = darkMode ? '#fff' : '#1a1a1a'}
          onMouseOut={(e) => e.currentTarget.style.color = darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
        >
          ← {backLabel}
        </Link>
        
        {breadcrumb && (
          <div style={breadcrumbStyle} aria-label="Post context">
            {breadcrumb}
          </div>
        )}
        
        <div className="blog-post-content">
          {children}
        </div>
      </main>
      
      <div style={{ marginTop: 'auto' }}>
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default BlogLayout;
