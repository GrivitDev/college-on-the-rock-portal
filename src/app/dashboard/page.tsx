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
          </div>
  
<div style="background-color:#f8f5f0; padding:1.5rem; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.05); font-family:sans-serif; color:#6b4c3b;">
  <h3 style="margin-bottom:1rem; font-size:1.4rem; display:flex; align-items:center; gap:0.5rem;">
    📞 MPT Contact Support
  </h3>
  <ul style="list-style:none; padding:0; margin:0;">
    <li style="margin-bottom:0.8rem; display:flex; align-items:center; justify-content:space-between;">
      <span>+234 913 299 3979</span>
      <a href="https://wa.me/2349132993979" target="_blank" style="display:inline-flex; align-items:center;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" viewBox="0 0 32 32" width="24" height="24">
          <path d="M16.04 3.004c-7.188 0-13.004 5.816-13.004 13.004 0 2.297.602 4.551 1.742 6.52l-1.83 6.684 6.855-1.789c1.875 1.012 3.992 1.547 6.191 1.547h.047c7.164 0 12.977-5.82 12.977-13.004s-5.813-13.004-13.004-13.004zm.004 23.73h-.039c-1.883 0-3.719-.488-5.344-1.418l-.383-.223-4.07 1.063 1.086-3.961-.25-.41c-1.086-1.789-1.656-3.836-1.656-5.922 0-6.172 5.027-11.203 11.199-11.203 2.992 0 5.805 1.164 7.902 3.27s3.273 4.91 3.273 7.902c0 6.18-5.027 11.203-11.199 11.203zm6.113-8.293c-.34-.172-2.016-.996-2.332-1.109-.316-.117-.547-.172-.777.18-.234.348-.898 1.109-1.102 1.34-.203.234-.398.262-.738.09-.34-.172-1.43-.527-2.719-1.68-1.004-.891-1.684-1.988-1.879-2.324-.195-.34-.02-.523.148-.695.152-.152.34-.395.512-.59.172-.203.227-.34.34-.57.117-.234.059-.43-.027-.602-.09-.172-.777-1.887-1.066-2.59-.281-.68-.566-.59-.777-.598l-.66-.012c-.227 0-.594.086-.906.43-.316.348-1.195 1.168-1.195 2.848s1.223 3.305 1.391 3.531c.172.227 2.406 3.668 5.828 5.148.816.352 1.453.562 1.949.719.82.262 1.566.223 2.156.137.656-.098 2.016-.824 2.301-1.617.285-.797.285-1.48.203-1.617-.086-.137-.312-.219-.648-.391z"/>
        </svg>
      </a>
    </li>
    <li style="margin-bottom:0.8rem; display:flex; align-items:center; justify-content:space-between;">
      <span>+234 809 989 2401</span>
      <a href="https://wa.me/2348099892401" target="_blank" style="display:inline-flex; align-items:center;">
        <svg fill="#25D366" viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
   <path d="M16.04 3.004c-7.188 0-13.004 5.816-13.004 13.004 0 2.297.602 4.551 1.742 6.52l-1.83 6.684 6.855-1.789c1.875 1.012 3.992 1.547 6.191 1.547h.047c7.164 0 12.977-5.82 12.977-13.004s-5.813-13.004-13.004-13.004zm.004 23.73h-.039c-1.883 0-3.719-.488-5.344-1.418l-.383-.223-4.07 1.063 1.086-3.961-.25-.41c-1.086-1.789-1.656-3.836-1.656-5.922 0-6.172 5.027-11.203 11.199-11.203 2.992 0 5.805 1.164 7.902 3.27s3.273 4.91 3.273 7.902c0 6.18-5.027 11.203-11.199 11.203zm6.113-8.293c-.34-.172-2.016-.996-2.332-1.109-.316-.117-.547-.172-.777.18-.234.348-.898 1.109-1.102 1.34-.203.234-.398.262-.738.09-.34-.172-1.43-.527-2.719-1.68-1.004-.891-1.684-1.988-1.879-2.324-.195-.34-.02-.523.148-.695.152-.152.34-.395.512-.59.172-.203.227-.34.34-.57.117-.234.059-.43-.027-.602-.09-.172-.777-1.887-1.066-2.59-.281-.68-.566-.59-.777-.598l-.66-.012c-.227 0-.594.086-.906.43-.316.348-1.195 1.168-1.195 2.848s1.223 3.305 1.391 3.531c.172.227 2.406 3.668 5.828 5.148.816.352 1.453.562 1.949.719.82.262 1.566.223 2.156.137.656-.098 2.016-.824 2.301-1.617.285-.797.285-1.48.203-1.617-.086-.137-.312-.219-.648-.391z"/>
