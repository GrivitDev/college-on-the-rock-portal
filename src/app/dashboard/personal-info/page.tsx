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
  const [viewInfo, setViewInfo] = useState<PersonalInfo | null>(null);
  const [editInfo, setEditInfo] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [uRes, pRes, sRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/personal-info/me'),
          api.get('/sessions/active'),
        ]);

        setUser(uRes.data);

        const personal = pRes.data;
        personal.currentSession = sRes.data?.sessionTitle ?? null;
        personal.currentSemester = sRes.data?.currentSemester?.toLowerCase() ?? null;

        setViewInfo(personal);
      } catch (err) {
        console.error('Failed to load profile', err);
        alert('Failed to load profile. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleOpenEditModal() {
    setEditInfo({ ...viewInfo });
    setIsEditModalOpen(true);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setEditInfo(null);
  }

  async function handleSaveProfile() {
    if (!user || !editInfo) return;
    setSavingProfile(true);
    try {
      await api.patch(`/users/${user._id}`, {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        whatsappNumber: user.whatsappNumber,
      });

      await api.patch('/personal-info', {
        dateOfBirth: editInfo.dateOfBirth,
        tutorialGroup: editInfo.tutorialGroup,
        hostel: editInfo.hostel,
        bunkCode: editInfo.bunkCode,
        phone: editInfo.phone,
        email: editInfo.email,
        emergencyContact: editInfo.emergencyContact,
        genotype: editInfo.genotype,
        bloodGroup: editInfo.bloodGroup,
        allergies: editInfo.allergies,
      });

      alert('Profile saved successfully');

      const pRes = await api.get('/personal-info/me');
      setViewInfo({
        ...pRes.data,
        currentSession: viewInfo?.currentSession,
        currentSemester: viewInfo?.currentSemester,
      });

      handleCloseEditModal();
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
      setViewInfo(res.data);
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

  if (loading) return <div className="sp-page__loading">Loading…</div>;

  return (
    <div className="sp-page__container">
      <h1 className="sp-page__title">My Personal Information</h1>

      {/* Profile Picture & Basic Info */}
      <section className="sp-profile-block">
        <div className="sp-avatar-wrap">
          <div className="sp-avatar-img-wrap">
            <Image
              src={viewInfo?.profilePictureUrl || '/default-profile.png'}
              alt="profile"
              fill
              className="sp-avatar-img"
            />
          </div>
          <label className="sp-avatar-upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureSelect}
              className="sp-avatar-input"
            />
            <span className="sp-avatar-btn">
              {uploadingPicture ? 'Uploading…' : 'Change Picture'}
            </span>
          </label>
        </div>

        <div className="sp-basic-fields">
          <p className="sp-field"><strong>First Name:</strong> {user?.firstName ?? 'N/A'}</p>
          <p className="sp-field"><strong>Middle Name:</strong> {user?.middleName ?? 'N/A'}</p>
          <p className="sp-field"><strong>Last Name:</strong> {user?.lastName ?? 'N/A'}</p>
          <p className="sp-field"><strong>Matric Number:</strong> {user?.matricNo ?? 'N/A'}</p>
          <p className="sp-field"><strong>Level:</strong> {user?.level ?? 'N/A'}</p>
        </div>
      </section>

      {/* Personal Info Display */}
      <section className="sp-info-display">
        <h2 className="sp-section-title">Contact</h2>
        <p className="sp-field"><strong>WhatsApp:</strong> {user?.whatsappNumber ?? 'N/A'}</p>
        <p className="sp-field"><strong>Phone:</strong> {viewInfo?.phone ?? 'Not provided'}</p>
        <p className="sp-field"><strong>Email:</strong> {viewInfo?.email ?? 'Not provided'}</p>
        <p className="sp-field"><strong>Emergency Contact:</strong> {viewInfo?.emergencyContact ?? 'Not provided'}</p>

        <h2 className="sp-section-title">Health</h2>
        <p className="sp-field"><strong>Genotype:</strong> {viewInfo?.genotype ?? 'Not provided'}</p>
        <p className="sp-field"><strong>Blood Group:</strong> {viewInfo?.bloodGroup ?? 'Not provided'}</p>
        <p className="sp-field"><strong>Allergies:</strong> {viewInfo?.allergies ?? 'Not provided'}</p>

        <h2 className="sp-section-title">Hostel Info</h2>
        <p className="sp-field"><strong>Hostel:</strong> {viewInfo?.hostel ?? 'Not assigned'}</p>
        <p className="sp-field"><strong>Bunk Code:</strong> {viewInfo?.bunkCode ?? 'Not assigned'}</p>

        <h2 className="sp-section-title">Academic Info</h2>
        <p className="sp-field"><strong>Current Session:</strong> {viewInfo?.currentSession ?? 'N/A'}</p>
        <p className="sp-field"><strong>Current Semester:</strong> {viewInfo?.currentSemester ?? 'N/A'}</p>
      </section>

      <div className="sp-actions">
        <button onClick={handleOpenEditModal} className="sp-edit-btn">Edit Profile</button>
      </div>

      <section className="sp-security-block">
        <h2 className="sp-section-title">Security</h2>
        <p className="sp-note">To change your password, you will be redirected to the reset page.</p>
        <button
          className="sp-reset-pw-btn"
          onClick={handleRedirectToResetPassword}
        >
          Go to Reset Password
        </button>
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && editInfo && (
        <div className="sp-modal-overlay">
          <div className="sp-modal-content">
            <h2 className="sp-modal-title">Edit Profile</h2>

            <label className="sp-label">First Name</label>
            <input
              className="sp-input"
              value={user?.firstName ?? ''}
              onChange={(e) => setUser((u) => u && { ...u, firstName: e.target.value })}
            />
            <label className="sp-label">Middle Name</label>
            <input
              className="sp-input"
              value={user?.middleName ?? ''}
              onChange={(e) => setUser((u) => u && { ...u, middleName: e.target.value })}
            />
            <label className="sp-label">Last Name</label>
            <input
              className="sp-input"
              value={user?.lastName ?? ''}
              onChange={(e) => setUser((u) => u && { ...u, lastName: e.target.value })}
            />
            <label className="sp-label">WhatsApp</label>
            <input
              className="sp-input"
              value={user?.whatsappNumber ?? ''}
              onChange={(e) => setUser((u) => u && { ...u, whatsappNumber: e.target.value })}
            />

            <label className="sp-label">Phone</label>
            <input
              className="sp-input"
              value={editInfo.phone ?? ''}
              onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })}
            />
            <label className="sp-label">Email</label>
            <input
              className="sp-input"
              value={editInfo.email ?? ''}
              onChange={(e) => setEditInfo({ ...editInfo, email: e.target.value })}
            />
            <label className="sp-label">Emergency Contact</label>
            <input
              className="sp-input"
              value={editInfo.emergencyContact ?? ''}
              onChange={(e) => setEditInfo({ ...editInfo, emergencyContact: e.target.value })}
            />
            <label className="sp-label">Genotype</label>
            <input
              className="sp-input"
              value={editInfo.genotype ?? ''}
              onChange={(e) => setEditInfo({ ...editInfo, genotype: e.target.value })}
            />
            <label className="sp-label">Blood Group</label>
            <input
              className="sp-input"
              value={editInfo.bloodGroup ?? ''}
              onChange={(e) => setEditInfo({ ...editInfo, bloodGroup: e.target.value })}
            />
            <label className="sp-label">Allergies</label>
            <input
              className="sp-input"
              value={editInfo.allergies ?? ''}
              onChange={(e) => setEditInfo({ ...editInfo, allergies: e.target.value })}
            />
            <label className="sp-label">Hostel</label>
            <input
              className="sp-input"
              value={editInfo.hostel ?? ''}
              onChange={(e) => setEditInfo({ ...editInfo, hostel: e.target.value })}
            />
            <label className="sp-label">Bunk Code</label>
            <input
              className="sp-input"
              value={editInfo.bunkCode ?? ''}
              onChange={(e) => setEditInfo({ ...editInfo, bunkCode: e.target.value })}
            />

            <div className="sp-modal-actions">
              <button className="sp-btn sp-btn-save" onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? 'Saving…' : 'Save'}
              </button>
              <button className="sp-btn sp-btn-cancel" onClick={handleCloseEditModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
