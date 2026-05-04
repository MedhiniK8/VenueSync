import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import BookingTable from '../../components/BookingTable';
import BookingForm from './BookingForm';

const VenueDetail = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [venue, setVenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const basePath = location.pathname.startsWith('/teacher') ? '/teacher' : '/student';

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const [venueResponse, bookingResponse] = await Promise.all([
        api.get(`/venues/${venueId}`),
        api.get(`/bookings/venue/${venueId}?status=approved`)
      ]);
      if (alive) {
        setVenue(venueResponse.data);
        setBookings(bookingResponse.data);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [venueId]);

  if (!venue) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">Loading venue...</div>;
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-tealbrand hover:underline">
        Back
      </button>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
        <img src={venue.imageUrl} alt={venue.name} className="h-64 w-full object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-slate-900">{venue.name}</h1>
          <p className="mt-2 text-sm text-slate-600">Capacity: {venue.capacity}</p>
          <p className="text-sm text-slate-600">Type: {venue.type.replace('_', ' ')}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Already Booked Slots</h2>
        <BookingTable bookings={bookings} emptyMessage="No bookings yet for this venue" />
      </section>

      <BookingForm venue={venue} onSuccess={() => navigate(basePath, { replace: true })} />
    </div>
  );
};

export default VenueDetail;
