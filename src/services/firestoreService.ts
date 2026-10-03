import {
  writeBatch,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  getShopDocRef,
  getUsersColRef,
  getCategoriesColRef,
  getProductsColRef,
  getCustomersColRef,
  getSuppliersColRef,
  getSalesColRef,
  getCustomerPaymentsColRef,
  getPurchasesColRef,
  getSupplierPaymentsColRef,
  getExpensesColRef,
  getCashTransactionsColRef,
  getDayCloseColRef,
  getAuditLogsColRef,
} from '../firebase/collections';
import {
  Shop,
  User,
  Category,
  Product,
  Customer,
  Supplier,
  Sale,
  CustomerPayment,
  Purchase,
  SupplierPayment,
  Expense,
  CashTransaction,
  DayCloseRecord,
  AuditLog,
} from '../types';

export const DEFAULT_SUPERMARKET_CATEGORIES = [
  'بقالة',
  'مشروبات',
  'ألبان',
  'مجمدات',
  'منظفات',
  'حلويات',
  'مخبوزات',
  'خضروات وفاكهة',
  'عام',
];

// Generate consistent device identifier for multi-device audit tracking
export function getOrCreateDeviceId(): string {
  try {
    let deviceId = localStorage.getItem('pos_device_id');
    if (!deviceId) {
      deviceId = 'DEV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem('pos_device_id', deviceId);
    }
    return deviceId;
  } catch {
    return 'DEV-WEB';
  }
}

export class FirestoreService {
  private static instance: FirestoreService;

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  // =========================================================================
  // 1. INITIALIZE NEW SHOP (STRICT ZERO BALANCE BASELINE)
  // =========================================================================
  async createNewShop(params: {
    shopId: string;
    shopName: string;
    phone?: string;
    address?: string;
    currency: string;
    managerName: string;
    managerUsername: string;
    managerPasswordHash: string;
    managerEmail?: string;
  }): Promise<{ shop: Shop; manager: User }> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    const shop: Shop = {
      id: params.shopId,
      name: params.shopName,
      phone: params.phone || '',
      address: params.address || '',
      currency: params.currency || 'EGP',
      createdAt: now,
      createdBy: params.managerUsername,
      ownerEmail: params.managerEmail || '',
      settings: {
        allowOverpayment: false,
        printReceipts: true,
        receiptFooter: 'شكراً لتعاملكم معنا ونسعد بزيارتكم دائماً',
        allowExceedDebtLimit: true,
      },
    };

    const manager: User = {
      id: 'USR-' + Date.now(),
      shopId: params.shopId,
      name: params.managerName,
      username: params.managerUsername,
      email: params.managerEmail || '',
      passwordHash: params.managerPasswordHash,
      role: 'manager',
      pin: '1234',
      active: true,
      createdAt: now,
    };

    // 1. Write Shop document
    const shopRef = getShopDocRef(params.shopId);
    batch.set(shopRef, shop);

    // 2. Write Manager user
    const userRef = doc(getUsersColRef(params.shopId), manager.id);
    batch.set(userRef, manager);

    // 3. Write default categories only (NO TRANSACTIONS, ZERO BALANCES)
    DEFAULT_SUPERMARKET_CATEGORIES.forEach((catName, idx) => {
      const catId = 'CAT-' + (idx + 1);
      const catDoc: Category = {
        id: catId,
        name: catName,
        active: true,
        createdAt: now,
      };
      const catRef = doc(getCategoriesColRef(params.shopId), catId);
      batch.set(catRef, catDoc);
    });

