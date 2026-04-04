export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
}
