import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useContext, Suspense } from 'react';
import { AuthContext } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { PageTransition, LoadingSkeleton } from './components/Transitions';
import Navbar from './components/Navbar';

const Login     = React.lazy(() => import('./pages/auth/Login'));
const Signup    = React.lazy(() => import('./pages/auth/Signup'));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const TripDetail = React.lazy(() => import('./pages/trip/TripDetail'));
const PublicTrip = React.lazy(() => import('./pages/public/PublicTrip'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <LoadingSkeleton />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// BUG-12: 404 page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
    <div className="text-8xl mb-4">🗺️</div>
    <h1 className="text-4xl font-bold text-white mb-2">Page Not Found</h1>
    <p className="text-gray-400 mb-8">Looks like this destination doesn't exist on our map.</p>
    <a href="/dashboard" className="btn-primary">Back to Dashboard</a>
  </div>
);

const AUTH_ROUTES = ['/login', '/signup'];

function App() {
  const location = useLocation();
  // BUG-05 fix: removed unused isPublicPage and user declarations
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {!isAuthPage && <Navbar />}
      <div className={!isAuthPage ? 'pt-16' : ''}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSkeleton />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/"          element={<Navigate to="/dashboard" />} />
              <Route path="/login"     element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup"    element={<PageTransition><Signup /></PageTransition>} />
              <Route path="/shared/:id" element={<PageTransition><PublicTrip /></PageTransition>} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              } />
              <Route path="/trip/:id"  element={
                <ProtectedRoute>
                  <PageTransition><TripDetail /></PageTransition>
                </ProtectedRoute>
              } />
              {/* BUG-12: catch-all 404 route */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
