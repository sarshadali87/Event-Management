
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import EventCard from '../components/EventCard';
import type { Event } from '../types';

const HomePage: React.FC = () => {
  const { events, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = useMemo(() => ['All', ...new Set(events.map(e => e.category))], [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Find Your Next Experience</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Discover concerts, workshops, sports and more.</p>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by event name or location..."
          className="w-full md:flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
                    <div className="p-6">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-6 mt-2 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="mt-4 space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event: Event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No events found</h2>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
