export type UserRole = 'manager' | 'cashier' | 'admin';

export interface Shop {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  currency: string;
  createdAt: string;
  createdBy: string;
  ownerEmail?: string;
  settings?: {
    allowOverpayment?: boolean;
    printReceipts?: boolean;
    receiptFooter?: string;
    allowExceedDebtLimit?: boolean;
  };
}

export interface User {
  id: string;
  shopId?: string;
  name: string;
  username: string;
  email?: string;
  passwordHash: string;
  role: UserRole;
  pin: string;
  active?: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  creditLimit?: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minimumStock: number;
  active: boolean;
  createdAt: string;
}

export type PaymentType = 'cash' | 'credit';

export interface Sale {
  id: string;
  shopId?: string;
  deviceId?: string;
  saleNumber: string;
  customerId?: string;
  customerName?: string;
  paymentType: PaymentType;
  totalAmount: number;
  categoryId: string;
  categoryName?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  notes?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  status: 'completed' | 'cancelled';
  cancelledReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface CustomerPayment {
  id: string;
  customerId: string;
  customerName?: string;
  amount: number;
  paymentMethod: 'cash' | 'transfer' | 'other';
  notes?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  status: 'completed' | 'cancelled';
}

export interface Purchase {
  id: string;
  supplierId?: string;
  supplierName?: string;
  paymentType: PaymentType;
  totalAmount: number;
  notes?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  status: 'completed' | 'cancelled';
}

export interface SupplierPayment {
  id: string;
  supplierId: string;
  supplierName?: string;
  amount: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'electricity'
  | 'water'
  | 'rent'
  | 'wages'
  | 'transport'
  | 'maintenance'
  | 'waste'
  | 'other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  categoryLabel: string;
  amount: number;
  paymentMethod: 'cash' | 'other';
  notes?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  status: 'completed' | 'cancelled';
}

export type CashFlow = 'in' | 'out';
export type CashTransactionType =
  | 'sale_cash'
  | 'debt_collection'
  | 'purchase_cash'
  | 'expense_cash'
  | 'deposit'
  | 'withdrawal'
  | 'correction'
  | 'reversal';

export interface CashTransaction {
  id: string;
  transactionType: CashTransactionType;
  flow: CashFlow;
  amount: number;
  referenceType: 'sale' | 'customer_payment' | 'purchase' | 'expense' | 'manual';
  referenceId?: string;
  description: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
}

export interface DayCloseRecord {
  id: string;
  date: string;
  expectedCash: number;
  actualCash: number;
  difference: number;
  totalSales: number;
  cashSales: number;
  creditSales: number;
  salesCount: number;
  debtCollected: number;
  newDebts: number;
  cashPurchases: number;
  creditPurchases: number;
  cashExpenses: number;
  notes?: string;
  closedBy: string;
  closedByName?: string;
  closedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  tableName: string;
  recordId: string;
  oldValue?: string;
  newValue?: string;
  reason?: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  address: string;
  currency: string;
  receiptFooter: string;
  openingCashBalance: number;
  allowExceedDebtLimit: boolean;
}

export interface InventoryCount {
  id: string;
  productId: string;
  productName: string;
  recordedQty: number;
  actualQty: number;
  difference: number;
  status: 'match' | 'deficit' | 'surplus';
  date: string;
  checkedBy: string;
}

export interface MonthFinancialStat {
  month: number;
  monthName: string;
  salesTotal: number;
  salesCash: number;
  salesCredit: number;
  debtCollected: number;
  totalInflow: number;
  purchasesTotal: number;
  purchasesCash: number;
  purchasesCredit: number;
  expensesTotal: number;
  withdrawals: number;
  netProfit: number;
  salesCount: number;
}

export interface MostPulledItem {
  id: string;
  name: string;
  categoryName: string;
  totalQuantity: number;
  totalSalesAmount: number;
  salesCount: number;
  percentageOfSales: number;
  unitPrice: number;
}

export interface MostPulledCategory {
  id: string;
  name: string;
  totalSalesAmount: number;
  salesCount: number;
  percentage: number;
}

export interface FinancialPillarsSummary {
  incomePillar: {
    totalSales: number;
    cashSales: number;
    creditSales: number;
    debtCollections: number;
    totalCashInflow: number;
    salesCount: number;
  };
  debtsOnStorePillar: {
    totalPayables: number;
    suppliersCount: number;
    totalCreditPurchases: number;
    totalPaidToSuppliers: number;
    topSuppliersOwed: Array<{ id: string; name: string; phone: string; balance: number }>;
  };
  debtsForStorePillar: {
    totalReceivables: number;
    debtorsCount: number;
    totalCreditGiven: number;
    totalCollected: number;
    topDebtors: Array<{ id: string; name: string; phone: string; balance: number }>;
  };
  mostPulledItemsPillar: {
    topItems: MostPulledItem[];
    topCategories: MostPulledCategory[];
    totalQuantityPulled: number;
    totalPulledValue: number;
    cashWithdrawalsTotal: number;
    cashWithdrawalsCount: number;
    topWithdrawalReasons: Array<{ reason: string; amount: number; count: number }>;
    recentWithdrawals: CashTransaction[];
  };
  withdrawalsPillar: {
    totalWithdrawals: number;
    withdrawalsCount: number;
    thisMonthWithdrawals: number;
    topReasons: Array<{ reason: string; amount: number; count: number }>;
    recentWithdrawals: CashTransaction[];
  };
}

