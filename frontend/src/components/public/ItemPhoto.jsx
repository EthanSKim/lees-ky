import PhotoPlaceholder from './PhotoPlaceholder';
import './ItemPhoto.css';

/**
 * Menu item photos come from the admin's upload (item.image_url) once set.
 * Until then, falls back to the labeled placeholder so the layout still
 * looks intentional rather than showing a broken image.
 */
export default function ItemPhoto({
  imageUrl,
  filename,
  alt,
  aspectRatio = '4 / 3',
  className = '',
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`item-photo ${className}`}
        style={{ aspectRatio, objectFit: 'cover', width: '100%', display: 'block' }}
      />
    );
  }

  return (
    <PhotoPlaceholder
      filename={filename}
      alt={alt}
      aspectRatio={aspectRatio}
      className={className}
    />
  );
}
