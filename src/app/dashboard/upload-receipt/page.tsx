'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import api from '@/lib/api';

interface Session {
  _id: string;
  sessionTitle: string;
}

interface Payment {
  _id: string;
  total: number;
  status: 'pending' | 'waiting_approval' | 'approved' | 'rejected';
  receiptUrl?: string;
  categoryId: {
    title: string;
    accountName: string;
    accountNo: string;
    bank: string;
  };
}

export default function UploadReceipt() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState<'first' | 'second' | ''>('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get<Session[]>('/sessions')
      .then(res => setSessions(res.data))
      .catch(() => setSessions([]));
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session || !semester) return setPayments([]);
      try {
        const res = await api.get<Payment[]>(`/payments/pending?session=${session}&semester=${semester}`);
        setPayments(res.data.filter(p => p.status === 'pending' || p.status === 'rejected'));
      } catch {
        setPayments([]);
      }
    };
    fetchPayments();
  }, [session, semester]);

  const handleFileChange = (paymentId: string, file: File | null) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setMessages(prev => ({ ...prev, [paymentId]: 'File size exceeds 5MB. Please select a smaller file.' }));
      setFiles(prev => ({ ...prev, [paymentId]: null }));
      return;
    }
    setMessages(prev => ({ ...prev, [paymentId]: '' }));
    setFiles(prev => ({ ...prev, [paymentId]: file }));
  };

  const handleUpload = async (paymentId: string) => {
    const file = files[paymentId];
    if (!file) {
      setMessages(prev => ({ ...prev, [paymentId]: 'No file selected.' }));
      return;
    }

    const fd = new FormData();
    fd.append('receipt', file);
    setUploading(paymentId);

    try {
      await api.post(`/payments/upload-receipt/${paymentId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessages(prev => ({
        ...prev,
        [paymentId]: 'Receipt uploaded successfully. Awaiting approval.',
      }));

      setPayments(prev =>
        prev.map(p =>
          p._id === paymentId
            ? { ...p, status: 'waiting_approval', receiptUrl: 'uploaded' }
            : p
        )
      );

      setFiles(prev => ({ ...prev, [paymentId]: null }));
    } catch {
      setMessages(prev => ({ ...prev, [paymentId]: 'Upload failed. Try again later.' }));
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="receipt-upload-page">
      <h2 className="receipt-upload-title">Payment Receipts upload</h2>
      <div className="receipt-upload-instructions">
        Please select a <strong>session</strong> and <strong>semester</strong> to view pending or rejected payments. For each item listed:
        <ul className="receipt-upload-guidelines">
          <li>Ensure your receipt file is either a PDF or image format.</li>
          <li>Maximum file size allowed is <strong>5MB</strong>.</li>
          <li>If your payment was rejected, re-confirm your transaction and re-upload a valid receipt.</li>
          <li>Once uploaded, the receipt will be marked as <em>Awaiting approval</em>.</li>
        </ul>
      </div>


      <div className="receipt-upload-controls">
        <select
          className="receipt-select-session"
          value={session}
          onChange={e => {
            setSession(e.target.value);
            setSemester('');
            setPayments([]);
          }}
        >
          <option value="">Select Session</option>
          {sessions.map(s => (
            <option key={s._id} value={s._id}>{s.sessionTitle}</option>
          ))}
        </select>

        {session && (
          <div className="receipt-semester-options">
            {(['first', 'second'] as const).map(s => (
              <label key={s} className="receipt-semester-option">
                <input
                  type="radio"
                  name="semester"
                  value={s}
                  checked={semester === s}
                  onChange={() => setSemester(s)}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)} Semester
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="receipt-payment-list">
        {payments.length === 0 && session && semester && (
          <p className="receipt-no-payments">No pending or rejected payments found.</p>
        )}

        {payments.map(p => (
          <div key={p._id} className="receipt-payment-card">
            <h4 className="receipt-payment-title">{p.categoryId.title}</h4>
            <p className="receipt-payment-amount">Total: ₦{p.total}</p>
            <p className="receipt-payment-status">Status: {p.status}</p>
            <p className="receipt-payment-account">
              Account: {p.categoryId.accountName} – {p.categoryId.accountNo} ({p.categoryId.bank})
            </p>

            {p.status === 'rejected' && (
              <p className="receipt-payment-error">
                <strong>Rejected:</strong> Payment was rejected. Confirm the payment and re-upload the receipt.
              </p>
            )}

            {(!p.receiptUrl || p.status === 'rejected') && (
              <div className="receipt-upload-action">
                <input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(p._id, e.target.files?.[0] || null)
                  }
                  className="receipt-file-input"
                />
                <p className="receipt-file-info">Max size: 5MB (PDF or image)</p>
                <button
                  onClick={() => handleUpload(p._id)}
                  className="receipt-upload-btn"
                  disabled={uploading === p._id}
                >
                  {uploading === p._id ? (
                    <span className="btn-spinner" />
                  ) : (
                    'Upload Receipt'
                  )}
                </button>
              </div>
            )}

            {messages[p._id] && (
              <p className={`receipt-message ${messages[p._id].includes('successfully') ? 'success' : messages[p._id].includes('failed') ? 'error' : 'info'}`}>
                {messages[p._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
