
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import CalendarIcon from '../components/icons/CalendarIcon';
import LocationIcon from '../components/icons/LocationIcon';
import TicketIcon from '../components/icons/TicketIcon';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, bookTicket, loading, user } = useAppContext();
  const event = events.find(e => e.id === id);

  if (loading) {
    return (
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-pulse">
        <div className="h-96 bg-gray-300 dark:bg-gray-700 w-full"></div>
        <div className="p-8">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
       </div>
    );
  }

  if (!event) {
    return (
        <div className="text-center py-20">
            <h2 className="text-3xl font-bold">Event Not Found</h2>
            <Link to="/" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Back to Events</Link>
        </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const ticketsLeft = event.totalTickets - event.bookedTickets;
  const isSoldOut = ticketsLeft <= 0;


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      <img src={event.imageUrl} alt={event.name} className="w-full h-64 md:h-96 object-cover" />
      <div className="p-6 md:p-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">{event.name}</h1>
        
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-lg text-gray-700 dark:text-gray-300">
            <div className="flex items-center space-x-2">
                <CalendarIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400"/>
                <span>{formattedDate} at {formattedTime}</span>
            </div>
             <div className="flex items-center space-x-2">
                <LocationIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-400"/>
                <span>{event.location}</span>
            </div>
        </div>
        
        <p className="mt-8 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {event.description}
        </p>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center space-x-3">
                <TicketIcon className="w-8 h-8 text-green-500"/>
                <div>
                   <p className="text-xl font-bold text-gray-900 dark:text-white">${event.price.toFixed(2)}</p>
                   <p className="text-sm text-gray-500 dark:text-gray-400">{ticketsLeft} tickets remaining</p>
                </div>
             </div>
             <div>
                {!user ? (
                    <p className="text-yellow-600 dark:text-yellow-400 font-semibold">Please log in to book a ticket.</p>
                ) : isSoldOut ? (
                    <button disabled className="px-8 py-3 rounded-lg bg-red-500 text-white font-bold text-lg cursor-not-allowed">Sold Out</button>
                ) : (
                    <button onClick={() => bookTicket(event.id)} disabled={loading} className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg transition duration-300 disabled:bg-indigo-400">
                        {loading ? 'Booking...' : 'Book Your Ticket'}
                    </button>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
