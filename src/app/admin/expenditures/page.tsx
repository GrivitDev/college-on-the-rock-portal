'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Session {
  _id: string;
  sessionTitle: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: { name: string };
  session: { sessionTitle: string };
  semester: 'first' | 'second';
  description?: string;
}

interface FormState {
  sessionId: string;
  semester: 'first' | 'second' | '';
  categoryId: string;
  title: string;
  amount: string;
  description: string;
}

export default function AdminExpenditures() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState<FormState>({
    sessionId: '',
    semester: '',
    categoryId: '',
    title: '',
    amount: '',
    description: '',
  });

  const [filterSession, setFilterSession] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, categoriesRes] = await Promise.all([
          api.get('/sessions'),
          api.get('/expenditure-category'),
        ]);
        setSessions(sessionsRes.data);
        setCategories(categoriesRes.data);
      } catch {
        setError('Failed to load sessions or categories.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (filterSession && filterSemester) {
      fetchExpenses(filterSession, filterSemester);
    } else {
      setExpenses([]); // clear expenses if no valid filters
    }
  }, [filterSession, filterSemester]);

  const fetchExpenses = async (sessionId: string, semester: string) => {
    try {
      const res = await api.get(`/expenditures/session/${sessionId}/semester/${semester}`);
      setExpenses(res.data);
      setError('');
    } catch {
      setError('Failed to fetch expenses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.post('/expenditures', {
        title: form.title,
        amount: parseFloat(form.amount),
        session: form.sessionId,
        category: form.categoryId,
        description: form.description,
        semester: form.semester,
      });
      setMessage('Expenditure logged!');
      setForm({ ...form, title: '', amount: '', description: '' });

      if (form.sessionId === filterSession && form.semester === filterSemester) {
        fetchExpenses(form.sessionId, form.semester);
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
       // @ts-expect-error: Ignore type error due to legacy API mismatch
        setError(err.response?.data?.message || 'Failed to log expenditure');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to log expenditure');
      }
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setCategoryLoading(true);
    setError('');
    try {
      await api.post('/expenditure-category', { name: newCategory });
      const res = await api.get('/expenditure-category');
      setCategories(res.data);
      setNewCategory('');
      setMessage('Category added!');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
      // @ts-expect-error: Ignore type error due to legacy API mismatch
        setError(err.response?.data?.message || 'Failed to add category');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add category');
      }
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleFilterChange = (sessionId: string, semester: string) => {
    setFilterSession(sessionId);
    setFilterSemester(semester);
  };

  return (
    <div className="admin-expenditures-container">
      <h2 className="admin-expenditures-header">Log Expenditures</h2>

      {error && <p className="admin-expenditures-error">{error}</p>}
      {message && <p className="admin-expenditures-message">{message}</p>}

      <form className="admin-expenditures-form" onSubmit={handleSubmit}>
        <select
          required
          value={form.sessionId}
          onChange={(e) => setForm({ ...form, sessionId: e.target.value })}
          className="admin-expenditures-select"
        >
          <option value="">Select Session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.sessionTitle}
            </option>
          ))}
        </select>

        <select
          required
          value={form.semester}
          onChange={(e) => setForm({ ...form, semester: e.target.value as 'first' | 'second' })}
          className="admin-expenditures-select"
        >
          <option value="">Select Semester</option>
          <option value="first">First Semester</option>
          <option value="second">Second Semester</option>
        </select>

        <select
          required
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="admin-expenditures-select"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Expense Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="admin-expenditures-input"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          className="admin-expenditures-input"
          min="0"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="admin-expenditures-input"
        />
        <button type="submit" disabled={loading} className="admin-expenditures-button">
          {loading ? 'Logging...' : 'Log Expense'}
        </button>
      </form>

      <div className="admin-expenditures-category-add">
        <h4>Add New Category</h4>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="e.g., Maintenance"
          className="admin-expenditures-input"
        />
        <button
          type="button"
          onClick={addCategory}
          disabled={categoryLoading}
          className="admin-expenditures-button"
        >
          {categoryLoading ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      <h3 className="admin-expenditures-subheader">Expenses Table</h3>

      <div className="admin-expenditures-filters">
        <select
          value={filterSession}
          onChange={(e) => handleFilterChange(e.target.value, filterSemester)}
          className="admin-expenditures-select"
        >
          <option value="">Filter by Session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.sessionTitle}
            </option>
          ))}
        </select>

        <select
          value={filterSemester}
          onChange={(e) => handleFilterChange(filterSession, e.target.value)}
          className="admin-expenditures-select"
        >
          <option value="">Filter by Semester</option>
          <option value="first">First Semester</option>
          <option value="second">Second Semester</option>
        </select>
      </div>

      <div className="admin-expenditures-table-wrapper">
        <table className="admin-expenditures-table">
          <thead>
            <tr>
              <th>Session</th>
              <th>Semester</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((ex) => (
              <tr key={ex._id}>
                <td>{ex.session?.sessionTitle || '—'}</td>
                <td>{ex.semester === 'first' ? 'First' : 'Second'}</td>
                <td>{ex.title}</td>
                <td>{ex.category?.name || '—'}</td>
                <td>₦{ex.amount}</td>
                <td>{ex.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
