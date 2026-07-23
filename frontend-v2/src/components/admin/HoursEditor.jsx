import { useId, useState } from 'react';
import { updateRestaurantInfo } from '../../api/admin';
import { ApiError } from '../../api/client';
import { getRestaurantInfo } from '../../api/public';
import { useFetchOnMount } from '../../hooks/useFetchOnMount';
import './HoursEditor.css';

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

export default function HoursEditor() {
  const uid = useId();
  const { data, status } = useFetchOnMount(getRestaurantInfo);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState(null);

  if (data && form === null) {
    setForm({
      phone: data.phone || '',
      address: data.address || '',
      hours: DAYS.reduce((acc, d) => ({ ...acc, [d.key]: data.hours?.[d.key] || [] }), {}),
      closure_message: data.closure_message || '',
      closure_active: data.closure_active || false,
    });
  }

  function updateSlot(dayKey, slotIndex, field, value) {
    setForm((prev) => {
      const slots = [...prev.hours[dayKey]];
      slots[slotIndex] = { ...slots[slotIndex], [field]: value };
      return { ...prev, hours: { ...prev.hours, [dayKey]: slots } };
    });
  }

  function addSlot(dayKey) {
    setForm((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [dayKey]: [...prev.hours[dayKey], { open: '11:00', close: '21:00' }],
      },
    }));
  }

  function removeSlot(dayKey, slotIndex) {
    setForm((prev) => ({
      ...prev,
      hours: { ...prev.hours, [dayKey]: prev.hours[dayKey].filter((_, i) => i !== slotIndex) },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSavedAt(null);
    setSaving(true);
    try {
      await updateRestaurantInfo({
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        hours: form.hours,
        closure_message: form.closure_message.trim() || null,
        closure_active: form.closure_active,
      });
      setSavedAt(new Date());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading' || form === null) {
    return <p className="hours-editor-state">Loading…</p>;
  }

  return (
    <form className="hours-editor" onSubmit={handleSubmit}>
      <div className="hours-editor-section">
        <h3>Contact</h3>
        <div className="field">
          <label htmlFor={`${uid}-phone`}>Phone</label>
          <input
            id={`${uid}-phone`}
            type="text"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="(502) 456-9714"
          />
        </div>
        <div className="field">
          <label htmlFor={`${uid}-address`}>Address</label>
          <input
            id={`${uid}-address`}
            type="text"
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="1941 Bishop Ln, Ste 107, Louisville, KY 40218"
          />
        </div>
      </div>

      <div className="hours-editor-section">
        <h3>Weekly hours</h3>
        <p className="hours-editor-hint">
          A day with no time slots shows as &quot;Closed&quot; on the site. Add a second slot for a
          lunch/dinner split with a break in between.
        </p>
        {DAYS.map((day) => (
          <div className="hours-day-row" key={day.key}>
            <span className="hours-day-label">{day.label}</span>
            <div className="hours-day-slots">
              {form.hours[day.key].length === 0 && (
                <span className="hours-closed-label">Closed</span>
              )}
              {form.hours[day.key].map((slot, i) => (
                <div className="hours-slot" key={i}>
                  <input
                    type="time"
                    aria-label={`${day.label} opening time, slot ${i + 1}`}
                    value={slot.open}
                    onChange={(e) => updateSlot(day.key, i, 'open', e.target.value)}
                  />
                  <span aria-hidden="true">–</span>
                  <input
                    type="time"
                    aria-label={`${day.label} closing time, slot ${i + 1}`}
                    value={slot.close}
                    onChange={(e) => updateSlot(day.key, i, 'close', e.target.value)}
                  />
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeSlot(day.key, i)}
                    aria-label={`Remove ${day.label} time slot ${i + 1}`}
                    title="Remove this time slot"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" className="text-btn" onClick={() => addSlot(day.key)}>
                + Add time slot for {day.label}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hours-editor-section">
        <h3>Closure banner</h3>
        <p className="hours-editor-hint">
          Turn this on to show a message across the top of the site — e.g. for a holiday or family
          event. This doesn&apos;t change your regular hours above.
        </p>
        <label className="item-editor-checkbox">
          <input
            type="checkbox"
            checked={form.closure_active}
            onChange={(e) => setForm((prev) => ({ ...prev, closure_active: e.target.checked }))}
          />
          Show closure banner
        </label>
        <div className="field">
          <label htmlFor={`${uid}-closure-message`}>Banner message</label>
          <input
            id={`${uid}-closure-message`}
            type="text"
            value={form.closure_message}
            onChange={(e) => setForm((prev) => ({ ...prev, closure_message: e.target.value }))}
            placeholder="Closed July 20 for a family wedding — back to normal hours July 21."
          />
        </div>
      </div>

      {error && (
        <p className="hours-editor-error" role="alert">
          {error}
        </p>
      )}
      {savedAt && <p className="hours-editor-saved">Saved.</p>}

      <button type="submit" className="btn-save" disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
