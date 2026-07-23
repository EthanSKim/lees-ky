import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="center" style={{ padding: '96px 24px' }}>
      <p className="section-eyebrow center">404</p>
      <h1 style={{ marginBottom: 16 }}>We couldn&apos;t find that page.</h1>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
