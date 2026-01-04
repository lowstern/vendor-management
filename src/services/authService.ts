import { User } from '../types';
// @ts-ignore - crypto-js types
import CryptoJS from 'crypto-js';

// In production, replace this with a real backend API
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Encryption key (in production, use environment variables and proper key management)
// @ts-ignore - Vite env types
const ENCRYPTION_KEY = (import.meta.env?.VITE_ENCRYPTION_KEY) || 'default-secret-key-change-in-production';

// Storage keys
const STORAGE_KEY_USER = 'vendor_mgmt_user';
const STORAGE_KEY_TOKEN = 'vendor_mgmt_token';

// Mock users database (in production, use a real database)
const MOCK_USERS: Array<{ email: string; passwordHash: string; user: User }> = [
  {
    email: 'admin@example.com',
    passwordHash: hashPassword('admin123'), // Change in production!
      user: {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      firmId: 'firm-1',
      duoEnabled: false, // Duo is optional - set to false by default
      duoRegistered: false,
      createdAt: new Date().toISOString(),
    },
  },
];

function hashPassword(password: string): string {
  // Using SHA-256 (in production, use bcrypt on the backend)
  return CryptoJS.SHA256(password).toString();
}

function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    // In production, this would be an API call
    // For now, use mock authentication
    const hashedPassword = hashPassword(password);
    const userData = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hashedPassword
    );

    if (!userData) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return null;
    }

    // Store user data securely (in production, use httpOnly cookies)
    const encryptedUser = encryptData(JSON.stringify(userData.user));
    localStorage.setItem(STORAGE_KEY_USER, encryptedUser);
    
    // Generate token (in production, backend would provide JWT)
    const token = generateToken(userData.user);
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    return userData.user;
  },

  async signup(email: string, password: string, name: string, firmId?: string): Promise<User | null> {
    // Validate input
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    if (!isStrongPassword(password)) {
      throw new Error('Password must contain uppercase, lowercase, number, and special character');
    }

    // Check if user already exists
    if (MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists');
    }

    // In production, this would be an API call
    const hashedPassword = hashPassword(password);
    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name: sanitizeInput(name),
      role: 'user',
      firmId: firmId,
      duoEnabled: false,
      duoRegistered: false,
      createdAt: new Date().toISOString(),
    };

    MOCK_USERS.push({
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      user: newUser,
    });

    // Store user data
    const encryptedUser = encryptData(JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY_USER, encryptedUser);
    
    const token = generateToken(newUser);
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    return newUser;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  },

  getCurrentUser(): User | null {
    try {
      const encryptedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (!encryptedUser) return null;

      const decryptedData = decryptData(encryptedUser);
      return JSON.parse(decryptedData) as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  },

  updateUser(user: User): void {
    const encryptedUser = encryptData(JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_USER, encryptedUser);
  },
};

function generateToken(user: User): string {
  // In production, this would be a JWT from the backend
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  return encryptData(JSON.stringify(payload));
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

function sanitizeInput(input: string): string {
  // Remove potential XSS characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

