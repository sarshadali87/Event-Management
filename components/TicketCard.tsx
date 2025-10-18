import React from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import type { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const eventDate = new Date(ticket.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const statusColor = ticket.status === 'valid' ? 'text-green-500' : 'text-red-500';
  const statusBgColor = ticket.status === 'valid' ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div className="p-6 bg-gray-50 dark:bg-gray-700 flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg">
          <QRCode value={ticket.qrCodeValue} size={128} />
        </div>
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.eventName}</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{formattedDate}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Ticket ID: {ticket.id}</p>
        </div>
        <div className="mt-4">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor} ${statusBgColor}`}>
                Status: {ticket.status.toUpperCase()}
            </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
