import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getPublicTrip, copyPublicTrip } from '../../services/public.service';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LoadingSkeleton } from '../../components/Transitions';

const PublicTrip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await getPublicTrip(id);
        setData(res.data);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleCopy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCopying(true);
    try {
      const res = await copyPublicTrip(id);
      toast.success('Trip copied to your account!');
      navigate(`/trip/${res.data._id}`);
    } catch (e) {
      setCopying(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!data || !data.trip) return <div className="text-white text-center py-20 text-2xl font-bold">This trip is private or doesn't exist.</div>;

  const { trip, itinerary } = data;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <div 
        className="h-80 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${trip.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold mb-4 text-center"
          >
            {trip.title}
          </motion.h1>
          <p className="text-xl text-gray-300">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Itinerary Overview</h2>
          <button 
            onClick={handleCopy}
            disabled={copying}
            className="bg-primary hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-colors disabled:opacity-50"
          >
            {copying ? 'Copying...' : 'Copy to My Trips'}
          </button>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-600 before:to-transparent">
          {itinerary.stops?.map((stop, index) => (
            <div key={stop.id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-900 text-primary font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                {index + 1}
              </div>
              <div className="glass-dark border border-gray-700 p-6 rounded-xl shadow-xl w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
                <h3 className="font-bold text-xl">{stop.city}</h3>
                <p className="text-sm text-gray-400 mb-4">{stop.country}</p>
                <div className="space-y-2 mt-4 border-t border-gray-700 pt-4">
                  {stop.activities?.map((activity, i) => (
                    <div key={i} className="flex justify-between text-sm bg-gray-800 p-2 rounded">
                      <span className="text-gray-300">{activity.title}</span>
                    </div>
                  ))}
                  {(!stop.activities || stop.activities.length === 0) && <p className="text-gray-500 text-sm">No specific activities planned.</p>}
                </div>
              </div>
            </div>
          ))}
          {(!itinerary.stops || itinerary.stops.length === 0) && (
            <p className="text-center text-gray-500">This itinerary is currently empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicTrip;
