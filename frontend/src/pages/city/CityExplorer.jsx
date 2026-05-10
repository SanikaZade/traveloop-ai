import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { searchCities } from '../../services/city.service';
import { CardSkeleton } from '../../components/Transitions';

// BUG-06 fix: debounced live search + continent/tag filters
const CONTINENTS = ['All', 'Europe', 'Asia', 'North America', 'Africa'];

const CityExplorer = ({ onAddCity }) => {
  const [query, setQuery]     = useState('');
  const [cities, setCities]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [continent, setContinent] = useState('All');
  const [addedIds, setAddedIds] = useState(new Set()); // track added cities for button state

  const fetchCities = useCallback(async (q) => {
    setLoading(true);
    try {
      const res = await searchCities(q);
      setCities(res.data || []);
    } catch (e) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchCities(''); }, [fetchCities]);

  // Debounced search on query change
  useEffect(() => {
    const timer = setTimeout(() => fetchCities(query), 280);
    return () => clearTimeout(timer);
  }, [query, fetchCities]);

  const filtered = continent === 'All'
    ? cities
    : cities.filter(c => c.continent === continent);

  const handleAddCity = (city) => {
    const newStop = {
      id: `stop-${Date.now()}-${city.id}`,
      city: city.name,
      country: city.country,
      activities: [],
    };
    onAddCity(newStop);
    setAddedIds(prev => new Set([...prev, city.id]));
    toast.success(`${city.name} added to your itinerary!`); // BUG-02 fix
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Explore Destinations</h2>
        <p className="text-gray-400">Discover 12+ hand-picked cities and add them to your trip</p>
      </div>

      {/* Search + Filters */}
      <div className="max-w-2xl mx-auto mb-6 space-y-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cities or countries..."
            className="input-field pl-12"
          />
        </div>

        {/* Continent filter pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CONTINENTS.map(c => (
            <button
              key={c}
              onClick={() => setContinent(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                continent === c
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-center text-gray-500 text-sm mb-6">
          {filtered.length} destination{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <CardSkeleton count={6} /> // BUG-07 reuse: consistent skeleton
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No cities match your search. Try a different term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((city, i) => {
            const isAdded = addedIds.has(city.id);
            return (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={city.image}
                    alt={city.name}
                    loading="lazy" // L1 fix
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/10 font-mono">
                    {city.costIndex}
                  </span>
                  {city.continent && (
                    <span className="absolute top-3 left-3 bg-indigo-600/80 text-white text-xs px-2.5 py-1 rounded-full">
                      {city.continent}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white">{city.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{city.country}</p>
                  {city.description && (
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{city.description}</p>
                  )}
                  {/* Tags */}
                  {city.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {city.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handleAddCity(city)}
                    disabled={isAdded}
                    className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isAdded
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-white/5 hover:bg-indigo-600 text-white border border-gray-700 hover:border-transparent'
                    }`}
                  >
                    {isAdded ? '✓ Added to Trip' : '+ Add to Itinerary'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CityExplorer;
