import { useState } from 'react';
import Auth from './pages/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
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

  return (
    <>
      {isAuthenticated ? (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Welcome 🎉</h1>
            <p style={styles.subtitle}>
              You are successfully logged in.
            </p>

            <button style={styles.primaryButton}>
              Go to Notes
            </button>

            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;
