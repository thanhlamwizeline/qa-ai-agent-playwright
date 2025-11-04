/**
 * Static test data constants organized by category
 */

import dotenv from 'dotenv';

import type {
  User,
  PaymentMethod
} from './data-interfaces';

dotenv.config();

export const USERS: Record<string, User> = {
  STANDARD_CUSTOMER: {
    userName: process.env.username as string,
    password: process.env.password as string,
    role: 'customer',
  },
  INVALID_USER_1: {
    userName: process.env.username as string,
    password: 'WrongPassword',
    firstName: 'Invalid',
    lastName: 'User 1',
    role: 'customer',
  },
  INVALID_USER_2: {
    userName: 'invaliduser',
    password: 'WrongPassword',
    firstName: 'Invalid',
    lastName: 'User 2',
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
