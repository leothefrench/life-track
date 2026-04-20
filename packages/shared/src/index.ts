import {z} from 'zod';
import { isCuid } from '@paralleldrive/cuid2';

export const ExpenseSchema = z.object({
  title: z.string().min(1, "La description est requise"),
  amount: z.coerce.number().positive("Le montant doit être supérieur à 0"),
  // MISE À JOUR ICI :
  category: z.enum([
    'LOGEMENT',
    'ENERGIE',
    'ALIMENTATION',
    'TRANSPORT',
    'ABONNEMENTS',
    'LOISIRS',
    'SANTE',
    'AUTRE',
  ]),
  date: z.coerce.date().optional(),
});

export const DeleteExpenseSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  email: z.string().email({ message: 'Email invalide' }),
  password: z
    .string()
    .min(8, 'Le mot de passe doit faire au moins 8 caractères')
    .regex(/[A-Z]/, 'Il faut au moins une majuscule')
    .regex(/[a-z]/, 'Il faut au moins une minuscule')
    .regex(/[0-9]/, 'Il faut au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Il faut au moins un caractère spécial'),
});

export type Expense = z.infer<typeof ExpenseSchema>;
export type DeleteExpenseInput = z.infer<typeof DeleteExpenseSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;