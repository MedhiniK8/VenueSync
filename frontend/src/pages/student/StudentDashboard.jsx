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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        title={teacherMode ? 'Teacher Workspace' : 'Student Workspace'}
        items={navItems}
        active={activeTab}
        onChange={setActiveTab}
        footer={
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            {teacherMode && (
              <div className="inline-flex w-full items-center justify-center rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                Teacher Priority
              </div>
            )}
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
              {navItems.find(item => item.key === activeTab)?.label}
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Optional header actions can go here */}
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {activeTab === 'home' && (
              <>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back, {user?.name.split(' ')[0]}</h1>
                  <p className="mt-2 text-sm text-slate-600">Here's an overview of your venue bookings and current status.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Total Bookings" value={stats.total} tone="slate" />
                  <StatCard label="Pending" value={stats.pending} tone="amber" />
                  <StatCard label="Approved" value={stats.approved} tone="emerald" />
                  <StatCard label="Rejected" value={stats.rejected} tone="rose" />
                </div>
                
                <div className="rounded-xl border border-slate-200 bg-white shadow-card">
                  <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
                  </div>
                  <div className="p-6">
                    <BookingTable bookings={recentBookings} emptyMessage="No recent bookings" />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'venues' && <VenueList basePath={basePath} />}
            {activeTab === 'bookings' && <MyBookings />}
            {activeTab === 'notifications' && <Notifications />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
