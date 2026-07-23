import './PhotoPlaceholder.css';

/**
 * Renders in place of a real photo until one is added to /public/images.
 * Shows the exact filename expected so replacing it is a drop-in operation -
 * see /public/images/README.md for the full shot list.
 *
 * To use a real photo instead: drop the file in /public/images/ and replace
 * this component with a plain <img src={`/images/${filename}`} alt={alt} />.
 */
export default function PhotoPlaceholder({ filename, alt, aspectRatio = '4 / 3', className = '' }) {
  return (
    <div
      className={`photo-placeholder ${className}`}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt}
    >
      <span className="photo-placeholder-label">{filename}</span>
    </div>
  );
}
