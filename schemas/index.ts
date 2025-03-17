import * as z from "zod";

export const TransactionSchema = z.object({
  amount: z.coerce.number().positive({
    message: "Amount must be greater than 0",
  }),
  date: z.date(),
  description: z.optional(z.string().trim()),
  categoryId: z.optional(z.string().trim()),
});

export const UpdateTransactionSchema = TransactionSchema.extend({
  id: z.string(),
});

export const BudgetSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
});
