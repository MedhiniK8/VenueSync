import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [venueResponse, bookingResponse] = await Promise.all([api.get('/venues'), api.get('/bookings/all')]);
      setVenues(venueResponse.data);
      setBookings(bookingResponse.data.filter((booking) => booking.status === 'approved'));
    };

    load();
  }, []);

  return (
    <div className="space-y-4">
      {venues.map((venue) => {
        const venueBookings = bookings.filter((booking) => booking.venueId?._id === venue._id);
        return (
          <div key={venue._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">{venue.name}</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {venueBookings.length === 0 ? (
                <p>No upcoming approved bookings</p>
              ) : (
                venueBookings.map((booking) => (
                  <div key={booking._id} className="rounded-xl bg-slate-50 p-3">
                    <p className="font-semibold text-slate-800">{new Date(booking.eventDate).toLocaleDateString()} | {booking.startTime} - {booking.endTime}</p>
                    <p>{booking.eventName} booked by {booking.userId?.name}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllVenues;
