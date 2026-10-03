import React, { useState } from 'react';
import {
  Settings,
  Database,
  Download,
  Upload,
  RefreshCw,
  Save,
  Users,
  ShieldCheck,
  Store,
  Layers,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Key,
  RotateCcw,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { StoreSettings, User, Category } from '../types';
import { useAuth, hashString } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export const SettingsScreen: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const db = DatabaseService.getInstance();
  const { currentUser, isAdmin } = useAuth();
  const shopContext = useShop();

  const [settings, setSettings] = useState<StoreSettings>(() => db.getSettings());
  const [users, setUsers] = useState<User[]>(() => db.getUsers());
  const [categories, setCategories] = useState<Category[]>(() => db.getCategories());

  const [activeTab, setActiveTab] = useState<'store' | 'backup' | 'users' | 'categories'>('store');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserPin, setNewUserPin] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'cashier'>('cashier');

  // New Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🛒');

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('تعديل الإعدادات العامة يتطلب صلاحية المدير.');
      return;
    }
    db.updateSettings(settings, currentUser!);
    setMessage({ text: 'تم حفظ إعدادات المحل بنجاح', type: 'success' });
    onRefresh();
  };

  // Export Backup JSON
  const handleExportBackup = () => {
    const jsonStr = db.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supermarket-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ text: 'تم تنزيل النسخة الاحتياطية JSON بنجاح', type: 'success' });
  };

  // Export SQL Dump
  const handleExportSql = () => {
    const sqlStr = db.exportSqlDump();
    const blob = new Blob([sqlStr], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supermarket-dump-${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ text: 'تم تصدير تفريغ SQL بنجاح', type: 'success' });
  };

  // Import Backup JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('تحذير: استعادة النسخة الاحتياطية ستستبدل البيانات الحالية بالكامل. هل أنت متأكد من المتابعة؟')) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      const res = db.importBackupJson(content, currentUser!);
      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        setSettings(db.getSettings());
        setUsers(db.getUsers());
        setCategories(db.getCategories());
        onRefresh();
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset / Zero All Transactions
  const handleResetTransactions = async () => {
    if (!isAdmin) {
      alert('تصفير المعاملات يتطلب صلاحيات المدير المسؤول.');
      return;
    }
    const conf = window.confirm(
      'تأكيد تصفير كافة المعاملات والبدء من الصفر:\n\n' +
      '• سيتم مسح كافة سجلات وفواتير المبيعات بالكامل.\n' +
      '• سيتم تصفير ديون جميع العملاء لتصبح 0.00 جنيه.\n' +
      '• سيتم تصفير مستحقات وسدادات الموردين.\n' +
      '• سيتم تصفير كافة المصروفات اليومية.\n' +
      '• سيتم تصفير رصيد وحركات الخزينة للبدء برصيد صفر.\n' +
      '• سيتم تصفير تقارير إغلاق اليومية.\n\n' +
      'مع الحفاظ الكامل على الأقسام والأصناف والعملاء والموردين والمستخدمين والإعدادات.\n\n' +
      'هل تريد تأكيد تصفير كافة المعاملات الآن؟'
    );
    if (!conf) return;

    try {
      if (shopContext?.resetAllTransactions) {
        await shopContext.resetAllTransactions(currentUser!);
      } else {
        db.resetAllTransactions(currentUser!);
      }
      setSettings(db.getSettings());
      onRefresh();
      setMessage({
        text: 'تم تصفير كافة المعاملات والديون والمصروفات والخزينة بنجاح! الأرصدة تبدأ الآن من الصفر.',
        type: 'success',
      });
    } catch (err) {
      db.resetAllTransactions(currentUser!);
      setSettings(db.getSettings());
      onRefresh();
      setMessage({
        text: 'تم تصفير المعاملات محلياً بنجاح.',
        type: 'success',
      });
    }
  };

  // Reset Factory / Zero Everything
  const handleResetFactory = () => {
    if (!isAdmin) {
      alert('إعادة ضبط وتصفير النظام تتطلب صلاحيات المدير المسؤول.');
      return;
    }
    const conf = window.confirm(
      'تحذير: سيتم مسح كافة البيانات الحالية وتصفير المخازن والعملاء والمعاملات والمستخدمين للبدء من الصفر تماماً. هل تريد المتابعة؟'
    );
    if (conf) {
      db.resetEverythingToZero();
      window.location.reload();
    }
  };

  // Add User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('إضافة مستخدمين تتطلب صلاحية المدير.');
      return;
    }
    if (!newUserName.trim() || !newUserUsername.trim() || !newUserPin.trim()) {
      alert('من فضلك املأ جميع الحقول');
      return;
    }

    const passwordHash = await hashString(newUserPassword || '123456');
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: newUserName.trim(),
      username: newUserUsername.trim(),
      passwordHash,
      pin: newUserPin.trim(),
      role: newUserRole,
      createdAt: new Date().toISOString(),
    };

    db.saveUser(newUser, currentUser!);
    setUsers(db.getUsers());
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserPin('');
    setMessage({ text: 'تمت إضافة المستخدم بنجاح', type: 'success' });
  };

  // Delete User
  const handleDeleteUser = (userId: string) => {
    if (!isAdmin) return;
    if (userId === currentUser?.id) {
      alert('لا يمكنك حذف الحساب الذي تستخدمه حالياً');
      return;
    }
    const res = db.deleteUser(userId, currentUser!);
    if (res) {
      setUsers(db.getUsers());
      setMessage({ text: 'تم حذف المستخدم بنجاح', type: 'success' });
    } else {
      alert('لا يمكن حذف المستخدم الأخير بالنظام');
    }
  };

  // Add Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    db.addCategory(newCatName.trim(), newCatIcon, '#0EA5E9', currentUser!);
    setCategories(db.getCategories());
    setNewCatName('');
    setMessage({ text: 'تمت إضافة القسم بنجاح', type: 'success' });
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">إعدادات النظام والنسخ الاحتياطي</h2>
            <p className="text-xs text-slate-500">
              بيانات المحل، العملة، تذييل الفاتورة، النسخ الاحتياطي والاستعادة، والمستخدمين
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold bg-white rounded-t-2xl px-3 pt-2">
        {[
          { id: 'store', label: 'بيانات المحل والفاتورة', icon: Store },
          { id: 'backup', label: 'النسخ الاحتياطي واستعادة البيانات', icon: Database },
          { id: 'users', label: 'المستخدمون والصلاحيات', icon: Users },
          { id: 'categories', label: 'أقسام السوبر ماركت', icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Store Settings */}
      {activeTab === 'store' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-b-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اسم المحل / السوبر ماركت *</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رمز / اسم العملة *</label>
              <input
                type="text"
                required
                value={settings.currency}
                onChange={e => setSettings({ ...settings, currency: e.target.value })}
                placeholder="جنيه، ج.م، ر.س، د.إ..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">رقم الهاتف للتواصل</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">العنوان بالتفصيل</label>
              <input
                type="text"
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">رسالة نهاية الإيصال (تذييل الفاتورة):</label>
            <input
              type="text"
              value={settings.receiptFooter}
              onChange={e => setSettings({ ...settings, receiptFooter: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={settings.allowExceedDebtLimit}
                onChange={e => setSettings({ ...settings, allowExceedDebtLimit: e.target.checked })}
                className="rounded text-emerald-600"
              />
              <span>السماح بتجاوز الحد الائتماني للعميل عند البيع الآجل تلقائياً</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 text-sm">أمان البيانات والعمل بدون إنترنت</h4>
              <p className="text-blue-800 mt-1 leading-relaxed">
                البرنامج يعمل بنسبة 100% بدون إنترنت ويحفظ جميع البيانات محلياً. يُنصح بتحميل نسخة احتياطية يومياً
                لحفظها على فلاشة USB أو جهاز كمبيوتر آخر لحماية بياناتك من أي عطل طارئ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export JSON */}
            <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-slate-50/50">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>تحميل نسخة احتياطية كاملة (JSON)</span>
              </div>
              <p className="text-slate-500">
                حفظ ملف شامل يتضمن جميع الفواتير، ديون العملاء، حركات الخزينة، والمخزون.
              </p>
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل ملف النسخة الاحتياطية</span>
              </button>
            </div>

            {/* Export SQL */}
            <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-slate-50/50">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span>تصدير تفريغ قواعد البيانات (SQL Dump)</span>
              </div>
              <p className="text-slate-500">
                إنشاء ملف أوامر SQL متوافق للترحيل إلى SQLite أو PostgreSQL أو MySQL عند التوسع.
              </p>
              <button
                onClick={handleExportSql}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <FileCode className="w-4 h-4" />
                <span>تصدير ملف SQL Script</span>
              </button>
            </div>
          </div>

          {/* Restore Section */}
          <div className="p-4 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50/40 space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <Upload className="w-4 h-4 text-amber-700" />
              <span>استعادة نسخة احتياطية سابقة</span>
            </div>
            <p className="text-amber-800 text-[11px]">
              اختر ملف نسخة احتياطية (.json) محفوظ مسبقاً لاسترجاع العمليات والحسابات.
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl cursor-pointer transition">
              <Upload className="w-4 h-4" />
              <span>اختيار ملف الاستعادة</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>

          {/* Danger Zone: Zero All Transactions */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-200">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>تصفير وتصفية جميع المعاملات (البدء من الصفر):</span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed max-w-xl">
                    يمسح كافة المبيعات، ديون العملاء (تصبح 0)، مستحقات الموردين، المصروفات، وحركات الخزينة، مع <strong className="text-slate-800 font-bold">الحفاظ التام على بيانات الأصناف والأسعار والعملاء والمستخدمين</strong> لبدء العمل الفعلي للمحل بحسابات نظيفة ومصفرة.
                  </p>
                </div>
                <button
                  onClick={handleResetTransactions}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 text-xs shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تصفير كل المعاملات الآن</span>
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone: Factory Reset */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-rose-700">
              <div>
                <span className="font-bold text-sm block">إعادة ضبط المصنع للبيانات التجريبية:</span>
                <span className="text-slate-400 text-[11px]">
                  مسح البيانات وإعادتها لحالتها الأولية
                </span>
              </div>
              <button
                onClick={handleResetFactory}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl transition"
              >
                إعادة ضبط المصنع
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Users */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">المستخدمون المسجلون ({users.length})</h3>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center ${u.role === 'admin' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                      {u.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-slate-500">اسم المستخدم: @{u.username} • PIN: {u.pin}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${u.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role === 'admin' ? 'مدير' : 'كاشير'}
                    </span>
                    {isAdmin && u.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add user form */}
          {isAdmin && (
            <form onSubmit={handleAddUser} className="pt-4 border-t border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">إضافة مستخدم جديد</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="اسم الموظف / الكاشير *"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="اسم المستخدم للدخول *"
                  value={newUserUsername}
                  onChange={e => setNewUserUsername(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
                <input
                  type="password"
                  placeholder="كلمة المرور (اختياري: الافتراضي 123456)"
                  value={newUserPassword}
                  onChange={e => setNewUserPassword(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="رمز PIN للدخول السريع (4 أرقام) *"
                  value={newUserPin}
                  onChange={e => setNewUserPin(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value as any)}
                  className="px-3 py-2 border border-slate-300 rounded-xl outline-none bg-white"
                >
                  <option value="cashier">كاشير (صلاحيات بيع وسداد فقط)</option>
                  <option value="admin">مدير (صلاحيات كاملة للخزينة والتقارير)</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
              >
                إضافة المستخدم
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: Categories */}
      {activeTab === 'categories' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">أقسام السوبر ماركت النشطة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                  <span className="text-xl">{c.icon || '🛒'}</span>
                  <span className="font-bold text-slate-800 text-xs">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddCategory} className="pt-4 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              required
              placeholder="اسم القسم الجديد..."
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
            >
              + إضافة قسم
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
