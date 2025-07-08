'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import '@/styles/login.css';

export default function Login() {
  const [form, setForm] = useState({ matricNo: '', password: '' });
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
      const res = await api.post('/auth/login', form);
      const { token, role } = res.data;
      sessionStorage.setItem('access_token', token);
      router.push(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      const msg = error?.response?.data?.message || 'Login failed';
      setMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Student Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="matricNo"
          placeholder="Matric Number"
          value={form.matricNo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : 'Login'}
        </button>

        {message && <p className="login-status-msg">{message}</p>}
      </form>

      <div className="login-footer">
        <a href="/reset-password" className="forgot-link">Forgot Password?</a>
      </div>
    </div>
  );
}
