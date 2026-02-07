import {z} from 'zod';
import { isCuid } from '@paralleldrive/cuid2';

export const ExpenseSchema = z.object({
  id: z
    .string()
    .refine((val) => isCuid(val), {
      message: "L'identifiant doit être un CUID2 valide",
    })
    .optional(),
  title: z.string().min(3, 'Le titre doit faire au moins 3 caractères'),
  amount: z.number().positive('Le montant doit être supérieur à 0'),
  category: z.enum(['LOYER', 'NOURRITURE', 'VETEMENTS', 'LOISIRS', 'AUTRE']),
  date: z.coerce.date().default(() => new Date()),
});

export const DeleteExpenseSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit faire au moins 8 caractères'),
});

export type Expense = z.infer<typeof ExpenseSchema>;
export type DeleteExpenseInput = z.infer<typeof DeleteExpenseSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;