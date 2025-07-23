'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api'; // Ensure this points to Axios with auth header

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

  useEffect(() => {
    api.get<User[]>('/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to fetch users.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-users-page">
      <h2 className="page-title">📋 Registered Users</h2>

      {loading && <p>Loading users...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p>No registered users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
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
                {users.map((u, index) => (
                    <tr key={u._id}>
                    <td data-label="#"> {index + 1}</td>
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
    </div>
  );
}
