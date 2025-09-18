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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState<string>('');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  // Load sessions
  useEffect(() => {
    api
      .get<Session[]>('/sessions')
      .then((res) => setSessions(res.data))
      .catch(() => setSessions([]));
  }, []);

  // Load payments when session/semester changes
  useEffect(() => {
    const fetchPayments = async () => {
      if (!session || !semester) return setPayments([]);
      try {
        const res = await api.get<Payment[]>(
          `/payments/pending?session=${session}&semester=${semester}`
        );
        setPayments(
          res.data.filter((p) => p.status === 'pending' || p.status === 'rejected')
        );
      } catch {
        setPayments([]);
      }
    };
    fetchPayments();
  }, [session, semester]);

  // Toggle selection
  const togglePaymentSelection = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Handle file selection
  const handleFileChange = (f: File | null) => {
    if (f && f.size > 5 * 1024 * 1024) {
      setMessages('File size exceeds 5MB. Please select a smaller file.');
      setFile(null);
      return;
    }
    setMessages('');
    setFile(f);
  };

  // Upload once and attach to selected payments
  const handleUpload = async () => {
    if (!file) {
      setMessages('Please select a file first.');
      return;
    }
    if (selectedPayments.length === 0) {
      setMessages('Please select at least one payment.');
      return;
    }

    const fd = new FormData();
    fd.append('receipt', file);
    setUploading(true);

    try {
      // Upload once
 // Upload once
        const res = await api.post<{ receiptUrl: string }>(
          `/payments/upload-receipt/${selectedPayments[0]}`, // use the first selected payment
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

      const { receiptUrl } = res.data;

      // Attach to all selected payments
      await Promise.all(
        selectedPayments.map((id) =>
          api.post(`/payments/attach-receipt/${id}`, { receiptUrl })
        )
      );

      setMessages('Receipt uploaded successfully to selected payments.');
      setPayments((prev) =>
        prev.map((p) =>
          selectedPayments.includes(p._id)
            ? { ...p, status: 'waiting_approval', receiptUrl }
            : p
        )
      );
      setFile(null);
      setSelectedPayments([]);
    } catch {
      setMessages('Upload failed. Try again later.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-receipt-container">
      <h2 className="upload-receipt-title">Payment Receipts Upload</h2>

      <div className="upload-receipt-instructions">
        Please select a <strong>session</strong> and <strong>semester</strong> to
        view pending or rejected payments.
        <ul className="upload-guidelines">
          <li>Ensure your receipt is in PDF or image format.</li>
          <li>
            Maximum file size: <strong>5MB</strong>.
          </li>
          <li>If rejected, confirm your transaction and re-upload.</li>
          <li>
            After uploading, status will change to <em>Awaiting approval</em>.
          </li>
        </ul>
      </div>

      {/* Session & Semester */}
      <div className="upload-controls">
        <select
          className="upload-session-select"
          value={session}
          onChange={(e) => {
            setSession(e.target.value);
            setSemester('');
            setPayments([]);
          }}
        >
          <option value="">Select Session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.sessionTitle}
            </option>
          ))}
        </select>

        {session && (
          <div className="upload-semester-options">
            {(['first', 'second'] as const).map((s) => (
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

      {/* File input for all */}
      <div className="upload-file-action">
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFileChange(e.target.files?.[0] || null)
          }
          className="upload-file-input"
        />
        <p className="upload-file-note">PDF or image. Max 5MB.</p>
      </div>

      {/* Payments List */}
      <div className="upload-payment-list">
        {payments.length === 0 && session && semester && (
          <p className="upload-no-payments">
            No pending or rejected payments found.
          </p>
        )}

        {payments.map((p) => (
          <div key={p._id} className="upload-payment-card">
            <label>
              <input
                type="checkbox"
                checked={selectedPayments.includes(p._id)}
                onChange={() => togglePaymentSelection(p._id)}
              />
              <strong>{p.categoryId.title}</strong>
            </label>
            <p>
              <strong>Total:</strong> ₦{p.total}
            </p>
            <p>
              <strong>Status:</strong> {p.status}
            </p>
            <p>
              <strong>Account:</strong> {p.categoryId.accountName} •{' '}
              {p.categoryId.accountNo} ({p.categoryId.bank})
            </p>
            {p.status === 'rejected' && (
              <p className="upload-error-message">
                <strong>Rejected:</strong> Payment was rejected. Please verify
                and re-upload.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Upload Button */}
      {payments.length > 0 && (
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? <span className="btn-spinner" /> : 'Upload Receipt'}
        </button>
      )}

      {/* Feedback */}
      {messages && (
        <p
          className={`upload-feedback ${
            messages.includes('successfully')
              ? 'success'
              : messages.includes('failed')
              ? 'error'
              : 'info'
          }`}
        >
          {messages}
        </p>
      )}
    </div>
  );
}
