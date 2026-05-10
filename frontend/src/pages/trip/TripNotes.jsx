import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getNotes, createNote, deleteNote } from '../../services/note.service';
import { LoadingSkeleton } from '../../components/Transitions';

const NOTE_COLORS = [
  'bg-indigo-900/30 border-indigo-700/40',
  'bg-emerald-900/30 border-emerald-700/40',
  'bg-amber-900/30 border-amber-700/40',
  'bg-violet-900/30 border-violet-700/40',
];

const TripNotes = ({ tripId }) => {
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [saving, setSaving]   = useState(false);

  useEffect(() => { fetchNotes(); }, [tripId]);

  const fetchNotes = async () => {
    try {
      const data = await getNotes(tripId);
      setNotes(data.data || []);
    } catch (e) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    setSaving(true);
    try {
      const data = await createNote(tripId, newNote);
      setNotes(prev => [data.data, ...prev]);
      setNewNote({ title: '', content: '' });
      toast.success('Note saved!'); // BUG-02 fix
    } catch (e) {
      // handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(tripId, noteId);
      setNotes(prev => prev.filter(n => n._id !== noteId));
      toast.success('Note deleted'); // BUG-02 fix
    } catch (e) {
      // handled by interceptor
    }
  };

  // BUG-09 fix: consistent LoadingSkeleton
  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-white mb-8">📓 Trip Notes & Journal</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Composer */}
        <div className="md:col-span-1">
          <form onSubmit={handleAddNote} className="glass-dark p-6 rounded-2xl border border-gray-700 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">New Entry</h3>
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={e => setNewNote({ ...newNote, title: e.target.value })}
              className="input-field mb-3"
              required
            />
            <textarea
              placeholder="Write your thoughts, reminders, or travel reflections..."
              value={newNote.content}
              onChange={e => setNewNote({ ...newNote, content: e.target.value })}
              className="input-field h-40 resize-none mb-4"
              required
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {saving ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
              ) : '✍️ Save Note'}
            </motion.button>
          </form>
        </div>

        {/* Notes grid */}
        <div className="md:col-span-2 space-y-4">
          {notes.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>No journal entries yet.</p>
              <p className="text-sm mt-1">Start recording your travel memories!</p>
            </div>
          )}
          {notes.map((note, i) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`p-6 rounded-2xl border relative group ${NOTE_COLORS[i % NOTE_COLORS.length]}`}
            >
              <button
                onClick={() => handleDelete(note._id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xl leading-none"
              >×</button>
              <h4 className="text-lg font-bold text-white mb-2 pr-8">{note.title}</h4>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{note.content}</p>
              <p className="mt-4 text-xs text-gray-500">
                {new Date(note.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripNotes;
