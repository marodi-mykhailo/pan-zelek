import { z } from 'zod';

// Auth validation
export const registerSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(6, 'Hasło musi mieć minimum 6 znaków'),
  name: z.string().min(2, 'Imię musi mieć minimum 2 znaki').optional(),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Nieprawidłowy numer telefonu').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
});

// Checkout validation
export const checkoutStep1Schema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Numer telefonu jest wymagany').regex(/^[0-9+\-\s()]+$/, 'Nieprawidłowy numer telefonu'),
  name: z.string().min(2, 'Imię i nazwisko jest wymagane'),
});

export const checkoutStep2Schema = z.object({
  street: z.string().min(5, 'Ulica i numer są wymagane'),
  city: z.string().min(2, 'Miasto jest wymagane'),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, 'Kod pocztowy musi być w formacie 00-000'),
  paymentMethod: z.enum(['card', 'blik', 'transfer']),
});

// Box builder validation
export const boxNameSchema = z.object({
  name: z.string().min(3, 'Nazwa boxa musi mieć minimum 3 znaki').max(50, 'Nazwa boxa może mieć maksimum 50 znaków'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutStep1Input = z.infer<typeof checkoutStep1Schema>;
export type CheckoutStep2Input = z.infer<typeof checkoutStep2Schema>;
export type BoxNameInput = z.infer<typeof boxNameSchema>;
