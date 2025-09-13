'use client';

import Image from 'next/image';

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <div className="admin-header-branding">
        <Image
          src="/logo.png"
          alt="BCCT Logo"
          width={220}
          height={220}
          className="admin-logo"
        />
        <h2 className="admin-institution">
          Bishop Crowther College Of Theology, Okenne, Kogi State
        </h2>
      </div>

      <h3 className="admin-dashboard-heading">Admin Dashboard</h3>

      <ul className="admin-links-list">
        <li><a href="/admin/users">Registered users</a></li>
        <li><a href="/admin/sessions">Create Academic Session</a></li>
        <li><a href="/admin/categories">Manage Payment Categories</a></li>
        <li><a href="/admin/payments">Approve Payments</a></li>
        <li><a href="/admin/expenditures">Log Expenditures</a></li>
        <li><a href="/admin/student-management">Student Details Management </a></li>
        <li><a href="/admin/reports">Export Reports</a></li>
      </ul>
    </div>
  );
}
