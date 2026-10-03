import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  MinusCircle,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Printer,
  History,
  TrendingDown,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { CashTransaction, DayCloseRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export const TreasuryScreen: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();
  const { currentUser, isAdmin } = useAuth();
  const shopContext = useShop();

  const [localTransactions, setLocalTransactions] = useState<CashTransaction[]>(() =>
    db.getCashTransactions().reverse()
  );
  const transactions = shopContext.cashTransactions.length > 0
    ? shopContext.cashTransactions
    : localTransactions;
  const [dayCloses, setDayCloses] = useState<DayCloseRecord[]>(() => db.getDayCloses());

  // Modal states
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDayCloseModalOpen, setIsDayCloseModalOpen] = useState(false);
  const [selectedDayCloseReport, setSelectedDayCloseReport] = useState<DayCloseRecord | null>(null);

  // Form states
  const [transAmount, setTransAmount] = useState('');
  const [transDesc, setTransDesc] = useState('');
  const [transError, setTransError] = useState('');

  // Day close form
  const [actualCashInput, setActualCashInput] = useState('');
  const [closeNotes, setCloseNotes] = useState('');

  const handleZeroTransactions = async () => {
    if (!isAdmin) {
      alert('تصفير المعاملات يتطلب صلاحيات المدير المسؤول.');
      return;
    }
    const conf = window.confirm(
      'تأكيد تصفير كافة معاملات وحركات الخزينة والمبيعات والديون:\n\n' +
      '• سيتم تصفير رصيد الخزينة بالكامل والبدء برصيد 0.00.\n' +
      '• سيتم مسح كافة سجلات المبيعات والمصروفات والديون.\n' +
      '• سيتم الحفاظ التام على بيانات الأصناف والأسعار والعملاء.\n\n' +
      'هل تريد تأكيد تصفير كافة المعاملات الآن؟'
    );
    if (!conf) return;

    try {
      if (shopContext?.resetAllTransactions) {
        await shopContext.resetAllTransactions(currentUser!);
      } else {
        db.resetAllTransactions(currentUser!);
      }
      refreshData();
      alert('تم تصفير كافة المعاملات والخزينة بنجاح! الرصيد يبدأ الآن من 0.');
    } catch {
      db.resetAllTransactions(currentUser!);
      refreshData();
      alert('تم تصفير المعاملات محلياً بنجاح.');
    }
  };

  const refreshData = () => {
    setLocalTransactions(db.getCashTransactions().reverse());
    setDayCloses(db.getDayCloses());
    onRefresh();
  };

  const treasuryBalance = db.getTreasuryBalance();

  const totalIn = transactions
    .filter(t => t.flow === 'in')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter(t => t.flow === 'out')
    .reduce((sum, t) => sum + t.amount, 0);

  // Deposit Submit
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransError('');
    const amt = parseFloat(transAmount);
    if (isNaN(amt) || amt <= 0) {
      setTransError('من فضلك أدخل مبلغ صحيح أكبر من الصفر');
      return;
    }
    const res = db.depositCash(amt, transDesc, currentUser!);
    if (res.success) {
      shopContext.recordDepositOrWithdrawal('in', 'deposit', amt, transDesc, currentUser!).catch(console.warn);
      setIsDepositModalOpen(false);
      setTransAmount('');
      setTransDesc('');
      refreshData();
      alert(res.message);
    } else {
      setTransError(res.message);
    }
  };

  // Withdraw Submit
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransError('');
    const amt = parseFloat(transAmount);
    if (isNaN(amt) || amt <= 0) {
      setTransError('من فضلك أدخل مبلغ صحيح أكبر من الصفر');
      return;
    }
    const res = db.withdrawCash(amt, transDesc, currentUser!);
    if (res.success) {
      shopContext.recordDepositOrWithdrawal('out', 'withdrawal', amt, transDesc, currentUser!).catch(console.warn);
      setIsWithdrawModalOpen(false);
      setTransAmount('');
      setTransDesc('');
      refreshData();
      alert(res.message);
    } else {
      setTransError(res.message);
    }
  };

  // Day Close Submit
  const handleDayCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actual = parseFloat(actualCashInput);
    if (isNaN(actual) || actual < 0) {
      alert('من فضلك أدخل النقدية الفعلية الموجودة في الدرج');
      return;
    }

    const res = db.closeDay(actual, closeNotes, currentUser!);
    setIsDayCloseModalOpen(false);
    setActualCashInput('');
    setCloseNotes('');
    refreshData();
    setSelectedDayCloseReport(res.record);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">الخزينة النقدية والدرج</h2>
            <p className="text-xs text-slate-500">
              حساب الرصيد الفعلي بدقة: الافتتاحي + الداخل (كاش وتحصيل) - الخارج (مشتريات ومصروفات وسحوبات)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setIsDepositModalOpen(true);
              setTransAmount('');
              setTransDesc('');
              setTransError('');
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إيداع نقدية</span>
          </button>

          <button
            onClick={() => {
              setIsWithdrawModalOpen(true);
              setTransAmount('');
              setTransDesc('');
              setTransError('');
            }}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <MinusCircle className="w-4 h-4" />
            <span>سحب نقدية (مسحوبات)</span>
          </button>

          <button
            onClick={() => {
              setIsDayCloseModalOpen(true);
              setActualCashInput(treasuryBalance.toFixed(2));
              setCloseNotes('');
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>إغلاق اليومية (تقرير Z)</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleZeroTransactions}
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              title="تصفير كافة المعاملات وحركات الخزينة والبدء من الصفر"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>تصفير المعاملات</span>
            </button>
          )}
        </div>
      </div>

      {/* Balance & In/Out Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Drawer Cash */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-emerald-200 text-xs font-bold mb-2">
            <span>الرصيد الفعلي الحالي بالخزينة</span>
            <Wallet className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-3xl font-black font-mono">
            {treasuryBalance.toFixed(2)}{' '}
            <span className="text-sm font-sans text-emerald-200 font-normal">{settings.currency}</span>
          </div>
          <p className="text-[11px] text-emerald-300 mt-2 font-medium">
            يجب أن يتطابق مع النقدية السائلة الموجودة في الدرج
          </p>
        </div>

        {/* Total Inflows */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold mb-2">
            <span>إجمالي المقبوضات النقدية (داخل)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            +{totalIn.toFixed(2)}{' '}
            <span className="text-xs font-sans text-slate-400 font-normal">{settings.currency}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            تشمل مبيعات الكاش، تحصيل الديون، والإيداعات
          </p>
        </div>

        {/* Total Outflows */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold mb-2">
            <span>إجمالي المدفوعات النقدية (خارج)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 font-mono">
            -{totalOut.toFixed(2)}{' '}
            <span className="text-xs font-sans text-slate-400 font-normal">{settings.currency}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            تشمل مشتريات البضاعة، المصروفات، والمسحوبات الشخصية
          </p>
        </div>
      </div>

      {/* Cash Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span>سجل حركات الخزينة التفصيلي ({transactions.length} حركة)</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">سجل زمني لحظي</span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            لا توجد أي حركات نقدية مسجلة حتى الآن
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-3.5">الوقت والتاريخ</th>
                  <th className="p-3.5">نوع الحركة</th>
                  <th className="p-3.5">البيان والشرح</th>
                  <th className="p-3.5">الاتجاه</th>
                  <th className="p-3.5">المبلغ</th>
                  <th className="p-3.5">المسؤول</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.map(t => {
                  const isIn = t.flow === 'in';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-500 font-mono">
                        {new Date(t.createdAt).toLocaleString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        {t.transactionType === 'sale_cash' && 'مبيعات كاش'}
                        {t.transactionType === 'debt_collection' && 'تحصيل دين عميل'}
                        {t.transactionType === 'purchase_cash' && 'شراء بضاعة نقداً'}
                        {t.transactionType === 'expense_cash' && 'مصروف نقدي'}
                        {t.transactionType === 'deposit' && 'إيداع نقدية'}
                        {t.transactionType === 'withdrawal' && 'سحب نقدية'}
                        {t.transactionType === 'reversal' && 'عكس حركة ملغاة'}
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate">
                        {t.description}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isIn ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isIn ? 'داخل (+)' : 'خارج (-)'}
                        </span>
                      </td>
                      <td
                        className={`p-3.5 font-black font-mono text-sm ${
                          isIn ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isIn ? `+${t.amount.toFixed(2)}` : `-${t.amount.toFixed(2)}`} {settings.currency}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {t.createdByName || 'الكاشير'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Cash Deposit */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleDepositSubmit}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-sm">إيداع نقدية في الخزينة</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              {transError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-bold">
                  {transError}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">المبلغ المودع *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={transAmount}
                  onChange={e => setTransAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 text-center text-lg font-black font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب الإيداع:</label>
                <input
                  type="text"
                  value={transDesc}
                  onChange={e => setTransDesc(e.target.value)}
                  placeholder="مثال: فكة للدرج، دعم الخزينة، إيداع شخصي..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                تأكيد الإيداع
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Cash Withdrawal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleWithdrawSubmit}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-rose-200" />
                <h3 className="font-bold text-sm">سحب نقدية من الخزينة</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1 rounded-lg text-rose-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              {transError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-bold">
                  {transError}
                </div>
              )}

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">رصيد الخزينة المتاح:</span>
                <span className="font-bold font-mono text-emerald-800">{treasuryBalance.toFixed(2)} {settings.currency}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المبلغ المطلوب سحبه *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={transAmount}
                  onChange={e => setTransAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 text-center text-lg font-black font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سبب السحب:</label>
                <input
                  type="text"
                  value={transDesc}
                  onChange={e => setTransDesc(e.target.value)}
                  placeholder="مثال: مسحوبات شخصية لصاحب المحل، تحويل للبنك..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
              >
                تأكيد السحب
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: End of Day Close (تقرير Z) */}
      {isDayCloseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleDayCloseSubmit}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">إغلاق اليومية وجرد النقدية بالدرج (تقرير Z)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDayCloseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-slate-600">
                  <span>الرصيد الدفتري المتوقع بالخزينة:</span>
                  <span className="font-black text-slate-900 text-base font-mono">
                    {treasuryBalance.toFixed(2)} {settings.currency}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  قم بعد النقدية الورقية والعملات الموجودة في الدرج فعلياً وأدخل الرقم بالأسفل
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  النقدية الفعلية الموجودة في الدرج *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={actualCashInput}
                  onChange={e => setActualCashInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-12 text-center text-xl font-black font-mono text-emerald-800 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  autoFocus
                />
              </div>

              {/* Calculated Difference Preview */}
              {actualCashInput && !isNaN(parseFloat(actualCashInput)) && (
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                    parseFloat(actualCashInput) === treasuryBalance
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : parseFloat(actualCashInput) > treasuryBalance
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <span>
                    {parseFloat(actualCashInput) === treasuryBalance
                      ? 'مطابق تماماً بدون عجز أو زيادة ✓'
                      : parseFloat(actualCashInput) > treasuryBalance
                      ? 'توجد زيادة في الدرج (+):'
                      : 'يوجد عجز في الدرج (-):'}
                  </span>
                  <span className="text-sm font-black font-mono">
                    {(parseFloat(actualCashInput) - treasuryBalance).toFixed(2)} {settings.currency}
                  </span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات الإغلاق:</label>
                <input
                  type="text"
                  value={closeNotes}
                  onChange={e => setCloseNotes(e.target.value)}
                  placeholder="مثال: جرد نوبة محمود - الدرج مطابق..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDayCloseModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                اعتماد إغلاق اليومية
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Day Close Generated Report View */}
      {selectedDayCloseReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
              <h3 className="font-bold text-sm">تقرير إغلاق اليومية المعتمد (تقرير Z)</h3>
              <button
                onClick={() => setSelectedDayCloseReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div id="z-report" className="p-5 space-y-3 text-xs">
              <div className="text-center border-b border-dashed border-slate-300 pb-3">
                <h4 className="text-base font-black text-slate-900">{settings.storeName}</h4>
                <p className="text-slate-500 mt-0.5">تقرير إغلاق اليومية - تقرير Z</p>
                <p className="text-[11px] text-slate-400">
                  {new Date(selectedDayCloseReport.closedAt).toLocaleString('ar-EG')}
                </p>
              </div>

              <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">إجمالي المبيعات:</span>
                  <span className="font-bold">{selectedDayCloseReport.totalSales.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">مبيعات كاش:</span>
                  <span className="font-bold text-emerald-700">{selectedDayCloseReport.cashSales.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">مبيعات آجل (ديون جديدة):</span>
                  <span className="font-bold text-amber-700">{selectedDayCloseReport.creditSales.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">تحصيل ديون قديمة:</span>
                  <span className="font-bold text-emerald-700">+{selectedDayCloseReport.debtCollected.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">مشتريات نقدية:</span>
                  <span className="font-bold text-rose-700">-{selectedDayCloseReport.cashPurchases.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">مصروفات نقدية:</span>
                  <span className="font-bold text-rose-700">-{selectedDayCloseReport.cashExpenses.toFixed(2)} {settings.currency}</span>
                </div>
              </div>

              {/* Drawer Cash Audit */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">الرصيد الدفتري المتوقع:</span>
                  <span className="font-bold font-mono">{selectedDayCloseReport.expectedCash.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">النقدية الفعلية بالدرج:</span>
                  <span className="font-bold font-mono text-emerald-800">{selectedDayCloseReport.actualCash.toFixed(2)} {settings.currency}</span>
                </div>
                <div className="flex justify-between font-black pt-1 border-t border-slate-200 text-sm">
                  <span>فرق الدرج:</span>
                  <span
                    className={
                      selectedDayCloseReport.difference === 0
                        ? 'text-emerald-700'
                        : selectedDayCloseReport.difference > 0
                        ? 'text-blue-700'
                        : 'text-rose-700'
                    }
                  >
                    {selectedDayCloseReport.difference >= 0 ? '+' : ''}
                    {selectedDayCloseReport.difference.toFixed(2)} {settings.currency}{' '}
                    {selectedDayCloseReport.difference === 0 ? '(مطابق)' : selectedDayCloseReport.difference < 0 ? '(عجز)' : '(زيادة)'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 text-center">
                المسؤول عن الإغلاق: {selectedDayCloseReport.closedByName}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة التقرير</span>
              </button>
              <button
                onClick={() => setSelectedDayCloseReport(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
