'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Session {
  _id: string;
  sessionTitle: string;
}

interface HistoryEntry {
  _id: string;
  createdAt: string;
  total: number;
  status: 'pending' | 'waiting_approval' | 'approved' | 'rejected';
  receiptUrl?: string;
  categoryId: { title: string };
}

export default function PaymentHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState<'first' | 'second' | ''>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get<Session[]>('/sessions')
      .then(r => setSessions(r.data))
      .catch(() => setSessions([]));
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      setError('');
      if (!session || !semester) {
        setHistory([]);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get<HistoryEntry[]>(`/payments/history/me?session=${session}&semester=${semester}`);
        setHistory(res.data);

        const approvedPayments = res.data.filter(p => p.status === 'approved');
        if (approvedPayments.length === 0) {
          setError('You have no successful (approved) payments for the selected session and semester.');
        }
      } catch {
        setHistory([]);
        setError('Failed to fetch payment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [session, semester]);

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Payment initiated. Upload your receipt to continue.';
      case 'waiting_approval':
        return 'Receipt uploaded. Awaiting approval.';
      case 'approved':
        return 'Payment has been successfully approved.';
      case 'rejected':
        return 'Payment was rejected. Re-initiate from the Make Payment page.';
      default:
        return '';
    }
  };

const handlePrintTicket = async () => {
  if (!session || !semester) return;

  try {
    setDownloading(true);

    // ✅ Call the ticket endpoint instead of PDF
    const res = await api.get(
      `/payments/me/receipt/ticket?session=${session}&semester=${semester}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([res.data], { type: 'image/jpeg' }); // JPEG instead of PDF
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${session}_${semester}.jpg`; // filename
    a.click();

    window.URL.revokeObjectURL(url);
    setShowModal(false);
  } catch {
    setError('Error generating ticket. Please try again later.');
  } finally {
    setDownloading(false);
  }
};

  return (
    <div className="payment-history-page">
      <h2 className="payment-history-title">Your Payment History</h2>

      <div className="payment-history-controls">
        <select
          value={session}
          onChange={e => {
            setSession(e.target.value);
            setSemester('');
          }}
          className="payment-history-select"
        >
          <option value="">Select Session</option>
          {sessions.map(s => (
            <option key={s._id} value={s._id}>{s.sessionTitle}</option>
          ))}
        </select>

        {session && (
          <div className="payment-history-semesters">
            {(['first', 'second'] as const).map(s => (
              <label key={s} className="payment-history-semester-option">
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

      {loading && <p className="loading-text">Loading history...</p>}

      <div className="payment-history-list">
        {!loading && history.length > 0 ? (
          history.map(p => (
            <div key={p._id} className={`payment-history-card status-${p.status}`}>
              <h4 className="payment-history-category">{p.categoryId.title}</h4>
              <p>Date: {new Date(p.createdAt).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}</p>
              <p>Total: ₦{p.total.toLocaleString()}</p>
              <p>Status: {p.status.replace('_', ' ').toUpperCase()}</p>

              {p.receiptUrl && (
                <a
                  href={p.receiptUrl}
                  download={`receipt_${p._id}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="receipt-download-link"
                >
                  Download Receipt
                </a>
              )}

              <p className="payment-history-status-message">
                {getStatusMessage(p.status)}
              </p>
            </div>
          ))
        ) : !loading ? (
          <p className="payment-history-empty">No payment history found for selected session and semester.</p>
        ) : null}
      </div>

      {error && <p className="payment-history-error">{error}</p>}

      {history.some(p => p.status === 'approved') && (
        <button
          onClick={() => setShowModal(true)}
          className="payment-history-print-btn"
          disabled={showModal}
        >
          {downloading ? <span className="btn-spinner" /> : 'Print receipt of all successful payments'}
        </button>
      )}

      {showModal && (
        <div className="payment-history-modal-overlay">
          <div className="payment-history-modal-box">
            <h3>Generate Ticket</h3>
            <p>This will generate a Tick which will be used to print a PDF receipt of all approved payments on resumption.</p>
            <div className="modal-actions">
              <button onClick={handlePrintTicket} disabled={downloading}>
                {downloading ? 'Generating...' : 'generate Ticket'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
                disabled={downloading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
