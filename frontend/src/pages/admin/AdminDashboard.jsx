import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AddVenue from './AddVenue';
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
    { key: 'add-venue', label: 'Add Venue' },
    { key: 'requests', label: 'Booking Requests' },
    { key: 'venues', label: 'All Venues' },
    { key: 'notifications', label: 'Notifications' }
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        title="Admin Workspace"
        items={items}
        active={activeTab}
        onChange={setActiveTab}
        footer={
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.name || 'Administrator'}</p>
                <p className="truncate text-xs text-slate-500">{user?.email || 'admin@kle.edu'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center font-semibold text-slate-900">
              {items.find(item => item.key === activeTab)?.label}
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {activeTab === 'overview' && (
              <>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Control Center</h1>
                  <p className="mt-2 text-sm text-slate-600">Overview of all system activity and pending approvals.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Total Bookings" value={stats.totalBookings} tone="slate" />
                  <StatCard label="Pending Requests" value={stats.pendingRequests} tone="amber" />
                  <StatCard label="Approved Today" value={stats.approvedToday} tone="emerald" />
                  <StatCard label="Rejected Total" value={stats.rejectedTotal} tone="rose" />
                </div>
                
                <div className="rounded-xl border border-slate-200 bg-white shadow-card">
                  <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {stats.recentActivity?.length ? stats.recentActivity.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.eventName}</p>
                            <p className="text-xs text-slate-500">{item.venueId?.name} | {new Date(item.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      )) : <p className="text-sm text-slate-500">No recent activity</p>}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'add-venue' && <AddVenue onCreated={() => setActiveTab('venues')} />}
            {activeTab === 'requests' && <BookingRequests />}
            {activeTab === 'venues' && <AllVenues />}
            {activeTab === 'notifications' && <AdminNotifications />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
