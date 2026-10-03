import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { DatabaseService } from '../db/dbService';
import {
  FirestoreService,
  getOrCreateDeviceId,
  DEFAULT_SUPERMARKET_CATEGORIES,
} from '../services/firestoreService';
import {
  Shop,
  User,
  Customer,
  Supplier,
  Category,
  Product,
  Sale,
  CustomerPayment,
  Purchase,
  SupplierPayment,
  Expense,
  CashTransaction,
  AuditLog,
} from '../types';

interface ShopContextType {
  // Current Shop & Device
  shopId: string;
  shop: Shop | null;
  deviceId: string;
  isOnline: boolean;
  isSyncing: boolean;
  isLoading: boolean;

  // Real-time Data Collections
  sales: Sale[];
  cashTransactions: CashTransaction[];
  customers: Customer[];
  customerPayments: CustomerPayment[];
  suppliers: Supplier[];
  purchases: Purchase[];
  supplierPayments: SupplierPayment[];
  expenses: Expense[];
  categories: Category[];
  products: Product[];
  users: User[];
  auditLogs: AuditLog[];

  // Live Calculated Ledger Metrics
  treasuryBalance: number;
  todayStats: {
    salesTotal: number;
    salesCash: number;
    salesCredit: number;
    salesCount: number;
    debtCollected: number;
    purchasesTotal: number;
    expensesTotal: number;
  };
  totalReceivables: number; // ديون للعملاء
  totalPayables: number; // ديون على المحل للموردين

  // Helper Methods
  switchShop: (newShopId: string) => void;
  createNewShop: (params: {
    shopId: string;
    shopName: string;
    phone?: string;
    address?: string;
    currency: string;
    managerName: string;
    managerUsername: string;
    managerPasswordHash: string;
  }) => Promise<{ shop: Shop; manager: User }>;

  // Financial Operations
  recordCashSale: (
    sale: Omit<Sale, 'id' | 'createdAt' | 'status' | 'paymentType'>,
    user: User
  ) => Promise<Sale>;
  recordCreditSale: (
    sale: Omit<Sale, 'id' | 'createdAt' | 'status' | 'paymentType'>,
    user: User
  ) => Promise<Sale>;
  recordCustomerPayment: (
    payment: Omit<CustomerPayment, 'id' | 'createdAt' | 'status'>,
    user: User,
    isCash: boolean
  ) => Promise<CustomerPayment>;
  recordExpense: (
    expense: Omit<Expense, 'id' | 'createdAt' | 'status'>,
    user: User
  ) => Promise<Expense>;
  recordPurchase: (
    purchase: Omit<Purchase, 'id' | 'createdAt' | 'status'>,
    user: User
  ) => Promise<Purchase>;
  recordSupplierPayment: (
    payment: Omit<SupplierPayment, 'id' | 'createdAt'>,
    user: User,
    isCash: boolean
  ) => Promise<SupplierPayment>;
  recordDepositOrWithdrawal: (
    flow: 'in' | 'out',
    type: 'deposit' | 'withdrawal',
    amount: number,
    description: string,
    user: User
  ) => Promise<CashTransaction>;
  cancelSale: (sale: Sale, reason: string, user: User) => Promise<void>;

  // Entity Management
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<Customer>;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => Promise<Supplier>;
  addCategory: (name: string) => Promise<Category>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<User>;

  // Balance Calculators
  getCustomerBalance: (customerId: string) => number;
  getSupplierBalance: (supplierId: string) => number;

  // Reset / Zero All Transactions
  resetAllTransactions: (user: User) => Promise<{ success: boolean; message: string }>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const firestoreService = useMemo(() => FirestoreService.getInstance(), []);
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  // Active Shop ID from localStorage or default
  const [shopId, setShopId] = useState<string>(() => {
    try {
      return localStorage.getItem('pos_active_shop_id') || 'SHOP-DEFAULT-01';
    } catch {
      return 'SHOP-DEFAULT-01';
    }
  });

