'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

interface ReceiptItem {
  name: string;
  amount: number;
}

interface ReceiptResult {
  valid: boolean;
  student: string;
  session: string;
  semester: string;
  total: number;
  items: ReceiptItem[];
  message: string;
}

export default function ReceiptVerificationResult() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ReceiptResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const barcodeData = searchParams.get('code');
    if (!barcodeData) {
      setError('No QR code data provided.');
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post<ReceiptResult>('/receipts/verify', { barcodeData });
        setResult(res.data);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const e = err as { response?: { data?: { message?: string } } };
          setError(e.response?.data?.message ?? 'Verification failed.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Verification failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Verifying receipt...</p>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
        ❌ {error}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      {/* Success Message */}
      <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'green' }}>
        {result.message} ✅
      </h2>

      {/* Receipt Details */}
      <div style={{ marginTop: '1.5rem', fontSize: '1rem' }}>
        <p><strong>Student:</strong> {result.student}</p>
        <p><strong>Session:</strong> {result.session}</p>
        <p><strong>Semester:</strong> {result.semester}</p>
        <p><strong>Total:</strong> ₦{result.total.toLocaleString()}</p>
        
        <div style={{ marginTop: '1rem' }}>
          <strong>Items:</strong>
          <ul>
            {result.items?.map((item, idx) => (
              <li key={idx}>{item.name} - ₦{item.amount.toLocaleString()}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
