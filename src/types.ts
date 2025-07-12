export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
  picture?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  picture?: string;
  description?: string;
  user: User;
}

export interface AuthResponse {
  error?: string
  user: User;
  token: string;
}
