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

export type Expense = z.infer<typeof ExpenseSchema>;