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

<div style="background-color: #f8f5f0; padding: 1.5rem; border-radius: 10px; font-family: 'Arial', sans-serif; color: #6b4c3b; font-size: 1rem;">
  <h3 style="margin-bottom: 1rem;">📲 MPT Contact Support</h3>
  <ul style="list-style: none; padding: 0; margin: 0;">
    <li style="margin-bottom: 0.8rem;">
      📲 <a href="tel:+2349132993979" style="color: #6b4c3b; text-decoration: none;">+234 913 299 3979</a> |
      <a href="https://wa.me/2349132993979" target="_blank" style="color: #6b4c3b; text-decoration: none;">WhatsApp</a>
    </li>
    <li style="margin-bottom: 0.8rem;">
      📲 <a href="tel:+2348099892401" style="color: #6b4c3b; text-decoration: none;">+234 809 989 2401</a> |
      <a href="https://wa.me/2348099892401" target="_blank" style="color: #6b4c3b; text-decoration: none;">WhatsApp</a>
    </li>
    <li style="margin-bottom: 0.8rem;">
      📲 <a href="tel:+2348121570750" style="color: #6b4c3b; text-decoration: none;">+234 812 157 0750</a> |
      <a href="https://wa.me/2348121570750" target="_blank" style="color: #6b4c3b; text-decoration: none;">WhatsApp</a>
    </li>
    <li style="margin-bottom: 0.8rem;">
      📲 <a href="tel:+2348135458607" style="color: #6b4c3b; text-decoration: none;">+234 813 545 8607</a> |
      <a href="https://wa.me/2348135458607" target="_blank" style="color: #6b4c3b; text-decoration: none;">WhatsApp</a>
    </li>
    <li style="margin-bottom: 0.8rem;">
      📲 <a href="tel:+2348148135651" style="color: #6b4c3b; text-decoration: none;">+234 814 813 5651</a> |
      <a href="https://wa.me/2348148135651" target="_blank" style="color: #6b4c3b; text-decoration: none;">WhatsApp</a>
    </li>
  </ul>
</div>
          </div>
  
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    );
  }
  