'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';

interface PersonalInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  level: string;
  matricNo: string;
  profilePictureUrl?: string;
  hostel?: string;
  bunkCode?: string;
}

interface SessionInfo {
  sessionTitle: string;
  currentSemester: 'first' | 'second';
}

interface PaymentStats {
  pending: number;
  waiting_approval: number;
  approved: number;
  rejected: number;
}

interface HeroSectionProps {
  student: {
    firstName: string;
    lastName: string;
    level: string;
    matricNo: string;
  };
}

export default function HeroSection({ student }: HeroSectionProps) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    pending: 0,
    waiting_approval: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch personal info
    api
      .get('/personal-info/me', { headers })
      .then((res) => setPersonalInfo(res.data))
      .catch(() => setPersonalInfo(null));

    // Fetch active session
    api
      .get('/sessions/active', { headers })
      .then((res) => {
        const session: SessionInfo = {
          sessionTitle: res.data.sessionTitle,
          currentSemester: res.data.currentSemester.toLowerCase() as 'first' | 'second',
        };
        setSessionInfo(session);

        // Fetch payment stats for this session & semester
        return api.get('/payments/me/stats', {
          headers,
          params: {
            session: res.data._id,
            semester: res.data.currentSemester.toLowerCase(),
          },
        });
      })
      .then((res) => setPaymentStats(res.data))
      .catch(() => setPaymentStats({ pending: 0, waiting_approval: 0, approved: 0, rejected: 0 }));
  }, []);

  const profileUrl = personalInfo?.profilePictureUrl || '/default-profile.png';

  return (
    <section className="stellar-hero-wrapper">
      <div className="stellar-hero-card">
        {/* Decorative overlay or glow */}
        <div className="stellar-hero-overlay" />
        <div className="stellar-hero-glow" />

        {/* Flex container for profile and stats */}
        <div className="stellar-hero-flex">
          {/* Profile Section */}
          <div className="stellar-profile-container">
            <Image
              src={profileUrl}
              alt={`${student.firstName} ${student.lastName}`}
              width={140}
              height={140}
              className="stellar-profile-picture"
            />
            <div className="stellar-student-info">
              <h2 className="stellar-student-name">{student.firstName} {student.lastName}</h2>
              <p className="stellar-student-level">Level: {student.level}</p>
              <p className="stellar-student-matric">Matric No: {student.matricNo}</p>
              {personalInfo?.hostel && (
                <p className="stellar-student-hostel">
                  Hostel: {personalInfo.hostel} ({personalInfo.bunkCode || '-'})
                </p>
              )}
              {sessionInfo && (
                <p className="stellar-student-session">
                  Session: {sessionInfo.sessionTitle} | Semester: {sessionInfo.currentSemester}
                </p>
              )}
            </div>
          </div>

          {/* Payment Stats */}
          <div className="stellar-payment-stats">
            <div className="stellar-stat-card pending">
              <p className="stellar-stat-count">{paymentStats.pending}</p>
              <p className="stellar-stat-label">Pending</p>
            </div>
            <div className="stellar-stat-card waiting">
              <p className="stellar-stat-count">{paymentStats.waiting_approval}</p>
              <p className="stellar-stat-label">Waiting Approval</p>
            </div>
            <div className="stellar-stat-card approved">
              <p className="stellar-stat-count">{paymentStats.approved}</p>
              <p className="stellar-stat-label">Approved</p>
            </div>
            <div className="stellar-stat-card rejected">
              <p className="stellar-stat-count">{paymentStats.rejected}</p>
              <p className="stellar-stat-label">Rejected</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
