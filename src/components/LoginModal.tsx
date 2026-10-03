import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, UserCheck, X, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onOpenNewShop?: () => void }> = ({
  isOpen,
  onClose,
  onOpenNewShop,
}) => {
  const { currentUser, login, loginWithPin, registerUser, logout, switchRoleQuick } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'pin' | 'credentials' | 'register'>('pin');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regRole, setRegRole] = useState<'admin' | 'cashier'>('admin');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  if (!isOpen) return null;

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handlePinBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const verifyPin = async (inputPin: string) => {
    setErrorMsg('');
    const res = await loginWithPin(inputPin);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setPin('');
      }, 500);
    } else {
      setErrorMsg(res.message);
      setPin('');
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !password.trim()) {
      setErrorMsg('من فضلك أدخل اسم المستخدم وكلمة المرور');
      return;
    }
    const res = await login(username, password);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setUsername('');
        setPassword('');
      }, 500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regUsername.trim() || !regPin.trim()) {
      setErrorMsg('من فضلك املأ جميع الحقول المطلوبة (الاسم، اسم المستخدم، ورمز PIN).');
      return;
    }

    if (regPin.trim().length !== 4) {
      setErrorMsg('رمز PIN يجب أن يتكون من 4 أرقام بالضبط للدخول السريع.');
      return;
    }

    setIsSubmittingReg(true);
    try {
      const res = await registerUser({
        name: regName.trim(),
        username: regUsername.trim(),
        password: regPassword,
        pin: regPin.trim(),
        role: regRole,
      });

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
          setRegName('');
          setRegUsername('');
          setRegPassword('');
          setRegPin('');
          setIsSubmittingReg(false);
        }, 800);
      } else {
        setErrorMsg(res.message);
        setIsSubmittingReg(false);
      }
    } catch (err: any) {
      setErrorMsg('حدث خطأ أثناء إنشاء الحساب: ' + (err?.message || err));
      setIsSubmittingReg(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm">تسجيل الدخول / تبديل المستخدم</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current user banner */}
        <div className="bg-slate-100 p-3.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-black flex items-center justify-center text-xs">
              {currentUser?.name.charAt(0) || '؟'}
            </div>
            <div>
              <div className="font-bold text-slate-800">{currentUser?.name || 'غير مسجل'}</div>
              <div className="text-slate-500">
                {currentUser?.role === 'admin' ? 'صلاحيات مدير كاملة (Admin)' : 'صلاحيات كاشير (Cashier)'}
              </div>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={() => {
                logout();
                setSuccessMsg('تم تسجيل الخروج');
              }}
              className="text-rose-600 hover:text-rose-700 font-bold"
            >
              خروج
            </button>
          )}
        </div>

        {/* Quick Demo Switchers */}
        <div className="p-3 bg-amber-50/70 border-b border-amber-200 text-xs">
          <span className="text-amber-900 font-bold block mb-1.5">تبديل فوري لتجربة الصلاحيات:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                switchRoleQuick('admin');
                onClose();
              }}
              className={`p-2 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                currentUser?.role === 'admin'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>المدير (PIN: 1234)</span>
            </button>

            <button
              onClick={() => {
                switchRoleQuick('cashier');
                onClose();
              }}
              className={`p-2 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                currentUser?.role === 'cashier'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>الكاشير (PIN: 0000)</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('pin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-center transition ${
              activeTab === 'pin' ? 'border-b-2 border-emerald-600 text-emerald-600 bg-white' : 'bg-slate-50 text-slate-500'
            }`}
          >
            رمز PIN
          </button>
          <button
            onClick={() => {
              setActiveTab('credentials');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-center transition ${
              activeTab === 'credentials' ? 'border-b-2 border-emerald-600 text-emerald-600 bg-white' : 'bg-slate-50 text-slate-500'
            }`}
          >
            اسم المستخدم
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1 ${
              activeTab === 'register' ? 'border-b-2 border-emerald-600 text-emerald-600 bg-white' : 'bg-slate-50 text-slate-500'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>حساب جديد</span>
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold text-center">
            {successMsg}
          </div>
        )}

        {/* PIN pad view */}
        {activeTab === 'pin' && (
          <div className="p-4">
            <div className="flex justify-center gap-3 my-3">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.length > i ? 'bg-emerald-600 border-emerald-600 scale-110' : 'border-slate-300 bg-slate-100'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num)}
                  className="h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold rounded-xl text-lg transition flex items-center justify-center shadow-xs"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setPin('')}
                className="h-12 bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold rounded-xl text-xs transition"
              >
                مسح
              </button>
              <button
                onClick={() => handlePinInput('0')}
                className="h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold rounded-xl text-lg transition flex items-center justify-center shadow-xs"
              >
                0
              </button>
              <button
                onClick={handlePinBackspace}
                className="h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition"
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {/* Credentials view */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">اسم المستخدم:</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin أو cashier"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">كلمة المرور:</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition"
            >
              تسجيل الدخول
            </button>
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-bold"
              >
                ليس لديك حساب؟ إنشاء حساب جديد من الصفر
              </button>
            </div>
          </form>
        )}

        {/* Register new user view */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-4 space-y-2.5 text-xs">
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>إنشاء حساب مستخدم / كاشير / مدير جديد</span>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">نوع الصلاحية:</label>
              <select
                value={regRole}
                onChange={e => setRegRole(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium outline-none"
              >
                <option value="admin">مدير مسؤول (صلاحيات كاملة للخزينة والتقارير)</option>
                <option value="cashier">كاشير (صلاحيات بيع وسداد ديون فقط)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">الاسم الكامل *:</label>
              <input
                type="text"
                required
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="مثال: مصطفى محمود"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-600 mb-1">اسم الدخول (Username) *:</label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                placeholder="مثال: mostafa"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-600 mb-1">كلمة المرور:</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">رمز PIN (4 أرقام) *:</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={regPin}
                  onChange={e => setRegPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-center font-bold outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingReg}
              className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
            >
              {isSubmittingReg ? 'جاري الإنشاء...' : 'إنشاء الحساب والبدء فوراً'}
            </button>

            {onOpenNewShop && (
              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNewShop();
                  }}
                  className="text-amber-700 hover:text-amber-800 text-[11px] font-bold underline"
                >
                  هل تريد إنشاء سوبرماركت ومحل جديد بالكامل من الصفر؟
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
