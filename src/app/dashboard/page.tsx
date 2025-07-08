'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Student {
  firstName: string;
  lastName: string;
  level: string;
  matricNo: string;
  whatsappNumber: string;
}

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('https://bcct-student-body.onrender.com/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data: Student) => setStudent(data))
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('access_token');
    router.push('/login');
  };

  return (
    <div className="student-dashboard-wrapper">
      <div className="student-dashboard-container">
        <header className="student-dashboard-header">
          <Image
            src="/logo.png"
            alt="BCCT Logo"
            width={200}
            height={200}
            className="student-dashboard-logo"
          />
          <h2 className="student-dashboard-institution">
            Bishop Crowther College Of Theology, Okenne, Kogi State
          </h2>
        </header>

        <h2 className="student-dashboard-title">Student Dashboard</h2>

        {student && (
          <div className="student-info">
            <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
            <p><strong>Level:</strong> {student.level}</p>
            <p><strong>Matric No:</strong> {student.matricNo}</p>
            <p><strong>Phone:</strong> {student.whatsappNumber}</p>
          </div>
        )}

        <ul className="student-dashboard-links">
          <li><a href="/dashboard/make-payment">Make a Payment</a></li>
          <li><a href="/dashboard/upload-receipt">Upload Receipt</a></li>
          <li><a href="/dashboard/payment-history">View Payment History</a></li>
        </ul>

        <div className="student-instructions" role="region" aria-label="Student instructions">
          <h3>📚 How to Use the Website - Dos &amp; Don&apos;ts</h3>
          <ol>
            <li>✅ Always keep your login details safe and never share them with others.</li>
            <li>✅ Use the payment portal only for authorized transactions related to your studies.</li>
            <li>✅ Upload payment receipts immediately after making payments for quicker processing.</li>
            <li>✅ Check your payment history regularly to confirm all transactions are recorded.</li>
            <li>✅ Contact support immediately if you notice any incorrect payment records.</li>
            <li>✅ Use only supported browsers for best website experience (Chrome, Firefox, Edge).</li>
            <li>❌ Don&apos;t refresh pages during payment or upload processes to avoid errors.</li>
            <li>❌ Don&apos;t share your payment receipts or personal data publicly or with unauthorized persons.</li>
            <li>❌ Avoid using public or unsecured Wi-Fi when accessing your dashboard for security.</li>
            <li>❌ Don&apos;t try to bypass or hack the payment system — it is monitored for security.</li>
            <li>✅ Always log out after finishing your session, especially on shared devices.</li>
          </ol>
        </div>

        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
}
