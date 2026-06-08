import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const kleTechEmailPattern = /^[^\s@]+@kletech\.ac\.in$/i;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();

    if (!kleTechEmailPattern.test(email)) {
      pushToast('Only @kletech.ac.in email addresses are allowed', 'error');
      return;
    }

    try {
      setLoading(true);
      const result = await login({ ...form, email });
      navigate(result.redirectTo, { replace: true });
    } catch (error) {
      pushToast(error?.response?.data?.message || 'Login failed', 'error');
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
            Smart venue booking for KLE Technological University.
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-300">
            Book venues with role-based access, conflict checks, and admin approvals in one controlled workflow.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-12 xl:p-24">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-600">VenueSync</p>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-slate-500">Welcome back! Please enter your details.</p>

          <form onSubmit={submit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  pattern="^[^\s@]+@kletech\.ac\.in$"
                  title="Use a @kletech.ac.in email address"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input"
                />
              </div>
              <div>
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
              className="flex w-full justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
