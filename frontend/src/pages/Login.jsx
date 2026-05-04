import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const result = await login(form);
      navigate(result.redirectTo, { replace: true });
    } catch (error) {
      pushToast(error?.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto flex min-h-full max-w-6xl items-center px-4 py-10">
        <div className="grid w-full gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-2 lg:p-8">
          <section className="rounded-3xl bg-gradient-to-br from-tealbrand to-bluebrandDeep p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">VenueSync</p>
            <h1 className="mt-6 text-4xl font-bold leading-tight">Smart venue booking for KLE Technological University.</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/85">
              Book venues with role-based access, conflict checks, and admin approvals in one controlled workflow.
            </p>
          </section>

          <section className="flex items-center">
            <form onSubmit={submit} className="w-full space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Login</h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input"
                />
              </div>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-tealbrand px-4 py-3 font-semibold text-white transition hover:bg-tealbrandSoft disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
              <p className="text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-tealbrand hover:underline">
                  Register here
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
