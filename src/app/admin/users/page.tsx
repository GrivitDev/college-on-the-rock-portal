'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import '@/styles/users.css'

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  matricNo: string;
  level: string;
  whatsappNumber: string;
};

export default function RegisteredUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  useEffect(() => {
    api.get<User[]>('/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to fetch users.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers =
    levelFilter === 'all'
      ? users
      : users.filter(u => u.level === levelFilter);

  return (
    <div className="admin-users-page">
      <h2 className="page-title">📋 Registered Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <>
          <div className="filter-controls">
            <label htmlFor="level-filter">Filter by Level:</label>
            <select
              id="level-filter"
              className="custom-select"
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
          </div>

          {filteredUsers.length === 0 ? (
            <p>No users found for this level.</p>
          ) : (
            <div className="table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Matric No</th>
                    <th>Level</th>
                    <th>WhatsApp Number</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, index) => (
                    <tr key={u._id}>
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Full Name">{u.firstName} {u.lastName}</td>
                      <td data-label="Matric No">{u.matricNo}</td>
                      <td data-label="Level">{u.level}</td>
                      <td data-label="WhatsApp">{u.whatsappNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
