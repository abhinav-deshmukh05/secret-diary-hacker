import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Modal, Sheet, Typography, Button, Input, Stack, Textarea } from '@mui/joy';

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
    padding: '1rem',
    borderRadius: '12px',
    width: '720px',
    textAlign: 'left',
    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
  },
  title: { marginBottom: '1rem', color: '#667eea', },
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

  const [notes, setNotes] = useState({ count: 0, notes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & form states
  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState(null);
  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  const handleAddNote = () => {
    setFormError(null);
    setFormData({ title: '', content: '' });
    setEditingId(null);
    setAddOpen(true);
  }

  const handleCreateNote = async () => {
    setFormError(null);
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and Content are required');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post('/notes', { title: formData.title, content: formData.content });
     // refresh notes list
      await fetchNotes();
      setAddOpen(false);
      setFormData({ title: '', content: '' });
    } catch (err) {
      console.error('Create note error:', err);
      setFormError(err?.response?.data?.message || 'Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdateNote = async () => {
    setFormError(null);
    if (!editingId) {
      setFormError('No note selected to update');
      return;
    }
    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError('Title and Content are required');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.put(`/notes/${editingId}`, { title: formData.title, content: formData.content });
      await fetchNotes();
      setAddOpen(false);
      setEditingId(null);
      setFormData({ title: '', content: '' });
    } catch (err) {
      console.error('Update note error:', err);
      setFormError(err?.response?.data?.message || 'Failed to update note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      setDeletingId(id);
      await api.delete(`/notes/${id}`);
      // Refresh notes after deletion
      await fetchNotes();
    } catch (err) {
      console.error('Delete note error:', err);
      setError(err?.response?.data?.message || 'Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  // Fetch notes (re-usable)
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

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom: '1rem'}}>
          <h1 style={{...styles.title, margin: 0}}>Notes</h1>
          <button
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: '10px',
              border: 'none',
              background: '#667eea',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            onClick={handleAddNote}
            aria-label="Add note"
          >
            + ADD NOTE
          </button>
        </div>

        {/* Add Note Modal */}
        <Modal
          open={addOpen}
          onClose={() => { setAddOpen(false); setEditingId(null); setFormData({ title: '', content: '' }); setFormError(null); }}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md', width: 480, mx: 2 }}>
            <Typography level="h6">{editingId ? 'Edit Note' : 'Add Note'}</Typography> 

            <Stack spacing={2} sx={{ mt: 2 }}>
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                autoFocus
              />

              <Textarea
                placeholder="Content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                minRows={4}
              />

              {formError && <Typography color="danger">{formError}</Typography>}

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button variant="plain" color="neutral" onClick={() => { setAddOpen(false); setEditingId(null); setFormData({ title: '', content: '' }); }}>
                  Cancel
                </Button>
                <Button onClick={editingId ? handleUpdateNote : handleCreateNote} disabled={submitting}>
                  {submitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update' : 'Add Data')}
                </Button> 
              </div>
            </Stack>
          </Sheet>
        </Modal>

        {loading && <p>Loading notes...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            {notes?.count > 0 ? (
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
                      onClick={() => {
                        setFormData({ title: note.title, content: note.content });
                        setEditingId(note._id);
                        setFormError(null);
                        setAddOpen(true);
                      }}
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
                      onClick={() => handleDeleteNote(note._id)}
                      disabled={deletingId === note._id}
                    >
                      {deletingId === note._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Add notes</p>
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
