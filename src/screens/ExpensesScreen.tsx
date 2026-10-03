import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Zap,
  Droplets,
  Building,
  Users,
  Truck,
  Wrench,
  Trash2,
  MoreHorizontal,
  X,
  Banknote,
  XCircle,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { Expense, ExpenseCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

const EXPENSE_TYPES: Array<{ id: ExpenseCategory; label: string; icon: any; color: string }> = [
  { id: 'electricity', label: 'كهرباء وإنارة', icon: Zap, color: 'text-amber-600 bg-amber-50' },
  { id: 'water', label: 'مياه ومرافق', icon: Droplets, color: 'text-blue-600 bg-blue-50' },
  { id: 'rent', label: 'إيجار المحل', icon: Building, color: 'text-purple-600 bg-purple-50' },
  { id: 'wages', label: 'أجور ومرتبات ويوميات', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'transport', label: 'نقل وشحن ومواصلات', icon: Truck, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'maintenance', label: 'صيانة ومعدات وتكييف', icon: Wrench, color: 'text-orange-600 bg-orange-50' },
  { id: 'waste', label: 'هالك وتالف ومنتهي الصلاحية', icon: Trash2, color: 'text-rose-600 bg-rose-50' },
  { id: 'other', label: 'مصروفات تشغيلية أخرى', icon: MoreHorizontal, color: 'text-slate-600 bg-slate-50' },
];

export const ExpensesScreen: React.FC<{ onRefreshTreasury: () => void }> = ({ onRefreshTreasury }) => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();
  const { currentUser, isAdmin } = useAuth();
  const shopContext = useShop();

  const [expenses, setExpenses] = useState<Expense[]>(() => db.getExpenses().reverse());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('electricity');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'other'>('cash');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const refreshList = () => {
    setExpenses(db.getExpenses().reverse());
  };

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('من فضلك أدخل قيمة مصروف صحيحة أكبر من الصفر');
      return;
    }

    const typeObj = EXPENSE_TYPES.find(t => t.id === selectedCategory);
    const categoryLabel = typeObj ? typeObj.label : 'أخرى';

    const res = db.recordExpense({
      category: selectedCategory,
      categoryLabel,
      amount: parsedAmount,
      paymentMethod,
      notes,
      user: currentUser!,
    });

    if (res.success) {
      shopContext.recordExpense({
        category: selectedCategory,
        categoryLabel,
        amount: parsedAmount,
        paymentMethod,
        notes,
        createdBy: currentUser?.id || 'cashier',
        createdByName: currentUser?.name || 'كاشير',
      }, currentUser!).catch(console.warn);

      setIsAddModalOpen(false);
      setAmount('');
      setNotes('');
      refreshList();
      onRefreshTreasury();
      alert(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const totalExpenses = expenses
    .filter(e => e.status === 'completed')
    .reduce((sum, e) => sum + e.amount, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses
    .filter(e => e.status === 'completed' && e.createdAt.startsWith(todayStr))
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">سجل المصروفات اليومية والتشغيلية</h2>
            <p className="text-xs text-slate-500">
              تسجيل ومتابعة فواتير الكهرباء، الأجور، الصيانة، وخصم النثريات من الخزينة تلقائياً
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ تسجيل مصروف جديد</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">مصروفات اليوم</span>
          <span className="text-2xl font-black text-rose-700 font-mono">
            {todayExpenses.toFixed(2)} {settings.currency}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي كافة المصروفات المسجلة</span>
          <span className="text-2xl font-black text-slate-800 font-mono">
            {totalExpenses.toFixed(2)} {settings.currency}
          </span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-bold text-sm text-slate-800">
          جدول حركات المصروفات ({expenses.length})
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            لم يتم تسجيل أي مصروفات تشغيلية بعد
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-3.5">التاريخ والوقت</th>
                  <th className="p-3.5">بند المصروف</th>
                  <th className="p-3.5">طريقة الدفع</th>
                  <th className="p-3.5">القيمة</th>
                  <th className="p-3.5">البيان والملاحظات</th>
                  <th className="p-3.5">المسؤول</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {expenses.map(exp => {
                  const typeObj = EXPENSE_TYPES.find(t => t.id === exp.category);
                  const Icon = typeObj ? typeObj.icon : Receipt;

                  return (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-500 font-mono">
                        {new Date(exp.createdAt).toLocaleString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        <span className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg ${typeObj ? typeObj.color : 'text-slate-600 bg-slate-100'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <span>{exp.categoryLabel}</span>
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            exp.paymentMethod === 'cash'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {exp.paymentMethod === 'cash' ? 'نقدي من الخزينة' : 'أخرى'}
                        </span>
                      </td>
                      <td className="p-3.5 font-black text-rose-700 font-mono text-sm">
                        -{exp.amount.toFixed(2)} {settings.currency}
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {exp.notes || '—'}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {exp.createdByName || 'الكاشير'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleRecordExpense}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm">تسجيل مصروف جديد</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">قيمة المصروف *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-12 text-center text-xl font-black font-mono text-rose-700 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    autoFocus
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    {settings.currency}
                  </span>
                </div>
              </div>

              {/* Expense Category Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">نوع وبند المصروف:</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPENSE_TYPES.map(type => {
                    const isSelected = selectedCategory === type.id;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedCategory(type.id)}
                        className={`p-2.5 rounded-xl border text-right transition flex items-center gap-2 ${
                          isSelected
                            ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-2 ring-rose-200'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`p-1.5 rounded-lg ${type.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[11px] truncate">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">طريقة الصرف:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'cash'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>نقدي (يخصم من الخزينة)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('other')}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                      paymentMethod === 'other'
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>أخرى (خارج الخزينة)</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">البيان والملاحظات:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="مثال: فاتورة كهرباء شهر 9، بنزين نقل البضاعة..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
              >
                حفظ المصروف وخصمه
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
