import React, { useState } from 'react';
import {
  Smartphone,
  Laptop,
  Radio,
  Copy,
  Check,
  RefreshCw,
  PlusCircle,
  Building2,
  X,
  Shield,
  Wifi,
  WifiOff,
  Cloud,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../db/dbService';
import {
  getActiveFirebaseConfig,
  saveCustomFirebaseConfig,
  clearCustomFirebaseConfig,
} from '../firebase/config';

interface MultiDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiDeviceModal: React.FC<MultiDeviceModalProps> = ({ isOpen, onClose }) => {
  const {
    shopId,
    deviceId,
    isOnline,
    isSyncing,
    switchShop,
    createNewShop,
    treasuryBalance,
    todayStats,
  } = useShop();
  const { currentUser, isAdmin, setCurrentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'status' | 'connect' | 'new_shop' | 'firebase'>('status');
  const [copied, setCopied] = useState(false);
  const [targetShopId, setTargetShopId] = useState('');

  // New Shop form states
  const [newShopName, setNewShopName] = useState('');
  const [newShopPhone, setNewShopPhone] = useState('');
  const [newShopAddress, setNewShopAddress] = useState('');
  const [newShopCurrency, setNewShopCurrency] = useState('جنيه');
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerUsername, setNewManagerUsername] = useState('');
  const [newManagerPassword, setNewManagerPassword] = useState('');
  const [newManagerPin, setNewManagerPin] = useState('1234');
  const [isCreatingShop, setIsCreatingShop] = useState(false);
  const [shopCreationSuccess, setShopCreationSuccess] = useState(false);
  const [createShopError, setCreateShopError] = useState('');

  // Custom Firebase Config states
  const currentConfig = getActiveFirebaseConfig();
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');

  if (!isOpen) return null;

  const handleCopyShopId = () => {
    navigator.clipboard.writeText(shopId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetShopId.trim()) return;
    switchShop(targetShopId.trim().toUpperCase());
    onClose();
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateShopError('');

    if (!newShopName.trim() || !newManagerName.trim() || !newManagerUsername.trim()) {
      setCreateShopError('من فضلك املأ جميع الحقول الأساسية المطلوبة.');
      return;
    }

    setIsCreatingShop(true);
    try {
      const generatedShopId = 'SHOP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const res = await createNewShop({
        shopId: generatedShopId,
        shopName: newShopName.trim(),
        phone: newShopPhone.trim(),
        address: newShopAddress.trim(),
        currency: newShopCurrency.trim() || 'جنيه',
        managerName: newManagerName.trim(),
        managerUsername: newManagerUsername.trim(),
        managerPasswordHash: newManagerPassword || '123456',
      });

      if (res?.manager) {
        setCurrentUser(res.manager);
      }

      setShopCreationSuccess(true);
      setTimeout(() => {
        setIsCreatingShop(false);
        setShopCreationSuccess(false);
        onClose();
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      console.warn('Handling local fallback for shop creation:', err);
      try {
        const dbInstance = DatabaseService.getInstance();
        const generatedShopId = 'SHOP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        dbInstance.updateSettings(
          {
            storeName: newShopName.trim(),
            currency: newShopCurrency.trim() || 'جنيه',
            phone: newShopPhone.trim(),
            address: newShopAddress.trim(),
            openingCashBalance: 0,
          },
          { id: 'admin', name: newManagerName.trim() }
        );

        const newManager = {
          id: 'usr-' + Date.now(),
          name: newManagerName.trim(),
          username: newManagerUsername.trim(),
          passwordHash: newManagerPassword || '123456',
          role: 'admin' as const,
          pin: newManagerPin.trim() || '1234',
          active: true,
          createdAt: new Date().toISOString(),
        };
        dbInstance.saveUser(newManager, { id: newManager.id, name: newManager.name });
        dbInstance.resetAllTransactions({ id: newManager.id, name: newManager.name }, true);
        localStorage.setItem('pos_active_shop_id', generatedShopId);
        setCurrentUser(newManager);

        setShopCreationSuccess(true);
        setTimeout(() => {
          setIsCreatingShop(false);
          setShopCreationSuccess(false);
          onClose();
          window.location.reload();
        }, 1200);
      } catch (fallbackErr: any) {
        setCreateShopError('حدث خطأ أثناء إنشاء الحساب: ' + (fallbackErr?.message || 'يرجى المحاولة مرة أخرى'));
        setIsCreatingShop(false);
      }
    }
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) return;
    saveCustomFirebaseConfig({
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      appId: appId.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-darkbg-950 border border-gold-600/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-gold-glow text-white">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>تعدد الأجهزة والمزامنة السحابية (Multi-Device Sync)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  Cloud Firestore
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                ربط الهواتف والكمبيوتر بنفس المحل مع التحديث اللحظي لجميع العمليات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-900 hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-800 px-6 gap-2 bg-darkbg-900/60 pt-3">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'status'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>حالة المزامنة والجهاز</span>
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'connect'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ربط جهاز آخر للمحل</span>
          </button>
          <button
            onClick={() => setActiveTab('new_shop')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'new_shop'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إنشاء حساب ومحل جديد من الصفر</span>
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
              activeTab === 'firebase'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>إعدادات Firebase</span>
          </button>
        </div>

        {/* Tab 1: Current Status & Diagnostics */}
        {activeTab === 'status' && (
          <div className="p-6 space-y-5">
            {/* Network & Live Status Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-darkbg-900 border border-stone-800 rounded-2xl flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isOnline ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}
                >
                  {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 font-bold">حالة الاتصال:</div>
                  <div className="text-xs font-black">
                    {isOnline ? (
                      <span className="text-emerald-400">🟢 متصل بالإنترنت</span>
                    ) : (
                      <span className="text-rose-400">🔴 غير متصل</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-darkbg-900 border border-stone-800 rounded-2xl flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSyncing ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 font-bold">المزامنة مع باقي الأجهزة:</div>
                  <div className="text-xs font-black">
                    {isSyncing ? (
                      <span className="text-amber-400">🟡 جاري المزامنة...</span>
                    ) : (
                      <span className="text-emerald-400">🟢 متزامن لحظياً</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-darkbg-900 border border-stone-800 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-950/60 border border-gold-600/30 text-gold-400 flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 font-bold">معرف هذا الجهاز:</div>
                  <div className="text-xs font-black text-white font-mono">{deviceId}</div>
                </div>
              </div>
            </div>

            {/* Current Active Shop Card */}
            <div className="p-5 bg-gradient-to-r from-brown-950 to-darkbg-900 border border-gold-600/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gold-400" />
                  <span className="text-xs text-gold-300 font-bold">المحل النشط حالياً:</span>
                </div>
                <button
                  onClick={handleCopyShopId}
                  className="px-2.5 py-1 bg-darkbg-900 hover:bg-darkbg-850 text-gold-300 border border-gold-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ كود المحل'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-darkbg-950/90 p-3.5 rounded-xl border border-stone-800">
                <div>
                  <div className="text-[10px] text-stone-400 font-bold">كود المحل (shopId):</div>
                  <div className="text-base font-black font-mono text-gold-400 tracking-wider">
                    {shopId}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-stone-400 font-bold">رصيد الخزينة المشترك:</div>
                  <div className="text-base font-black font-mono text-emerald-400">
                    {treasuryBalance.toFixed(2)} EGP
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-300 leading-relaxed bg-brown-900/20 p-3 rounded-xl border border-brown-600/20 flex items-start gap-2">
                <Shield className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  أي جهاز هاتف أو كمبيوتر آخر يدخل نفس الكود <strong>({shopId})</strong> سيرى نفس المبيعات والخزينة والديون فورياً بدون أي تأخير، وبدون الحاجة لإعادة تحميل الصفحة.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Connect another Device to existing Shop */}
        {activeTab === 'connect' && (
          <form onSubmit={handleSwitchShop} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">
                أدخل كود المحل (shopId) للاتصال به من هذا الجهاز:
              </label>
              <input
                type="text"
                value={targetShopId}
                onChange={(e) => setTargetShopId(e.target.value)}
                placeholder="مثال: SHOP-XYZ123"
                className="w-full bg-darkbg-900 border border-stone-700 focus:border-gold-500 rounded-xl px-4 py-3 text-white font-mono text-center font-bold text-base outline-hidden uppercase tracking-wider"
                required
              />
              <p className="text-[11px] text-stone-400 mt-1.5">
                يمكنك نسخ كود المحل من شاشة الجهاز الأول ولصقه هنا للربط المباشر.
              </p>
            </div>

            <div className="bg-darkbg-900 p-4 rounded-xl border border-stone-800 space-y-2 text-xs text-stone-300">
              <div className="font-bold text-gold-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-gold-400" />
                <span>طريقة تشغيل النظام على عدة هواتف:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-stone-400">
                <li>افتح رابط التطبيق من متصفح الهاتف الثاني.</li>
                <li>انقر على أيقونة "تعدد الأجهزة" من الأعلى.</li>
                <li>اكتب كود المحل الحالي: <span className="font-mono text-gold-300">{shopId}</span></li>
                <li>انقر "اتصال بالمحل"، وستتصل قاعدة بيانات المحل بالكامل بالهاتف فوراً.</li>
              </ol>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-darkbg-950 font-black rounded-xl text-sm transition shadow-gold-glow cursor-pointer"
            >
              اتصال بالمحل ومزامنة البيانات
            </button>
          </form>
        )}

        {/* Tab 3: Create Brand New Shop from Zero */}
        {activeTab === 'new_shop' && (
          <form onSubmit={handleCreateShop} className="p-6 space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                <strong>شرط البداية من الصفر:</strong> المحل الجديد يبدأ بمبيعات = 0، خزانة = 0، ديون = 0، وبدون أي حركات وهمية.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">اسم المحل / السوبرماركت:</label>
                <input
                  type="text"
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  placeholder="مثال: سوبر ماركت الأمانة"
                  className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">العملة:</label>
                <input
                  type="text"
                  value={newShopCurrency}
                  onChange={(e) => setNewShopCurrency(e.target.value)}
                  className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">رقم الهاتف (اختياري):</label>
                <input
                  type="text"
                  value={newShopPhone}
                  onChange={(e) => setNewShopPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">العنوان (اختياري):</label>
                <input
                  type="text"
                  value={newShopAddress}
                  onChange={(e) => setNewShopAddress(e.target.value)}
                  placeholder="الشارع، المدينة"
                  className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="border-t border-stone-800 pt-3">
              <h4 className="text-xs font-bold text-gold-300 mb-2">بيانات المدير المسؤول (Manager):</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">الاسم الكامل *:</label>
                  <input
                    type="text"
                    value={newManagerName}
                    onChange={(e) => setNewManagerName(e.target.value)}
                    placeholder="مثال: أحمد محمد"
                    className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">اسم الدخول (Username) *:</label>
                  <input
                    type="text"
                    value={newManagerUsername}
                    onChange={(e) => setNewManagerUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">كلمة المرور *:</label>
                  <input
                    type="password"
                    value={newManagerPassword}
                    onChange={(e) => setNewManagerPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">رمز PIN للدخول السريع (4 أرقام) *:</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newManagerPin}
                    onChange={(e) => setNewManagerPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-center font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            {createShopError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500 rounded-xl text-center text-xs text-rose-300 font-bold">
                {createShopError}
              </div>
            )}

            {shopCreationSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-center text-xs text-emerald-300 font-bold">
                تم إنشاء الحساب والمحل الجديد بنجاح وبدء الحسابات من 0.00 جنيه!
              </div>
            )}

            <button
              type="submit"
              disabled={isCreatingShop}
              className="w-full py-3 bg-gradient-to-r from-brown-700 to-gold-600 hover:from-brown-600 hover:to-gold-500 text-white font-black rounded-xl text-sm transition shadow-gold-glow cursor-pointer disabled:opacity-50"
            >
              {isCreatingShop ? 'جاري تجهيز وتصفير الحساب والمحل...' : 'إنشاء الحساب والمحل الجديد والبدء من الصفر'}
            </button>
          </form>
        )}

        {/* Tab 4: Firebase Configuration */}
        {activeTab === 'firebase' && (
          <form onSubmit={handleSaveFirebaseConfig} className="p-6 space-y-4">
            <div className="text-xs text-stone-300 leading-relaxed bg-darkbg-900 p-3.5 rounded-xl border border-stone-800">
              <span className="font-bold text-gold-300 block mb-1">اتصال Cloud Firestore السحابي:</span>
              يدعم التطبيق العمل السحابي المباشر، ويمكنك إدخال مفاتيح مشروع Firebase الخاص بك للتحكم الكامل بقاعدة البيانات والنسخ الاحتياطي السحابي.
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1 font-mono">Firebase Project ID:</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="supermarket-pos-12345"
                  className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1 font-mono">Firebase API Key:</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 block mb-1 font-mono">Firebase App ID:</label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456789:web:abcdef..."
                  className="w-full bg-darkbg-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-darkbg-950 font-black rounded-xl text-xs transition"
              >
                حفظ وإعادة الاتصال السحابي
              </button>
              <button
                type="button"
                onClick={clearCustomFirebaseConfig}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl text-xs font-bold transition"
              >
                استعادة الافتراضي
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
