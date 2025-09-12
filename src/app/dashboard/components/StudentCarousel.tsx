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
  currentSession?: string;
  currentSemester?: 'first' | 'second';
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

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    api
      .get('/personal-info/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPersonalInfo(res.data))
      .catch(() => setPersonalInfo(null));
  }, []);

  const profileUrl =
    personalInfo?.profilePictureUrl || '/default-profile.png'; // fallback default

  return (
    <section className="hero-section-wrapper">
      <div className="hero-section-card">
        <div className="hero-section-image">
          <Image
            src={profileUrl}
            alt={`${student.firstName} ${student.lastName}`}
            width={120}
            height={120}
            className="hero-profile-picture"
          />
        </div>

        <div className="hero-section-info">
          <h2 className="hero-student-name">
            {student.firstName} {student.lastName}
          </h2>
          <p className="hero-student-level">
            Level: {student.level}
          </p>
          <p className="hero-student-matric">
            Matric No: {student.matricNo}
          </p>

          {personalInfo?.hostel && (
            <p className="hero-student-hostel">
              Hostel: {personalInfo.hostel} ({personalInfo.bunkCode || '-'})
            </p>
          )}

          {personalInfo?.currentSession && personalInfo?.currentSemester && (
            <p className="hero-student-session">
              Session: {personalInfo.currentSession} | Semester: {personalInfo.currentSemester}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
