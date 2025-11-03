export interface User {
  email?: string;
  userName: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'customer' | 'guest';

export interface Product {
  productName: string;
  productPrice: number;
  imgSrc: string;
}

export interface Cart {
  productName: string;
  productPrice: number;
  total: number;
}

export interface PaymentMethod {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface UrlConfig {
  URL_HOMEPAGE: string;
  URL_PRODUCPAGE: string;
  URL_CARTPAGE: string;
}

export interface TestConfig {
  FE_URL: UrlConfig;
}
