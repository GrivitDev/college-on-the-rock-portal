'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '@/lib/api';

export default function ReceiptVerifier() {
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrRegionId = 'qr-scanner-region';

  const handleVerify = async (dataToVerify?: string) => {
    setError('');
    setResult(null);

    const data = dataToVerify ?? qrData;

    if (!data.trim()) {
      setError('Please enter or scan QR code data to verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/receipts/verify', { barcodeData: data });
      setResult(res.data);
    } catch (err: unknown) {
      // Safe error handling
      if (typeof err === 'object' && err !== null && 'response' in err) {
     // @ts-expect-error: Ignore type error due to legacy API mismatch
        setError(err.response?.data?.message || 'Verification failed. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const startScanner = async () => {
    setResult(null);
    setError('');
    setQrData('');
    setScanning(true);

    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current.clear();
    }

    const html5QrcodeScanner = new Html5Qrcode(qrRegionId);
    scannerRef.current = html5QrcodeScanner;

    try {
      await html5QrcodeScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }, // square box for QR codes
        },
        (decodedText) => {
          setQrData(decodedText);
          handleVerify(decodedText);
          stopScanner();
        },
        // Unused errorMessage param removed for eslint compliance
        // Instead, provide an anonymous function without param if you want to ignore errors silently
        () => {}
      );
    } catch {
      setError('Unable to start camera for scanning.');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          setScanning(false);
        })
        // Remove unused err param, add empty catch to silence errors
        .catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="receipt-verifier-wrapper">
      <h2 className="receipt-verifier-header">Receipt Verification via QR Code</h2>

      <textarea
        rows={3}
        placeholder="Enter or scan QR code data here"
        value={qrData}
        onChange={(e) => setQrData(e.target.value)}
        className="receipt-verifier-textarea"
        disabled={scanning}
      />

      <div>
        {!scanning ? (
          <button onClick={startScanner} className="receipt-verifier-button receipt-verifier-button-start">
            Start QR Scanner
          </button>
        ) : (
          <button onClick={stopScanner} className="receipt-verifier-button receipt-verifier-button-stop">
            Stop Scanner
          </button>
        )}
      </div>

      <div id={qrRegionId}></div>

      <button
        onClick={() => handleVerify()}
        disabled={loading || scanning}
        className="receipt-verifier-button receipt-verifier-button-verify"
      >
        {loading ? 'Verifying...' : 'Verify QR Code'}
      </button>

      {error && <p className="receipt-verifier-message-error">{error}</p>}

      {result && (
        <div className={`receipt-verifier-message-result ${result.valid ? 'valid' : 'invalid'}`}>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
            {result.message}
          </pre>
        </div>
      )}
    </div>
  );
}
