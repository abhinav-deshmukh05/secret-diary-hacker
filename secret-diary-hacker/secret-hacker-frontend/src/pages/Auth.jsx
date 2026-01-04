import { useState } from 'react';
import api from '../api/axios.js';

const EyeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const EyeOffIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const Auth = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await api.post('/auth/signup', { email, password });
        alert('Account created successfully! Please log in.');
        setEmail('');
        setPassword('');
        setIsSignup(false);
      } else {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        onAuthSuccess(); 
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  const styles = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  card: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    width: '320px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    background: '#f7f7f7',
    color: '#333',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    background: '#667eea',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  eyeButton: {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: '6px',
    color: '#667eea',
    padding: 0
  },
  switchText: {
    marginTop: '1rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#555',
  },
  switchLink: {
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, paddingRight: '2.5rem' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Please wait…' : isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <p style={styles.switchText}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span style={styles.switchLink} onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? ' Login' : ' Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
