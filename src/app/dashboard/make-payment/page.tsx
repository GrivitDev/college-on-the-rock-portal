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
  paymentItems: { name: string; amount: number; description: string }[];
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<User>('/users/me').then(r => setUser(r.data));
    api.get<Session[]>('/sessions').then(r => setSessions(r.data));
  }, []);

  useEffect(() => {
    if (selectedSession && selectedSemester && user?.level) {
      api
        .get<Category[]>(`/payment-category/session/${selectedSession}/level/${user.level}/semester/${selectedSemester}`)
        .then(r => setCategories(r.data))
        .catch(() => setCategories([]));

      api
        .get<HistoryEntry[]>(`/payments/history/me?session=${selectedSession}&semester=${selectedSemester}`)
        .then(r => setHistory(r.data))
        .catch(() => setHistory([]));
    } else {
      setCategories([]);
      setHistory([]);
    }
  }, [selectedSession, selectedSemester, user]);

  const toggleCategorySelection = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) return;

    setLoading(true);
    try {
      for (const catId of selectedCategories) {
        const cat = categories.find(c => c._id === catId);
        if (!cat) continue;

        await api.post('/payments', {
          sessionId: selectedSession,
          semester: selectedSemester,
          categoryId: catId,
          items: cat.paymentItems.map(i => ({ name: i.name, amount: Number(i.amount) })),
          total: cat.paymentItems.reduce((a, b) => a + Number(b.amount), 0),
        });
      }

      setMessage('✅ Payments initiated. Upload receipt next.');
      setSelectedCategories([]);
    } catch (err) {
      const error = err as ApiError;
      if (error.response?.status === 409) {
        setMessage('❌ Some payments already initiated.');
      } else {
        setMessage('❌ Error initiating payments.');
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


  const selectedCategoryObjects = categories.filter(c => selectedCategories.includes(c._id));
  const grandTotal = selectedCategoryObjects.reduce(
    (sum, cat) => sum + cat.paymentItems.reduce((a, b) => a + Number(b.amount), 0),
    0
  );

  return (
    <div className="payment-page">
      {user && (
        <>
          <h2 className="welcome-title">
            Welcome, {user.firstName} {user.lastName} — Level {user.level}
          </h2>
          <p className="payment-instructions">
            Please choose session, semester, and one or more payment categories to begin.
          </p>
        </>
      )}

      <div className="payment-form-controls">
        <select
          className="custom-select"
          value={selectedSession}
          onChange={e => {
            setSelectedSession(e.target.value);
            setSelectedSemester('');
            setSelectedCategories([]);
            setMessage('');
          }}
        >
          <option value="">Select Session</option>
          {sessions.map(s => (
            <option key={s._id} value={s._id}>
              {s.sessionTitle}
            </option>
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
                    setSelectedCategories([]);
                    setMessage('');
                  }}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)} Semester
              </label>
            ))}
          </div>
        )}

        {selectedSemester && (
          <div className="category-checkboxes">
            {categories.map(c => {
              const status = getCategoryStatus(c._id);
              const disabled =
                status === 'approved' || status === 'pending' || status === 'waiting_approval';
              return (
                <label key={c._id} className="checkbox-option">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={selectedCategories.includes(c._id)}
                    onChange={() => toggleCategorySelection(c._id)}
                  />
                  {c.title}{' '}
                  {status === 'approved'
                    ? '✅'
                    : status === 'pending' || status === 'waiting_approval'
                    ? '⏳'
                    : ''}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {selectedCategoryObjects.length > 0 && (
        <div className="payment-details-box">
          <h4>Selected Categories</h4>
          {selectedCategoryObjects.map(cat => (
            <div key={cat._id} className="category-details">
              <p>
                <strong>{cat.title}</strong>
              </p>
              <ul>
                {cat.paymentItems.map(i => (
                  <li key={i.name}>
                    {i.name} — ₦{i.amount}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Category Total:</strong> ₦
                {cat.paymentItems.reduce((a, b) => a + Number(b.amount), 0)}
              </p>
              {cat.paymentItems[0]?.description && (
                <p className="category-description">
                  <em>{cat.paymentItems[0].description}</em>
                </p>
              )}
              <hr />
            </div>
          ))}
          <p>
            <strong>Grand Total:</strong> ₦{grandTotal}
          </p>
          <p>
            <strong>Account:</strong> Jonathan Yetu Yisa • 0181739808 (Union Bank)
          </p>
          <button
            disabled={loading || selectedCategories.length === 0}
            className="initiate-btn"
            onClick={() => setShowModal(true)}
          >
            {loading ? <span className="btn-spinner" /> : 'Initiate Payments'}
          </button>
        </div>
      )}

      {message && <div className="payment-message-box">{message}</div>}

      {showModal && selectedCategoryObjects.length > 0 && (
        <div className="modal-overlay-payment">
          <div className="modal-payment-box">
            <h3>Payment Summary</h3>
            <p>
              <strong>Student:</strong> {user?.firstName} {user?.lastName} — Level {user?.level}
            </p>
            {selectedCategoryObjects.map(cat => (
              <div key={cat._id}>
                <p>
                  <strong>Category:</strong> {cat.title}
                </p>
                <ul>
                  {cat.paymentItems.map(i => (
                    <li key={i.name}>
                      {i.name} — ₦{i.amount}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total:</strong> ₦
                  {cat.paymentItems.reduce((a, b) => a + Number(b.amount), 0)}
                </p>
                <hr />
              </div>
            ))}
            <p>
              <strong>Grand Total:</strong> ₦{grandTotal}
            </p>
            <p>
              <strong>Account:</strong> Jonathan Yetu Yisa • 0181739808 (Union Bank)
            </p>
            <p className="summary-payment-note">
              Pay the total amount above, then upload your receipt on the Upload page.
            </p>
            <button className="modal-payment-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Confirm All Payments'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
