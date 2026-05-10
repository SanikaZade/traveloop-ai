import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getTrips, createTrip, deleteTrip } from '../../services/trip.service';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { EmptyState, CardSkeleton } from '../../components/Transitions';

const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', // Paris
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // Tokyo
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', // Bali
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // NYC
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', // Rome
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', // Dubai
];

const STAT_CARDS = [
  { label: 'Trips Planned', icon: '🗺️', color: 'from-indigo-600/20 to-indigo-800/10', border: 'border-indigo-500/20' },
  { label: 'Cities Explored', icon: '🏙️', color: 'from-emerald-600/20 to-emerald-800/10', border: 'border-emerald-500/20' },
  { label: 'Memories Made', icon: '📸', color: 'from-amber-600/20 to-amber-800/10', border: 'border-amber-500/20' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTrip, setNewTrip] = useState({ title: '', destination: '', startDate: '', endDate: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const res = await getTrips();
      setTrips(res.data || []);
    } catch (e) {
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTrip.title || !newTrip.destination) {
      toast.error('Trip name and destination are required');
      return;
    }
    setCreating(true);
    try {
      const coverImage = COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)];
      const res = await createTrip({
        ...newTrip,
        coverImage,
        startDate: newTrip.startDate || new Date().toISOString(),
        endDate: newTrip.endDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      });
      toast.success('Trip created! 🎉');
      setShowModal(false);
      setNewTrip({ title: '', destination: '', startDate: '', endDate: '' });
      navigate(`/trip/${res.data._id}`);
    } catch (e) {
      // Handled by interceptor
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this trip? This cannot be undone.')) return;
    try {
      await deleteTrip(id);
      setTrips(prev => prev.filter(t => t._id !== id));
      toast.success('Trip deleted');
    } catch (e) {
      // Handled by interceptor
    }
  };

  const stats = [
    { ...STAT_CARDS[0], value: trips.length },
    { ...STAT_CARDS[1], value: trips.length * 2 },
    { ...STAT_CARDS[2], value: trips.length * 5 },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Hey, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's your travel universe at a glance</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${stat.color} border ${stat.border}`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trips Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">My Trips</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Trip
        </motion.button>
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : trips.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="No trips yet!"
          description="Create your first trip and start building your dream itinerary with cities, activities, and more."
          actionLabel="Plan My First Trip"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <motion.div
              key={trip._id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onClick={() => navigate(`/trip/${trip._id}`)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer relative group"
            >
              {/* Delete button */}
              <button
                onClick={(e) => handleDelete(e, trip._id)}
                className="absolute top-3 right-3 z-10 w-7 h-7 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm"
              >
                ×
              </button>

              {/* Public badge */}
              {trip.isPublic && (
                <span className="absolute top-3 left-3 z-10 bg-emerald-500/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                  🌍 Public
                </span>
              )}

              <div className="relative overflow-hidden h-44">
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white truncate">{trip.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{trip.destination}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">
                    {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
                    {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-indigo-400 text-xs font-medium group-hover:text-indigo-300 transition-colors">
                    Open →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark rounded-3xl p-8 w-full max-w-md gradient-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Trip ✈️</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trip Name *</label>
                <input
                  type="text"
                  value={newTrip.title}
                  onChange={e => setNewTrip({ ...newTrip, title: e.target.value })}
                  placeholder="Summer in Italy"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destination *</label>
                <input
                  type="text"
                  value={newTrip.destination}
                  onChange={e => setNewTrip({ ...newTrip, destination: e.target.value })}
                  placeholder="Italy"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newTrip.startDate}
                    onChange={e => setNewTrip({ ...newTrip, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newTrip.endDate}
                    onChange={e => setNewTrip({ ...newTrip, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={creating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating...</>
                  ) : 'Create Trip'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
