'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaBars, FaTimes, FaQuestionCircle, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { MdInfo, MdPayment, MdHistory } from 'react-icons/md';
import api from '@/lib/api';

// Components (import your other dashboard sections here)
import HeroSection from './components/StudentCarousel';
import NewsUpdates from './components/NewsSection';
import ExecutivesSection from './components/ExecutivesSection';
import HallOfFamers from './components/HallOfFamers';

interface Student {
  firstName: string;
  lastName: string;
  level: string;
  matricNo: string;
  whatsappNumber: string;
  profilePictureUrl?: string;
}

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return router.push('/login');

    api
      .get('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStudent(res.data))
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const supportNumbers = [
    '+2349132993979',
    '+2348099892401',
    '+2348121570750',
    '+2348135458607',
    '+2348148135651',
  ];

  return (
    <div className="dashboard-page-wrapper">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        {/* Mobile Hamburger */}
        <button
          className="dashboard-navbar__hamburger"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>


        {/* Desktop & Mobile Links */}
        <ul
          className={`dashboard-navbar__links ${
            mobileNavOpen ? 'dashboard-navbar__links--open' : ''
          }`}
        >
          <li>
            <a href="/dashboard/personal-info">
              <MdInfo size={18} /> Personal Info
            </a>
          </li>
          <li>
            <a href="/dashboard/make-payment">
              <MdPayment size={18} /> Payments
            </a>
          </li>
          <li>
            <a href="/dashboard/upload-receipt">
              <MdInfo size={18} /> Payment Approval
            </a>
          </li>
          <li>
            <a href="/dashboard/payment-history">
              <MdHistory size={18} /> History & Receipts
            </a>
          </li>

          {/* Help with popup */}
          <li className="dashboard-navbar__help-wrapper">
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              onMouseEnter={() => setHelpOpen(true)}
              onMouseLeave={() => setHelpOpen(false)}
              className="dashboard-navbar__help-btn"
            >
              <FaQuestionCircle size={20} />
            </button>
            {helpOpen && (
              <div className="dashboard-navbar__help-popup">
                <h4>Support Contacts</h4>
                <ul>
                  {supportNumbers.map((num, idx) => (
                    <li key={idx} className="dashboard-navbar__help-item">
                      <span>Support {idx + 1}: {num}</span>
                      <div className="dashboard-navbar__help-actions">
                        <a href={`tel:${num}`} title="Call">
                          <FaPhoneAlt />
                        </a>
                        <a
                          href={`https://wa.me/${num.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                        >
                          <FaWhatsapp color="green" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>

          <li>
            <button onClick={handleLogout} className="dashboard-navbar__logout-btn">
              Logout
            </button>
          </li>
        </ul>


        {/* Logo on right */}
        <div className="dashboard-navbar__logo">
          <Image src="/logo.png" alt="BCCT Logo" width={60} height={60} />
        </div>
      </nav>

      {/* Hero Section */}
      {student && <HeroSection student={student} />}

      {/* Welcome Address */}
      <section className="dashboard-welcome-address">
        <h2>Welcome to Bishop Crowther College of Theology Portal</h2>
        <p>
          We are thrilled to have you on board. Here, you can manage your payments, track your academic progress, and stay up to date with all institutional news. Explore the sections below to get started!
        </p>
      </section>

      {/* Other Sections */}
      <NewsUpdates />
      <ExecutivesSection />
      <HallOfFamers />
    </div>
  );
}
