import React from 'react';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700'
};

const BookingTable = ({ bookings, emptyMessage = 'No records found' }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Venue</th>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
            <th className="px-4 py-3 text-left font-semibold">Time</th>
            <th className="px-4 py-3 text-left font-semibold">Event</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking._id} className={booking.status === 'pending' ? 'border-l-4 border-l-amber-300' : ''}>
                <td className="px-4 py-3 text-slate-800">{booking.venueId?.name || booking.venueName || '-'}</td>
                <td className="px-4 py-3 text-slate-700">{new Date(booking.eventDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-slate-700">
                  {booking.startTime} - {booking.endTime}
                </td>
                <td className="px-4 py-3 text-slate-700">{booking.eventName}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default BookingTable;
