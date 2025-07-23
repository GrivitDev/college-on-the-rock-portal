'use client';
  
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';

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
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    api
      .get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setStudent(res.data))
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
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
          <h2>📚 How to Use the Website - Dos &amp; Don&apos;ts</h2>
           <h3>✅ DOs:</h3>
          <ol>
            <li>Select the correct session and semester first.</li>
            <li>Always initiate payment before sending money.</li>
            <li>Pay the exact amount for each category.</li>
            <li>Use only the account number generated for you.</li>
            <li>Upload each receipt under the correct transaction.</li>
            <li>Ensure receipts are clear and readable.</li>
            <li>Check your payment history for updates.</li>
            <li>Generate receipt only after approval.</li>
            <li>Contact the Portal Team for help if needed.</li>
          </ol>

          <h3>❌ DON’Ts:</h3>
          <ol>
            <li>Don’t pay without initiating the transaction.</li>
            <li>Don’t use one receipt for multiple payments.</li>
            <li>Don’t upload fake or wrong receipts.</li>
            <li>Don’t share your login with anyone.</li>
            <li>Don’t use unstable networks during uploads.</li>
            <li>Don’t delay receipt uploads after payment.</li>
            <li>Don’t panic over rejections — just re-upload.</li>
            <li>Don’t use backdoors or unofficial help.</li>
            <li>Don’t stay logged in on shared devices.</li>
          </ol>

          <div style={{ padding: '1rem', background: '#f8f5f0', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'Playfair Display, serif', color: '#6b4c3b' }}>
              MPT Contact Support
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                '+2349132993979',
                '+2348099892401',
                '+2348121570750',
                '+2348135458607',
                '+2348148135651',
              ].map((number) => (
                <li
                  key={number}
                  style={{
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                  } as React.CSSProperties}
                >
                  {/* Phone icon */}
                  <a
                    href={`tel:${number}`}
                    style={{ marginRight: '10px', fontSize: '20px', textDecoration: 'none' }}
                    title="Call"
                  >
                    📲
                  </a>

                  {/* WhatsApp icon with SVG */}
                  <a
                    href={`https://wa.me/${number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', width: '20px', height: '20px' }}
                    title="Message on WhatsApp"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      fill="#25D366"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <path d="M380.9 97.1C339.3 55.5 282.4 32 221.7 32 104.1 32 7 129.1 7 246.8c0 43.5 11.4 85.9 33 123L0 480l114.2-39.7c35 19.2 74.3 29.4 114.8 29.4 117.6 0 214.7-97.1 214.7-214.7 0-60.7-23.5-117.6-65.1-159.2zM221.7 438c-35.1 0-69.4-9.4-99.4-27.1l-7.1-4.2-67.7 23.5 22.6-70-4.6-7.3c-20.1-31.6-30.7-68.1-30.7-105.1 0-105.2 85.6-190.8 190.8-190.8 51 0 98.9 19.8 134.9 55.8s55.8 83.9 55.8 134.9c0 105.2-85.6 190.8-190.8 190.8zm101.5-138.4c-5.6-2.8-33.3-16.4-38.5-18.3s-8.9-2.8-12.6 2.8-14.4 18.3-17.7 22.1-6.5 4.2-12.1 1.4-23.6-8.7-45-27.8c-16.6-14.8-27.8-33-31-38.6s-.3-8.6 2.1-11.4c2.1-2.8 5.6-7.3 8.4-11s3.7-6.5 5.6-10.9c1.9-4.4.9-8.2-.5-11.4s-12.6-30.2-17.3-41.4c-4.6-11.1-9.3-9.6-12.6-9.8-3.3-.2-7.1-.2-10.9-.2s-10 1.4-15.2 7c-5.2 5.6-19.9 19.5-19.9 47.6s20.4 55.2 23.2 59c2.8 3.7 40.2 61.4 97.4 86.1 13.6 5.9 24.2 9.4 32.5 12s15.6 2.8 21.5 1.7c6.6-1 33.3-13.6 38-26.8 4.7-13.3 4.7-24.7 3.3-27.1z" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>


        </div>

        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
}
