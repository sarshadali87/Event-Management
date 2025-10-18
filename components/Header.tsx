
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import TicketIcon from './icons/TicketIcon';
import UserIcon from './icons/UserIcon';

const Header: React.FC = () => {
  const { user, login, logout } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          <TicketIcon className="w-8 h-8"/>
          <span>EventEase</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Events</Link>
          {user && <Link to="/my-tickets" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">My Tickets</Link>}
          {user?.role === 'organizer' && (
            <>
              <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Dashboard</Link>
              <Link to="/scan" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Scan Tickets</Link>
            </>
          )}
        </nav>
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
            <span className="hidden sm:inline text-sm font-medium">{user ? user.name : 'Guest'}</span>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
              {user ? (
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                  Logout
                </button>
              ) : (
                <>
                  <button onClick={() => { login('user'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                    Login as User
                  </button>
                  <button onClick={() => { login('organizer'); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                    Login as Organizer
                  </button>
                </>
              )}
               <div className="block md:hidden">
                 <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                 <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Events</Link>
                 {user && <Link to="/my-tickets" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">My Tickets</Link>}
                 {user?.role === 'organizer' && (
                  <>
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Dashboard</Link>
                    <Link to="/scan" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Scan Tickets</Link>
                  </>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
