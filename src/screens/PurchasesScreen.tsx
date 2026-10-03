import React, { useState } from 'react';
import {
  Package,
  Plus,
  Truck,
  Banknote,
  CreditCard,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { Purchase, Supplier, PaymentType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export const PurchasesScreen: React.FC<{ onRefreshTreasury: () => void }> = ({ onRefreshTreasury }) => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();
  const { currentUser } = useAuth();
  const shopContext = useShop();

  const [purchases, setPurchases] = useState<Purchase[]>(() => db.getPurchases().reverse());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => db.getSuppliers());

  // Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('cash');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshPurchases = () => {
    setPurchases(db.getPurchases().reverse());
  };

  const handleRecordPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('من فضلك أدخل قيمة مشتريات صحيحة');
      return;
    }

    const res = db.recordPurchase({
      amount: parsedAmount,
      paymentType,
      supplierId: selectedSupplierId || undefined,
      notes,
      user: currentUser!,
    });

    if (res.success) {
      const sup = suppliers.find(s => s.id === selectedSupplierId);
      shopContext.recordPurchase(
        {
          supplierId: selectedSupplierId || undefined,
          supplierName: sup?.name,
          paymentType,
          totalAmount: parsedAmount,
          notes,
          createdBy: currentUser?.id || 'cashier',
          createdByName: currentUser?.name || 'كاشير',
        },
        currentUser!
      ).catch(console.warn);

      setIsAddModalOpen(false);
      setAmount('');
      setNotes('');
      setSelectedSupplierId('');
      refreshPurchases();
      onRefreshTreasury();
      alert(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const totalPurchasesAmount = purchases
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const cashPurchasesAmount = purchases
    .filter(p => p.status === 'completed' && p.paymentType === 'cash')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const creditPurchasesAmount = purchases
    .filter(p => p.status === 'completed' && p.paymentType === 'credit')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-darkbg-950 via-brown-950 to-darkbg-900 p-5 rounded-2xl border border-gold-600/30 shadow-dark-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black gold-text-gradient">سجل مشتريات وتوريدات البضاعة</h2>
            <p className="text-xs text-stone-300">
              تسجيل فواتير الشراء، متابعة الموردين، وخصم المشتريات النقدية تلقائياً من الخزينة
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 text-darkbg-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-gold-glow transition active:scale-95"
        >
          <Plus className="w-4 h-4 text-darkbg-950 stroke-[2.5]" />
          <span>+ تسجيل شراء بضاعة جديدة</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 shadow-xs">
          <span className="text-xs font-bold text-stone-400 block mb-1">إجمالي المشتريات</span>
          <span className="text-xl font-black text-white font-mono">
            {totalPurchasesAmount.toFixed(2)} {settings.currency}
          </span>
        </div>

        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 shadow-xs">
          <span className="text-xs font-bold text-emerald-400 block mb-1">مشتريات كاش (مخصومة من الخزينة)</span>
          <span className="text-xl font-black text-emerald-400 font-mono">
            {cashPurchasesAmount.toFixed(2)} {settings.currency}
          </span>
        </div>

        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 shadow-xs">
          <span className="text-xs font-bold text-amber-300 block mb-1">مشتريات آجل (التزام على المحل)</span>
          <span className="text-xl font-black text-amber-300 font-mono">
            {creditPurchasesAmount.toFixed(2)} {settings.currency}
          </span>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-darkbg-900 rounded-2xl border border-stone-800 shadow-dark-card overflow-hidden">
        <div className="p-4 border-b border-stone-800 font-bold text-sm text-gold-300">
          فواتير وتوريدات البضاعة المسجلة ({purchases.length})
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-16 text-stone-500 text-xs">
            لم تسجل أي فواتير شراء بضاعة حتى الآن
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-brown-950/80 text-gold-300 font-bold border-b border-stone-800">
                  <th className="p-3.5">التاريخ والوقت</th>
                  <th className="p-3.5">المورد</th>
                  <th className="p-3.5">طريقة الدفع</th>
                  <th className="p-3.5">المبلغ الإجمالي</th>
                  <th className="p-3.5">ملاحظات وبيان الفاتورة</th>
                  <th className="p-3.5">المسؤول</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 font-medium">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-brown-950/20 transition">
                    <td className="p-3.5 text-stone-400 font-mono">
                      {new Date(p.createdAt).toLocaleString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {p.supplierName ? (
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-gold-400" />
                          {p.supplierName}
                        </span>
                      ) : (
                        <span className="text-stone-400">مورد عام (نثري)</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.paymentType === 'cash'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {p.paymentType === 'cash' ? 'كاش (من الخزينة)' : 'آجل (على الحساب)'}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-gold-300 font-mono text-sm">
                      {p.totalAmount.toFixed(2)} {settings.currency}
                    </td>
                    <td className="p-3.5 text-stone-300">
                      {p.notes || '—'}
                    </td>
                    <td className="p-3.5 text-stone-400">
                      {p.createdByName || 'الكاشير'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Purchase Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleRecordPurchase}
            className="bg-darkbg-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gold-500/40 text-white"
          >
            <div className="p-4 bg-gradient-to-r from-darkbg-950 via-brown-950 to-darkbg-900 border-b border-stone-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gold-400" />
                <h3 className="font-bold text-sm">تسجيل شراء بضاعة جديدة</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-2.5 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block font-bold text-stone-300 mb-1">إجمالي قيمة الفاتورة *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-12 text-center text-xl font-black font-mono text-gold-300 bg-darkbg-950 border border-stone-800 rounded-xl focus:border-gold-400 outline-none"
                    autoFocus
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 font-bold">
                    {settings.currency}
                  </span>
                </div>
              </div>

              {/* Payment Type */}
              <div>
                <label className="block font-bold text-stone-300 mb-1">طريقة الدفع:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('cash')}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentType === 'cash'
                        ? 'bg-gradient-to-r from-gold-600 to-brown-700 text-darkbg-950 border-gold-400 font-black shadow-sm'
                        : 'bg-darkbg-950 text-stone-300 border-stone-800'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>كاش (يخصم من الخزينة)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('credit')}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentType === 'credit'
                        ? 'bg-amber-950 text-amber-300 border-amber-500 font-black shadow-sm'
                        : 'bg-darkbg-950 text-stone-300 border-stone-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>آجل (التزام على المحل)</span>
                  </button>
                </div>
              </div>

              {/* Supplier (Optional) */}
              <div>
                <label className="block font-bold text-stone-300 mb-1">المورد (اختياري):</label>
                <select
                  value={selectedSupplierId}
                  onChange={e => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-800 rounded-xl focus:border-gold-400 outline-none bg-darkbg-950 text-white"
                >
                  <option value="">بدون مورد محدد (شراء نثري من السوق)</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-stone-300 mb-1">ملاحظات وبيان البضاعة:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="مثال: كرتونة زيت + 2 شيكارة أرز + شيبسي..."
                  className="w-full px-3 py-2 border border-stone-800 bg-darkbg-950 text-white rounded-xl focus:border-gold-400 outline-none placeholder-stone-500"
                />
              </div>
            </div>

            <div className="p-4 bg-darkbg-950 border-t border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 text-darkbg-950 font-black text-xs rounded-xl shadow-gold-glow"
              >
                حفظ فاتورة الشراء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
