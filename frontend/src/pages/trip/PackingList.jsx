import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getPackingList, updatePackingList } from '../../services/packing.service';
import { LoadingSkeleton } from '../../components/Transitions';

const PackingList = ({ tripId }) => {
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [newItemName, setNewItemName]     = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => { fetchPackingList(); }, [tripId]);

  const fetchPackingList = async () => {
    try {
      const data = await getPackingList(tripId);
      const cats = data.data?.categories || [];
      setCategories(cats);
      if (cats.length > 0) setSelectedCategory(0);
    } catch (e) {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const saveToBackend = async (newCategories) => {
    try {
      await updatePackingList(tripId, newCategories);
    } catch (e) {
      toast.error('Failed to sync packing list'); // BUG-02 fix
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const updated = [...categories];
    updated[selectedCategory].items.push({ name: newItemName.trim(), isPacked: false });
    setCategories(updated);
    setNewItemName('');
    saveToBackend(updated);
  };

  const toggleItemPacked = (catIdx, itemIdx) => {
    const updated = [...categories];
    updated[catIdx].items[itemIdx].isPacked = !updated[catIdx].items[itemIdx].isPacked;
    setCategories(updated);
    saveToBackend(updated);
  };

  const deleteItem = (catIdx, itemIdx) => {
    const updated = [...categories];
    updated[catIdx].items.splice(itemIdx, 1);
    setCategories(updated);
    saveToBackend(updated);
  };

  // BUG-08 fix: consistent LoadingSkeleton
  if (loading) return <LoadingSkeleton />;

  const totalItems  = categories.reduce((acc, c) => acc + c.items.length, 0);
  const packedItems = categories.reduce((acc, c) => acc + c.items.filter(i => i.isPacked).length, 0);
  const pct = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-white">🎒 Packing Checklist</h2>
        <span className="text-gray-400 text-sm">{packedItems}/{totalItems} packed</span>
      </div>

      {/* Overall progress */}
      {totalItems > 0 && (
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Category sidebar */}
        <div className="space-y-2">
          {categories.map((cat, idx) => {
            const packed   = cat.items.filter(i => i.isPacked).length;
            const allDone  = cat.items.length > 0 && packed === cat.items.length;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center ${
                  selectedCategory === idx
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'glass-card text-gray-400 hover:text-white'
                }`}
              >
                <span className="font-medium text-sm">{cat.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${allDone ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {packed}/{cat.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Checklist area */}
        <div className="md:col-span-3 glass-dark p-6 rounded-2xl border border-gray-700 min-h-[400px] flex flex-col">
          {categories.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              No categories found.
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white mb-5 pb-4 border-b border-gray-700">
                {categories[selectedCategory].category}
              </h3>

              <div className="flex-1 space-y-2 mb-5 overflow-y-auto">
                {categories[selectedCategory].items.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Nothing here yet. Add your first item!</p>
                )}
                {categories[selectedCategory].items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
                      item.isPacked ? 'bg-gray-800/40 border-gray-700/40 opacity-60' : 'bg-gray-800/60 border-gray-700 hover:border-indigo-500/40'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={item.isPacked}
                        onChange={() => toggleItemPacked(selectedCategory, idx)}
                        className="w-5 h-5 accent-indigo-500 cursor-pointer rounded"
                      />
                      <span className={`text-base ${item.isPacked ? 'line-through text-gray-500' : 'text-white'}`}>
                        {item.name}
                      </span>
                    </label>
                    <button
                      onClick={() => deleteItem(selectedCategory, idx)}
                      className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-2 text-lg leading-none"
                    >×</button>
                  </motion.div>
                ))}
              </div>

              <form onSubmit={handleAddItem} className="flex gap-2">
                <input
                  type="text"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  placeholder="Add item..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary px-5">Add</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackingList;
