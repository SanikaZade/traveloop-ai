import React from 'react';
import { motion } from 'framer-motion';

/** Wraps any page with a smooth fade-slide entrance/exit */
export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{ willChange: 'opacity, transform' }}
  >
    {children}
  </motion.div>
);

/** Full-page skeleton loader */
export const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-950 p-8 flex flex-col gap-6 max-w-5xl mx-auto">
    <div className="skeleton h-10 w-48 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton h-52 rounded-2xl" />
      ))}
    </div>
    <div className="skeleton h-64 rounded-2xl" />
    <div className="grid grid-cols-2 gap-4">
      <div className="skeleton h-24 rounded-xl" />
      <div className="skeleton h-24 rounded-xl" />
    </div>
  </div>
);

/** Inline skeleton for smaller UI elements */
export const InlineSkeleton = ({ className = '' }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

/** Empty state component with CTA */
export const EmptyState = ({ icon = '✈️', title, description, actionLabel, onAction }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 px-8 text-center"
  >
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 max-w-sm">{description}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary">
        {actionLabel}
      </button>
    )}
  </motion.div>
);

/** Card skeleton for trip/activity lists */
export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass-card rounded-2xl overflow-hidden">
        <div className="skeleton h-44" />
        <div className="p-5 space-y-3">
          <div className="skeleton h-5 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
      </div>
    ))}
  </div>
);
