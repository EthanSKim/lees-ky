import { useId, useState } from 'react';
import { uploadImage } from '../../api/admin';
import { ApiError } from '../../api/client';
import './MenuItemEditor.css';

const SPICY = '🌶️';

function stripSpicy(name) {
  return name.replace(new RegExp(`\\s*${SPICY}\\s*$`), '').trim();
}

const emptyItem = {
  name_en: '',
  name_kr: '',
  description: '',
  price: '',
  image_url: '',
  is_available: true,
  is_featured: false,
};

/**
 * Shared form for creating or editing a menu item. `initialItem` being
 * present means "edit"; absent means "create new".
 *
 * Spiciness is represented the same way the printed menu does it - a chili
 * emoji right next to the name - rather than a numeric 1-6 scale. The
 * checkbox below just manages appending/stripping that suffix so the owner
 * never has to type or delete an emoji by hand.
 */
export default function MenuItemEditor({ initialItem, onSave, onCancel, saving }) {
  const uid = useId();
  const initialName = initialItem?.name_en ?? '';
  const [form, setForm] = useState(() => ({
    ...emptyItem,
    ...initialItem,
    name_en: stripSpicy(initialName),
    price: initialItem?.price ?? '',
  }));
  const [isSpicy, setIsSpicy] = useState(() => initialName.trim().endsWith(SPICY));
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setImageUploading(true);
    try {
      const { url } = await uploadImage(file);
      updateField('image_url', url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Image upload failed.');
    } finally {
      setImageUploading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const baseName = form.name_en.trim();
    if (!baseName) {
      setError('Name is required.');
      return;
    }
    const price = parseFloat(form.price);
    if (Number.isNaN(price) || price <= 0) {
      setError('Enter a valid price greater than $0.');
      return;
    }

    onSave({
      name_en: isSpicy ? `${baseName} ${SPICY}` : baseName,
      name_kr: form.name_kr.trim() || null,
      description: form.description.trim() || null,
      price,
      image_url: form.image_url || null,
      is_available: form.is_available,
      is_featured: form.is_featured,
    });
  }

  return (
    <form className="item-editor" onSubmit={handleSubmit}>
      <div className="item-editor-grid">
        <div className="field">
          <label htmlFor={`${uid}-name-en`}>Name (English)</label>
          <input
            id={`${uid}-name-en`}
            type="text"
            value={form.name_en}
            onChange={(e) => updateField('name_en', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor={`${uid}-name-kr`}>Name (Korean)</label>
          <input
            id={`${uid}-name-kr`}
            type="text"
            value={form.name_kr || ''}
            onChange={(e) => updateField('name_kr', e.target.value)}
            placeholder="김밥"
          />
        </div>
        <div className="field">
          <label htmlFor={`${uid}-price`}>Price ($)</label>
          <input
            id={`${uid}-price`}
            type="number"
            step="0.01"
            min="0.01"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${uid}-description`}>Description</label>
        <textarea
          id={`${uid}-description`}
          value={form.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          rows={2}
        />
      </div>

      <label className="item-editor-checkbox">
        <input type="checkbox" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} />
        {SPICY} Spicy (shown right next to the name, like the printed menu)
      </label>

      <label className="item-editor-checkbox">
        <input
          type="checkbox"
          checked={form.is_available}
          onChange={(e) => updateField('is_available', e.target.checked)}
        />
        Available on the public menu
      </label>

      <label className="item-editor-checkbox">
        <input
          type="checkbox"
          checked={form.is_featured}
          onChange={(e) => updateField('is_featured', e.target.checked)}
        />
        Feature on the homepage
      </label>

      {form.is_featured && (
        <div className="field item-editor-photo-field">
          <label htmlFor={`${uid}-photo`}>Photo (only featured items show a photo)</label>
          <div className="item-editor-image-row">
            {form.image_url && <img src={form.image_url} alt="" className="item-editor-thumb" />}
            <input
              id={`${uid}-photo`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />
            {imageUploading && <span className="item-editor-uploading">Uploading…</span>}
          </div>
        </div>
      )}

      {error && (
        <p className="item-editor-error" role="alert">
          {error}
        </p>
      )}

      <div className="item-editor-actions">
        <button type="submit" className="btn-save" disabled={saving || imageUploading}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
