'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import api from '@/lib/api';
import '@/styles/upload-receipt.css';

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
    <div className="upload-receipt-container">
      <h2 className="upload-receipt-title">Payment Receipts Upload</h2>

      <div className="upload-receipt-instructions">
        Please select a <strong>session</strong> and <strong>semester</strong> to view pending or rejected payments.
        <ul className="upload-guidelines">
          <li>Ensure your receipt is in PDF or image format.</li>
          <li>Maximum file size: <strong>5MB</strong>.</li>
          <li>If rejected, confirm your transaction and re-upload.</li>
          <li>After uploading, status will change to <em>Awaiting approval</em>.</li>
        </ul>
      </div>

      <div className="upload-controls">
        <select
          className="upload-session-select"
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
          <div className="upload-semester-options">
            {(['first', 'second'] as const).map(s => (
              <label key={s} className="upload-semester-label">
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

      <div className="upload-payment-list">
        {payments.length === 0 && session && semester && (
          <p className="upload-no-payments">No pending or rejected payments found.</p>
        )}

        {payments.map(p => (
          <div key={p._id} className="upload-payment-card">
            <h4 className="upload-payment-title">{p.categoryId.title}</h4>
            <p><strong>Total:</strong> ₦{p.total}</p>
            <p><strong>Status:</strong> {p.status}</p>
            <p><strong>Account:</strong> {p.categoryId.accountName} • {p.categoryId.accountNo} ({p.categoryId.bank})</p>

            {p.status === 'rejected' && (
              <p className="upload-error-message">
                <strong>Rejected:</strong> Payment was rejected. Please verify and re-upload.
              </p>
            )}

            {(!p.receiptUrl || p.status === 'rejected') && (
              <div className="upload-file-action">
                <input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(p._id, e.target.files?.[0] || null)
                  }
                  className="upload-file-input"
                />
                <p className="upload-file-note">PDF or image. Max 5MB.</p>
                <button
                  className="upload-btn"
                  onClick={() => handleUpload(p._id)}
                  disabled={uploading === p._id}
                >
                  {uploading === p._id ? <span className="btn-spinner" /> : 'Upload Receipt'}
                </button>
              </div>
            )}

            {messages[p._id] && (
              <p className={`upload-feedback ${
                messages[p._id].includes('successfully') ? 'success' :
                messages[p._id].includes('failed') ? 'error' : 'info'
              }`}>
                {messages[p._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
