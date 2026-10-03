import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Wallet,
  Search,
  ShieldCheck,
  UserCheck,
  Key,
  HelpCircle,
  TestTube2,
  Menu,
  Sparkles,
  Radio,
  Wifi,
  WifiOff,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { StoreSettings } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  treasuryBalance: number;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
  onOpenTests: () => void;
  onOpenMultiDevice?: () => void;
  onNavigateTreasury: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  treasuryBalance,
  onOpenSearch,
  onOpenLogin,
  onOpenTests,
  onOpenMultiDevice,
  onNavigateTreasury,
  onToggleSidebar,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { shopId, deviceId, isOnline, isSyncing } = useShop();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('ar-EG', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-darkbg-950 border-b border-gold-600/30 sticky top-0 z-30 shadow-dark-card px-4 py-3 flex items-center justify-between no-print text-white">
      {/* Right side: Mobile Menu + Store Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-gold-300 hover:bg-darkbg-900 transition"
          aria-label="القائمة الرئيسية"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 via-gold-600 to-brown-800 text-darkbg-950 flex items-center justify-center shadow-gold-glow">
            <ShoppingBag className="w-5 h-5 text-darkbg-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-black text-white text-base leading-tight flex items-center gap-1.5">
              <span>{settings.storeName}</span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            </h1>
            <p className="text-[11px] text-gold-300/80 font-medium">
              نظام الكاشير والإدارة الذكي • النسخة الفاخرة
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Clock & Quick Treasury Indicator */}
      <div className="hidden md:flex items-center gap-4">
        <div className="text-xs text-stone-300 font-medium bg-darkbg-900 px-3 py-1.5 rounded-xl border border-stone-800">
          {timeStr}
        </div>

        <button
          onClick={onNavigateTreasury}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-brown-950 to-darkbg-900 hover:from-brown-900 hover:to-darkbg-850 border border-gold-500/40 text-gold-300 rounded-xl font-bold text-xs transition cursor-pointer shadow-sm"
          title="انقر لعرض تفاصيل الخزينة وحركاتها"
        >
          <Wallet className="w-4 h-4 text-gold-400" />
          <span>الخزينة:</span>
          <span className="text-sm font-black text-white font-mono">
            {treasuryBalance.toFixed(2)} {settings.currency}
          </span>
        </button>
      </div>

      {/* Left side: Search, Tests, and User Profile */}
      <div className="flex items-center gap-2">
        {/* Quick Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-darkbg-900 hover:bg-darkbg-850 text-stone-200 border border-stone-800 rounded-xl text-xs font-bold transition"
          title="بحث عام (F3)"
        >
          <Search className="w-4 h-4 text-gold-400" />
          <span className="hidden sm:inline">بحث (F3)</span>
        </button>

        {/* Test Suite Button */}
        <button
          onClick={onOpenTests}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brown-950/80 hover:bg-brown-900 text-gold-300 border border-gold-600/30 rounded-xl text-xs font-bold transition"
          title="فحص المعادلات المحاسبية الـ 7"
        >
          <TestTube2 className="w-4 h-4 text-gold-400" />
          <span className="hidden sm:inline">فحص النظام</span>
        </button>

        {/* Multi-Device Status & Modal Trigger */}
        <button
          onClick={onOpenMultiDevice}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-darkbg-900 hover:bg-darkbg-850 border border-gold-500/40 rounded-xl text-xs font-bold text-gold-300 transition"
          title={`المحل: ${shopId} | الجهاز: ${deviceId} | انقر لإدارة الأجهزة والمزامنة`}
        >
          <span className="relative flex h-2 w-2">
            {isOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            )}
          </span>
          <Smartphone className="w-3.5 h-3.5 text-gold-400" />
          <span className="hidden lg:inline text-[11px] font-mono">{shopId}</span>
          {isSyncing ? (
            <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
          ) : (
            <span className="text-[10px] text-emerald-400 hidden sm:inline">
              {isOnline ? 'سحابي' : 'أوفلاين'}
            </span>
          )}
        </button>

        {/* User Role Badge */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-darkbg-900 hover:bg-darkbg-850 border border-gold-600/30 rounded-xl text-xs transition"
          title="انقر لتغيير المستخدم أو رمز PIN"
        >
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-darkbg-950 text-[11px] font-black ${
              isAdmin ? 'bg-gold-400' : 'bg-brown-400'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </div>
          <div className="text-right hidden sm:block">
            <div className="font-bold text-white text-[11px] leading-tight">
              {currentUser?.name || 'مستخدم'}
            </div>
            <div className="text-[10px] text-gold-400/80">
              {isAdmin ? 'المدير العام' : 'كاشير المحل'}
            </div>
          </div>
          <Key className="w-3.5 h-3.5 text-stone-400" />
        </button>
      </div>
    </header>
  );
};
