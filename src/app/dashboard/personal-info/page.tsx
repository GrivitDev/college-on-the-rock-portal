'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import api from '@/lib/api'; 

type User = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  matricNo: string;
  level: string;
  whatsappNumber: string;
  role: string;
};

type PersonalInfo = {
  userId?: string;
  dateOfBirth?: string;
  tutorialGroup?: string;
  hostel?: string;
  bunkCode?: string;
  phone?: string;
  email?: string;
  emergencyContact?: string;
  genotype?: string;
  bloodGroup?: string;
  allergies?: string;
  profilePictureUrl?: string;
  currentSession?: string | null;
  currentSemester?: 'first' | 'second' | null;
};

export default function StudentPersonalInfoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [info, setInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [uRes, pRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/personal-info/me'),
        ]);
        setUser(uRes.data);
        setInfo(pRes.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSaveProfile() {
    if (!user) return;
    setSavingProfile(true);
    try {
      // Update user editable fields
      await api.patch(`/users/${user._id}`, {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        whatsappNumber: user.whatsappNumber,
      });

      // Update personal info
      await api.patch('/personal-info', {
        dateOfBirth: info?.dateOfBirth,
        tutorialGroup: info?.tutorialGroup,
        hostel: info?.hostel,
        bunkCode: info?.bunkCode,
        phone: info?.phone,
        email: info?.email,
        emergencyContact: info?.emergencyContact,
        genotype: info?.genotype,
        bloodGroup: info?.bloodGroup,
        allergies: info?.allergies,
      });

      alert('Profile saved successfully');
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleProfilePictureSelect(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPicture(true);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.patch('/personal-info/profile-picture', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setInfo(res.data);
      alert('Profile picture updated');
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload profile picture');
    } finally {
      setUploadingPicture(false);
    }
  }

  function handleRedirectToResetPassword() {
    router.push('/reset-password');
  }

  if (loading) return <div className="student-page__loading">Loading…</div>;

  return (
    <div className="student-page__container">
      <h1 className="student-page__title">My Personal Information</h1>

      {/* Profile Picture & Basic Info */}
      <section className="student-page__profile-block">
        <div className="student-page__avatar-wrap">
            <div className="student-page__avatar-img-wrap">
            <Image
                src={info?.profilePictureUrl || '/default-profile.png'}
                alt="profile"
                fill
                className="student-page__avatar-img"
            />
            </div>
          <label className="student-page__avatar-upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureSelect}
              className="student-page__avatar-input"
            />
            <span className="student-page__avatar-btn">
              {uploadingPicture ? 'Uploading…' : 'Change Picture'}
            </span>
          </label>
        </div>

        <div className="student-page__basic-fields">
          <label className="student-page__label">First name</label>
          <input
            className="student-page__input"
            value={user?.firstName || ''}
            onChange={(e) =>
              setUser((u) => u && { ...u, firstName: e.target.value })
            }
          />

          <label className="student-page__label">Middle name</label>
          <input
            className="student-page__input"
            value={user?.middleName || ''}
            onChange={(e) =>
              setUser((u) => u && { ...u, middleName: e.target.value })
            }
          />

          <label className="student-page__label">Last name</label>
          <input
            className="student-page__input"
            value={user?.lastName || ''}
            onChange={(e) =>
              setUser((u) => u && { ...u, lastName: e.target.value })
            }
          />

          <label className="student-page__label">Matric number</label>
          <p className="student-page__readonly">{user?.matricNo}</p>

          <label className="student-page__label">Level</label>
          <p className="student-page__readonly">{user?.level}</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="student-page__contact-block">
        <h2 className="student-page__section-title">Contact</h2>

        <label className="student-page__label">WhatsApp Number</label>
        <input
          className="student-page__input"
          value={user?.whatsappNumber || ''}
          onChange={(e) =>
            setUser((u) => u && { ...u, whatsappNumber: e.target.value })
          }
        />

        <label className="student-page__label">Phone</label>
        <input
          className="student-page__input"
          value={info?.phone || ''}
          onChange={(e) =>
            setInfo((p) => ({ ...(p || {}), phone: e.target.value }))
          }
        />

        <label className="student-page__label">Email</label>
        <input
          className="student-page__input"
          value={info?.email || ''}
          onChange={(e) =>
            setInfo((p) => ({ ...(p || {}), email: e.target.value }))
          }
        />

        <label className="student-page__label">Emergency contact</label>
        <input
          className="student-page__input"
          value={info?.emergencyContact || ''}
          onChange={(e) =>
            setInfo((p) => ({
              ...(p || {}),
              emergencyContact: e.target.value,
            }))
          }
        />
      </section>

      {/* Health Section */}
      <section className="student-page__health-block">
        <h2 className="student-page__section-title">Health</h2>

        <label className="student-page__label">Genotype</label>
        <input
          className="student-page__input"
          value={info?.genotype || ''}
          onChange={(e) =>
            setInfo((p) => ({ ...(p || {}), genotype: e.target.value }))
          }
        />

        <label className="student-page__label">Blood group</label>
        <input
          className="student-page__input"
          value={info?.bloodGroup || ''}
          onChange={(e) =>
            setInfo((p) => ({ ...(p || {}), bloodGroup: e.target.value }))
          }
        />

        <label className="student-page__label">Allergies</label>
        <input
          className="student-page__input"
          value={info?.allergies || ''}
          onChange={(e) =>
            setInfo((p) => ({ ...(p || {}), allergies: e.target.value }))
          }
        />
      </section>

      <div className="student-page__actions">
        <button
          className="student-page__save-btn"
          onClick={handleSaveProfile}
          disabled={savingProfile}
        >
          {savingProfile ? 'Saving…' : 'Save profile'}
        </button>
      </div>

      {/* Security Section */}
      <section className="student-page__security-block">
        <h2 className="student-page__section-title">Security</h2>
        <p className="student-page__note">
          To change your password, you will be redirected to the reset page.
        </p>
        <button
          className="student-page__reset-pw-btn"
          onClick={handleRedirectToResetPassword}
        >
          Go to Reset Password
        </button>
      </section>
    </div>
  );
}
