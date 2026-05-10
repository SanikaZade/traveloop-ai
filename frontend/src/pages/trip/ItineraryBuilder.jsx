import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { updateItinerary } from '../../services/itinerary.service';

const ItineraryBuilder = ({ tripId, stops, setStops }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(stops);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setStops(items);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateItinerary(tripId, stops);
      toast.success('Itinerary saved!'); // BUG-02 fix
    } catch (error) {
      // error toast already fired by interceptor
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Your Itinerary</h2>
          <p className="text-gray-400 text-sm mt-1">Drag stops to reorder, then save</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={isSaving || stops.length === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
          ) : '💾 Save Order'}
        </motion.button>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="timeline">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent"
            >
              {stops.length === 0 && (
                <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-800 rounded-2xl">
                  <div className="text-5xl mb-3">🏙️</div>
                  <p className="font-medium text-gray-400">No stops yet</p>
                  <p className="text-sm mt-1">Go to <strong>Explore Cities</strong> to add destinations</p>
                </div>
              )}

              {stops.map((stop, index) => (
                <Draggable key={stop.id} draggableId={stop.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group
                        ${snapshot.isDragging ? 'opacity-80 scale-[1.02]' : ''}`}
                    >
                      {/* Timeline dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-bold text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {index + 1}
                      </div>

                      {/* Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className="glass-dark border border-gray-700 hover:border-indigo-500/40 p-5 rounded-2xl shadow-xl w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-bold text-white text-lg leading-tight">{stop.city}</h3>
                            {stop.country && <p className="text-sm text-gray-400">{stop.country}</p>}
                          </div>
                          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-lg select-none cursor-grab active:cursor-grabbing">
                            ⠿ drag
                          </span>
                        </div>

                        {stop.startDate && (
                          <p className="text-xs text-gray-500 mt-2 mb-3">
                            📅 {new Date(stop.startDate).toLocaleDateString()} — {new Date(stop.endDate).toLocaleDateString()}
                          </p>
                        )}

                        {stop.activities?.length > 0 && (
                          <div className="space-y-1.5 mt-3 border-t border-gray-700 pt-3">
                            {stop.activities.map((activity, i) => (
                              <div key={i} className="flex justify-between text-sm bg-gray-800/60 px-3 py-1.5 rounded-lg">
                                <span className="text-gray-300">{activity.title}</span>
                                {activity.cost > 0 && <span className="text-indigo-400 font-medium">${activity.cost}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ItineraryBuilder;
