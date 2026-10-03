import { 
  collection, 
  doc, 
  CollectionReference, 
  DocumentReference 
} from 'firebase/firestore';
import { db } from './config';
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
  DayCloseRecord, 
  AuditLog 
} from '../types';

// Root shops collection
export const getShopsCollection = () => 
  collection(db, 'shops') as CollectionReference<Shop>;

export const getShopDocRef = (shopId: string) => 
  doc(db, 'shops', shopId) as DocumentReference<Shop>;

// Subcollections under shops/{shopId}
export const getUsersColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'users') as CollectionReference<User>;

export const getCategoriesColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'categories') as CollectionReference<Category>;

export const getProductsColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'products') as CollectionReference<Product>;

export const getCustomersColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'customers') as CollectionReference<Customer>;

export const getSuppliersColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'suppliers') as CollectionReference<Supplier>;

export const getSalesColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'sales') as CollectionReference<Sale>;

export const getCustomerPaymentsColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'customerPayments') as CollectionReference<CustomerPayment>;

export const getPurchasesColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'purchases') as CollectionReference<Purchase>;

export const getSupplierPaymentsColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'supplierPayments') as CollectionReference<SupplierPayment>;

export const getExpensesColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'expenses') as CollectionReference<Expense>;

export const getCashTransactionsColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'cashTransactions') as CollectionReference<CashTransaction>;

export const getDayCloseColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'dailyClosings') as CollectionReference<DayCloseRecord>;

export const getAuditLogsColRef = (shopId: string) => 
  collection(db, 'shops', shopId, 'auditLogs') as CollectionReference<AuditLog>;
