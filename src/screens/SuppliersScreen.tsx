import React, { useState } from 'react';
import { Truck, Plus, Phone, MapPin, DollarSign, X, CheckCircle2 } from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { Supplier } from '../types';
import { useAuth } from '../context/AuthContext';

export const SuppliersScreen: React.FC<{ onRefreshTreasury: () => void }> = ({ onRefreshTreasury }) => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();
  const { currentUser } = useAuth();

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => db.getSuppliers());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentModalSupplier, setPaymentModalSupplier] = useState<Supplier | null>(null);

  // Supplier Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Form
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const refreshList = () => {
    setSuppliers(db.getSuppliers());
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    db.addSupplier(
      {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
      },
      currentUser!
    );

    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    setAddress('');
    setNotes('');
    refreshList();
  };

  const handleRecordSupplierPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalSupplier) return;
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('من فضلك أدخل مبلغ صحيح أكبر من الصفر');
      return;
    }

    // Record cash transaction out for supplier payment
    db.addCashTransaction({
      transactionType: 'withdrawal',
      flow: 'out',
      amount: amt,
      referenceType: 'manual',
      description: `سداد دفعة للمورد: ${paymentModalSupplier.name}${paymentNotes ? ' - ' + paymentNotes : ''}`,
      createdBy: currentUser!.id,
      createdByName: currentUser!.name,
    });

    db.logAudit(
      currentUser!.id,
      currentUser!.name,
      'SUPPLIER_PAYMENT',
      'suppliers',
      paymentModalSupplier.id,
      '',
      `سداد دفعة: ${amt} ج.م`,
      `سداد دفعة للمورد ${paymentModalSupplier.name}`
    );

    setPaymentModalSupplier(null);
    setPaymentAmount('');
    setPaymentNotes('');
    onRefreshTreasury();
    alert(`تم سداد ${amt.toFixed(2)} ${settings.currency} للمورد بنجاح وخصمها من الخزينة.`);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">سجل الموردين والشركات</h2>
            <p className="text-xs text-slate-500">
              بيانات مندوبي الشركات، ومتابعة فواتير التوريد وسداد المستحقات
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة مورد جديد</span>
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suppliers.map(sup => {
          const supplierPurchases = db.getPurchases().filter(p => p.supplierId === sup.id && p.status === 'completed');
          const totalBought = supplierPurchases.reduce((s, p) => s + p.totalAmount, 0);

          return (
            <div key={sup.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {sup.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {supplierPurchases.length} توريدات
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3">{sup.name}</h3>

                <div className="space-y-1 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sup.phone || 'بدون هاتف'}</span>
                  </div>
                  {sup.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sup.address}</span>
                    </div>
                  )}
                  {sup.notes && (
                    <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100 mt-2">
                      {sup.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">إجمالي المشتريات:</span>
                  <span className="text-sm font-black text-slate-800 font-mono">
                    {totalBought.toFixed(2)} {settings.currency}
                  </span>
                </div>

                <button
                  onClick={() => setPaymentModalSupplier(sup)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1 transition"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>سداد دفعة</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleAddSupplier}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">إضافة مورد أو شركة جديدة</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المورد أو الشركة *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: شركة المراعي، مخازن الأمانة..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف / المندوب</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان أو منطقة المخزن</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="المنطقة الصناعية..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات ومواعيد المرور</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="مثال: يمر كل ثلاثاء، كاش فقط..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
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
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
              >
                حفظ المورد
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Supplier Payment Modal */}
      {paymentModalSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleRecordSupplierPayment}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-200" />
                <h3 className="font-bold text-sm">سداد دفعة للمورد: {paymentModalSupplier.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalSupplier(null)}
                className="p-1 rounded-lg text-indigo-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                سيتم خصم هذا المبلغ فورياً من الخزينة النقدية وتوثيق الحركة.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المبلغ المسدد *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 text-center text-lg font-black font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات ورقم إيصال الاستلام:</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  placeholder="مثال: استلم المندوب كاش مع إيصال قبض #22"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPaymentModalSupplier(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
              >
                تأكيد السداد والخصم
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
