import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Notes = () => {
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
    padding: '2rem',
    borderRadius: '12px',
    width: '720px',
    textAlign: 'left',
    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
  },
  title: { marginBottom: '1rem',color: '#555', },
  note: {
    padding: '1rem',
    borderBottom: '1px solid #eee',
    
  },
  content: {
    fontSize: '0.9rem',
    color: '#444',
  },
  meta: {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '0.5rem',
  },
  backButton: {
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: 'none',
    background: '#667eea',
    color: '#fff',
    cursor: 'pointer',
  },
};

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/notes');
        setNotes(response.data);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotes();
    }
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Your Notes</h1>

        {loading && <p>Loading notes...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            {notes.count > 0 ? (
              notes?.notes?.map((note) => (
                <div key={note._id} style={styles.note}>
                  <strong style={{color:'#333'}}>{note.title}</strong>
                  <div style={styles.content}>{note.content}</div>
                  <div style={styles.meta}>
                    Created: {new Date(note.createdAt).toLocaleString()}
                  </div>

                  // Add two button for Edit and Delete
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#f0f0f0',
                        color: '#333',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                      }}
                    //   onClick={() => handleUpdateNote(note)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#ff6b6b',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                    //   onClick={() => handleDeleteNote(note)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No notes yet.</p>
            )}
          </>
        )}

        <div style={{ marginTop: '1.25rem' }}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
