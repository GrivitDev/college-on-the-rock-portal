'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await api.post('/auth/reset-password', form);
      setMessage(res.data.message);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: unknown) {
      const error = err as ApiError;
      const msg = error.response?.data?.message || 'Reset failed';
      setMessage(msg);
    } finally {
      setIsLoading(false);
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
          Your password should contain both letters and numbers for security, and must be at least 8 characters long.
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

        <button type="submit" className="reset-password-btn" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : 'Reset Password'}
        </button>

        {message && (
          <p
            className={`reset-password-status ${
              message.toLowerCase().includes('success')
                ? 'success'
                : message.toLowerCase().includes('fail') ||
                  message.toLowerCase().includes('error')
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
