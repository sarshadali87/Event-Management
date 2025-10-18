
import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import LocationIcon from './icons/LocationIcon';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const ticketsLeft = event.totalTickets - event.bookedTickets;
  const isSoldOut = ticketsLeft <= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <Link to={`/event/${event.id}`} className="block">
        <img className="w-full h-48 object-cover" src={event.imageUrl} alt={event.name} />
        <div className="p-6">
          <p className="text-sm text-indigo-500 dark:text-indigo-400 font-semibold">{event.category}</p>
          <h3 className="text-xl font-bold mt-2 text-gray-900 dark:text-white">{event.name}</h3>
          <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-gray-400"/>
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LocationIcon className="w-5 h-5 text-gray-400"/>
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-6 pb-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          ${event.price > 0 ? event.price.toFixed(2) : 'Free'}
        </p>
        {isSoldOut ? (
            <span className="px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-semibold">Sold Out</span>
        ) : (
            <Link to={`/event/${event.id}`} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition">
              Book Now
            </Link>
        )}
      </div>
    </div>
  );
};

export default EventCard;
