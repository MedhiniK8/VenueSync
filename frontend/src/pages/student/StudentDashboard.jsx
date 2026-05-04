import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import BookingTable from '../../components/BookingTable';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import VenueList from './VenueList';
import MyBookings from './MyBookings';
import Notifications from './Notifications';

const StudentDashboard = ({ basePath = '/student', teacherMode = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const [statsResponse, bookingsResponse] = await Promise.all([
        api.get('/bookings/my-stats'),
        api.get('/bookings/my-bookings')
      ]);

      if (alive) {
        setStats(statsResponse.data);
        setRecentBookings(bookingsResponse.data.slice(0, 5));
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'venues', label: 'Book a Venue' },
    { key: 'bookings', label: 'My Bookings' },
    { key: 'notifications', label: 'Notifications' }
  ];

  return (
    <div className="min-h-full bg-slate-100 p-4 lg:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[290px_1fr]">
        <Sidebar
          title={teacherMode ? 'Teacher Dashboard' : 'Student Dashboard'}
          items={navItems}
          active={activeTab}
          onChange={setActiveTab}
          footer={
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                Welcome, <span className="font-semibold text-slate-900">{user?.name}</span>
              </p>
              {teacherMode ? (
                <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  ⭐ Teacher Priority Account
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          }
        />

        <main className="space-y-6">
          <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-tealbrand">VenueSync</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {user?.name}</h1>
            <p className="mt-2 text-sm text-slate-600">Use the dashboard to check availability, book a venue, and track approvals.</p>
          </header>

          {activeTab === 'home' ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Bookings" value={stats.total} />
                <StatCard label="Pending" value={stats.pending} tone="blue" />
                <StatCard label="Approved" value={stats.approved} />
                <StatCard label="Rejected" value={stats.rejected} tone="blue" />
              </div>
              <BookingTable bookings={recentBookings} emptyMessage="No recent bookings" />
            </div>
          ) : null}

          {activeTab === 'venues' ? <VenueList basePath={basePath} /> : null}
          {activeTab === 'bookings' ? <MyBookings /> : null}
          {activeTab === 'notifications' ? <Notifications /> : null}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