</svg>
      </a>
    </li>
    <li style="margin-bottom:0.8rem; display:flex; align-items:center; justify-content:space-between;">
      <span>+234 812 157 0750</span>
      <a href="https://wa.me/2348121570750" target="_blank" style="display:inline-flex; align-items:center;">
        <svg fill="#25D366" viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
 <path d="M16.04 3.004c-7.188 0-13.004 5.816-13.004 13.004 0 2.297.602 4.551 1.742 6.52l-1.83 6.684 6.855-1.789c1.875 1.012 3.992 1.547 6.191 1.547h.047c7.164 0 12.977-5.82 12.977-13.004s-5.813-13.004-13.004-13.004zm.004 23.73h-.039c-1.883 0-3.719-.488-5.344-1.418l-.383-.223-4.07 1.063 1.086-3.961-.25-.41c-1.086-1.789-1.656-3.836-1.656-5.922 0-6.172 5.027-11.203 11.199-11.203 2.992 0 5.805 1.164 7.902 3.27s3.273 4.91 3.273 7.902c0 6.18-5.027 11.203-11.199 11.203zm6.113-8.293c-.34-.172-2.016-.996-2.332-1.109-.316-.117-.547-.172-.777.18-.234.348-.898 1.109-1.102 1.34-.203.234-.398.262-.738.09-.34-.172-1.43-.527-2.719-1.68-1.004-.891-1.684-1.988-1.879-2.324-.195-.34-.02-.523.148-.695.152-.152.34-.395.512-.59.172-.203.227-.34.34-.57.117-.234.059-.43-.027-.602-.09-.172-.777-1.887-1.066-2.59-.281-.68-.566-.59-.777-.598l-.66-.012c-.227 0-.594.086-.906.43-.316.348-1.195 1.168-1.195 2.848s1.223 3.305 1.391 3.531c.172.227 2.406 3.668 5.828 5.148.816.352 1.453.562 1.949.719.82.262 1.566.223 2.156.137.656-.098 2.016-.824 2.301-1.617.285-.797.285-1.48.203-1.617-.086-.137-.312-.219-.648-.391z"/>
</svg>
      </a>
    </li>
    <li style="margin-bottom:0.8rem; display:flex; align-items:center; justify-content:space-between;">
      <span>+234 813 545 8607</span>
      <a href="https://wa.me/2348135458607" target="_blank" style="display:inline-flex; align-items:center;">
        <svg fill="#25D366" viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
   <path d="M16.04 3.004c-7.188 0-13.004 5.816-13.004 13.004 0 2.297.602 4.551 1.742 6.52l-1.83 6.684 6.855-1.789c1.875 1.012 3.992 1.547 6.191 1.547h.047c7.164 0 12.977-5.82 12.977-13.004s-5.813-13.004-13.004-13.004zm.004 23.73h-.039c-1.883 0-3.719-.488-5.344-1.418l-.383-.223-4.07 1.063 1.086-3.961-.25-.41c-1.086-1.789-1.656-3.836-1.656-5.922 0-6.172 5.027-11.203 11.199-11.203 2.992 0 5.805 1.164 7.902 3.27s3.273 4.91 3.273 7.902c0 6.18-5.027 11.203-11.199 11.203zm6.113-8.293c-.34-.172-2.016-.996-2.332-1.109-.316-.117-.547-.172-.777.18-.234.348-.898 1.109-1.102 1.34-.203.234-.398.262-.738.09-.34-.172-1.43-.527-2.719-1.68-1.004-.891-1.684-1.988-1.879-2.324-.195-.34-.02-.523.148-.695.152-.152.34-.395.512-.59.172-.203.227-.34.34-.57.117-.234.059-.43-.027-.602-.09-.172-.777-1.887-1.066-2.59-.281-.68-.566-.59-.777-.598l-.66-.012c-.227 0-.594.086-.906.43-.316.348-1.195 1.168-1.195 2.848s1.223 3.305 1.391 3.531c.172.227 2.406 3.668 5.828 5.148.816.352 1.453.562 1.949.719.82.262 1.566.223 2.156.137.656-.098 2.016-.824 2.301-1.617.285-.797.285-1.48.203-1.617-.086-.137-.312-.219-.648-.391z"/>
</svg>
      </a>
    </li>
    <li style="display:flex; align-items:center; justify-content:space-between;">
      <span>+234 814 813 5651</span>
      <a href="https://wa.me/2348148135651" target="_blank" style="display:inline-flex; align-items:center;">
        <svg fill="#25D366" viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
   <path d="M16.04 3.004c-7.188 0-13.004 5.816-13.004 13.004 0 2.297.602 4.551 1.742 6.52l-1.83 6.684 6.855-1.789c1.875 1.012 3.992 1.547 6.191 1.547h.047c7.164 0 12.977-5.82 12.977-13.004s-5.813-13.004-13.004-13.004zm.004 23.73h-.039c-1.883 0-3.719-.488-5.344-1.418l-.383-.223-4.07 1.063 1.086-3.961-.25-.41c-1.086-1.789-1.656-3.836-1.656-5.922 0-6.172 5.027-11.203 11.199-11.203 2.992 0 5.805 1.164 7.902 3.27s3.273 4.91 3.273 7.902c0 6.18-5.027 11.203-11.199 11.203zm6.113-8.293c-.34-.172-2.016-.996-2.332-1.109-.316-.117-.547-.172-.777.18-.234.348-.898 1.109-1.102 1.34-.203.234-.398.262-.738.09-.34-.172-1.43-.527-2.719-1.68-1.004-.891-1.684-1.988-1.879-2.324-.195-.34-.02-.523.148-.695.152-.152.34-.395.512-.59.172-.203.227-.34.34-.57.117-.234.059-.43-.027-.602-.09-.172-.777-1.887-1.066-2.59-.281-.68-.566-.59-.777-.598l-.66-.012c-.227 0-.594.086-.906.43-.316.348-1.195 1.168-1.195 2.848s1.223 3.305 1.391 3.531c.172.227 2.406 3.668 5.828 5.148.816.352 1.453.562 1.949.719.82.262 1.566.223 2.156.137.656-.098 2.016-.824 2.301-1.617.285-.797.285-1.48.203-1.617-.086-.137-.312-.219-.648-.391z"/>
</svg>
      </a>
    </li>
  </ul>
</div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    );
  }
  