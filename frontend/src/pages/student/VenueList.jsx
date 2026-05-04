import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import VenueCard from '../../components/VenueCard';

const VenueList = ({ basePath = '/student' }) => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const { data } = await api.get('/venues');
        if (alive) {
          setVenues(data);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">Loading venues...</div>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard key={venue._id} venue={venue} onView={(venueId) => navigate(`${basePath}/venue/${venueId}`)} />
      ))}
    </div>
  );
};

export default VenueList;
