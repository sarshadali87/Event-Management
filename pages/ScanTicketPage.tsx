
import React from 'react';
import QRScanner from '../components/QRScanner';

const ScanTicketPage: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Ticket Scanner</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Position the QR code inside the box to validate the ticket.</p>
      </div>
      <QRScanner />
    </div>
  );
};

export default ScanTicketPage;
