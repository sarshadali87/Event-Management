
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import TicketCard from '../components/TicketCard';
import { Link } from 'react-router-dom';

const MyTicketsPage: React.FC = () => {
  const { tickets, loading, user } = useAppContext();

  if (!user) {
    return (
        <div className="text-center py-20">
            <h2 className="text-3xl font-bold">Please Log In</h2>
            <p className="text-gray-500 mt-2">You need to be logged in to see your tickets.</p>
        </div>
    );
  }
  
  if (loading) {
      return <div>Loading tickets...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
      {tickets.length > 0 ? (
        <div className="space-y-6">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">You have no tickets yet.</h2>
          <p className="text-gray-500 mt-2">Time to find your next adventure!</p>
          <Link to="/" className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
