-- ====================================================================
-- مخطط قاعدة بيانات نظام كاشير وإدارة سوبر ماركت متكامل بدون باركود
-- متوافق مع SQLite / PostgreSQL / MySQL
-- ====================================================================

-- 1. جدول المستخدمين والصلاحيات
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    pin TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'cashier')) DEFAULT 'cashier',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول العملاء والديون
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    notes TEXT,
    credit_limit REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 3. جدول الموردين
CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. جدول أقسام السوبر ماركت
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. جدول المنتجات (اختياري للجرد السريع والتوسع المستقبلي)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category_id TEXT,
    purchase_price REAL DEFAULT 0,
    selling_price REAL DEFAULT 0,
    stock_quantity REAL DEFAULT 0,
    minimum_stock REAL DEFAULT 5,
    active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- 6. جدول المبيعات (البيع السريع بدون باركود)
CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    sale_number TEXT UNIQUE NOT NULL,
    customer_id TEXT,
    payment_type TEXT CHECK(payment_type IN ('cash', 'credit')) NOT NULL,
    total_amount REAL NOT NULL CHECK(total_amount > 0),
    category_id TEXT NOT NULL,
    product_id TEXT,
    notes TEXT,
    created_by TEXT NOT NULL,
    status TEXT CHECK(status IN ('completed', 'cancelled')) DEFAULT 'completed',
    cancelled_reason TEXT,
    cancelled_at TIMESTAMP,
    cancelled_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_payment ON sales(payment_type);

-- 7. جدول سداد ديون العملاء
CREATE TABLE IF NOT EXISTS customer_payments (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    payment_method TEXT CHECK(payment_method IN ('cash', 'transfer', 'other')) DEFAULT 'cash',
    notes TEXT,
    created_by TEXT NOT NULL,
    status TEXT CHECK(status IN ('completed', 'cancelled')) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_customer_payments_customer ON customer_payments(customer_id);

-- 8. جدول المشتريات
CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    supplier_id TEXT,
    payment_type TEXT CHECK(payment_type IN ('cash', 'credit')) NOT NULL,
    total_amount REAL NOT NULL CHECK(total_amount > 0),
    notes TEXT,
    created_by TEXT NOT NULL,
    status TEXT CHECK(status IN ('completed', 'cancelled')) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);

-- 9. جدول سداد دفعات الموردين
CREATE TABLE IF NOT EXISTS supplier_payments (
    id TEXT PRIMARY KEY,
    supplier_id TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    notes TEXT,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- 10. جدول المصروفات التشغيلية
CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    payment_method TEXT CHECK(payment_method IN ('cash', 'other')) DEFAULT 'cash',
    notes TEXT,
    created_by TEXT NOT NULL,
    status TEXT CHECK(status IN ('completed', 'cancelled')) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

-- 11. جدول حركات الخزينة (سجل النقدية الدقيق)
CREATE TABLE IF NOT EXISTS cash_transactions (
    id TEXT PRIMARY KEY,
    transaction_type TEXT NOT NULL,
    flow TEXT CHECK(flow IN ('in', 'out')) NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    reference_type TEXT NOT NULL,
    reference_id TEXT,
    description TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_cash_tx_date ON cash_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_cash_tx_type ON cash_transactions(transaction_type);

-- 12. جدول إغلاق اليومية (تقرير Z)
CREATE TABLE IF NOT EXISTS day_closes (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    expected_cash REAL NOT NULL,
    actual_cash REAL NOT NULL,
    difference REAL NOT NULL,
    total_sales REAL NOT NULL,
    cash_sales REAL NOT NULL,
    credit_sales REAL NOT NULL,
    sales_count INTEGER NOT NULL,
    debt_collected REAL NOT NULL,
    new_debts REAL NOT NULL,
    cash_purchases REAL NOT NULL,
    credit_purchases REAL NOT NULL,
    cash_expenses REAL NOT NULL,
    notes TEXT,
    closed_by TEXT NOT NULL,
    closed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (closed_by) REFERENCES users(id)
);

-- 13. جدول الجرد الفعلي للمخزون
CREATE TABLE IF NOT EXISTS inventory_counts (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    recorded_qty REAL NOT NULL,
    actual_qty REAL NOT NULL,
    difference REAL NOT NULL,
    status TEXT CHECK(status IN ('match', 'deficit', 'surplus')) NOT NULL,
    checked_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 14. جدول سجل التدقيق والأمان
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- 15. جدول إعدادات المحل
CREATE TABLE IF NOT EXISTS store_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
