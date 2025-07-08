'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Session { _id: string; sessionTitle: string }
interface Category {
  _id: string;
  title: string;
  accountNo: string;
  accountName: string;
  bank: string;
  paymentItems: { name: string; amount: number }[];
}
interface User { firstName: string; lastName: string; level: string }
interface HistoryEntry {
  categoryId: string;
  status: 'pending' | 'waiting_approval' | 'approved' | 'rejected';
}

type ApiError = {
  response?: {
    status?: number;
    data?: { message?: string };
  }
};

export default function MakePayment() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'first' | 'second' | ''>('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<User>('/users/me').then(r => setUser(r.data));
    api.get<Session[]>('/sessions').then(r => setSessions(r.data));
  }, []);

  useEffect(() => {
    if (selectedSession && selectedSemester && user?.level) {
      api.get<Category[]>(`/payment-category/session/${selectedSession}/level/${user.level}/semester/${selectedSemester}`)
        .then(r => setCategories(r.data))
        .catch(() => setCategories([]));

      api.get<HistoryEntry[]>(`/payments/history/me?session=${selectedSession}&semester=${selectedSemester}`)
        .then(r => setHistory(r.data))
        .catch(() => setHistory([]));
    } else {
      setCategories([]);
      setHistory([]);
    }
  }, [selectedSession, selectedSemester, user]);

  const handleSubmit = async () => {
    const cat = categories.find(c => c._id === selectedCategory);
    if (!cat) return;

    setLoading(true);
    try {
      await api.post('/payments', {
        sessionId: selectedSession,
        semester: selectedSemester,
        categoryId: selectedCategory,
        items: cat.paymentItems.map(i => ({ name: i.name, amount: Number(i.amount) })),
        total: cat.paymentItems.reduce((a, b) => a + Number(b.amount), 0),
      });
      setMessage('✅ Payment initiated. Upload receipt next.');
      setSelectedCategory('');
    } catch (err) {
      const error = err as ApiError;
      if (error.response?.status === 409) {
        setMessage('❌ Payment already initiated for this category.');
      } else {
        setMessage('❌ Error initiating payment.');
      }
    } finally {
      setShowModal(false);
      setLoading(false);
    }
  };

  const getCategoryStatus = (catId: string): HistoryEntry['status'] | null => {
    const record = history.find(h => h.categoryId === catId);
    return record?.status ?? null;
  };

  const alreadyPaid = (catId: string): string | null => {
    const status = getCategoryStatus(catId);
    if (!status) return null;
    if (status === 'approved') return '✅ Already paid';
    if (status === 'pending' || status === 'waiting_approval') return '⏳ Payment in progress';
    if (status === 'rejected') return null;
    return null;
  };

  const current = categories.find(c => c._id === selectedCategory);
  const blockReason = selectedCategory ? alreadyPaid(selectedCategory) : null;

  // Close modal if block reason appears (payment in progress or paid)
  useEffect(() => {
    if (blockReason) setShowModal(false);
  }, [blockReason]);

  return (
    <div className="payment-page">
      {user && (
        <>
          <h2 className="welcome-title">Welcome, {user.firstName} {user.lastName} — Level {user.level}</h2>
          <p className="payment-instructions">Please choose session, semester, and a payment category to begin.</p>
        </>
      )}

      <div className="payment-form-controls">
        <select className="custom-select" value={selectedSession} onChange={e => {
          setSelectedSession(e.target.value);
          setSelectedSemester('');
          setSelectedCategory('');
          setMessage('');
        }}>
          <option value="">Select Session</option>
          {sessions.map(s => (
            <option key={s._id} value={s._id}>{s.sessionTitle}</option>
          ))}
        </select>

        {selectedSession && (
          <div className="semester-options">
            {['first', 'second'].map(s => (
              <label key={s} className="radio-option">
                <input
                  type="radio"
                  name="semester"
                  value={s}
                  checked={selectedSemester === s}
                  onChange={() => {
                    setSelectedSemester(s as 'first' | 'second');
                    setSelectedCategory('');
                    setMessage('');
                  }}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)} Semester
              </label>
            ))}
          </div>
        )}

        {selectedSemester && (
          <select className="custom-select" value={selectedCategory} onChange={e => {
            setSelectedCategory(e.target.value);
            setMessage('');
          }}>
            <option value="">Select Category</option>
            {categories.map(c => {
              const status = getCategoryStatus(c._id);
              let icon = '';
              if (status === 'approved') icon = '✅';
              else if (status === 'pending' || status === 'waiting_approval') icon = '⏳';
              else if (status === 'rejected') icon = '❌';

              return (
                <option key={c._id} value={c._id}>
                  {icon} {c.title}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {current && (
        <div className="payment-details-box">
          <h4>{current.title}</h4>
          <p><strong>Account:</strong> {current.accountName} • {current.accountNo} ({current.bank})</p>
          <ul>
            {current.paymentItems.map(i => (
              <li key={i.name}>{i.name} — ₦{i.amount}</li>
            ))}
          </ul>
          <p><strong>Total:</strong> ₦{current.paymentItems.reduce((a, b) => a + Number(b.amount), 0)}</p>
          <button
            disabled={!!blockReason || loading}
            className="initiate-btn"
            onClick={() => {
              if (!blockReason) setShowModal(true);
            }}
          >
            {loading ? <span className="btn-spinner" /> : 'Initiate Payment'}
          </button>
        </div>
      )}

      {message && <div className="payment-message-box">{message}</div>}

      {showModal && current && !blockReason && (
        <div className="modal-overlay-payment">
          <div className="modal-payment-box">
            <h3>Payment Summary</h3>
            <p><strong>Category:</strong> {current.title}</p>
            <p><strong>Student:</strong> {user?.firstName} {user?.lastName} — Level {user?.level}</p>
            <ul>
              {current.paymentItems.map(i => (
                <li key={i.name}>{i.name} — ₦{i.amount}</li>
              ))}
            </ul>
            <p><strong>Total:</strong> ₦{current.paymentItems.reduce((a, b) => a + Number(b.amount), 0)}</p>
            <p><strong>Account:</strong> {current.accountName} • {current.accountNo} ({current.bank})</p>
            <p className="summary-payment-note">
              Pay the total amount above, then upload your receipt on the Upload page.
            </p>
            <button className="modal-payment-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'OK'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
