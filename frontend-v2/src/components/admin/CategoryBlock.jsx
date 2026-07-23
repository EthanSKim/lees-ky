import { useState } from 'react';
import MenuItemEditor from './MenuItemEditor';
import './CategoryBlock.css';

export default function CategoryBlock({
  category,
  isFirst,
  isLast,
  onRenameCategory,
  onMoveCategory,
  onDeleteCategory,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  busy,
}) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [addingItem, setAddingItem] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(category.name);

  function submitRename() {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== category.name) {
      onRenameCategory(category.id, trimmed);
    }
    setRenaming(false);
  }

  return (
    <section className="category-block">
      <div className="category-block-header">
        {renaming ? (
          <input
            type="text"
            className="category-name-input"
            value={nameDraft}
            autoFocus
            aria-label={`Rename category "${category.name}"`}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitRename();
              if (e.key === 'Escape') {
                setNameDraft(category.name);
                setRenaming(false);
              }
            }}
          />
        ) : (
          <h3
            onClick={() => setRenaming(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setRenaming(true);
              }
            }}
            role="button"
            tabIndex={0}
            title="Click to rename"
            aria-label={`Category: ${category.name}. Press Enter to rename.`}
          >
            {category.name}
          </h3>
        )}

        <div className="category-block-controls">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onMoveCategory(category.id, -1)}
            disabled={isFirst || busy}
            aria-label={`Move ${category.name} category up`}
            title="Move category up"
          >
            ↑
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onMoveCategory(category.id, 1)}
            disabled={isLast || busy}
            aria-label={`Move ${category.name} category down`}
            title="Move category down"
          >
            ↓
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => onDeleteCategory(category.id, category.name)}
            disabled={busy}
            aria-label={`Delete ${category.name} category`}
          >
            X
          </button>
        </div>
      </div>

      {category.items.length === 0 && !addingItem && (
        <p className="category-empty-note">No items yet.</p>
      )}

      <ul className="item-list">
        {category.items.map((item) =>
          editingItemId === item.id ? (
            <li key={item.id}>
              <MenuItemEditor
                initialItem={item}
                saving={busy}
                onCancel={() => setEditingItemId(null)}
                onSave={async (data) => {
                  await onUpdateItem(item.id, data);
                  setEditingItemId(null);
                }}
              />
            </li>
          ) : (
            <li key={item.id} className={`item-row ${item.is_available ? '' : 'unavailable'}`}>
              {item.image_url ? (
                <img src={item.image_url} alt="" className="item-row-thumb" />
              ) : (
                <div className="item-row-thumb placeholder" aria-hidden="true" />
              )}
              <div className="item-row-info">
                <div className="item-row-title">
                  <span>{item.name_en}</span>
                  {item.name_kr && <span className="item-row-kr">{item.name_kr}</span>}
                </div>
                <div className="item-row-meta">
                  <span>${item.price.toFixed(2)}</span>
                  {item.is_featured && <span className="badge-featured">Featured</span>}
                  {!item.is_available && <span className="badge-unavailable">Hidden</span>}
                </div>
              </div>
              <div className="item-row-actions">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={item.is_available}
                    onChange={(e) => onUpdateItem(item.id, { is_available: e.target.checked })}
                    disabled={busy}
                  />
                  <span>Available</span>
                </label>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => setEditingItemId(item.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-btn danger"
                  onClick={() => onDeleteItem(item.id, item.name_en)}
                >
                  Delete
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {addingItem ? (
        <MenuItemEditor
          saving={busy}
          onCancel={() => setAddingItem(false)}
          onSave={async (data) => {
            await onCreateItem(category.id, data);
            setAddingItem(false);
          }}
        />
      ) : (
        <button type="button" className="add-item-btn" onClick={() => setAddingItem(true)}>
          + Add item to {category.name}
        </button>
      )}
    </section>
  );
}
