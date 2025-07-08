'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Session {
  _id: string;
  sessionTitle: string;
}

export default function AdminSessions() {
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    api.get('/sessions').then((res) => setSessions(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await api.post('/sessions', { sessionTitle });
    const updated = await api.get('/sessions');
    setSessions(updated.data);
    setSessionTitle('');
  };

  return (
    <div className="admin-main-container">
      <div className="admin-session-container">
        <h2 className="admin-session-title">Create Academic Session</h2>
        <p className="admin-session-instruction">
          Enter the new academic session (e.g. <strong>2023/2024</strong>) below. This will be available across all student and admin dashboards.
        </p>

        <form className="admin-session-form" onSubmit={handleSubmit}>
          <input
            className="admin-session-input"
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="e.g., 2023/2024"
            required
          />
          <button type="submit" className="admin-session-button">
            Create Session
          </button>
        </form>

        <h3 className="admin-session-subtitle">Existing Sessions</h3>
        <ul className="admin-session-list">
          {sessions.map((s) => (
            <li key={s._id} className="admin-session-list-item">
              {s.sessionTitle}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
