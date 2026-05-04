import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const eventTypes = ['Workshop', 'Seminar', 'Hackathon', 'Meeting', 'Fest', 'Other'];
const audienceTypes = ['Students', 'Faculty', 'External Guests', 'Mixed'];

const BookingForm = ({ venue, onSuccess }) => {
  const { pushToast } = useToast();
  const [availableState, setAvailableState] = useState({ checked: false, available: false, message: '' });
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    eventName: '',
    eventType: 'Workshop',
    organizerName: '',
    department: '',
    contactPhone: '',
    contactEmail: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    capacityRequired: '',
    expectedCrowd: '',
    audienceType: 'Students',
    purpose: ''
  });

  const duration = useMemo(() => {
    if (!form.startTime || !form.endTime) return '0 hours 0 minutes';
    const [sh, sm] = form.startTime.split(':').map(Number);
    const [eh, em] = form.endTime.split(':').map(Number);
    const total = Math.max(0, eh * 60 + em - (sh * 60 + sm));
    return `${Math.floor(total / 60)} hours ${total % 60} minutes`;
  }, [form.startTime, form.endTime]);

  useEffect(() => {
    setAvailableState({ checked: false, available: false, message: '' });
  }, [form.eventDate, form.startTime, form.endTime]);

  const checkAvailability = async () => {
    if (!form.eventDate || !form.startTime || !form.endTime) {
      pushToast('Pick event date and time first', 'warning');
      return;
    }

    if (form.endTime <= form.startTime) {
      pushToast('End Time must be after Start Time', 'error');
      return;
    }

    try {
      setChecking(true);
      const { data } = await api.post('/bookings/check-availability', {
        venueId: venue._id,
        eventDate: form.eventDate,
        startTime: form.startTime,
        endTime: form.endTime
      });
      setAvailableState({ checked: true, available: data.available, message: data.message || '' });
      if (data.available) {
        pushToast('Slot is available', 'success');
      } else {
        pushToast('This slot is already booked', 'error');
      }
    } catch (error) {
      pushToast(error?.response?.data?.message || 'Availability check failed', 'error');
    } finally {
      setChecking(false);
    }
  };

  const submitBooking = async () => {
    if (Number(form.capacityRequired || 0) > Number(venue.capacity)) {
      pushToast('Capacity Required cannot exceed venue capacity', 'error');
      return;
    }

    if ((form.purpose || '').trim().length < 20) {
      pushToast('Purpose must be at least 20 characters', 'error');
      return;
    }

    if (!availableState.available) {
      pushToast('Confirm availability before submitting', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/bookings', {
        venueId: venue._id,
        ...form,
        eventDate: form.eventDate,
        expectedCrowd: Number(form.expectedCrowd),
        capacityRequired: Number(form.capacityRequired)
      });
      pushToast('Booking request submitted successfully! Awaiting admin approval.', 'success');
      onSuccess?.();
    } catch (error) {
      pushToast(error?.response?.data?.message || 'Booking submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Booking Form</h3>
        <p className="text-sm text-slate-500">Submit a venue request after checking availability.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Event Name" value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} />
        <select className="input" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}>
          {eventTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <input className="input" placeholder="Organizer Name" value={form.organizerName} onChange={(e) => setForm({ ...form, organizerName: e.target.value })} />
        <input className="input" placeholder="Department / Club Name" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <input className="input" placeholder="Contact Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
        <input className="input" placeholder="Contact Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
        <input className="input" type="date" min={new Date().toISOString().split('T')[0]} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className="input" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          <input className="input" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
        </div>
        <input className="input" readOnly value={venue.name} />
        <input className="input" type="number" placeholder="Capacity Required" value={form.capacityRequired} onChange={(e) => setForm({ ...form, capacityRequired: e.target.value })} />
        <input className="input" type="number" placeholder="Expected Number of Participants" value={form.expectedCrowd} onChange={(e) => setForm({ ...form, expectedCrowd: e.target.value })} />
        <select className="input" value={form.audienceType} onChange={(e) => setForm({ ...form, audienceType: e.target.value })}>
          {audienceTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Purpose of Event</label>
        <textarea
          className="input min-h-28"
          value={form.purpose}
          onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          placeholder="Describe the purpose of the event..."
        />
        <p className="mt-1 text-xs text-slate-500">Minimum 20 characters required.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={checkAvailability}
          disabled={checking}
          className="rounded-xl border border-tealbrand px-4 py-2.5 font-semibold text-tealbrand transition hover:bg-tealbrand hover:text-white disabled:opacity-60"
        >
          {checking ? 'Checking...' : 'Check Availability'}
        </button>
        <span className="text-sm text-slate-600">Duration: {duration}</span>
      </div>

      {availableState.checked ? (
        <div className={`rounded-xl border p-4 text-sm ${availableState.available ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {availableState.available
            ? 'Slot is available. Click Confirm Slot to submit your booking request.'
            : 'This slot is already booked for the selected time.'}
        </div>
      ) : null}

      {availableState.available ? (
        <button
          type="button"
          onClick={submitBooking}
          disabled={submitting}
          className="rounded-xl bg-tealbrand px-5 py-3 font-semibold text-white transition hover:bg-tealbrandSoft disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Confirm Slot'}
        </button>
      ) : null}
    </div>
  );
};

export default BookingForm;
