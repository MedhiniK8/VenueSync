import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const BookingRequests = () => {
  const { pushToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [rejecting, setRejecting] = useState(null);
  const [remarks, setRemarks] = useState('');

  const load = async () => {
    const { data } = await api.get('/bookings/all');
    setBookings(data);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return bookings;
    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  const approve = async (id) => {
    await api.patch(`/bookings/${id}/approve`);
    pushToast('Booking approved successfully', 'success');
    load();
  };

  const confirmReject = async () => {
    if (!remarks.trim()) {
      pushToast('Rejection reason is required', 'error');
      return;
    }

    await api.patch(`/bookings/${rejecting}/reject`, { remarks });
    pushToast('Booking rejected successfully', 'success');
    setRejecting(null);
    setRemarks('');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
              filter === item ? 'bg-tealbrand text-white' : 'bg-white text-slate-700'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Venue</th>
                <th className="px-4 py-3 text-left font-semibold">User Name</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Time</th>
                <th className="px-4 py-3 text-left font-semibold">Event Name</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-slate-500">No bookings found</td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr key={booking._id} className={booking.status === 'pending' ? 'border-l-4 border-l-amber-300' : ''}>
                    <td className="px-4 py-3">{booking.venueId?.name}</td>
                    <td className="px-4 py-3">{booking.userId?.name}</td>
                    <td className="px-4 py-3 capitalize">{booking.userRole}</td>
                    <td className="px-4 py-3">{new Date(booking.eventDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{booking.startTime} - {booking.endTime}</td>
                    <td className="px-4 py-3">{booking.eventName}</td>
                    <td className="px-4 py-3 capitalize">{booking.status}</td>
                    <td className="px-4 py-3">
                      {booking.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => approve(booking._id)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
                            Approve
                          </button>
                          <button type="button" onClick={() => setRejecting(booking._id)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rejecting ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-slate-900">Reason for Rejection</h3>
            <textarea className="input mt-4 min-h-32" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            <div className="mt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setRejecting(null)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button type="button" onClick={confirmReject} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">Confirm Reject</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BookingRequests;
