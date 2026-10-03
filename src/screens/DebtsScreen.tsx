import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  ArrowDownLeft,
  FileText,
  Trash2,
  Edit,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { Customer, StoreSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

interface DebtsScreenProps {
  onRefreshTreasury: () => void;
  selectedCustomerIdProp?: string;
}

export const DebtsScreen: React.FC<DebtsScreenProps> = ({
  onRefreshTreasury,
  selectedCustomerIdProp,
}) => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();
  const { currentUser, isAdmin } = useAuth();
  const shopContext = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'has_debt' | 'zero_debt'>('all');
  const [customers, setCustomers] = useState<Customer[]>(() => db.getCustomers());

  // Modal states
  const [selectedCustomerIdForStatement, setSelectedCustomerIdForStatement] = useState<string | null>(
    selectedCustomerIdProp || null
  );
  const [paymentModalCustomerId, setPaymentModalCustomerId] = useState<string | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Payment Form state
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'transfer' | 'other'>('cash');
  const [payNotes, setPayNotes] = useState('');
  const [allowOverpay, setAllowOverpay] = useState(false);
  const [payError, setPayError] = useState('');

  // Customer Form state
  const [custFormName, setCustFormName] = useState('');
  const [custFormPhone, setCustFormPhone] = useState('');
  const [custFormAddress, setCustFormAddress] = useState('');
  const [custFormLimit, setCustFormLimit] = useState('');
  const [custFormNotes, setCustFormNotes] = useState('');

  const refreshList = () => {
    setCustomers(db.getCustomers());
  };

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    const balance = db.getCustomerBalance(c.id);
    if (filterType === 'has_debt') return balance > 0;
    if (filterType === 'zero_debt') return balance === 0;
    return true;
  });

  const totalOutstanding = customers.reduce((sum, c) => sum + db.getCustomerBalance(c.id), 0);
  const totalDebtorsCount = customers.filter(c => db.getCustomerBalance(c.id) > 0).length;

  // Handle open payment modal
  const handleOpenPayment = (customerId: string) => {
    setPaymentModalCustomerId(customerId);
    setPayAmount('');
    setPayNotes('');
    setPayError('');
    setAllowOverpay(false);
  };

  // Submit Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPayError('');
    if (!paymentModalCustomerId) return;

    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      setPayError('من فضلك أدخل مبلغ سداد صحيح أكبر من الصفر');
      return;
    }

    const res = db.recordCustomerPayment({
      customerId: paymentModalCustomerId,
      amount,
      paymentMethod: payMethod,
      notes: payNotes,
      user: currentUser!,
      allowOverpay: isAdmin && allowOverpay,
    });

    if (res.success) {
      const cust = customers.find(c => c.id === paymentModalCustomerId);
      shopContext.recordCustomerPayment(
        {
          customerId: paymentModalCustomerId,
          customerName: cust?.name || 'عميل',
          amount,
          paymentMethod: payMethod === 'cash' ? 'cash' : 'transfer',
          notes: payNotes,
          createdBy: currentUser?.id || 'cashier',
          createdByName: currentUser?.name || 'كاشير',
        },
        currentUser!,
        payMethod === 'cash'
      ).catch(console.warn);

      setPaymentModalCustomerId(null);
      refreshList();
      onRefreshTreasury();
      alert(res.message);
    } else {
      setPayError(res.message);
    }
  };

  // Delete customer check
  const handleDeleteCustomer = (customer: Customer) => {
    const res = db.deleteCustomer(customer.id, currentUser!, isAdmin);
    alert(res.message);
    if (res.success) {
      refreshList();
    }
  };

  // Open add/edit modal
  const handleOpenAddEdit = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setCustFormName(customer.name);
      setCustFormPhone(customer.phone);
      setCustFormAddress(customer.address || '');
      setCustFormLimit(customer.creditLimit ? customer.creditLimit.toString() : '');
      setCustFormNotes(customer.notes || '');
    } else {
      setEditingCustomer(null);
      setCustFormName('');
      setCustFormPhone('');
      setCustFormAddress('');
      setCustFormLimit('');
      setCustFormNotes('');
    }
    setIsAddEditModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custFormName.trim()) {
      alert('من فضلك أدخل اسم العميل');
      return;
    }

    if (editingCustomer) {
      db.updateCustomer(
        {
          ...editingCustomer,
          name: custFormName.trim(),
          phone: custFormPhone.trim(),
          address: custFormAddress.trim(),
          creditLimit: parseFloat(custFormLimit) || 0,
          notes: custFormNotes.trim(),
        },
        currentUser!
      );
    } else {
      db.addCustomer(
        {
          name: custFormName.trim(),
          phone: custFormPhone.trim(),
          address: custFormAddress.trim(),
          creditLimit: parseFloat(custFormLimit) || 0,
          notes: custFormNotes.trim(),
        },
        currentUser!
      );
    }

    setIsAddEditModalOpen(false);
    refreshList();
  };

  // Statement customer
  const statementCustomer = customers.find(c => c.id === selectedCustomerIdForStatement);
  const statementRecords = selectedCustomerIdForStatement
    ? db.getCustomerStatement(selectedCustomerIdForStatement)
    : [];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Banner: Debts Summary */}
      <div className="bg-gradient-to-r from-darkbg-950 via-brown-950 to-darkbg-900 p-5 rounded-2xl border border-gold-600/30 shadow-dark-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black gold-text-gradient">دفتر الديون والشكك (العملاء)</h2>
            <p className="text-xs text-stone-300">
              متابعة حسابات العملاء، الشراء الآجل، تسجيل السداد، وكشوفات الحسابات الدقيقة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="text-left">
            <span className="text-[11px] font-bold text-stone-400 block">إجمالي الديون بالخارج (لينا برة)</span>
            <span className="text-2xl font-black text-gold-300 font-mono">
              {totalOutstanding.toFixed(2)} {settings.currency}
            </span>
          </div>

          <button
            onClick={() => handleOpenAddEdit()}
            className="px-4 py-2.5 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 text-darkbg-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-gold-glow transition active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-darkbg-950 stroke-[2.5]" />
            <span>+ إضافة عميل جديد</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between text-white">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gold-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو رقم الهاتف..."
            className="w-full pr-9 pl-3 py-2 bg-darkbg-950 border border-stone-800 rounded-xl text-xs outline-none focus:border-gold-500 text-white transition placeholder-stone-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'all'
                ? 'bg-brown-900 text-gold-300 border border-gold-600/40'
                : 'bg-darkbg-950 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            الكل ({customers.length})
          </button>
          <button
            onClick={() => setFilterType('has_debt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'has_debt'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                : 'bg-darkbg-950 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            عليهم ديون ({totalDebtorsCount})
          </button>
          <button
            onClick={() => setFilterType('zero_debt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'zero_debt'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                : 'bg-darkbg-950 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            خالصين ({customers.length - totalDebtorsCount})
          </button>
        </div>
      </div>

      {/* Customers Table / Grid */}
      <div className="bg-darkbg-900 rounded-2xl border border-stone-800 shadow-dark-card overflow-hidden text-white">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 text-stone-500 text-xs">
            لا توجد بيانات مطابقة لبحثك في دفتر العملاء
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-brown-950/80 text-gold-300 font-bold border-b border-stone-800">
                  <th className="p-3.5">العميل</th>
                  <th className="p-3.5">الهاتف / العنوان</th>
                  <th className="p-3.5">إجمالي المشتريات الآجلة</th>
                  <th className="p-3.5">إجمالي المدفوع</th>
                  <th className="p-3.5">الرصيد المتبقي (الدين)</th>
                  <th className="p-3.5">حالة الحساب</th>
                  <th className="p-3.5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 font-medium">
                {filteredCustomers.map(customer => {
                  const summary = db.getCustomerSummary(customer.id);
                  const hasDebt = summary.balance > 0;
                  const isOverLimit = customer.creditLimit && customer.creditLimit > 0 && summary.balance > customer.creditLimit;

                  return (
                    <tr key={customer.id} className="hover:bg-brown-950/20 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{customer.name}</div>
                        {customer.notes && (
                          <div className="text-[10px] text-stone-400 italic mt-0.5">{customer.notes}</div>
                        )}
                      </td>

                      <td className="p-3.5 text-stone-300">
                        <div>{customer.phone || 'بدون هاتف'}</div>
                        {customer.address && (
                          <div className="text-[10px] text-stone-400">{customer.address}</div>
                        )}
                      </td>

                      <td className="p-3.5 font-bold text-stone-300 font-mono">
                        {summary.totalCredit.toFixed(2)} {settings.currency}
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400 font-mono">
                        {summary.totalPaid.toFixed(2)} {settings.currency}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`font-black text-sm font-mono ${
                            hasDebt ? 'text-gold-300' : 'text-stone-500'
                          }`}
                        >
                          {summary.balance.toFixed(2)} {settings.currency}
                        </span>
                      </td>

                      <td className="p-3.5">
                        {isOverLimit ? (
                          <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-500/40 font-bold rounded-full text-[10px]">
                            تجاوز الحد الائتماني
                          </span>
                        ) : hasDebt ? (
                          <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/40 font-bold rounded-full text-[10px]">
                            عليه مديونية
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold rounded-full text-[10px]">
                            حساب خالص
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Payment Button */}
                          <button
                            onClick={() => handleOpenPayment(customer.id)}
                            className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-bold rounded-lg text-xs flex items-center gap-1 transition"
                            title="تسجيل سداد دين نقدي أو تحويل"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>سداد</span>
                          </button>

                          {/* Statement Button */}
                          <button
                            onClick={() => setSelectedCustomerIdForStatement(customer.id)}
                            className="px-2.5 py-1.5 bg-brown-900 hover:bg-brown-800 text-gold-300 border border-gold-600/30 font-bold rounded-lg text-xs flex items-center gap-1 transition"
                            title="عرض كشف حساب العميل"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>كشف حساب</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenAddEdit(customer)}
                            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition"
                            title="تعديل بيانات العميل"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteCustomer(customer)}
                              className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                              title="حذف حساب العميل (للمدير)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Customer Statement (كشف حساب العميل) */}
      {selectedCustomerIdForStatement && statementCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-darkbg-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gold-500/40 text-white">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-darkbg-950 via-brown-950 to-darkbg-900 text-white border-b border-stone-800 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold-400" />
                <div>
                  <h3 className="font-bold text-sm gold-text-gradient">كشف حساب العميل: {statementCustomer.name}</h3>
                  <p className="text-[11px] text-stone-400">هاتف: {statementCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerIdForStatement(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Statement Body */}
            <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-darkbg-950 border border-stone-800 rounded-xl">
                  <span className="text-[10px] text-stone-400 font-bold block">إجمالي الآجل</span>
                  <span className="text-sm font-black text-stone-200 font-mono">
                    {db.getCustomerSummary(statementCustomer.id).totalCredit.toFixed(2)} {settings.currency}
                  </span>
                </div>
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl">
                  <span className="text-[10px] text-emerald-400 font-bold block">إجمالي المسدد</span>
                  <span className="text-sm font-black text-emerald-300 font-mono">
                    {db.getCustomerSummary(statementCustomer.id).totalPaid.toFixed(2)} {settings.currency}
                  </span>
                </div>
                <div className="p-3 bg-brown-950 border border-gold-500/40 rounded-xl">
                  <span className="text-[10px] text-gold-300 font-bold block">المتبقي حالياً</span>
                  <span className="text-sm font-black text-gold-300 font-mono">
                    {db.getCustomerBalance(statementCustomer.id).toFixed(2)} {settings.currency}
                  </span>
                </div>
              </div>

              {/* Transactions Timeline Table */}
              <div className="border border-stone-800 rounded-xl overflow-hidden bg-darkbg-950">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="bg-brown-950 text-gold-300 font-bold border-b border-stone-800">
                      <th className="p-2.5">التاريخ</th>
                      <th className="p-2.5">نوع العملية</th>
                      <th className="p-2.5">قيمة البيع</th>
                      <th className="p-2.5">المسدد</th>
                      <th className="p-2.5">الرصيد بعد العملية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 font-medium">
                    {statementRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-stone-500">
                          لا توجد عمليات مسجلة في كشف الحساب
                        </td>
                      </tr>
                    ) : (
                      statementRecords.map(r => (
                        <tr key={r.id} className="hover:bg-brown-950/30">
                          <td className="p-2.5 text-stone-400">
                            {new Date(r.date).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`font-bold ${
                                r.type === 'credit_sale' ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            >
                              {r.typeLabel}
                            </span>
                            {r.notes && (
                              <div className="text-[10px] text-stone-500 italic">{r.notes}</div>
                            )}
                          </td>
                          <td className="p-2.5 font-bold font-mono text-stone-200">
                            {r.amount > 0 ? `${r.amount.toFixed(2)}` : '—'}
                          </td>
                          <td className="p-2.5 font-bold font-mono text-emerald-400">
                            {r.paid > 0 ? `${r.paid.toFixed(2)}` : '—'}
                          </td>
                          <td className="p-2.5 font-black font-mono text-gold-300">
                            {r.runningBalance.toFixed(2)} {settings.currency}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-darkbg-950 border-t border-stone-800 flex justify-between items-center no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-brown-900 hover:bg-brown-800 text-gold-200 border border-gold-600/40 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة كشف الحساب</span>
              </button>

              <button
                onClick={() => setSelectedCustomerIdForStatement(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record Customer Payment (تسجيل سداد) */}
      {paymentModalCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmitPayment}
            className="bg-darkbg-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gold-500/40 text-white"
          >
            <div className="p-4 bg-gradient-to-r from-brown-950 via-darkbg-950 to-brown-900 text-gold-300 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold-400" />
                <h3 className="font-bold text-sm">تسجيل سداد دفعة من العميل</h3>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalCustomerId(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const cust = customers.find(c => c.id === paymentModalCustomerId);
              const currentDebt = db.getCustomerBalance(paymentModalCustomerId);

              return (
                <div className="p-5 space-y-4 text-xs">
                  {/* Customer Debt Info Card */}
                  <div className="bg-darkbg-950 p-3.5 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="font-black text-white text-sm">{cust?.name}</div>
                      <div className="text-stone-400">هاتف: {cust?.phone}</div>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-stone-400 block font-bold">المديونية الحالية:</span>
                      <span className="text-base font-black text-gold-300 font-mono">
                        {currentDebt.toFixed(2)} {settings.currency}
                      </span>
                    </div>
                  </div>

                  {payError && (
                    <div className="p-2.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 font-bold">
                      {payError}
                    </div>
                  )}

                  {/* Payment Amount */}
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">المبلغ المسدد *</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={payAmount}
                        onChange={e => setPayAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-12 text-center text-xl font-black font-mono text-gold-300 bg-darkbg-950 border border-stone-800 rounded-xl focus:border-gold-400 outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setPayAmount(currentDebt.toString())}
                        className="absolute left-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-brown-900 hover:bg-brown-800 text-gold-200 border border-gold-600/30 text-[10px] font-bold rounded-lg transition"
                      >
                        سداد كامل الدين
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">طريقة السداد:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayMethod('cash')}
                        className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                          payMethod === 'cash'
                            ? 'bg-gradient-to-r from-gold-600 to-brown-700 text-darkbg-950 border-gold-400 font-black'
                            : 'bg-darkbg-950 text-stone-300 border-stone-800'
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        <span>نقدي (يضاف للخزينة)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayMethod('transfer')}
                        className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                          payMethod === 'transfer'
                            ? 'bg-brown-900 text-gold-300 border-gold-500 font-black'
                            : 'bg-darkbg-950 text-stone-300 border-stone-800'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>تحويل بنكي / محفظة</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">ملاحظات:</label>
                    <input
                      type="text"
                      value={payNotes}
                      onChange={e => setPayNotes(e.target.value)}
                      placeholder="مثال: دفعة من حساب البيت، استلام يد بيد..."
                      className="w-full px-3 py-2 bg-darkbg-950 border border-stone-800 text-white rounded-xl outline-none focus:border-gold-400 placeholder-stone-500"
                    />
                  </div>

                  {/* Admin override for overpayment */}
                  {isAdmin && (
                    <label className="flex items-center gap-2 cursor-pointer pt-1 text-stone-400">
                      <input
                        type="checkbox"
                        checked={allowOverpay}
                        onChange={e => setAllowOverpay(e.target.checked)}
                        className="rounded text-gold-500"
                      />
                      <span>صلاحية المدير: السماح بتسجيل سداد أكبر من قيمة الدين</span>
                    </label>
                  )}
                </div>
              );
            })()}

            <div className="p-4 bg-darkbg-950 border-t border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPaymentModalCustomerId(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 text-darkbg-950 font-black text-xs rounded-xl shadow-gold-glow"
              >
                حفظ السداد وتحديث الخزينة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add / Edit Customer */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveCustomer}
            className="bg-darkbg-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gold-500/40 text-white"
          >
            <div className="p-4 bg-gradient-to-r from-darkbg-950 via-brown-950 to-darkbg-900 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-400" />
                <h3 className="font-bold text-sm text-white">
                  {editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-300 mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={custFormName}
                  onChange={e => setCustFormName(e.target.value)}
                  placeholder="الاسم ثلاثي"
                  className="w-full px-3 py-2 bg-darkbg-950 border border-stone-800 text-white rounded-xl focus:border-gold-400 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={custFormPhone}
                  onChange={e => setCustFormPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-3 py-2 bg-darkbg-950 border border-stone-800 text-white rounded-xl focus:border-gold-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">العنوان</label>
                <input
                  type="text"
                  value={custFormAddress}
                  onChange={e => setCustFormAddress(e.target.value)}
                  placeholder="العنوان التفصيلي"
                  className="w-full px-3 py-2 bg-darkbg-950 border border-stone-800 text-white rounded-xl focus:border-gold-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-300 mb-1">الحد الائتماني (اختياري)</label>
                  <input
                    type="number"
                    value={custFormLimit}
                    onChange={e => setCustFormLimit(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-darkbg-950 border border-stone-800 text-white rounded-xl focus:border-gold-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-300 mb-1">ملاحظات</label>
                  <input
                    type="text"
                    value={custFormNotes}
                    onChange={e => setCustFormNotes(e.target.value)}
                    placeholder="ملاحظات الحساب"
                    className="w-full px-3 py-2 bg-darkbg-950 border border-stone-800 text-white rounded-xl focus:border-gold-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-darkbg-950 border-t border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 text-darkbg-950 font-black text-xs rounded-xl shadow-gold-glow"
              >
                حفظ العميل
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
