import './ClosureBanner.css';

export default function ClosureBanner({ message }) {
  if (!message) return null;

  return (
    <div className="closure-banner" role="status">
      {message}
    </div>
  );
}
