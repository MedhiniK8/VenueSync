import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import BookingTable from '../../components/BookingTable';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { data } = await api.get('/bookings/my-bookings');
      if (alive) {
        setBookings(data);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  return <BookingTable bookings={bookings} emptyMessage="No bookings yet" />;
};

export default MyBookings;
