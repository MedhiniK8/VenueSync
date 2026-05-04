import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { pushToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      pushToast('Passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
        phone: form.phone
      });
      pushToast('Account created! Please login.', 'success');
      navigate('/login', { replace: true });
    } catch (error) {
      pushToast(error?.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tealbrand">VenueSync</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Create account</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['name', 'Full Name', 'text', true],
              ['email', 'Email', 'email', true],
              ['password', 'Password', 'password', true],
              ['confirmPassword', 'Confirm Password', 'password', true],
              ['department', 'Department', 'text', true],
              ['phone', 'Phone', 'text', true]
            ].map(([key, label, type, required]) => (
              <div key={key} className={key === 'phone' ? 'md:col-span-2' : ''}>
                <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
                <input
                  type={type}
                  required={required}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input"
                />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="input"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-tealbrand px-5 py-3 font-semibold text-white transition hover:bg-tealbrandSoft disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
          <p className="text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-tealbrand hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