  const [shop, setShop] = useState<Shop | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Real-time collections state
  const [sales, setSales] = useState<Sale[]>([]);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerPayments, setCustomerPayments] = useState<CustomerPayment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Connectivity Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Subscribe to Realtime Data when shopId changes
  useEffect(() => {
    if (!shopId) return;

    try {
      localStorage.setItem('pos_active_shop_id', shopId);
    } catch {}

    setIsLoading(true);
    setIsSyncing(true);

    const unsubs: Array<() => void> = [];

    try {
      // 1. Sales
      unsubs.push(
        firestoreService.subscribeToSales(shopId, (data) => {
          setSales(data);
          setIsSyncing(false);
          setIsLoading(false);
        })
      );

      // 2. Cash Transactions
      unsubs.push(
        firestoreService.subscribeToCashTransactions(shopId, (data) => {
          setCashTransactions(data);
        })
      );

      // 3. Customers
      unsubs.push(
        firestoreService.subscribeToCustomers(shopId, (data) => {
          setCustomers(data);
        })
      );

      // 4. Customer Payments
      unsubs.push(
        firestoreService.subscribeToCustomerPayments(shopId, (data) => {
          setCustomerPayments(data);
        })
      );

      // 5. Suppliers
      unsubs.push(
        firestoreService.subscribeToSuppliers(shopId, (data) => {
          setSuppliers(data);
        })
      );

      // 6. Purchases
      unsubs.push(
        firestoreService.subscribeToPurchases(shopId, (data) => {
          setPurchases(data);
        })
      );

      // 7. Supplier Payments
      unsubs.push(
        firestoreService.subscribeToSupplierPayments(shopId, (data) => {
          setSupplierPayments(data);
        })
      );

      // 8. Expenses
      unsubs.push(
        firestoreService.subscribeToExpenses(shopId, (data) => {
          setExpenses(data);
        })
      );

      // 9. Categories
      unsubs.push(
        firestoreService.subscribeToCategories(shopId, (data) => {
          // If no categories yet, provide default list for UI
          if (data.length === 0) {
            setCategories(
              DEFAULT_SUPERMARKET_CATEGORIES.map((c, i) => ({
                id: `CAT-${i + 1}`,
                name: c,
                active: true,
                createdAt: new Date().toISOString(),
              }))
            );
          } else {
            setCategories(data);
          }
        })
      );

      // 10. Products
      unsubs.push(
        firestoreService.subscribeToProducts(shopId, (data) => {
          setProducts(data);
        })
      );

      // 11. Users
      unsubs.push(
        firestoreService.subscribeToUsers(shopId, (data) => {
          setUsers(data);
        })
      );

      // 12. Audit Logs
      unsubs.push(
        firestoreService.subscribeToAuditLogs(shopId, (data) => {
          setAuditLogs(data);
        })
      );
    } catch (err) {
      console.warn('Realtime subscription fallback mode activated:', err);
      setIsLoading(false);
      setIsSyncing(false);
    }

    return () => {
      unsubs.forEach((u) => {
        try {
          u();
        } catch {}
      });
    };
  }, [shopId, firestoreService]);

  // =========================================================================
  // CALCULATED LEDGER STATS (PURE EVENT RECONCILIATION)
  // =========================================================================

  // Treasury Balance = Sum(Cash In) - Sum(Cash Out)
  const treasuryBalance = useMemo(() => {
    return firestoreService.calculateCashBalance(cashTransactions);
  }, [cashTransactions, firestoreService]);

  // Customer Balance Calculator
  const getCustomerBalance = (customerId: string) => {
    return firestoreService.calculateCustomerBalance(customerId, sales, customerPayments);
  };

  // Supplier Balance Calculator
  const getSupplierBalance = (supplierId: string) => {
    return firestoreService.calculateSupplierBalance(supplierId, purchases, supplierPayments);
  };

  // Total Receivables = Sum of all individual customer balances
  const totalReceivables = useMemo(() => {
    return customers.reduce((sum, c) => sum + getCustomerBalance(c.id), 0);
  }, [customers, sales, customerPayments]);

  // Total Payables = Sum of all individual supplier balances
  const totalPayables = useMemo(() => {
    return suppliers.reduce((sum, s) => sum + getSupplierBalance(s.id), 0);
  }, [suppliers, purchases, supplierPayments]);

  // Today's Date String in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's Live Stats
  const todayStats = useMemo(() => {
    const todaySales = sales.filter(
      (s) => s.createdAt.startsWith(todayStr) && s.status !== 'cancelled'
    );
    const salesTotal = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
    const salesCash = todaySales
      .filter((s) => s.paymentType === 'cash')
      .reduce((sum, s) => sum + s.totalAmount, 0);
    const salesCredit = todaySales
      .filter((s) => s.paymentType === 'credit')
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const debtCollected = customerPayments
      .filter((p) => p.createdAt.startsWith(todayStr) && p.status !== 'cancelled')
      .reduce((sum, p) => sum + p.amount, 0);

    const purchasesTotal = purchases
      .filter((p) => p.createdAt.startsWith(todayStr) && p.status !== 'cancelled')
      .reduce((sum, p) => sum + p.totalAmount, 0);

    const expensesTotal = expenses
      .filter((e) => e.createdAt.startsWith(todayStr) && e.status !== 'cancelled')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      salesTotal,
      salesCash,
      salesCredit,
      salesCount: todaySales.length,
      debtCollected,
      purchasesTotal,
      expensesTotal,
    };
  }, [sales, customerPayments, purchases, expenses, todayStr]);

  // Actions
  const switchShop = (newShopId: string) => {
    setShopId(newShopId);
  };

  const createNewShop = async (params: {
    shopId: string;
    shopName: string;
    phone?: string;
    address?: string;
    currency: string;
    managerName: string;
    managerUsername: string;
    managerPasswordHash: string;
  }) => {
    setIsSyncing(true);
    const dbInstance = DatabaseService.getInstance();
    const now = new Date().toISOString();

    // 1. Update local database settings
    dbInstance.updateSettings(
      {
        storeName: params.shopName,
        currency: params.currency || 'جنيه',
        phone: params.phone || '',
        address: params.address || '',
        openingCashBalance: 0,
      },
      { id: 'admin', name: params.managerName }
    );

    // 2. Create the new manager user in local DB
    const managerUser: User = {
      id: 'usr-' + Date.now(),
      shopId: params.shopId,
      name: params.managerName,
      username: params.managerUsername,
      passwordHash: params.managerPasswordHash,
      role: 'admin',
      pin: '1234',
      active: true,
      createdAt: now,
    };
    dbInstance.saveUser(managerUser, { id: managerUser.id, name: managerUser.name });

    // 3. Reset all transactions to absolute zero
    dbInstance.resetAllTransactions({ id: managerUser.id, name: managerUser.name }, true);

    // 4. Update local context memory
    setSales([]);
    setCashTransactions([]);
    setCustomerPayments([]);
    setPurchases([]);
    setSupplierPayments([]);
    setExpenses([]);
    localStorage.setItem('pos_active_shop_id', params.shopId);

    // 5. Try creating on Cloud Firestore
    let activeShopObj: Shop = {
      id: params.shopId,
      name: params.shopName,
      currency: params.currency || 'EGP',
      phone: params.phone || '',
      address: params.address || '',
      createdAt: now,
      createdBy: params.managerUsername,
    };

    try {
      const cloudResult = await firestoreService.createNewShop(params);
      if (cloudResult?.shop) {
        activeShopObj = cloudResult.shop;
      }
    } catch (cloudErr) {
      console.warn('Cloud shop creation fallback to local storage:', cloudErr);
    }

    setShop(activeShopObj);
    setShopId(params.shopId);
    setIsSyncing(false);
    return { shop: activeShopObj, manager: managerUser };
  };

  const recordCashSale = async (
    sale: Omit<Sale, 'id' | 'createdAt' | 'status' | 'paymentType'>,
    user: User
  ) => {
    setIsSyncing(true);
    try {
      const res = await firestoreService.recordCashSale({
        shopId,
        sale,
        user,
        deviceId,
      });
      return res;
    } finally {
      setIsSyncing(false);
    }
  };

  const recordCreditSale = async (
    sale: Omit<Sale, 'id' | 'createdAt' | 'status' | 'paymentType'>,
    user: User
  ) => {
    setIsSyncing(true);
    try {
      const res = await firestoreService.recordCreditSale({
        shopId,
        sale,
        user,
        deviceId,
      });
      return res;
    } finally {
      setIsSyncing(false);
    }
  };

  const recordCustomerPayment = async (
    payment: Omit<CustomerPayment, 'id' | 'createdAt' | 'status'>,
    user: User,
    isCash: boolean
  ) => {
    setIsSyncing(true);
    try {
      const res = await firestoreService.recordCustomerPayment({
        shopId,
        payment,
        user,
        isCash,
      });
      return res;
    } finally {
      setIsSyncing(false);
    }
  };

  const recordExpense = async (
    expense: Omit<Expense, 'id' | 'createdAt' | 'status'>,
    user: User
  ) => {
    setIsSyncing(true);
    try {
      const res = await firestoreService.recordExpense({
        shopId,
        expense,
        user,
      });
      return res;
    } finally {
      setIsSyncing(false);
    }
  };

  const recordPurchase = async (
    purchase: Omit<Purchase, 'id' | 'createdAt' | 'status'>,
    user: User
  ) => {
    setIsSyncing(true);
    try {
      const res = await firestoreService.recordPurchase({
        shopId,
        purchase,
        user,
      });
      return res;
    } finally {
      setIsSyncing(false);
    }
  };

  const recordSupplierPayment = async (
    payment: Omit<SupplierPayment, 'id' | 'createdAt'>,
    user: User,
    isCash: boolean
  ) => {
    setIsSyncing(true);
    try {
      const res = await firestoreService.recordSupplierPayment({
        shopId,
        payment,
        user,
        isCash,
      });
      return res;
    } finally {
      setIsSyncing(false);
    }
  };

  const recordDepositOrWithdrawal = async (
    flow: 'in' | 'out',
    type: 'deposit' | 'withdrawal',
    amount: number,
    description: string,
    user: User
  ) => {
    setIsSyncing(true);
    try {
      const res = await firestoreService.recordDepositOrWithdrawal({
        shopId,
        flow,
        type,
        amount,
        description,
        user,
      });
      return res;
    } finally {
      setIsSyncing(false);
    }
  };

  const cancelSale = async (sale: Sale, reason: string, user: User) => {
    setIsSyncing(true);
    try {
      await firestoreService.cancelSale({
        shopId,
        sale,
        reason,
        user,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const addCustomer = async (cust: Omit<Customer, 'id' | 'createdAt'>) => {
    setIsSyncing(true);
    try {
      return await firestoreService.addCustomer(shopId, cust);
    } finally {
      setIsSyncing(false);
    }
  };

  const addSupplier = async (sup: Omit<Supplier, 'id' | 'createdAt'>) => {
    setIsSyncing(true);
    try {
      return await firestoreService.addSupplier(shopId, sup);
    } finally {
      setIsSyncing(false);
    }
  };

  const addCategory = async (name: string) => {
    setIsSyncing(true);
    try {
      return await firestoreService.addCategory(shopId, name);
    } finally {
      setIsSyncing(false);
    }
  };

  const addProduct = async (prod: Omit<Product, 'id' | 'createdAt'>) => {
    setIsSyncing(true);
    try {
      return await firestoreService.addProduct(shopId, prod);
    } finally {
      setIsSyncing(false);
    }
  };

  const addUser = async (usr: Omit<User, 'id' | 'createdAt'>) => {
    setIsSyncing(true);
    try {
      return await firestoreService.addUser(shopId, usr);
    } finally {
      setIsSyncing(false);
    }
  };

  const resetAllTransactions = async (user: User) => {
    setIsSyncing(true);
    try {
      if (shopId) {
        await firestoreService.clearAllTransactions(shopId, user);
      }
      const res = DatabaseService.getInstance().resetAllTransactions(user);
      return res;
    } catch (err) {
      console.error('Error resetting transactions in cloud:', err);
      return DatabaseService.getInstance().resetAllTransactions(user);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        shopId,
        shop,
        deviceId,
        isOnline,
        isSyncing,
        isLoading,
        sales,
        cashTransactions,
        customers,
        customerPayments,
        suppliers,
        purchases,
        supplierPayments,
        expenses,
        categories,
        products,
        users,
        auditLogs,
        treasuryBalance,
        todayStats,
        totalReceivables,
        totalPayables,
        switchShop,
        createNewShop,
        recordCashSale,
        recordCreditSale,
        recordCustomerPayment,
        recordExpense,
        recordPurchase,
        recordSupplierPayment,
        recordDepositOrWithdrawal,
        cancelSale,
        addCustomer,
        addSupplier,
        addCategory,
        addProduct,
        addUser,
        getCustomerBalance,
        getSupplierBalance,
        resetAllTransactions,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
