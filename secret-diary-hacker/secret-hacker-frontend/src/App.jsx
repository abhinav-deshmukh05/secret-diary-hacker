import { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Notes from './pages/Notes';
import { isTokenExpired } from './api/axios';

function App() {
  const styles = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    background: '#fff',
    padding: '3rem',
    borderRadius: '14px',
    width: '360px',
    textAlign: 'center',
    boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
  },
  title: {
    marginBottom: '0.5rem',
    color: '#333',
  },
  subtitle: {
    marginBottom: '2rem',
    color: '#666',
  },
  primaryButton: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: 'none',
    background: '#667eea',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  logoutButton: {
    width: '100%',
    padding: '0.65rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: '#fff',
    color: '#333',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
};
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  // On mount: check token expiry and listen for global logout events
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }

    const onLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/', { replace: true });
    };

    window.addEventListener('app:logout', onLogout);
    return () => window.removeEventListener('app:logout', onLogout);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/', { replace: true });
  };

  const handleNotes = () => {
    navigate('/notes'); // SPA-friendly navigation using react-router
  }

  const LoggedIn = () => (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome 🎉</h1>
        <p style={styles.subtitle}>
          You are successfully logged in.
        </p>

        <button style={styles.primaryButton} onClick={handleNotes}>
          Go to Notes
        </button>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <LoggedIn />
          ) : (
            <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
          )
        }
      />
      <Route path="/notes" element={<Notes />} />
      
    </Routes>
  );
}

export default App;
