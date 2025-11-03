/**
 * Static test data constants organized by category
 */

import type { 
  User, 
  PaymentMethod
} from './data-interfaces';

export const USERS: Record<string, User> = {
  ADMIN: {
    userName: 'Admin',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  STANDARD_CUSTOMER: {
    userName: 'qatest',
    password: '123456',
    role: 'customer',
  },
  INVALID_USER: {
    email: 'invalid@example.com',
    userName: 'invaliduser',
    password: 'WrongPassword',
    firstName: 'Invalid',
    lastName: 'User',
    role: 'customer',
  },
};

export const PAYMENT_METHODS: Record<string, PaymentMethod> = {
  VALID_CARD: {
    cardNumber: '4532015112830366',
    cardHolder: 'John Doe',
    expiryMonth: '12',
    expiryYear: '2026'
  },
  EXPIRED_CARD: {
    cardNumber: '4532015112830366',
    cardHolder: 'Test User',
    expiryMonth: '01',
    expiryYear: '2020',
  }
};