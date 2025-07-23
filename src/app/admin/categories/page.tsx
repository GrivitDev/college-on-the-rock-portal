'use client';
import { useEffect, useState, FormEvent } from 'react';
import api from '@/lib/api';

interface Session {
  _id: string;
  sessionTitle: string;
}

interface PaymentItem {
  name: string;
  amount: number;
  description?: string;
}

interface PaymentCategory {
  _id: string;
  title: string;
  accountNo: string;
  accountName: string;
  bank: string;
  session: { _id: string; sessionTitle: string };
  semester: 'first' | 'second';
  levels: string[];
  paymentItems: PaymentItem[];
}

interface FormState {
  session: string;
  semester: 'first' | 'second' | '';
  title: string;
  accountNo: string;
  accountName: string;
  bank: string;
  levels: string[];
}

export default function AdminCategories() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [categories, setCategories] = useState<PaymentCategory[]>([]);
  const [form, setForm] = useState<FormState>({
    session: '',
    semester: '',
    title: '',
    accountNo: '',
    accountName: '',
    bank: '',
    levels: [],
  });
  const [items, setItems] = useState<PaymentItem[]>([{ name: '', amount: 0, description: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/sessions')
      .then(res => setSessions(res.data))
      .catch(() => setFormMessage({ type: 'error', text: 'Failed to load sessions.' }));

    loadCategories();
  }, []);

  const loadCategories = () => {
    api.get('/payment-category')
      .then(res => setCategories(res.data))
      .catch(() => setFormMessage({ type: 'error', text: 'Failed to load categories.' }));
  };

  const handleChange = (key: keyof FormState, value: string | string[]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setFormMessage(null);
  };

  const toggleLevel = (level: string, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      levels: checked ? [...prev.levels, level] : prev.levels.filter(l => l !== level),
    }));
    setFormMessage(null);
  };

  const addItem = () => setItems(prev => [...prev, { name: '', amount: 0, description: '' }]);

  const handleItemChange = (index: number, field: keyof PaymentItem, value: string) => {
    const updated = [...items];
    if (field === 'amount') {
      updated[index][field] = parseFloat(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setItems(updated);
    setFormMessage(null);
  };

  const resetForm = () => {
    setForm({
      session: '',
      semester: '',
      title: '',
      accountNo: '',
      accountName: '',
      bank: '',
      levels: [],
    });
    setItems([{ name: '', amount: 0, description: '' }]);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await api.delete(`/payment-category/${confirmDeleteId}`);
      setFormMessage({ type: 'success', text: 'Category deleted.' });
      setConfirmDeleteId(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      setFormMessage({ type: 'error', text: 'Error deleting category.' });
      setConfirmDeleteId(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage(null);
    setSubmitting(true);
    try {
      await api.post('/payment-category', {
        ...form,
        paymentItems: items,
      });
      setFormMessage({ type: 'success', text: 'Category created successfully.' });
      resetForm();
      loadCategories();
    } catch (err) {
      console.error(err);
      setFormMessage({ type: 'error', text: 'Failed to save category.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-categories-page-wrapper">
      <div className="admin-categories-content-container">
        <h1 className="admin-categories-header">Manage Payment Categories</h1>

        <form onSubmit={handleSubmit} className="admin-categories-form" noValidate>
          <label className="admin-categories-label">Session</label>
          <select
            className="admin-categories-select"
            required
            value={form.session}
            onChange={(e) => handleChange('session', e.target.value)}
          >
            <option value="" disabled>Select Session</option>
            {sessions.map(s => (
              <option key={s._id} value={s._id}>{s.sessionTitle}</option>
            ))}
          </select>

          <fieldset className="admin-categories-fieldset">
            <legend className="admin-categories-legend">Semester</legend>
            <label>
              <input
                type="radio"
                name="semester"
                value="first"
                checked={form.semester === 'first'}
                onChange={() => handleChange('semester', 'first')}
              />
              First Semester
            </label>
            <label>
              <input
                type="radio"
                name="semester"
                value="second"
                checked={form.semester === 'second'}
                onChange={() => handleChange('semester', 'second')}
              />
              Second Semester
            </label>
          </fieldset>

          <fieldset className="admin-categories-fieldset">
            <legend className="admin-categories-legend">Levels</legend>
            {['100', '200', '300', '400'].map(lvl => (
              <label key={lvl}>
                <input
                  type="checkbox"
                  value={lvl}
                  checked={form.levels.includes(lvl)}
                  onChange={(e) => toggleLevel(lvl, e.target.checked)}
                />
                Level {lvl}
              </label>
            ))}
          </fieldset>

          <input
            className="admin-categories-input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
          <input
            className="admin-categories-input"
            placeholder="Account Name"
            value={form.accountName}
            onChange={(e) => handleChange('accountName', e.target.value)}
            required
          />
          <input
            className="admin-categories-input"
            placeholder="Account Number"
            value={form.accountNo}
            onChange={(e) => handleChange('accountNo', e.target.value)}
            required
          />
          <input
            className="admin-categories-input"
            placeholder="Bank"
            value={form.bank}
            onChange={(e) => handleChange('bank', e.target.value)}
            required
          />

          <h4 className="admin-categories-payment-items-title">Payment Items</h4>
          {items.map((itm, i) => (
            <div key={i} className="admin-categories-payment-item-row">
              <input
                className="admin-categories-payment-item-input"
                placeholder="Name"
                value={itm.name}
                onChange={(e) => handleItemChange(i, 'name', e.target.value)}
                required
              />
              <input
                className="admin-categories-payment-item-input"
                type="number"
                placeholder="Amount"
                value={isNaN(itm.amount) ? '' : itm.amount}
                onChange={(e) => handleItemChange(i, 'amount', e.target.value)}
                required
              />
              <input
                className="admin-categories-payment-item-input"
                placeholder="Description"
                value={itm.description}
                onChange={(e) => handleItemChange(i, 'description', e.target.value)}
              />
            </div>
          ))}

          <button
            type="button"
            className="admin-categories-add-item-button"
            onClick={addItem}
          >
            + Add Item
          </button>

          {formMessage && (
            <div className={`admin-categories-form-message admin-categories-form-message--${formMessage.type}`}>
              {formMessage.text}
            </div>
          )}

          <button type="submit" className="admin-categories-submit-button" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create Category'}
          </button>
        </form>

        <hr className="admin-categories-divider" />

        <h2 className="admin-categories-subheader">Existing Categories</h2>
        <ul className="admin-categories-list">
          {categories.map(cat => (
            <li key={cat._id} className="admin-categories-list-item">
              <div className="admin-categories-list-details">
              <strong>{cat.title}</strong> – {cat.session?.sessionTitle} ({cat.semester}) – Levels: {cat.levels.join(', ')}
              </div>
              <div className="admin-categories-list-actions">
                <button onClick={() => setConfirmDeleteId(cat._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        {confirmDeleteId && (
          <div className="admin-categories-modal-backdrop" role="dialog" aria-modal="true">
            <div className="admin-categories-modal">
              <p>Are you sure you want to delete this category?</p>
              <div className="admin-categories-modal-buttons">
                <button onClick={handleDelete}>Yes, Delete</button>
                <button onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>  
  );
}
