const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABELS = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

/** "14:00" -> "2:00 PM" */
function formatTime(hhmm) {
  const [hourStr, minuteStr] = hhmm.split(':');
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return minuteStr === '00' ? `${displayHour} ${period}` : `${displayHour}:${minuteStr} ${period}`;
}

/**
 * Returns an ordered array of { key, label, slots, isToday } for rendering
 * a full weekly hours table starting from Monday.
 */
export function getWeeklySchedule(hours = {}) {
  const orderedKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const todayKey = DAY_KEYS[new Date().getDay()];

  return orderedKeys.map((key) => ({
    key,
    label: DAY_LABELS[key],
    slots: hours[key] || [],
    isToday: key === todayKey,
  }));
}

export function formatSlots(slots) {
  if (!slots || slots.length === 0) return 'Closed';
  return slots.map((slot) => `${formatTime(slot.open)} – ${formatTime(slot.close)}`).join(', ');
}

/**
 * Determines whether the restaurant is open right now based on the hours
 * JSON and the visitor's local clock. Returns { isOpen, label }.
 */
export function getOpenStatus(hours = {}) {
  const now = new Date();
  const todayKey = DAY_KEYS[now.getDay()];
  const slots = hours[todayKey] || [];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const slot of slots) {
    const [openH, openM] = slot.open.split(':').map(Number);
    const [closeH, closeM] = slot.close.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
      return { isOpen: true, label: `Open now · closes ${formatTime(slot.close)}` };
    }
  }

  return { isOpen: false, label: 'Closed now' };
}
