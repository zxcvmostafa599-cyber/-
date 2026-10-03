import React, { useState } from 'react';
import {
  Store,
  ShieldCheck,
  User,
  Key,
  Lock,
  Sparkles,
  CheckCircle2,
  Coins,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { useAuth, hashString } from '../context/AuthContext';
import { User as UserType } from '../types';

export const FirstTimeSetup: React.FC<{ onComplete: () => void; onOpenLogin?: () => void }> = ({
  onComplete,
  onOpenLogin,
}) => {
  const db = DatabaseService.getInstance();
  const { setCurrentUser } = useAuth();
  const hasExistingUsers = db.getUsers().length > 0;

  const [storeName, setStoreName] = useState('');
  const [currency, setCurrency] = useState('جنيه');
  const [phone, setPhone] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPin, setAdminPin] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!adminName.trim() || !adminUsername.trim() || !adminPassword.trim() || !adminPin.trim()) {
      setErrorMsg('من فضلك املأ جميع بيانات الحساب (الاسم، اسم المستخدم، كلمة المرور، ورمز PIN).');
      return;
    }

    if (adminPin.trim().length !== 4) {
      setErrorMsg('رمز PIN للدخول السريع يجب أن يتكون من 4 أرقام بالضبط.');
      return;
    }

    setLoading(true);
    try {
      const passwordHash = await hashString(adminPassword.trim());
      const newAdmin: UserType = {
        id: 'usr-' + Date.now(),
        name: adminName.trim(),
        username: adminUsername.trim(),
        passwordHash,
        pin: adminPin.trim(),
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString(),
      };

      // 1. Save user to database
      db.saveUser(newAdmin, { id: newAdmin.id, name: newAdmin.name });

      // 2. Save store settings with 0 opening cash
      db.updateSettings(
        {
          storeName: storeName.trim() || 'سوبر ماركت ' + adminName.trim(),
          currency: currency.trim() || 'جنيه',
          phone: phone.trim() || '',
          address: '',
          openingCashBalance: 0,
        },
        { id: newAdmin.id, name: newAdmin.name }
      );

      // 3. Set current user
      setCurrentUser(newAdmin);
      localStorage.setItem('supermarket_active_user', JSON.stringify(newAdmin));

      // 4. Log audit
      db.logAudit(
        newAdmin.id,
        newAdmin.name,
        'SETUP_ACCOUNT_ZERO',
        'system',
        newAdmin.id,
        '',
        '',
        'إعداد وبدء حساب مدير السوبر ماركت لأول مرة من الصفر خالص'
      );

      setLoading(false);
      onComplete();
    } catch (err: any) {
      setErrorMsg('حدث خطأ أثناء حفظ البيانات: ' + (err?.message || 'يرجى المحاولة مجدداً'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090C0A] text-stone-100 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-xl bg-[#121614] border border-gold-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-gold-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 text-darkbg-950 shadow-gold-glow mb-2">
            <Store className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
            <span>تسجيل حساب المحل الأول والبدء من الصفر</span>
            <Sparkles className="w-5 h-5 text-gold-400" />
          </h1>
          <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
            تم تصفير كافة الحسابات والبيانات الوهمية تماماً. أدخل بيانات محلك وحساب المدير للبدء الفعلي برصيد ومخازن <span className="text-gold-400 font-bold font-mono">0.00</span>.
          </p>
        </div>

        {/* Zero Guarantee Badges */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-darkbg-950/80 rounded-2xl border border-stone-800 text-center mb-6">
          <div className="space-y-0.5">
            <span className="text-[11px] text-stone-400 block font-medium">المخازن والأصناف:</span>
            <span className="text-xs font-black text-emerald-400 font-mono">0 أصناف</span>
          </div>
          <div className="space-y-0.5 border-x border-stone-800">
            <span className="text-[11px] text-stone-400 block font-medium">العملاء والديون:</span>
            <span className="text-xs font-black text-emerald-400 font-mono">0.00 {currency}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-stone-400 block font-medium">رصيد الخزينة:</span>
            <span className="text-xs font-black text-emerald-400 font-mono">0.00 {currency}</span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-300 font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Store info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gold-400 border-b border-stone-800 pb-1.5">
              <Store className="w-4 h-4" />
              <span>1. بيانات المحل أو السوبر ماركت:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">اسم السوبر ماركت / المحل:</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder="مثال: سوبر ماركت السلام"
                  className="w-full bg-[#181D1A] border border-stone-700 focus:border-gold-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">العملة:</label>
                <input
                  type="text"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  placeholder="جنيه / ريال / دولار"
                  className="w-full bg-[#181D1A] border border-stone-700 focus:border-gold-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono transition"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-300 block mb-1">رقم الهاتف (اختياري للطباعة على الفاتورة):</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full bg-[#181D1A] border border-stone-700 focus:border-gold-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Manager admin account */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gold-400 border-b border-stone-800 pb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>2. حساب المدير المسؤول (صلاحيات كاملة):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">الاسم الكامل للمدير *:</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  placeholder="مثال: مصطفى محمود"
                  className="w-full bg-[#181D1A] border border-stone-700 focus:border-gold-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">اسم الدخول (Username) *:</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={e => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#181D1A] border border-stone-700 focus:border-gold-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">كلمة المرور *:</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181D1A] border border-stone-700 focus:border-gold-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">رمز PIN للدخول السريع (4 أرقام) *:</label>
                <input
                  type="text"
                  maxLength={4}
                  value={adminPin}
                  onChange={e => setAdminPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  className="w-full bg-[#181D1A] border border-stone-700 focus:border-gold-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono text-center font-bold tracking-widest outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-darkbg-950 font-black rounded-xl text-sm transition shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span>جاري تجهيز النظام...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>إنشاء الحساب وبدء تشغيل السوبر ماركت (0.00)</span>
              </>
            )}
          </button>

          {hasExistingUsers && onOpenLogin && (
            <div className="text-center pt-3 border-t border-stone-800/80">
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-xs text-gold-400 hover:text-gold-300 font-bold underline transition"
              >
                لديك حساب مسجل بالفعل؟ اضغط هنا لتسجيل الدخول
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
