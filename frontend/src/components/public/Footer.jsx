import { Link } from 'react-router-dom';
import { formatSlots, getWeeklySchedule } from '../../utils/hours';
import './Footer.css';

export default function Footer({ restaurantInfo }) {
  const schedule = getWeeklySchedule(restaurantInfo?.hours || {});

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-col">
          <h3 className="footer-brand">Lee&apos;s Korean Restaurant</h3>
          <p className="footer-tagline">Louisville&apos;s first Korean restaurant, since 1980.</p>
        </div>

        <div className="footer-col">
          <h4>Visit</h4>
          {restaurantInfo?.address && <p>{restaurantInfo.address}</p>}
          {restaurantInfo?.phone && <p>{restaurantInfo.phone}</p>}
          <Link to="/location" className="footer-link">
            Get directions →
          </Link>
        </div>

        <div className="footer-col">
          <h4>Hours</h4>
          <ul className="footer-hours">
            {schedule.map((day) => (
              <li key={day.key}>
                <span>{day.label.slice(0, 3)}</span>
                <span>{formatSlots(day.slots)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Lee&apos;s Korean Restaurant</span>
        <Link to="/admin" className="footer-admin-link">
          Staff login
        </Link>
      </div>
    </footer>
  );
}
