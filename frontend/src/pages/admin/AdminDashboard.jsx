import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import BookingRequests from './BookingRequests';
import AllVenues from './AllVenues';
import AdminNotifications from './AdminNotifications';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalBookings: 0, pendingRequests: 0, approvedToday: 0, rejectedTotal: 0, recentActivity: [] });

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/bookings/admin-stats');
      setStats(data);
    };

    load();
  }, []);

  const items = [
    { key: 'overview', label: 'Overview' },
    { key: 'requests', label: 'Booking Requests' },
    { key: 'venues', label: 'All Venues' },
    { key: 'notifications', label: 'Notifications' }
  ];

  return (
    <div className="min-h-full bg-slate-100 p-4 lg:p-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[290px_1fr]">
        <Sidebar
          title="Admin Dashboard"
          items={items}
          active={activeTab}
          onChange={setActiveTab}
          footer={
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                Welcome, <span className="font-semibold text-slate-900">{user?.name}</span>
              </p>
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
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Admin Control Center</h1>
          </header>

          {activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Bookings" value={stats.totalBookings} />
                <StatCard label="Pending Requests" value={stats.pendingRequests} tone="blue" />
                <StatCard label="Approved Today" value={stats.approvedToday} />
                <StatCard label="Rejected Total" value={stats.rejectedTotal} tone="blue" />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  {stats.recentActivity?.length ? stats.recentActivity.map((item) => (
                    <div key={item._id} className="rounded-xl bg-slate-50 p-3">
                      <p className="font-semibold text-slate-800">{item.eventName}</p>
                      <p>{item.venueId?.name} | {new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  )) : <p>No recent activity</p>}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'requests' ? <BookingRequests /> : null}
          {activeTab === 'venues' ? <AllVenues /> : null}
          {activeTab === 'notifications' ? <AdminNotifications /> : null}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
