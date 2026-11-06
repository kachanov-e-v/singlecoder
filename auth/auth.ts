import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

export interface StoredUser extends User {
  passwordHash: string;
}

const USERS_KEY = 'singlecoder:users';
const SESSION_KEY = 'singlecoder:session';

export function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSessionUserId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionUserId(id: string | null): void {
  if (id) localStorage.setItem(SESSION_KEY, id);
  else localStorage.removeItem(SESSION_KEY);
}

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function register(email: string, password: string, name: string): Promise<User> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();
  if (!trimmedEmail || !password) throw new Error('Заполните все поля');
  if (password.length < 4) throw new Error('Пароль должен быть не короче 4 символов');

  const users = getUsers();
  if (users.some((u) => u.email === trimmedEmail)) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const passwordHash = await hashPassword(password);
  const stored: StoredUser = {
    id: uuidv4(),
    email: trimmedEmail,
    name: trimmedName || trimmedEmail.split('@')[0],
    createdAt: Date.now(),
    passwordHash,
  };
  users.push(stored);
  saveUsers(users);
  setSessionUserId(stored.id);
  const { passwordHash: _ph, ...user } = stored;
  return user;
}

export async function login(email: string, password: string): Promise<User> {
  const trimmedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const stored = users.find((u) => u.email === trimmedEmail);
  if (!stored) throw new Error('Пользователь не найден');

  const passwordHash = await hashPassword(password);
  if (passwordHash !== stored.passwordHash) throw new Error('Неверный пароль');

  setSessionUserId(stored.id);
  const { passwordHash: _ph, ...user } = stored;
  return user;
}

export function logout(): void {
  setSessionUserId(null);
}

export function getCurrentUser(): User | null {
  const id = getSessionUserId();
  if (!id) return null;
  const stored = getUsers().find((u) => u.id === id);
  if (!stored) {
    setSessionUserId(null);
    return null;
  }
  const { passwordHash: _ph, ...user } = stored;
  return user;
}
