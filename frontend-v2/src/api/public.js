import { api } from './client';

export function getMenu() {
  return api.get('/menu', { auth: false });
}

export function getRestaurantInfo() {
  return api.get('/restaurant-info', { auth: false });
}
