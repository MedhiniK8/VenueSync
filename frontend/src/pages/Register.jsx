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
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:relative lg:flex lg:w-1/2 lg:flex-col lg:justify-end lg:bg-slate-900">
        <img
          src="/login-bg.png"
          alt="Architecture"
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
        <div className="relative z-10 p-12 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-300">VenueSync</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight">
            Join KLE Technological University's Venue Network.
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-300">
            Create an account to streamline your venue bookings and approvals today.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-12 xl:p-24 overflow-y-auto">
        <div className="w-full max-w-md py-12">
          <div className="mb-8 lg:hidden">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-600">VenueSync</p>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>
          <p className="mt-2 text-sm text-slate-500">Sign up to get started with VenueSync.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['name', 'Full Name', 'text', true],
                ['email', 'Email', 'email', true],
                ['password', 'Password', 'password', true],
                ['confirmPassword', 'Confirm Password', 'password', true],
                ['department', 'Department', 'text', true],
                ['phone', 'Phone', 'text', true]
              ].map(([key, label, type, required]) => (
                <div key={key} className={key === 'name' || key === 'email' || key === 'phone' ? 'md:col-span-2' : ''}>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
                  <input
                    type={type}
                    required={required}
                    placeholder={label}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
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
              className="mt-6 flex w-full justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
            
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
