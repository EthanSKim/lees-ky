import { useOutletContext } from 'react-router-dom';
import { formatSlots, getWeeklySchedule } from '../../utils/hours';
import './Location.css';

export default function Location() {
  const { restaurantInfo } = useOutletContext();
  const address = restaurantInfo?.address;
  const schedule = getWeeklySchedule(restaurantInfo?.hours || {});

  return (
    <div className="location-page">
      <section className="location-hero">
        <p className="section-eyebrow center">Visit us</p>
        <h1 className="center">Find Lee&apos;s</h1>
      </section>

      <section className="location-grid">
        <div className="location-map">
          {address ? (
            <iframe
              title="Map to Lee's Korean Restaurant"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="location-map-placeholder">Map will appear once an address is set.</div>
          )}
        </div>

        <div className="location-details">
          <div className="location-detail-block">
            <h2>Address</h2>
            <p>{address || 'Address coming soon — please call.'}</p>
            <p className="location-note">
              We&apos;re in a strip mall just off Bishop Lane — look for the Ste 107 entrance and
              our sign; the storefront is set back from the road.
            </p>
          </div>

          {restaurantInfo?.phone && (
            <div className="location-detail-block">
              <h2>Phone</h2>
              <p>
                <a href={`tel:${restaurantInfo.phone.replace(/[^\d+]/g, '')}`}>
                  {restaurantInfo.phone}
                </a>
              </p>
            </div>
          )}

          <div className="location-detail-block">
            <h2>Hours</h2>
            <table className="hours-table">
              <tbody>
                {schedule.map((day) => (
                  <tr key={day.key} className={day.isToday ? 'today' : ''}>
                    <th scope="row">{day.label}</th>
                    <td>{formatSlots(day.slots)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
