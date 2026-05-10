import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ItineraryBuilder from './ItineraryBuilder';
import CityExplorer from '../city/CityExplorer';
import BudgetDashboard from './BudgetDashboard';
import PackingList from './PackingList';
import TripNotes from './TripNotes';
import { updateItinerary, getItinerary } from '../../services/itinerary.service';
import { updateTripVisibility } from '../../services/public.service';
import api from '../../services/api';
import { LoadingSkeleton } from '../../components/Transitions';

const TABS = [
  { id: 'itinerary', label: '🗓 Timeline' },
  { id: 'explore',   label: '🏙 Explore' },
  { id: 'budget',    label: '💰 Budget' },
  { id: 'packing',   label: '🎒 Packing' },
  { id: 'notes',     label: '📓 Notes' },
];

const TripDetail = () => {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState('itinerary');
  const [stops, setStops]           = useState([]);
  const [trip, setTrip]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [isPublic, setIsPublic]     = useState(false);
  const [sharing, setSharing]       = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, itineraryRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          getItinerary(tripId)
        ]);
        setTrip(tripRes.data.data);
        setIsPublic(tripRes.data.data.isPublic || false);
        setStops(itineraryRes.data?.stops || []);
      } catch (e) {
        toast.error('Failed to load trip details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  const handleAddCity = async (newStop) => {
    const updatedStops = [...stops, newStop];
    setStops(updatedStops);
    try {
      await updateItinerary(tripId, updatedStops);
    } catch (e) {
      // toast fired by interceptor
    }
  };

  // BUG-02 fix: replaced alert with toast + clipboard API (L5 fix)
  const toggleShare = async () => {
    setSharing(true);
    try {
      await updateTripVisibility(tripId, !isPublic);
      setIsPublic(prev => !prev);
      if (!isPublic) {
        const url = `${window.location.origin}/shared/${tripId}`;
        await navigator.clipboard.writeText(url);
        toast.success('Trip is public! Link copied to clipboard 🔗');
      } else {
        toast.success('Trip is now private 🔒');
      }
    } catch (e) {
      // toast fired by interceptor
    } finally {
      setSharing(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    // BUG-10 fix: bg-gray-950 to match design system
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      {/* Trip Header */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-white text-sm mb-2 flex items-center gap-1 transition-colors">
            ← Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">{trip?.title}</h1>
          <p className="text-gray-400 text-sm">{trip?.destination}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={toggleShare}
          disabled={sharing}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
            isPublic
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25'
              : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-indigo-500/50'
          }`}
        >
          {sharing ? '...' : isPublic ? '🌍 Public — Click to make private' : '🔒 Private — Click to share'}
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'itinerary' && <ItineraryBuilder tripId={tripId} stops={stops} setStops={setStops} />}
        {activeTab === 'explore'   && <CityExplorer onAddCity={handleAddCity} />}
        {activeTab === 'budget'    && <BudgetDashboard tripId={tripId} />}
        {activeTab === 'packing'   && <PackingList tripId={tripId} />}
        {activeTab === 'notes'     && <TripNotes tripId={tripId} />}
      </div>
    </div>
  );
};

export default TripDetail;
