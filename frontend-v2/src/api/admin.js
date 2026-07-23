import { api } from './client';

// ---------- Categories ----------

export function listCategories() {
  return api.get('/admin/categories', { auth: true });
}

export function createCategory(data) {
  return api.post('/admin/categories', data, { auth: true });
}

export function updateCategory(id, data) {
  return api.patch(`/admin/categories/${id}`, data, { auth: true });
}

export function deleteCategory(id) {
  return api.delete(`/admin/categories/${id}`, { auth: true });
}

// ---------- Menu items ----------

export function createMenuItem(data) {
  return api.post('/admin/menu-items', data, { auth: true });
}

export function updateMenuItem(id, data) {
  return api.patch(`/admin/menu-items/${id}`, data, { auth: true });
}

export function deleteMenuItem(id) {
  return api.delete(`/admin/menu-items/${id}`, { auth: true });
}

// ---------- Restaurant info ----------

export function updateRestaurantInfo(data) {
  return api.patch('/admin/restaurant-info', data, { auth: true });
}

// ---------- Uploads ----------

export function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/admin/uploads/image', formData, { auth: true, isFormData: true });
}
