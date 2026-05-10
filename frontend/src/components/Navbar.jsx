import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
];

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:animate-float">✈️</span>
            <span className="text-xl font-bold text-gradient">TravelLoop</span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === link.href
                      ? 'bg-indigo-600/20 text-indigo-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleLogout}
                  className="btn-ghost text-sm px-4 py-2"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-5 py-2">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            {user && (
              <button
                className="md:hidden p-2 text-gray-400 hover:text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 px-4 py-3 space-y-1"
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white"
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/5">
              <p className="px-4 py-2 text-sm text-gray-400">{user.email}</p>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
