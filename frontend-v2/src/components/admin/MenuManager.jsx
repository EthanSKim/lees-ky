import { useState } from 'react';
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  listCategories,
  updateCategory,
  updateMenuItem,
} from '../../api/admin';
import { ApiError } from '../../api/client';
import { useFetchOnMount } from '../../hooks/useFetchOnMount';
import CategoryBlock from './CategoryBlock';
import './MenuManager.css';

export default function MenuManager() {
  const { data, status, error } = useFetchOnMount(listCategories);
  const [categories, setCategories] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  // Sync fetched data into local editable state once loaded.
  if (data && categories === null) {
    setCategories(data);
  }

  async function refetch() {
    const fresh = await listCategories();
    setCategories(fresh);
  }

  async function runAction(fn) {
    setActionError('');
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  function handleCreateCategory(event) {
    event.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    runAction(async () => {
      await createCategory({ name, display_order: categories.length });
      setNewCategoryName('');
      setAddingCategory(false);
      await refetch();
    });
  }

  function handleRenameCategory(id, name) {
    runAction(async () => {
      await updateCategory(id, { name });
      await refetch();
    });
  }

  function handleMoveCategory(id, direction) {
    const index = categories.findIndex((c) => c.id === id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= categories.length) return;

    const current = categories[index];
    const swapWith = categories[swapIndex];

    runAction(async () => {
      await Promise.all([
        updateCategory(current.id, { display_order: swapWith.display_order }),
        updateCategory(swapWith.id, { display_order: current.display_order }),
      ]);
      await refetch();
    });
  }

  function handleDeleteCategory(id, name) {
    if (!window.confirm(`Delete "${name}" and every item in it? This can't be undone.`)) return;
    runAction(async () => {
      await deleteCategory(id);
      await refetch();
    });
  }

  function handleCreateItem(categoryId, itemData) {
    return runAction(async () => {
      const category = categories.find((c) => c.id === categoryId);
      await createMenuItem({
        ...itemData,
        category_id: categoryId,
        display_order: category.items.length,
      });
      await refetch();
    });
  }

  function handleUpdateItem(itemId, itemData) {
    return runAction(async () => {
      await updateMenuItem(itemId, itemData);
      await refetch();
    });
  }

  function handleDeleteItem(itemId, name) {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    runAction(async () => {
      await deleteMenuItem(itemId);
      await refetch();
    });
  }

  if (status === 'loading' || (status === 'success' && categories === null)) {
    return <p className="menu-manager-state">Loading menu…</p>;
  }

  if (status === 'error') {
    return (
      <p className="menu-manager-state error">
        Couldn&apos;t load the menu: {error instanceof ApiError ? error.message : 'unknown error'}
      </p>
    );
  }

  return (
    <div className="menu-manager">
      {actionError && (
        <p className="menu-manager-action-error" role="alert">
          {actionError}
        </p>
      )}

      {categories.length === 0 && !addingCategory && (
        <p className="menu-manager-state">
          No categories yet. Add one below to start building the menu.
        </p>
      )}

      {categories.map((category, index) => (
        <CategoryBlock
          key={category.id}
          category={category}
          isFirst={index === 0}
          isLast={index === categories.length - 1}
          busy={busy}
          onRenameCategory={handleRenameCategory}
          onMoveCategory={handleMoveCategory}
          onDeleteCategory={handleDeleteCategory}
          onCreateItem={handleCreateItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      ))}

      {addingCategory ? (
        <form className="new-category-form" onSubmit={handleCreateCategory}>
          <input
            type="text"
            placeholder="Category name, e.g. Soups & Stews"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-save" disabled={busy}>
            Add category
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setAddingCategory(false);
              setNewCategoryName('');
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button type="button" className="add-category-btn" onClick={() => setAddingCategory(true)}>
          + Add category
        </button>
      )}
    </div>
  );
}
