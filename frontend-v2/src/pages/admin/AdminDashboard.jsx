import { useState } from 'react';
import HoursEditor from '../../components/admin/HoursEditor';
import MenuManager from '../../components/admin/MenuManager';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const TABS = [
  { key: 'menu', label: 'Menu' },
  { key: 'hours', label: 'Hours & Info' },
];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <span className="admin-header-brand">Lee&apos;s Korean Restaurant — Admin</span>
        <div className="admin-header-user">
          <span>{admin?.email}</span>
          <button type="button" onClick={logout} className="admin-logout-btn">
            Log out
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="admin-content">
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'hours' && <HoursEditor />}
      </main>
    </div>
  );
}
