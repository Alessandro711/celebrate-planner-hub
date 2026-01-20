const VALID_CREDENTIALS = {
  login: "ALESSANDRO E VANESSA",
  password: "100120"
};

const AUTH_STORAGE_KEY = 'wedding_auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

export function login(username: string, password: string): boolean {
  if (username.toUpperCase() === VALID_CREDENTIALS.login && password === VALID_CREDENTIALS.password) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: VALID_CREDENTIALS.login }));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthState(): AuthState {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const { user } = JSON.parse(stored);
      return { isAuthenticated: true, user };
    }
  } catch {
    // Invalid stored data
  }
  return { isAuthenticated: false, user: null };
}

export function isAuthenticated(): boolean {
  return getAuthState().isAuthenticated;
}
