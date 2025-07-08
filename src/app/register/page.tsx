'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface RegisterForm {
  firstName: string;
  lastName: string;
  matricNo: string;
  level: string;
  whatsappNumber: string;
  password: string;
  confirmPassword: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    matricNo: '',
    level: '',
    whatsappNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (): string | null => {
    const matricPattern = /^BCCT\/B\.TH\/\d{2}\/\d{4}$/;

    if (!matricPattern.test(form.matricNo)) {
      return 'Invalid matric number format. Expected: BCCT/B.TH/01/0001';
    }

    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }

    if (form.password.length < 8) {
      return 'Your password must be at least 8 characters, and should contain both letters and numbers for security.';
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', form);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: unknown) {
      const error = err as ApiError;
      setMessage(error.response?.data?.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const fields: { name: keyof RegisterForm; type?: string; placeholder?: string }[] = [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'matricNo', placeholder: 'BCCT/B.TH/01/0001' },
    { name: 'level', placeholder: '100 / 200 / 300 / 400' },
    { name: 'whatsappNumber', placeholder: '080XXXXXXXX' },
    { name: 'password', type: 'password' },
    { name: 'confirmPassword', type: 'password' },
  ];

  return (
    <div className="register-container">
      <h2 className="register-title">Student Registration</h2>
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        {fields.map(({ name, type = 'text', placeholder }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={placeholder || name.replace(/([A-Z])/g, ' $1')}
            value={form[name]}
            onChange={handleChange}
            required
          />
        ))}

        <button type="submit" disabled={isLoading}>
          {isLoading ? <span className="spinner" /> : 'Register'}
        </button>

        {message && <p className="register-status-msg">{message}</p>}
      </form>
    </div>
  );
}
