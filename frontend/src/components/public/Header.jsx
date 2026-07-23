import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'Our Story' },
  { to: '/location', label: 'Visit' },
];

export default function Header({ openStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          <span className="site-brand-en">Lee&apos;s Korean Restaurant</span>
          <span className="site-brand-kr">이가네</span>
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {openStatus && (
            <span className={`open-badge ${openStatus.isOpen ? 'is-open' : 'is-closed'}`}>
              <span className="open-badge-dot" aria-hidden="true" />
              {openStatus.label}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
