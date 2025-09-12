'use client';

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import api from '@/lib/api';

type UserSummary = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  matricNo: string;
  level: string;
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

const HOSTELS = ['Ondo', 'Jos', 'Abuja', 'Lagos', 'Lokoja', 'Niger'];

export default function AdminStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<UserSummary[]>([]);
  const [selected, setSelected] = useState<UserSummary | null>(null);
  const [info, setInfo] = useState<PersonalInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // admin form state
  const [hostel, setHostel] = useState('');
  const [bunkCode, setBunkCode] = useState('');
  const [currentSession, setCurrentSession] = useState('');
  const [currentSemester, setCurrentSemester] = useState<'first' | 'second' | ''>('');
  const [useCustomBunk, setUseCustomBunk] = useState(false);
  const [saving, setSaving] = useState(false);

  // search by name or matricNo - we call backend search endpoint
  async function doSearch(q: string) {
    setSearching(true);
    try {
      const params: Record<string, string> = {};
      // decide whether input looks like a matricNo vs name
      // we simply pass same input as both params so backend does OR search
      params.name = q;
      params.matricNo = q;
      const res = await api.get('/users/search', { params });
      setResults(res.data || []);
    } catch (err) {
      console.error('Search failed', err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleSearchInput(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setSearchTerm(v);
    // Debounce or simple immediate search
    if (v.trim().length >= 1) {
      doSearch(v.trim());
    } else {
      setResults([]);
    }
  }

  async function selectStudent(u: UserSummary) {
    setSelected(u);
    setInfo(null);
    setLoadingInfo(true);
    try {
      const res = await api.get(`/personal-info/${u._id}`);
      setInfo(res.data);
      // prefill form values
      setHostel(res.data.hostel || '');
      setBunkCode(res.data.bunkCode || '');
      setCurrentSession(res.data.currentSession || '');
      setCurrentSemester(res.data.currentSemester || '');
      setUseCustomBunk(false);
    } catch (err) {
      console.error('Failed to load personal info', err);
    } finally {
      setLoadingInfo(false);
    }
  }

  function validateBunk(value: string) {
    // Accept any string (bunkCode is flexible). If admin wants to use 1A..10B we can validate client-side.
    const re = /^(?:[1-9]|10)[AB]$/i;
    return re.test(value);
  }

  async function saveAdminFields() {
    if (!selected) return alert('Select student first');
    if (!hostel) return alert('Hostel is required (choose one of the six).');

    // hostel must be one of HOSTELS
    if (!HOSTELS.includes(hostel)) return alert('Hostel must be one of the six official hostels');

    // bunkCode may be custom (e.g. "Downbelow Room 2" or "Room 7") OR standard like 3A
    // If not custom, we can optionally validate basic format
    if (!useCustomBunk && bunkCode && !validateBunk(bunkCode)) {
      return alert('Bunk invalid — expected format 1A..10B (or switch to custom bunk mode)');
    }

        const payload: Partial<PersonalInfo> = {
        hostel,
        bunkCode: bunkCode || undefined,
        currentSession: currentSession || undefined,
        currentSemester: currentSemester || undefined,
        };

    setSaving(true);
    try {
      const res = await api.patch(`/personal-info/admin/${selected._id}`, payload);
      setInfo(res.data);
      alert('Admin fields updated');
    } catch (err) {
      console.error('Admin update failed', err);
      alert('Failed to save admin fields');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page__container">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Admin — Students</h1>
      </header>

      <section className="admin-page__search-section">
        <label className="admin-page__search-label">Search by name or matric number</label>
        <div className="admin-page__search-row">
          <input
            className="admin-page__search-input"
            placeholder="Type name or matric..."
            value={searchTerm}
            onChange={handleSearchInput}
            aria-label="Search students"
          />
          <div className="admin-page__search-meta">
            {searching ? 'Searching…' : `${results.length} results`}
          </div>
        </div>

        <ul className="admin-page__results-list">
          {results.map((r) => (
            <li
              key={r._id}
              className={'admin-page__result ' + (selected?._id === r._id ? 'admin-page__result--active' : '')}
              onClick={() => selectStudent(r)}
            >
              <div className="admin-page__result-name">
                {r.firstName} {r.middleName ? `${r.middleName} ` : ''}{r.lastName}
              </div>
              <div className="admin-page__result-meta">
                <span className="admin-page__result-matric">{r.matricNo}</span>
                <span className="admin-page__result-level">{r.level}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-page__details-section">
        {!selected ? (
          <div className="admin-page__pick-a-student">Select a student to view details</div>
        ) : loadingInfo ? (
          <div className="admin-page__loading-info">Loading student information…</div>
        ) : info ? (
          <div className="admin-page__details-card">
            <div className="admin-page__profile-head">
                <Image
                src={info.profilePictureUrl || '/default-profile.png'}
                alt="profile"
                width={120}
                height={120}
                className="admin-page__profile-pic"
                />
              <div className="admin-page__profile-meta">
                <div className="admin-page__profile-name">{selected.firstName} {selected.middleName || ''} {selected.lastName}</div>
                <div className="admin-page__profile-matric">Matric: {selected.matricNo}</div>
                <div className="admin-page__profile-level">Level: {selected.level}</div>
              </div>
            </div>

            <div className="admin-page__info-grid">
              <div className="admin-page__info-row"><strong>Email:</strong> {info.email || '—'}</div>
              <div className="admin-page__info-row"><strong>Phone:</strong> {info.phone || '—'}</div>
              <div className="admin-page__info-row"><strong>Emergency:</strong> {info.emergencyContact || '—'}</div>
              <div className="admin-page__info-row"><strong>Genotype:</strong> {info.genotype || '—'}</div>
              <div className="admin-page__info-row"><strong>Blood:</strong> {info.bloodGroup || '—'}</div>
              <div className="admin-page__info-row"><strong>Allergies:</strong> {info.allergies || '—'}</div>
            </div>

            <div className="admin-page__assign-section">
              <h3 className="admin-page__assign-title">Assign admin fields</h3>

              <label className="admin-page__label">Hostel</label>
                <select
                    className="admin-page__select"
                    value={currentSemester}
                    onChange={(e) =>
                        setCurrentSemester(e.target.value as 'first' | 'second' | '')
                    }
                >                
                <option value="">-- select hostel --</option>
                {HOSTELS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>

              <div className="admin-page__bunk-mode">
                <label className="admin-page__radio">
                  <input type="radio" name="bunkMode" checked={!useCustomBunk} onChange={() => setUseCustomBunk(false)} />
                  Standard bunk (1A..10B)
                </label>
                <label className="admin-page__radio">
                  <input type="radio" name="bunkMode" checked={useCustomBunk} onChange={() => setUseCustomBunk(true)} />
                  Custom bunk / overflow
                </label>
              </div>

              {!useCustomBunk ? (
                <>
                  <label className="admin-page__label">Bunk code (1A..10B)</label>
                  <input className="admin-page__input" value={bunkCode} onChange={(e) => setBunkCode(e.target.value.toUpperCase())} placeholder="e.g. 3A" />
                </>
              ) : (
                <>
                  <label className="admin-page__label">Custom bunk / overflow (e.g. Downbelow Room 2)</label>
                  <input className="admin-page__input" value={bunkCode} onChange={(e) => setBunkCode(e.target.value)} placeholder="e.g. Downbelow Room 2" />
                </>
              )}

              <label className="admin-page__label">Current session (session id)</label>
              <input className="admin-page__input" value={currentSession} onChange={(e) => setCurrentSession(e.target.value)} placeholder="Paste session id or leave blank" />

              <label className="admin-page__label">Current semester</label>
              <select className="admin-page__select" value={currentSemester} onChange={(e) => setCurrentSemester(e.target.value as any)}>
                <option value="">-- none --</option>
                <option value="first">first</option>
                <option value="second">second</option>
              </select>

              <div className="admin-page__actions-row">
                <button className="admin-page__save-btn" onClick={saveAdminFields} disabled={saving}>
                  {saving ? 'Saving…' : 'Save admin fields'}
                </button>

                <button className="admin-page__refresh-btn" onClick={() => selected && selectStudent(selected)}>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-page__no-info">No personal info found for this student.</div>
        )}
      </section>
    </div>
  );
}
