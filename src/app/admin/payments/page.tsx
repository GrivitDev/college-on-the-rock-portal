'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Session {
  _id: string;
  sessionTitle: string;
}

interface Category {
  _id: string;
  title: string;
}

interface Payment {
  _id: string;
  createdAt: string;
  studentId: {
    firstName: string;
    lastName: string;
    matricNo: string;
    level: string;
  };  
  categoryId: {
    title: string;
  };
  total: number;
  status: 'waiting_approval' | 'approved' | 'rejected';
  receiptUrl?: string;
  items: { name: string; amount: number }[];
}

interface ConfirmModalData {
  id: string;
  action: 'approve' | 'reject';
}

export default function AdminPayments() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'first' | 'second' | ''>('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState<ConfirmModalData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    api.get<Session[]>('/sessions').then(r => setSessions(r.data));
    api.get<Category[]>('/payment-category').then(r => setCategories(r.data));
  }, []);

  useEffect(() => {
    if (!selectedSession || !selectedSemester) return setPayments([]);

    const q = new URLSearchParams({
      session: selectedSession,
      semester: selectedSemester,
      ...(filterStatus && { status: filterStatus }),
      ...(filterCategory && { category: filterCategory }),
      ...(filterLevel && { level: filterLevel }),
    });

    api.get<Payment[]>(`/payments/admin?${q.toString()}`)
      .then(r => setPayments(r.data))
      .catch(() => setPayments([]));
  }, [selectedSession, selectedSemester, filterStatus, filterCategory, filterLevel]);

  const handleConfirm = async () => {
    if (!confirmModal) return;

    try {
      const { id, action } = confirmModal;

      if (action === 'approve') {
        await api.patch(`/payments/approve/${id}`);
      } else {
        if (!rejectionReason.trim()) {
          alert('Rejection reason is required.');
          return;
        }
        await api.patch(`/payments/reject/${id}`, { reason: rejectionReason });
      }

      setMessage(`Payment ${action}d successfully.`);
      setPayments(prev => prev.filter(p => p._id !== confirmModal.id));
    } catch {
      setMessage(`Failed to ${confirmModal.action} payment.`);
    } finally {
      setConfirmModal(null);
      setRejectionReason('');
    }
  };

  return (
    <div className="admin-payments-page-wrapper">
      <div className="admin-payments-container">
      <h2 className="admin-payments-header">Payment Approvals</h2>


        <div className="admin-payments-filters">
          <select value={selectedSession} onChange={e => {
            setSelectedSession(e.target.value);
            setSelectedSemester('');
          }}>
            <option value="">Select Session</option>
            {sessions.map(s => <option key={s._id} value={s._id}>{s.sessionTitle}</option>)}
          </select>

          {selectedSession && (
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value as 'first' | 'second')}
            >
              <option value="">Select Semester</option>
              <option value="first">First Semester</option>
              <option value="second">Second Semester</option>
            </select>
          )}

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="waiting_approval">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>

          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
            <option value="">All Levels</option>
            {['100', '200', '300', '400'].map(l => <option key={l} value={l}>Level {l}</option>)}
          </select>
        </div>

        {message && <p className="admin-payments-message">{message}</p>}

        {selectedSession && selectedSemester ? (
          <>
            <h3 className="admin-payments-view">All Payments</h3>
            <table className="admin-payments-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Matric No</th>
                  <th>Name</th>
                  <th>Level</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <React.Fragment key={p._id}>
                    <tr
                      onClick={() =>
                        setExpandedPaymentId(prev => (prev === p._id ? null : p._id))
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>{p.studentId.matricNo}</td>
                      <td>{p.studentId.firstName} {p.studentId.lastName}</td>
                      <td>{p.studentId.level}</td>
                      <td>{p.categoryId.title}</td>
                      <td>₦{p.total}</td>
                      <td>{p.status}</td>
                    </tr>
                    {expandedPaymentId === p._id && (
                      <tr className="admin-payments-expanded-row">
                        <td colSpan={7}>
                          <strong>Payment Items:</strong>
                          <ul>
                            {p.items.map(item => (
                              <li key={item.name}>{item.name} — ₦{item.amount}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {payments.filter(p => p.status === 'waiting_approval').length > 0 && (
              <>
                <h3 className="admin-payments-view">Pending Approval</h3>
                <div className="admin-payments-card-grid">
                  {payments
                    .filter(p => p.status === 'waiting_approval')
                    .map(p => (
                      <div key={p._id} className="admin-payments-card">
                        <p><strong>Matric:</strong> {p.studentId.matricNo}</p>
                        <p><strong>Name:</strong> {p.studentId.firstName} {p.studentId.lastName}</p>
                        <p><strong>Level:</strong> {p.studentId.level}</p>
                        <p><strong>Category:</strong> {p.categoryId.title}</p>
                        <p><strong>Amount:</strong> ₦{p.total}</p>
                        <p><strong>Date:</strong> {new Date(p.createdAt).toLocaleString()}</p>
                        <p>
                          <strong>Receipt:</strong>{' '}
                          {p.receiptUrl ? (
                            <a href={p.receiptUrl} target="_blank" rel="noreferrer">View</a>
                          ) : '—'}
                        </p>
                        <ul>
                          {p.items.map(item => (
                            <li key={item.name}>{item.name} — ₦{item.amount}</li>
                          ))}
                        </ul>
                        <div className="admin-payments-actions">
                          <button onClick={() => setConfirmModal({ id: p._id, action: 'approve' })}>Approve</button>
                          <button onClick={() => setConfirmModal({ id: p._id, action: 'reject' })}>Reject</button>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
            Please select both session and semester to view payments.
          </p>
        )}

        {confirmModal && (
          <div className="admin-payments-modal-overlay">
            <div className="admin-payments-modal-content">
              <h3 className="admin-payments-view  ">Confirm {confirmModal.action === 'approve' ? 'Approval' : 'Rejection'}</h3>
              <p>Are you sure you want to {confirmModal.action} this payment?</p>

              {confirmModal.action === 'reject' && (
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason"
                  rows={3}
                />
              )}

              <div className="admin-payments-modal-actions">
                <button onClick={handleConfirm}>Yes</button>
                <button onClick={() => {
                  setConfirmModal(null);
                  setRejectionReason('');
                }}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
