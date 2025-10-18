
import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import type { Html5QrcodeResult } from 'html5-qrcode/esm/core';
import { useAppContext } from '../contexts/AppContext';

const QRScanner: React.FC = () => {
  const { validateTicket } = useAppContext();
  const [scanResult, setScanResult] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const qrcodeRegionId = "qr-code-reader";
    const scanner = new Html5Qrcode(qrcodeRegionId);
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          await scanner.start(
            cameras[0].id,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText: string, result: Html5QrcodeResult) => {
              scanner.pause(true);
              handleScan(decodedText);
            },
            (errorMessage: string) => {
              // ignore
            }
          );
        }
      } catch (err) {
        console.error("Error starting scanner:", err);
        setScanResult({ message: 'Failed to start QR scanner. Check camera permissions.', type: 'error' });
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop scanner", err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScan = async (data: string) => {
    if (data) {
      const result = await validateTicket(data);
      setScanResult({ message: result.message, type: result.status });
      setTimeout(() => {
          setScanResult(null);
          if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.PAUSED) {
              scannerRef.current.resume();
          }
      }, 3000);
    }
  };
  
  const resultColor = scanResult?.type === 'success' ? 'bg-green-100 text-green-800' : 
                      scanResult?.type === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800';

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Scan Ticket QR Code</h2>
      <div id="qr-code-reader" className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"></div>
      {scanResult && (
        <div className={`mt-4 p-4 rounded-lg text-center font-semibold ${resultColor}`}>
          {scanResult.message}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
