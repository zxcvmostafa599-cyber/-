import React, { useState, useEffect, useRef } from 'react';
import {
  Banknote,
  CreditCard,
  UserPlus,
  Users,
  Printer,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  ShoppingCart,
  X,
  Sparkles,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { Category, Customer, Product, Sale, PaymentType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { ReceiptModal } from '../components/ReceiptModal';

interface POSScreenProps {
  onRefreshTreasury: () => void;
  onOpenCustomerLedger?: (customerId: string) => void;
}

export const POSScreen: React.FC<POSScreenProps> = ({
  onRefreshTreasury,
  onOpenCustomerLedger,
}) => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();
  const { currentUser } = useAuth();
  const shopContext = useShop();

  // Sale form state
  const [amountInput, setAmountInput] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-grocery');
  const [paymentType, setPaymentType] = useState<PaymentType>('cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // UI state
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [newCatName, setNewCatName] = useState('');

  // New Customer Form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustLimit, setNewCustLimit] = useState('');
  const [newCustNotes, setNewCustNotes] = useState('');

  // Print Receipt Modal
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [custPrevBalance, setCustPrevBalance] = useState(0);
  const [custNewBalance, setCustNewBalance] = useState(0);

  // References
  const amountInputRef = useRef<HTMLInputElement>(null);

  // Live Data lists from Firestore (fallback to local if empty)
  const categories = shopContext.categories.length > 0 ? shopContext.categories : db.getCategories();
  const customers = shopContext.customers.length > 0 ? shopContext.customers : db.getCustomers();
  const products = shopContext.products.length > 0 ? shopContext.products : db.getProducts();

  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  // Keyboard shortcut listener for POS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enter to submit
      if (e.key === 'Enter' && !isCustomerModalOpen && !isAddCustomerOpen && !isAddCategoryOpen && !receiptSale) {
        e.preventDefault();
        handleSubmitSale();
      }
      // Esc to clear input or close modals
      if (e.key === 'Escape') {
        if (receiptSale) setReceiptSale(null);
        else if (isAddCustomerOpen) setIsAddCustomerOpen(false);
        else if (isCustomerModalOpen) setIsCustomerModalOpen(false);
        else if (isAddCategoryOpen) setIsAddCategoryOpen(false);
        else setAmountInput('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [amountInput, selectedCategoryId, paymentType, selectedCustomerId, isCustomerModalOpen, isAddCustomerOpen, isAddCategoryOpen, receiptSale]);

  // Selected customer details & balance
  const activeCustomer = customers.find(c => c.id === selectedCustomerId);
  const activeCustomerBalance = selectedCustomerId ? db.getCustomerBalance(selectedCustomerId) : 0;
  const parsedAmount = parseFloat(amountInput) || 0;
  const projectedCustomerDebt = activeCustomerBalance + parsedAmount;

  // Numpad handlers
  const handleNumpadClick = (val: string) => {
    if (val === 'C') {
      setAmountInput('');
    } else if (val === 'BACK') {
      setAmountInput(prev => prev.slice(0, -1));
    } else if (val === '.') {
      if (!amountInput.includes('.')) {
        setAmountInput(prev => (prev ? prev + '.' : '0.'));
      }
    } else {
      setAmountInput(prev => prev + val);
    }
  };

  const handleAddQuickCash = (increment: number) => {
    const current = parseFloat(amountInput) || 0;
    setAmountInput((current + increment).toFixed(2).replace(/\.00$/, ''));
  };

  // Add new inline category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const cat = db.addCategory(newCatName.trim(), '🛒', '#0EA5E9', currentUser!);
    setSelectedCategoryId(cat.id);
    setNewCatName('');
    setIsAddCategoryOpen(false);
  };

  // Add new inline customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      alert('من فضلك أدخل اسم العميل');
      return;
    }
    const customer = db.addCustomer(
      {
        name: newCustName.trim(),
        phone: newCustPhone.trim(),
        address: newCustAddress.trim(),
        creditLimit: parseFloat(newCustLimit) || 0,
        notes: newCustNotes.trim(),
      },
      currentUser!
    );
    shopContext.addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim(),
      creditLimit: parseFloat(newCustLimit) || 0,
      notes: newCustNotes.trim(),
    }).catch(console.warn);

    setSelectedCustomerId(customer.id);
    setIsAddCustomerOpen(false);
    setIsCustomerModalOpen(false);
    // Reset fields
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustLimit('');
    setNewCustNotes('');
  };

  // Submit Sale Handler
  const handleSubmitSale = () => {
    setMessage(null);
    const amount = parseFloat(amountInput);

    if (isNaN(amount) || amount <= 0) {
      setMessage({ text: 'من فضلك أدخل مبلغ البيع أولاً.', type: 'error' });
      amountInputRef.current?.focus();
      return;
    }

    if (paymentType === 'credit' && !selectedCustomerId) {
      setMessage({ text: 'عملية البيع الآجل تتطلب تحديد عميل لتسجيل الدين عليه.', type: 'error' });
      setIsCustomerModalOpen(true);
      return;
    }

    const prevBal = selectedCustomerId ? db.getCustomerBalance(selectedCustomerId) : 0;

    const result = db.recordSale({
      amount,
      categoryId: selectedCategoryId,
      paymentType,
      customerId: paymentType === 'credit' ? selectedCustomerId : undefined,
      productId: selectedProductId || undefined,
      notes,
      user: currentUser!,
    });

    if (result.success && result.sale) {
      // Sync immediately with Firestore Multi-Device Cloud
      if (paymentType === 'cash') {
        shopContext.recordCashSale({
          saleNumber: result.sale.saleNumber,
          totalAmount: amount,
          categoryId: selectedCategoryId,
          categoryName: categories.find(c => c.id === selectedCategoryId)?.name || 'عام',
          productId: selectedProductId || undefined,
          notes,
          createdBy: currentUser?.id || 'cashier',
          createdByName: currentUser?.name || 'كاشير',
        }, currentUser!).catch(console.warn);
      } else {
        shopContext.recordCreditSale({
          saleNumber: result.sale.saleNumber,
          totalAmount: amount,
          customerId: selectedCustomerId,
          customerName: customers.find(c => c.id === selectedCustomerId)?.name || 'عميل',
          categoryId: selectedCategoryId,
          categoryName: categories.find(c => c.id === selectedCategoryId)?.name || 'عام',
          productId: selectedProductId || undefined,
          notes,
          createdBy: currentUser?.id || 'cashier',
          createdByName: currentUser?.name || 'كاشير',
        }, currentUser!).catch(console.warn);
      }

      const newBal = selectedCustomerId ? db.getCustomerBalance(selectedCustomerId) : 0;
      setCustPrevBalance(prevBal);
      setCustNewBalance(newBal);
      setReceiptSale(result.sale);

      setMessage({ text: result.message, type: 'success' });
      setAmountInput('');
      setNotes('');
      setSelectedProductId('');
      if (paymentType === 'credit') {
        setSelectedCustomerId('');
      }
      onRefreshTreasury();
      amountInputRef.current?.focus();
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  // Filtered customer list for modal
  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.phone.includes(customerSearchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Alert / Feedback message */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* POS Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start text-white">
        {/* Left Column (5 Cols): Sale Amount & Fast Numpad & Quick increments */}
        <div className="lg:col-span-5 bg-darkbg-900 p-5 rounded-2xl border border-stone-800 shadow-dark-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gold-400 uppercase tracking-wider">
              1. إدخال مبلغ البيع (بدون باركود)
            </span>
            <span className="text-[11px] font-bold text-gold-300 bg-brown-950 px-2.5 py-0.5 rounded-full border border-gold-600/40">
              إدخال فوري ومباشر
            </span>
          </div>

          {/* Large prominent amount input */}
          <div className="relative">
            <input
              ref={amountInputRef}
              type="number"
              step="0.01"
              value={amountInput}
              onChange={e => setAmountInput(e.target.value)}
              placeholder="0.00"
              className="w-full h-18 text-center text-4xl font-black font-mono text-gold-300 bg-darkbg-950 border-2 border-gold-500/50 rounded-2xl focus:border-gold-400 focus:bg-black outline-none transition shadow-inner"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500 font-bold text-sm pointer-events-none">
              {settings.currency}
            </span>
          </div>

          {/* Quick Cash Buttons (+5, +10, +20, +50, +100, +200) */}
          <div className="grid grid-cols-6 gap-1.5">
            {[5, 10, 20, 50, 100, 200].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => handleAddQuickCash(val)}
                className="py-2 bg-brown-950 hover:bg-brown-900 hover:text-gold-200 text-gold-300 font-bold text-xs rounded-xl border border-gold-600/30 transition active:scale-95"
              >
                +{val}
              </button>
            ))}
          </div>

          {/* Full Numeric Keypad for fast touchscreen or mouse cashier use */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(digit => (
              <button
                key={digit}
                type="button"
                onClick={() => handleNumpadClick(digit)}
                className="h-13 bg-darkbg-950 hover:bg-brown-950 hover:text-gold-300 active:scale-95 text-white font-black text-xl rounded-xl border border-stone-800 transition flex items-center justify-center shadow-xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNumpadClick('.')}
              className="h-13 bg-darkbg-950 hover:bg-brown-950 hover:text-gold-300 active:scale-95 text-white font-bold text-xl rounded-xl border border-stone-800 transition"
            >
              .
            </button>
            <button
              type="button"
              onClick={() => handleNumpadClick('0')}
              className="h-13 bg-darkbg-950 hover:bg-brown-950 hover:text-gold-300 active:scale-95 text-white font-black text-xl rounded-xl border border-stone-800 transition"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleNumpadClick('BACK')}
              className="h-13 bg-darkbg-950 hover:bg-brown-950 text-stone-300 font-bold rounded-xl border border-stone-800 transition flex items-center justify-center text-sm"
              title="تراجع"
            >
              ⌫ مسح
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleNumpadClick('C')}
            className="w-full py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-bold text-xs rounded-xl border border-rose-600/30 transition"
          >
            تفريغ الخانة (Esc)
          </button>
        </div>

        {/* Right Column (7 Cols): Category selection + Payment Method + Customer & Submit */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category selection */}
          <div className="bg-darkbg-900 p-5 rounded-2xl border border-stone-800 shadow-dark-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gold-400 uppercase tracking-wider">
                2. اختيار القسم وتصنيف العملية
              </span>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(true)}
                className="text-xs text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة قسم جديد</span>
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {categories.map(cat => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-gold-600 to-brown-700 text-darkbg-950 border-gold-400 shadow-gold-glow scale-102 font-black'
                        : 'bg-darkbg-950 text-stone-300 border-stone-800 hover:border-gold-500/40'
                    }`}
                  >
                    <span className="text-xl">{cat.icon || '🛒'}</span>
                    <span className="font-bold text-[11px] leading-tight truncate w-full">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Type Selection (كاش vs آجل) */}
          <div className="bg-darkbg-900 p-5 rounded-2xl border border-stone-800 shadow-dark-card space-y-3">
            <span className="text-xs font-black text-gold-400 uppercase tracking-wider block">
              3. طريقة الدفع
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Cash Button */}
              <button
                type="button"
                onClick={() => {
                  setPaymentType('cash');
                  setSelectedCustomerId('');
                }}
                className={`p-3.5 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2.5 transition active:scale-95 ${
                  paymentType === 'cash'
                    ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300 shadow-sm'
                    : 'border-stone-800 bg-darkbg-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span>دفع كاش (نقداً للخزينة)</span>
              </button>

              {/* Credit Button */}
              <button
                type="button"
                onClick={() => {
                  setPaymentType('credit');
                  if (!selectedCustomerId) setIsCustomerModalOpen(true);
                }}
                className={`p-3.5 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2.5 transition active:scale-95 ${
                  paymentType === 'credit'
                    ? 'border-gold-500 bg-brown-950/80 text-gold-300 shadow-gold-glow'
                    : 'border-stone-800 bg-darkbg-950 text-stone-400 hover:border-stone-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-gold-400" />
                <span>دفع آجل (على الحساب / شكك)</span>
              </button>
            </div>

            {/* If Credit is selected: Customer Selection Area */}
            {paymentType === 'credit' && (
              <div className="mt-3 p-4 bg-brown-950/60 border border-gold-600/30 rounded-2xl space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gold-400" />
                    <span>العميل صاحب الحساب:</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="text-xs font-bold text-gold-400 hover:text-gold-300 underline"
                  >
                    {activeCustomer ? 'تغيير العميل' : 'اختر العميل من الدفتر'}
                  </button>
                </div>

                {activeCustomer ? (
                  <div className="bg-darkbg-950 p-3 rounded-xl border border-stone-800 text-xs space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white text-sm">{activeCustomer.name}</span>
                      <span className="text-stone-400">هاتف: {activeCustomer.phone}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-800 text-[11px]">
                      <div>
                        <span className="text-stone-400 block">الرصيد السابق:</span>
                        <span className="font-bold text-stone-300">
                          {activeCustomerBalance.toFixed(2)} {settings.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">قيمة البيع:</span>
                        <span className="font-bold text-gold-400">
                          +{parsedAmount.toFixed(2)} {settings.currency}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block">الرصيد الجديد المتوقع:</span>
                        <span className="font-black text-gold-300 font-mono">
                          {projectedCustomerDebt.toFixed(2)} {settings.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-gold-300/80">لم يتم تحديد عميل بعد لهذه الفاتورة الآجلة</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCustomerModalOpen(true)}
                        className="px-3 py-1.5 bg-gradient-to-r from-gold-600 to-brown-700 text-darkbg-950 font-bold text-xs rounded-xl transition"
                      >
                        اختيار عميل
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddCustomerOpen(true)}
                        className="px-3 py-1.5 bg-darkbg-950 border border-gold-600/40 text-gold-300 hover:bg-darkbg-900 font-bold text-xs rounded-xl transition"
                      >
                        + عميل جديد
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes and Optional Product Link */}
          <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 shadow-dark-card flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="ملاحظات اختيارية (مثال: طلب البيت، كابتن محمود...)"
              className="flex-1 px-3 py-2 bg-darkbg-950 border border-stone-800 text-stone-200 rounded-xl text-xs outline-none focus:border-gold-500 transition"
            />

            {/* Optional product dropdown for inventory link */}
            <select
              value={selectedProductId}
              onChange={e => {
                const prodId = e.target.value;
                setSelectedProductId(prodId);
                if (prodId) {
                  const p = products.find(prod => prod.id === prodId);
                  if (p && !amountInput) {
                    setAmountInput(p.sellingPrice.toString());
                    setSelectedCategoryId(p.categoryId);
                  }
                }
              }}
              className="px-3 py-2 bg-darkbg-950 border border-stone-800 rounded-xl text-xs text-stone-300 outline-none focus:border-gold-500"
            >
              <option value="">(اختياري) ربط بمنتج من المخزون</option>
              {products.map(p => (
                <option key={p.id} value={p.id} className="bg-darkbg-950 text-white">
                  {p.name} ({p.sellingPrice} {settings.currency} - متبقي {p.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          {/* Big Green/Gold Complete Sale Button */}
          <button
            type="button"
            onClick={handleSubmitSale}
            className="w-full py-4 bg-gradient-to-r from-gold-500 via-gold-600 to-brown-700 hover:from-gold-400 hover:to-brown-600 active:scale-98 text-darkbg-950 font-black text-lg rounded-2xl flex items-center justify-center gap-3 shadow-gold-glow transition cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6 text-darkbg-950 stroke-[2.5]" />
            <span>
              إتمام وحفظ العملية — {parsedAmount > 0 ? `${parsedAmount.toFixed(2)} ${settings.currency}` : 'ادخل المبلغ'} (Enter)
            </span>
          </button>
        </div>
      </div>

      {/* Customer Selection Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">دفتر العملاء — اختيار عميل للبيع الآجل</h3>
              </div>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Add New Customer */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerSearchQuery}
                  onChange={e => setCustomerSearchQuery(e.target.value)}
                  placeholder="ابحث باسم العميل أو رقم الهاتف..."
                  className="w-full pr-9 pl-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsAddCustomerOpen(true)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>عميل جديد</span>
              </button>
            </div>

            {/* Customers List */}
            <div className="p-3 max-h-72 overflow-y-auto divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  لا يوجد عميل مطابق للبحث. يمكنك إضافة عميل جديد فوراً بالضغط على &quot;عميل جديد&quot;
                </div>
              ) : (
                filteredCustomers.map(c => {
                  const debt = db.getCustomerBalance(c.id);
                  const isSelected = selectedCustomerId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomerId(c.id);
                        setIsCustomerModalOpen(false);
                      }}
                      className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition ${
                        isSelected ? 'bg-emerald-50 border border-emerald-300' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.phone} {c.address ? `• ${c.address}` : ''}
                        </div>
                      </div>
                      <div className="text-left">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            debt > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {debt > 0 ? `المديونية: ${debt.toFixed(2)} ${settings.currency}` : 'لا يوجد دين'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateCustomer}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">إضافة عميل جديد لدفتر الديون</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم العميل *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  placeholder="مثال: أحمد محمد علي"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف (اختياري)</label>
                <input
                  type="tel"
                  value={newCustPhone}
                  onChange={e => setNewCustPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان (اختياري)</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={e => setNewCustAddress(e.target.value)}
                  placeholder="مثال: شارع البحر - عمارة 5"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحد الائتماني (اختياري)</label>
                  <input
                    type="number"
                    value={newCustLimit}
                    onChange={e => setNewCustLimit(e.target.value)}
                    placeholder="مثال: 2000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ملاحظات</label>
                  <input
                    type="text"
                    value={newCustNotes}
                    onChange={e => setNewCustNotes(e.target.value)}
                    placeholder="مثال: يسدد أسبوعياً"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                حفظ واختيار العميل
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateCategory}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">إضافة قسم بيع جديد</h3>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <label className="block font-bold text-slate-700 mb-1">اسم القسم:</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="مثال: بهارات وعطارة، عطارة، بلاستيك..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                autoFocus
              />
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                إضافة القسم
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        sale={receiptSale}
        customerPreviousBalance={custPrevBalance}
        customerNewBalance={custNewBalance}
        settings={settings}
        onClose={() => setReceiptSale(null)}
      />
    </div>
  );
};
