'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/contexts/LoaderContext';

interface ResetPasswordForm {
  matricNo: string;
  level: string;
  whatsappNumber: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ResetPassword() {
  const [form, setForm] = useState<ResetPasswordForm>({
    matricNo: '',
    level: '',
    whatsappNumber: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showLoader();
    try {
      const res = await api.post('/auth/reset-password', form);
      setMessage(res.data.message);
      hideLoader(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: unknown) {
      const error = err as ApiError;
      const msg = error.response?.data?.message || 'Reset failed';
      setMessage(msg);
      hideLoader(false);
    }
  };

  return (
    <div className="reset-password-page">
      <h2 className="reset-password-title">Reset Password</h2>

      <p className="reset-password-instructions">
        Please fill in your <strong>correct details</strong> to set a new password. Use your official registration data.
      </p>

      <form onSubmit={handleSubmit} className="reset-password-form" autoComplete="off">
        <input
          type="text"
          name="matricNo"
          placeholder="Matric Number"
          value={form.matricNo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="level"
          placeholder="Level"
          value={form.level}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="whatsappNumber"
          placeholder="WhatsApp Number"
          value={form.whatsappNumber}
          onChange={handleChange}
          required
        />

        <p className="reset-password-note">
          Your password should contain both letters and numbers for security, and make sure they are up to 8 characters.
        </p>

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="reset-password-btn">
          Reset Password
        </button>

        {message && (
          <p
            className={`reset-password-status ${
              message.toLowerCase().includes('success')
                ? 'success'
                : message.toLowerCase().includes('fail')
                ? 'error'
                : 'info'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
