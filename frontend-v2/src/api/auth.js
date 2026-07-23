import { api } from './client';

export function login(email, password) {
  // auth: false here - logging in is what *gets* the token, so there's nothing to attach yet.
  return api.post('/auth/login', { email, password }, { auth: false });
}
