import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required').max(255),
    date: z.string().datetime({ message: 'Invalid date format' }).or(z.string().min(1)),
    categoryId: z.string().uuid('Invalid category'),
    paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'UPI', 'WALLET', 'OTHER']).optional(),
    merchant: z.string().max(255).optional(),
    notes: z.string().max(1000).optional(),
    location: z.string().max(255).optional(),
    tags: z.array(z.string()).optional(),
    isRecurring: z.boolean().optional(),
    recurringInterval: z.string().optional(),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    description: z.string().min(1).max(255).optional(),
    date: z.string().datetime().or(z.string().min(1)).optional(),
    categoryId: z.string().uuid().optional(),
    paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'UPI', 'WALLET', 'OTHER']).optional(),
    merchant: z.string().max(255).optional(),
    notes: z.string().max(1000).optional(),
    location: z.string().max(255).optional(),
    tags: z.array(z.string()).optional(),
    isRecurring: z.boolean().optional(),
    recurringInterval: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const expenseQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minAmount: z.string().optional(),
    maxAmount: z.string().optional(),
    paymentMethod: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
