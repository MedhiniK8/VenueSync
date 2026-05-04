import React from 'react';

const VenueCard = ({ venue, onView }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
    <img src={venue.imageUrl} alt={venue.name} className="h-44 w-full object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-slate-900">{venue.name}</h3>
      <p className="mt-2 text-sm text-slate-600">Capacity: {venue.capacity}</p>
      <p className="text-sm text-slate-600">Type: {venue.type.replace('_', ' ')}</p>
      <button
        type="button"
        onClick={() => onView(venue._id)}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-tealbrand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-tealbrandSoft"
      >
        View &amp; Book
      </button>
    </div>
  </div>
);

export default VenueCard;