    // 4. Initial Audit Log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: manager.id,
      userName: manager.name,
      action: 'SHOP_INITIALIZED_ZERO_BALANCE',
      tableName: 'shops',
      recordId: params.shopId,
      oldValue: '',
      newValue: JSON.stringify({ shopName: params.shopName, currency: params.currency }),
      reason: 'إنشاء المحل الجديد وتصفير جميع الحركات النقدية والديون من الصفر',
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return { shop, manager };
  }

  // =========================================================================
  // 2. REALTIME LISTENERS FOR MULTI-DEVICE SYNCHRONIZATION
  // =========================================================================

  subscribeToSales(
    shopId: string,
    callback: (sales: Sale[]) => void
  ): Unsubscribe {
    const q = query(getSalesColRef(shopId), orderBy('createdAt', 'desc'), limit(500));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToCashTransactions(
    shopId: string,
    callback: (txs: CashTransaction[]) => void
  ): Unsubscribe {
    const q = query(getCashTransactionsColRef(shopId), orderBy('createdAt', 'desc'), limit(1000));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToCustomers(
    shopId: string,
    callback: (customers: Customer[]) => void
  ): Unsubscribe {
    const q = query(getCustomersColRef(shopId), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToCustomerPayments(
    shopId: string,
    callback: (payments: CustomerPayment[]) => void
  ): Unsubscribe {
    const q = query(getCustomerPaymentsColRef(shopId), orderBy('createdAt', 'desc'), limit(500));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToExpenses(
    shopId: string,
    callback: (expenses: Expense[]) => void
  ): Unsubscribe {
    const q = query(getExpensesColRef(shopId), orderBy('createdAt', 'desc'), limit(500));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToPurchases(
    shopId: string,
    callback: (purchases: Purchase[]) => void
  ): Unsubscribe {
    const q = query(getPurchasesColRef(shopId), orderBy('createdAt', 'desc'), limit(500));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToSuppliers(
    shopId: string,
    callback: (suppliers: Supplier[]) => void
  ): Unsubscribe {
    const q = query(getSuppliersColRef(shopId), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToSupplierPayments(
    shopId: string,
    callback: (payments: SupplierPayment[]) => void
  ): Unsubscribe {
    const q = query(getSupplierPaymentsColRef(shopId), orderBy('createdAt', 'desc'), limit(500));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToCategories(
    shopId: string,
    callback: (categories: Category[]) => void
  ): Unsubscribe {
    const q = query(getCategoriesColRef(shopId));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToProducts(
    shopId: string,
    callback: (products: Product[]) => void
  ): Unsubscribe {
    const q = query(getProductsColRef(shopId), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToUsers(
    shopId: string,
    callback: (users: User[]) => void
  ): Unsubscribe {
    const q = query(getUsersColRef(shopId));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  subscribeToAuditLogs(
    shopId: string,
    callback: (logs: AuditLog[]) => void
  ): Unsubscribe {
    const q = query(getAuditLogsColRef(shopId), orderBy('createdAt', 'desc'), limit(200));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => d.data());
      callback(list);
    });
  }

  // =========================================================================
  // 3. ATOMIC TRANSACTIONS (NO PARTIAL WRITES / NO RACE CONDITIONS)
  // =========================================================================

  // --- RECORD CASH SALE ---
  async recordCashSale(params: {
    shopId: string;
    sale: Omit<Sale, 'id' | 'createdAt' | 'status' | 'paymentType'>;
    user: User;
    deviceId: string;
  }): Promise<Sale> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const saleId = 'SL-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const fullSale: Sale = {
      ...params.sale,
      id: saleId,
      shopId: params.shopId,
      deviceId: params.deviceId,
      paymentType: 'cash',
      status: 'completed',
      createdBy: params.user.id,
      createdByName: params.user.name,
      createdAt: now,
    };

    // 1. Sale document
    const saleRef = doc(getSalesColRef(params.shopId), saleId);
    batch.set(saleRef, fullSale);

    // 2. Cash transaction in Treasury Ledger
    const txId = 'TX-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const cashTx: CashTransaction = {
      id: txId,
      transactionType: 'sale_cash',
      flow: 'in',
      amount: fullSale.totalAmount,
      referenceType: 'sale',
      referenceId: saleId,
      description: `بيع كاش فاتورة #${fullSale.saleNumber} - قسم ${fullSale.categoryName || 'عام'}`,
      createdBy: params.user.id,
      createdByName: params.user.name,
      createdAt: now,
    };
    const txRef = doc(getCashTransactionsColRef(params.shopId), txId);
    batch.set(txRef, cashTx);

    // 3. Audit log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: 'SALE_CASH_CREATED',
      tableName: 'sales',
      recordId: saleId,
      newValue: JSON.stringify({ amount: fullSale.totalAmount, bill: fullSale.saleNumber }),
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return fullSale;
  }

  // --- RECORD CREDIT SALE (آجل - NEVER ADDS TO TREASURY) ---
  async recordCreditSale(params: {
    shopId: string;
    sale: Omit<Sale, 'id' | 'createdAt' | 'status' | 'paymentType'>;
    user: User;
    deviceId: string;
  }): Promise<Sale> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const saleId = 'SL-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const fullSale: Sale = {
      ...params.sale,
      id: saleId,
      shopId: params.shopId,
      deviceId: params.deviceId,
      paymentType: 'credit',
      status: 'completed',
      createdBy: params.user.id,
      createdByName: params.user.name,
      createdAt: now,
    };

    // 1. Sale document
    const saleRef = doc(getSalesColRef(params.shopId), saleId);
    batch.set(saleRef, fullSale);

    // NOTE: Crucial Accounting Invariant: CREDIT SALES DO NOT AFFECT CASHTRANSACTIONS!

    // 2. Audit log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: 'SALE_CREDIT_CREATED',
      tableName: 'sales',
      recordId: saleId,
      newValue: JSON.stringify({
        amount: fullSale.totalAmount,
        customer: fullSale.customerName,
        bill: fullSale.saleNumber,
      }),
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return fullSale;
  }

  // --- RECORD CUSTOMER DEBT PAYMENT (تحصيل ديون) ---
  async recordCustomerPayment(params: {
    shopId: string;
    payment: Omit<CustomerPayment, 'id' | 'createdAt' | 'status'>;
    user: User;
    isCash: boolean;
  }): Promise<CustomerPayment> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const paymentId = 'CPAY-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const fullPayment: CustomerPayment = {
      ...params.payment,
      id: paymentId,
      status: 'completed',
      createdBy: params.user.id,
      createdByName: params.user.name,
      createdAt: now,
    };

    // 1. Payment doc
    const payRef = doc(getCustomerPaymentsColRef(params.shopId), paymentId);
    batch.set(payRef, fullPayment);

    // 2. If paid in cash, add to Treasury Ledger
    if (params.isCash) {
      const txId = 'TX-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const cashTx: CashTransaction = {
        id: txId,
        transactionType: 'debt_collection',
        flow: 'in',
        amount: fullPayment.amount,
        referenceType: 'customer_payment',
        referenceId: paymentId,
        description: `تحصيل دين نقدي من العميل: ${fullPayment.customerName || 'عميل'}`,
        createdBy: params.user.id,
        createdByName: params.user.name,
        createdAt: now,
      };
      const txRef = doc(getCashTransactionsColRef(params.shopId), txId);
      batch.set(txRef, cashTx);
    }

    // 3. Audit log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: 'CUSTOMER_DEBT_COLLECTED',
      tableName: 'customerPayments',
      recordId: paymentId,
      newValue: JSON.stringify({ customer: fullPayment.customerName, amount: fullPayment.amount }),
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return fullPayment;
  }

  // --- RECORD EXPENSE (مصروفات تشغيلية) ---
  async recordExpense(params: {
    shopId: string;
    expense: Omit<Expense, 'id' | 'createdAt' | 'status'>;
    user: User;
  }): Promise<Expense> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const expenseId = 'EXP-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const fullExpense: Expense = {
      ...params.expense,
      id: expenseId,
      status: 'completed',
      createdBy: params.user.id,
      createdByName: params.user.name,
      createdAt: now,
    };

    // 1. Expense document
    const expRef = doc(getExpensesColRef(params.shopId), expenseId);
    batch.set(expRef, fullExpense);

    // 2. If cash, deduct from Treasury Ledger
    if (fullExpense.paymentMethod === 'cash') {
      const txId = 'TX-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const cashTx: CashTransaction = {
        id: txId,
        transactionType: 'expense_cash',
        flow: 'out',
        amount: fullExpense.amount,
        referenceType: 'expense',
        referenceId: expenseId,
        description: `مصروف نقدي: ${fullExpense.categoryLabel} ${fullExpense.notes ? `(${fullExpense.notes})` : ''}`,
        createdBy: params.user.id,
        createdByName: params.user.name,
        createdAt: now,
      };
      const txRef = doc(getCashTransactionsColRef(params.shopId), txId);
      batch.set(txRef, cashTx);
    }

    // 3. Audit log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: 'EXPENSE_RECORDED',
      tableName: 'expenses',
      recordId: expenseId,
      newValue: JSON.stringify({ category: fullExpense.categoryLabel, amount: fullExpense.amount }),
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return fullExpense;
  }

  // --- RECORD PURCHASE (مشتريات بضاعة) ---
  async recordPurchase(params: {
    shopId: string;
    purchase: Omit<Purchase, 'id' | 'createdAt' | 'status'>;
    user: User;
  }): Promise<Purchase> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const purchaseId = 'PUR-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const fullPurchase: Purchase = {
      ...params.purchase,
      id: purchaseId,
      status: 'completed',
      createdBy: params.user.id,
      createdByName: params.user.name,
      createdAt: now,
    };

    // 1. Purchase doc
    const purRef = doc(getPurchasesColRef(params.shopId), purchaseId);
    batch.set(purRef, fullPurchase);

    // 2. If cash purchase, deduct from Treasury
    if (fullPurchase.paymentType === 'cash') {
      const txId = 'TX-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const cashTx: CashTransaction = {
        id: txId,
        transactionType: 'purchase_cash',
        flow: 'out',
        amount: fullPurchase.totalAmount,
        referenceType: 'purchase',
        referenceId: purchaseId,
        description: `شراء بضاعة كاش من ${fullPurchase.supplierName || 'مورد'}`,
        createdBy: params.user.id,
        createdByName: params.user.name,
        createdAt: now,
      };
      const txRef = doc(getCashTransactionsColRef(params.shopId), txId);
      batch.set(txRef, cashTx);
    }

    // 3. Audit log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: 'PURCHASE_RECORDED',
      tableName: 'purchases',
      recordId: purchaseId,
      newValue: JSON.stringify({
        supplier: fullPurchase.supplierName,
        amount: fullPurchase.totalAmount,
        type: fullPurchase.paymentType,
      }),
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return fullPurchase;
  }

  // --- RECORD SUPPLIER PAYMENT (سداد موردين) ---
  async recordSupplierPayment(params: {
    shopId: string;
    payment: Omit<SupplierPayment, 'id' | 'createdAt'>;
    user: User;
    isCash: boolean;
  }): Promise<SupplierPayment> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const paymentId = 'SPAY-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const fullPayment: SupplierPayment = {
      ...params.payment,
      id: paymentId,
      createdBy: params.user.id,
      createdAt: now,
    };

    // 1. Supplier payment doc
    const payRef = doc(getSupplierPaymentsColRef(params.shopId), paymentId);
    batch.set(payRef, fullPayment);

    // 2. If cash, deduct from Treasury
    if (params.isCash) {
      const txId = 'TX-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const cashTx: CashTransaction = {
        id: txId,
        transactionType: 'withdrawal',
        flow: 'out',
        amount: fullPayment.amount,
        referenceType: 'manual',
        referenceId: paymentId,
        description: `سداد مستحقات نقدية للمورد: ${fullPayment.supplierName || 'مورد'}`,
        createdBy: params.user.id,
        createdByName: params.user.name,
        createdAt: now,
      };
      const txRef = doc(getCashTransactionsColRef(params.shopId), txId);
      batch.set(txRef, cashTx);
    }

    // 3. Audit log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: 'SUPPLIER_PAYMENT_RECORDED',
      tableName: 'supplierPayments',
      recordId: paymentId,
      newValue: JSON.stringify({ supplier: fullPayment.supplierName, amount: fullPayment.amount }),
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return fullPayment;
  }

  // --- TREASURY DEPOSIT / WITHDRAWAL (إيداع أو سحب نقدي) ---
  async recordDepositOrWithdrawal(params: {
    shopId: string;
    flow: 'in' | 'out';
    type: 'deposit' | 'withdrawal';
    amount: number;
    description: string;
    user: User;
  }): Promise<CashTransaction> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const txId = 'TX-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const cashTx: CashTransaction = {
      id: txId,
      transactionType: params.type,
      flow: params.flow,
      amount: params.amount,
      referenceType: 'manual',
      description: params.description,
      createdBy: params.user.id,
      createdByName: params.user.name,
      createdAt: now,
    };

    const txRef = doc(getCashTransactionsColRef(params.shopId), txId);
    batch.set(txRef, cashTx);

    // Audit log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: params.type === 'deposit' ? 'TREASURY_DEPOSIT' : 'TREASURY_WITHDRAWAL',
      tableName: 'cashTransactions',
      recordId: txId,
      newValue: JSON.stringify({ amount: params.amount, note: params.description }),
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return cashTx;
  }

  // --- CANCEL SALE (SOFT REVERSAL - NEVER HARD DELETE) ---
  async cancelSale(params: {
    shopId: string;
    sale: Sale;
    reason: string;
    user: User;
  }): Promise<void> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // 1. Update sale status to cancelled
    const saleRef = doc(getSalesColRef(params.shopId), params.sale.id);
    batch.update(saleRef, {
      status: 'cancelled',
      cancelledReason: params.reason,
      cancelledAt: now,
      cancelledBy: params.user.id,
    });

    // 2. If it was cash sale, reverse it in Treasury Ledger
    if (params.sale.paymentType === 'cash') {
      const txId = 'TX-REV-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const revTx: CashTransaction = {
        id: txId,
        transactionType: 'reversal',
        flow: 'out',
        amount: params.sale.totalAmount,
        referenceType: 'sale',
        referenceId: params.sale.id,
        description: `عكس عملية بيع كاش ملغاة #${params.sale.saleNumber} (السبب: ${params.reason})`,
        createdBy: params.user.id,
        createdByName: params.user.name,
        createdAt: now,
      };
      const txRef = doc(getCashTransactionsColRef(params.shopId), txId);
      batch.set(txRef, revTx);
    }

    // 3. Audit log
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: 'SALE_CANCELLED_WITH_REVERSAL',
      tableName: 'sales',
      recordId: params.sale.id,
      oldValue: 'completed',
      newValue: 'cancelled',
      reason: params.reason,
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
  }

  // --- RECORD DAY CLOSING (إغلاق الوردية / اليوم) ---
  async recordDayClosing(params: {
    shopId: string;
    closingRecord: Omit<DayCloseRecord, 'id' | 'closedAt'>;
    user: User;
  }): Promise<DayCloseRecord> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const closeId = 'CLOSE-' + Date.now();

    const fullRecord: DayCloseRecord = {
      ...params.closingRecord,
      id: closeId,
      closedAt: now,
    };

    const closeRef = doc(getDayCloseColRef(params.shopId), closeId);
    batch.set(closeRef, fullRecord);

    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: params.user.id,
      userName: params.user.name,
      action: 'DAY_CLOSED',
      tableName: 'dailyClosings',
      recordId: closeId,
      newValue: JSON.stringify({
        date: fullRecord.date,
        expectedCash: fullRecord.expectedCash,
        actualCash: fullRecord.actualCash,
        diff: fullRecord.difference,
      }),
      createdAt: now,
    };
    const auditRef = doc(getAuditLogsColRef(params.shopId), auditId);
    batch.set(auditRef, auditDoc);

    await batch.commit();
    return fullRecord;
  }

  // =========================================================================
  // 4. ENTITY MANAGEMENT (CUSTOMERS, SUPPLIERS, PRODUCTS, CATEGORIES, USERS)
  // =========================================================================

  async addCustomer(shopId: string, customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const now = new Date().toISOString();
    const id = 'CUST-' + Date.now();
    const fullCust: Customer = { ...customer, id, createdAt: now };
    const ref = doc(getCustomersColRef(shopId), id);
    await setDoc(ref, fullCust);
    return fullCust;
  }

  async addSupplier(shopId: string, supplier: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> {
    const now = new Date().toISOString();
    const id = 'SUP-' + Date.now();
    const fullSup: Supplier = { ...supplier, id, createdAt: now };
    const ref = doc(getSuppliersColRef(shopId), id);
    await setDoc(ref, fullSup);
    return fullSup;
  }

  async addCategory(shopId: string, name: string): Promise<Category> {
    const now = new Date().toISOString();
    const id = 'CAT-' + Date.now();
    const cat: Category = { id, name, active: true, createdAt: now };
    const ref = doc(getCategoriesColRef(shopId), id);
    await setDoc(ref, cat);
    return cat;
  }

  async addProduct(shopId: string, product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const now = new Date().toISOString();
    const id = 'PRD-' + Date.now();
    const prod: Product = { ...product, id, createdAt: now };
    const ref = doc(getProductsColRef(shopId), id);
    await setDoc(ref, prod);
    return prod;
  }

  async addUser(shopId: string, user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const now = new Date().toISOString();
    const id = 'USR-' + Date.now();
    const fullUser: User = { ...user, id, shopId, active: true, createdAt: now };
    const ref = doc(getUsersColRef(shopId), id);
    await setDoc(ref, fullUser);
    return fullUser;
  }

  // =========================================================================
  // 5. PURE LEDGER ACCOUNTING ENGINE (ZERO DRIFT / CALCULATED FROM EVENTS)
  // =========================================================================

  // Current Treasury Balance = Sum(Cash In) - Sum(Cash Out)
  calculateCashBalance(txs: CashTransaction[]): number {
    return txs.reduce((acc, tx) => {
      if (tx.flow === 'in') return acc + tx.amount;
      if (tx.flow === 'out') return acc - tx.amount;
      return acc;
    }, 0);
  }

  // Customer Debt = Sum(Active Credit Sales) - Sum(Active Customer Payments)
  calculateCustomerBalance(
    customerId: string,
    sales: Sale[],
    payments: CustomerPayment[]
  ): number {
    const creditSalesTotal = sales
      .filter((s) => s.customerId === customerId && s.paymentType === 'credit' && s.status !== 'cancelled')
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const paymentsTotal = payments
      .filter((p) => p.customerId === customerId && p.status !== 'cancelled')
      .reduce((sum, p) => sum + p.amount, 0);

    return Math.max(0, creditSalesTotal - paymentsTotal);
  }

  // Supplier Balance = Sum(Active Credit Purchases) - Sum(Supplier Payments)
  calculateSupplierBalance(
    supplierId: string,
    purchases: Purchase[],
    payments: SupplierPayment[]
  ): number {
    const creditPurchases = purchases
      .filter((p) => p.supplierId === supplierId && p.paymentType === 'credit' && p.status !== 'cancelled')
      .reduce((sum, p) => sum + p.totalAmount, 0);

    const paidTotal = payments
      .filter((p) => p.supplierId === supplierId)
      .reduce((sum, p) => sum + p.amount, 0);

    return Math.max(0, creditPurchases - paidTotal);
  }

  // =========================================================================
  // 6. CLEAR / ZERO ALL TRANSACTIONS (FRESH START)
  // =========================================================================
  async clearAllTransactions(shopId: string, user: User): Promise<void> {
    const colRefs = [
      getSalesColRef(shopId),
      getCustomerPaymentsColRef(shopId),
      getPurchasesColRef(shopId),
      getSupplierPaymentsColRef(shopId),
      getExpensesColRef(shopId),
      getCashTransactionsColRef(shopId),
      getDayCloseColRef(shopId),
    ];

    for (const colRef of colRefs) {
      try {
        const snap = await getDocs(colRef as any);
        if (!snap.empty) {
          const batch = writeBatch(db);
          snap.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      } catch (err) {
        console.warn('Error clearing collection in Firestore:', err);
      }
    }

    // Log the transaction reset in auditLogs
    const now = new Date().toISOString();
    const auditId = 'AUD-' + Date.now();
    const auditDoc: AuditLog = {
      id: auditId,
      userId: user.id,
      userName: user.name,
      action: 'CLEAR_TRANSACTIONS',
      tableName: 'system',
      recordId: 'all',
      reason: 'تصفير كافة المعاملات والمبيعات والديون والمصروفات بالكامل والبدء من الصفر',
      createdAt: now,
    };
    try {
      await setDoc(doc(getAuditLogsColRef(shopId), auditId), auditDoc);
    } catch (e) {
      console.warn('Error saving audit log:', e);
    }
  }
}
