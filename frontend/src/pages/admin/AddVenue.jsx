import React, { useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const venueTypes = [
  { value: 'auditorium', label: 'Auditorium' },
  { value: 'seminar_hall', label: 'Seminar Hall' },
  { value: 'sports_arena', label: 'Sports Arena' },
  { value: 'amphitheatre', label: 'Amphitheatre' }
];

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

const AddVenue = ({ onCreated }) => {
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    capacity: '',
    type: 'auditorium',
    amenities: '',
    imageUrl: '',
    isActive: true
  });

  const submit = async (event) => {
    event.preventDefault();

    const capacity = Number(form.capacity);
    const amenities = form.amenities
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!form.name.trim()) {
      pushToast('Venue name is required', 'error');
      return;
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      pushToast('Capacity must be a number greater than zero', 'error');
      return;
    }

    if (amenities.length === 0) {
      pushToast('Please enter at least one amenity', 'error');
      return;
    }

    if (!isValidUrl(form.imageUrl.trim())) {
      pushToast('Please enter a valid image URL', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.post('/venues', {
        name: form.name.trim(),
        capacity,
        type: form.type,
        amenities,
        imageUrl: form.imageUrl.trim(),
        isActive: form.isActive
      });
      pushToast('Venue added successfully', 'success');
      setForm({
        name: '',
        capacity: '',
        type: 'auditorium',
        amenities: '',
        imageUrl: '',
        isActive: true
      });
      onCreated?.();
    } catch (error) {
      pushToast(error?.response?.data?.message || 'Failed to add venue', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Add Venue</h3>
        <p className="mt-1 text-sm text-slate-500">Admins can create new venues that appear in the booking list immediately.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Venue Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Venue name" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Capacity</label>
          <input
            className="input"
            type="number"
            min="1"
            step="1"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            placeholder="Capacity"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Venue Type</label>
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {venueTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Amenities</label>
          <input
            className="input"
            value={form.amenities}
            onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            placeholder="Projector, AC, Wi-Fi"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Image URL</label>
          <input
            className="input"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-tealbrand focus:ring-tealbrand"
        />
        Make this venue active immediately
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-tealbrand px-5 py-3 font-semibold text-white transition hover:bg-tealbrandSoft disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Add Venue'}
      </button>
    </form>
  );
};

export default AddVenue;