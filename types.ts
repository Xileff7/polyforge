export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  filamentType: string;
}

export enum PaymentMethod {
  CASH = 'CASH',
  ASK_FOR_FREE = 'ASK_FOR_FREE'
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  customerName: string;
  notes?: string; // For specifying model details or other requests
  aiJudgmentReason?: string; // If they asked for free
  receiptMessage?: string;
}

export interface FreeRequestJudgment {
  approved: boolean;
  reason: string;
  wittyComment: string;
}