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

<div style="padding: 1rem; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; max-width: 400px; font-family: sans-serif;">
  <h3 style="margin-bottom: 1rem; font-size: 1.2rem; color: #333;">📞 MPT Contact Support</h3>

  <ul style="list-style: none; padding: 0; margin: 0;">
    <!-- Contact 1 -->
    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;">
      <a href="tel:+2349132993979" style="text-decoration: none;">
        📞
      </a>
      <a href="https://wa.me/2349132993979" style="text-decoration: none;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" width="20" height="20" viewBox="0 0 32 32">
          <path d="M16.001 2.884c-7.278 0-13.183 5.906-13.183 13.183 0 2.324.607 4.594 1.76 6.598l-1.854 6.765 6.957-1.826a13.15 13.15 0 0 0 6.32 1.615h.001c7.277 0 13.183-5.906 13.183-13.184 0-3.523-1.372-6.833-3.864-9.325a13.157 13.157 0 0 0-9.32-3.826zm0 24.06a11.764 11.764 0 0 1-5.983-1.615l-.43-.254-4.134 1.087 1.103-4.045-.28-.464a11.757 11.757 0 0 1-1.81-6.259c0-6.504 5.29-11.793 11.794-11.793 3.15 0 6.11 1.228 8.34 3.458 2.23 2.23 3.458 5.19 3.458 8.34 0 6.505-5.29 11.795-11.795 11.795zm6.477-8.852c-.354-.177-2.095-1.033-2.418-1.152-.322-.118-.557-.177-.793.177s-.91 1.152-1.118 1.39c-.207.237-.412.266-.766.089-.354-.178-1.497-.552-2.85-1.76-1.053-.942-1.764-2.105-1.97-2.46-.207-.354-.022-.545.155-.722.159-.158.354-.412.532-.619.177-.207.236-.355.354-.592.118-.237.06-.444-.03-.62-.089-.177-.793-1.918-1.086-2.626-.285-.685-.574-.59-.793-.6l-.677-.011c-.237 0-.62.088-.945.414s-1.242 1.213-1.242 2.959c0 1.745 1.27 3.429 1.447 3.666.177.237 2.497 3.812 6.052 5.338.845.365 1.504.582 2.017.745.847.269 1.616.231 2.225.14.678-.101 2.095-.855 2.39-1.68.295-.826.295-1.535.207-1.68-.089-.147-.322-.236-.677-.414z"/>
        </svg>
      </a>
      <span style="font-size: 0.95rem; color: #333;">+234 913 299 3979</span>
    </li>

    <!-- Repeat for each contact -->
    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;">
      <a href="tel:+2348099892401">📞</a>
      <a href="https://wa.me/2348099892401">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" width="20" height="20" viewBox="0 0 32 32">
          <path d="..."/> <!-- Same path as above -->
        </svg>
      </a>
      <span style="font-size: 0.95rem; color: #333;">+234 809 989 2401</span>
    </li>

    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;">
      <a href="tel:+2348121570750">📞</a>
      <a href="https://wa.me/2348121570750">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" width="20" height="20" viewBox="0 0 32 32">
          <path d="..."/>
        </svg>
      </a>
      <span style="font-size: 0.95rem; color: #333;">+234 812 157 0750</span>
    </li>

    <li style="margin-bottom: 0.8rem; display: flex; align-items: center; gap: 10px;">
      <a href="tel:+2348135458607">📞</a>
      <a href="https://wa.me/2348135458607">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" width="20" height="20" viewBox="0 0 32 32">
          <path d="..."/>
        </svg>
      </a>
      <span style="font-size: 0.95rem; color: #333;">+234 813 545 8607</span>
    </li>

    <li style="display: flex; align-items: center; gap: 10px;">
      <a href="tel:+2348148135651">📞</a>
      <a href="https://wa.me/2348148135651">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" width="20" height="20" viewBox="0 0 32 32">
          <path d="..."/>
        </svg>
      </a>
      <span style="font-size: 0.95rem; color: #333;">+234 814 813 5651</span>
    </li>
  </ul>
</div>
          </div>
  
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    );
  }
  