import React from 'react';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Users,
  Wallet,
  Receipt,
  ShoppingCart,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
  BarChart3,
  ClipboardList,
  Settings,
  Layers,
  Flame,
  Sparkles,
  CalendarRange,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { NavTab } from '../components/Sidebar';

interface DashboardScreenProps {
  onNavigate: (tab: NavTab) => void;
  onRefresh: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onRefresh }) => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();
  const { isAdmin, currentUser } = useAuth();
  const shopContext = useShop();
  const stats = db.getTodayStats();
  const pillars = db.getFinancialPillarsSummary();

  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());
  const [isYearlyCardsExpanded, setIsYearlyCardsExpanded] = React.useState<boolean>(true);
  const yearlyReport = db.getYearlyMonthlyReport(selectedYear);

  const handleCancelSale = (saleId: string, saleNumber: string) => {
    if (!isAdmin) {
      alert('إلغاء العمليات يتطلب صلاحية المدير المسؤول.');
      return;
    }
    const reason = prompt(`من فضلك اكتب سبب إلغاء الفاتورة #${saleNumber}:`);
    if (!reason || !reason.trim()) return;

    const res = db.cancelSale(saleId, reason.trim(), currentUser!);
    const targetSale = db.getSales().find(s => s.id === saleId);
    if (targetSale) {
      shopContext.cancelSale(targetSale, reason.trim(), currentUser!).catch(console.warn);
    }
    alert(res.message);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome with Black & Gold Luxury Theme */}
      <div className="bg-gradient-to-r from-darkbg-950 via-brown-950 to-darkbg-900 border border-gold-600/30 rounded-2xl p-6 text-white shadow-dark-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-gold-500/10 text-gold-300 border border-gold-500/30">
              لوحة التحكم والمؤشرات الفورية
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-darkbg-900 text-gold-400 border border-stone-800">
              المحل: {shopContext.shopId}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-darkbg-900 text-stone-300 border border-stone-800">
              الجهاز: {shopContext.deviceId}
            </span>
            <span className="text-xs text-stone-400">اليوم: {new Date().toLocaleDateString('ar-EG')}</span>
          </div>
          <h2 className="text-2xl font-black mt-1 gold-text-gradient flex items-center gap-2">
            <span>أهلاً بك، {currentUser?.name || 'الكاشير'}</span>
            <Sparkles className="w-5 h-5 text-gold-400" />
          </h2>
          <p className="text-xs text-stone-300 mt-0.5">
            ملخص حركة البيع والخزينة والديون والمصروفات المشتركة لجميع الأجهزة المرتبطة
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigate('pos')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 hover:to-brown-600 active:scale-95 text-darkbg-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-gold-glow transition"
          >
            <PlusCircle className="w-4 h-4 text-darkbg-950 stroke-[2.5]" />
            <span>بيع جديد (F1)</span>
          </button>

          <button
            onClick={() => onNavigate('pillars')}
            className="px-3.5 py-2.5 bg-brown-950 hover:bg-brown-900 text-gold-300 border border-gold-600/40 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Layers className="w-4 h-4 text-gold-400" />
            <span>الأركان المالية ٤</span>
          </button>

          <button
            onClick={() => onNavigate('treasury')}
            className="px-3.5 py-2.5 bg-darkbg-900 hover:bg-darkbg-850 text-stone-200 border border-stone-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Wallet className="w-4 h-4 text-gold-400" />
            <span>الخزينة والدرج</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Today Sales */}
        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 shadow-xs hover:border-gold-500/50 transition">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold">مبيعات اليوم</span>
            <div className="w-8 h-8 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {stats.salesTotal.toFixed(2)}{' '}
            <span className="text-xs font-sans text-gold-400">{settings.currency}</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-2 font-medium">
            عدد العمليات: <strong className="text-white">{stats.salesCount}</strong>
          </div>
        </div>

        {/* Card 2: Cash vs Credit */}
        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold">مبيعات كاش / آجل</span>
            <div className="w-8 h-8 rounded-xl bg-brown-600/20 text-brown-300 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-400 font-bold">كاش:</span>
              <span className="font-bold text-white font-mono">{stats.salesCash.toFixed(2)} {settings.currency}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-300 font-bold">آجل (شكك):</span>
              <span className="font-bold text-white font-mono">{stats.salesCredit.toFixed(2)} {settings.currency}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Current Treasury */}
        <div className="bg-darkbg-900 p-4 rounded-2xl border border-gold-600/30 shadow-xs hover:border-gold-500 transition">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold">رصيد الخزينة الحي</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {stats.treasuryBalance.toFixed(2)}{' '}
            <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-2 font-medium">
            الرصيد الفعلي الموجود في الدرج
          </div>
        </div>

        {/* Card 4: Total Outstanding Debt */}
        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 shadow-xs hover:border-gold-500/50 transition">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold">ديون للمحل (لينا برة)</span>
            <div className="w-8 h-8 rounded-xl bg-gold-950 text-gold-300 border border-gold-600/40 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-gold-300 font-mono">
            {stats.totalOutstandingDebt.toFixed(2)}{' '}
            <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-2 font-medium">
            المبالغ المستحقة عند العملاء
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4 FINANCIAL PILLARS SHOWCASE (الدخل، ديون على المحل، ديون للمحل، أكثر المواد سحباً) */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-br from-darkbg-950 via-darkbg-900 to-brown-950 border border-gold-600/30 rounded-2xl p-5 space-y-4 shadow-dark-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-800 pb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-gold-400 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-white">الأقسام المالية الأربعة المنفصلة للمحل</h3>
              <p className="text-[11px] text-stone-400">
                دخل لوحده • ديون على المحل لوحده • ديون للمحل لوحده • أكثر المواد سحباً من المحل
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('pillars')}
            className="text-xs text-gold-300 hover:text-gold-200 font-bold underline flex items-center gap-1 self-end sm:self-auto"
          >
            <span>عرض التحليل الكامل للأركان الأربعة</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pillar 1: دخل المحل لوحده */}
          <div
            onClick={() => onNavigate('pillars')}
            className="p-4 bg-darkbg-950/80 rounded-xl border border-stone-800 hover:border-emerald-500/50 cursor-pointer transition space-y-1.5"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-400">١. دخل المحل (لوحده)</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              {pillars.incomePillar.totalSales.toFixed(2)} {settings.currency}
            </div>
            <div className="text-[11px] text-stone-400 flex justify-between">
              <span>كاش: {pillars.incomePillar.cashSales.toFixed(0)}</span>
              <span className="text-gold-300">تحصيل: +{pillars.incomePillar.debtCollections.toFixed(0)}</span>
            </div>
          </div>

          {/* Pillar 2: ديون على المحل لوحده */}
          <div
            onClick={() => onNavigate('pillars')}
            className="p-4 bg-darkbg-950/80 rounded-xl border border-stone-800 hover:border-amber-500/50 cursor-pointer transition space-y-1.5"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-amber-300">٢. ديون على المحل (لوحده)</span>
              <Truck className="w-4 h-4 text-brown-400" />
            </div>
            <div className="text-lg font-black text-amber-300 font-mono">
              {pillars.debtsOnStorePillar.totalPayables.toFixed(2)} {settings.currency}
            </div>
            <div className="text-[11px] text-stone-400 flex justify-between">
              <span>الموردين: {pillars.debtsOnStorePillar.suppliersCount}</span>
              <span className="text-stone-300">سددنا: {pillars.debtsOnStorePillar.totalPaidToSuppliers.toFixed(0)}</span>
            </div>
          </div>

          {/* Pillar 3: ديون للمحل لوحده */}
          <div
            onClick={() => onNavigate('pillars')}
            className="p-4 bg-darkbg-950/80 rounded-xl border border-stone-800 hover:border-gold-500/50 cursor-pointer transition space-y-1.5"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gold-300">٣. ديون للمحل (لوحده)</span>
              <Users className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-lg font-black text-gold-300 font-mono">
              {pillars.debtsForStorePillar.totalReceivables.toFixed(2)} {settings.currency}
            </div>
            <div className="text-[11px] text-stone-400 flex justify-between">
              <span>المدينين: {pillars.debtsForStorePillar.debtorsCount} عميل</span>
              <span className="text-emerald-400">مسدد: {pillars.debtsForStorePillar.totalCollected.toFixed(0)}</span>
            </div>
          </div>

          {/* Pillar 4: أكثر المواد سحباً من المحل لوحده */}
          <div
            onClick={() => onNavigate('pillars')}
            className="p-4 bg-darkbg-950/80 rounded-xl border border-stone-800 hover:border-rose-500/50 cursor-pointer transition space-y-1.5"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-rose-300">٤. أكثر المواد سحباً (لوحده)</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              {pillars.mostPulledItemsPillar?.totalQuantityPulled || 0}{' '}
              <span className="text-xs font-sans text-gold-400">قطعة / كجم</span>
            </div>
            <div className="text-[11px] text-stone-400 flex justify-between">
              <span>أعلى مادة: {pillars.mostPulledItemsPillar?.topItems[0]?.name.slice(0, 15) || '—'}</span>
              <span className="text-rose-300">قيمة: {(pillars.mostPulledItemsPillar?.totalPulledValue || 0).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. خانة إيرادات السنة — مفصلة كل شهر لوحده مع صافي الربح */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-br from-darkbg-950 via-darkbg-900 to-brown-950 border border-gold-600/40 rounded-2xl p-5 space-y-4 shadow-dark-card text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-800 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center shrink-0">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white gold-text-gradient">
                  خانة إيرادات سنة {selectedYear} — مفصلة شهرياً وصافي ربح كل شهر
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  شهر 1، شهر 2... حتى شهر 12
                </span>
              </div>
              <p className="text-xs text-stone-300">
                متابعة دقيقة لكل شهر على حدة: إجمالي المبيعات، تكاليف المشتريات، المصاريف، وصافي الربح الشهري
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Year Switcher */}
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="bg-darkbg-900 border border-gold-600/40 text-gold-300 px-3 py-1.5 rounded-xl text-xs font-black outline-none cursor-pointer"
            >
              {[2026, 2025, 2024].map(y => (
                <option key={y} value={y} className="bg-darkbg-950 text-white">
                  سنة {y}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsYearlyCardsExpanded(!isYearlyCardsExpanded)}
              className="px-3 py-1.5 bg-darkbg-900 hover:bg-darkbg-850 text-stone-300 border border-stone-800 rounded-xl text-xs font-bold flex items-center gap-1 transition"
            >
              <span>{isYearlyCardsExpanded ? 'طي الشهور' : 'إظهار الـ 12 شهراً'}</span>
              {isYearlyCardsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="px-3 py-1.5 bg-brown-900 hover:bg-brown-800 text-gold-200 border border-gold-600/40 rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <span>التقرير الشامل والطباعة</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Yearly Summary Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-darkbg-950/80 p-3.5 rounded-xl border border-stone-800">
            <span className="text-stone-400 font-bold block mb-1">إجمالي إيرادات مبيعات {selectedYear}:</span>
            <span className="text-lg font-black text-gold-300 font-mono">
              {yearlyReport.totals.salesTotal.toFixed(2)} {settings.currency}
            </span>
            <div className="text-[10px] text-stone-400 mt-1">
              كاش: {yearlyReport.totals.salesCash.toFixed(0)} • آجل: {yearlyReport.totals.salesCredit.toFixed(0)}
            </div>
          </div>

          <div className="bg-darkbg-950/80 p-3.5 rounded-xl border border-stone-800">
            <span className="text-stone-400 font-bold block mb-1">إجمالي مشتريات البضاعة:</span>
            <span className="text-lg font-black text-stone-200 font-mono">
              {yearlyReport.totals.purchasesTotal.toFixed(2)} {settings.currency}
            </span>
            <div className="text-[10px] text-stone-400 mt-1">تكلفة توريدات المحل</div>
          </div>

          <div className="bg-darkbg-950/80 p-3.5 rounded-xl border border-stone-800">
            <span className="text-stone-400 font-bold block mb-1">إجمالي المصروفات والمسحوبات:</span>
            <span className="text-lg font-black text-rose-400 font-mono">
              {(yearlyReport.totals.expensesTotal + yearlyReport.totals.withdrawalsTotal).toFixed(2)} {settings.currency}
            </span>
            <div className="text-[10px] text-stone-400 mt-1">
              مصاريف: {yearlyReport.totals.expensesTotal.toFixed(0)} • مسحوبات: {yearlyReport.totals.withdrawalsTotal.toFixed(0)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-brown-950 to-darkbg-950 p-3.5 rounded-xl border border-gold-500/50 shadow-gold-glow">
            <span className="text-gold-300 font-black block mb-1">صافي أرباح سنة {selectedYear} (الإجمالي):</span>
            <span
              className={`text-xl font-black font-mono ${
                yearlyReport.totals.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {yearlyReport.totals.netProfit >= 0 ? '+' : ''}
              {yearlyReport.totals.netProfit.toFixed(2)} {settings.currency}
            </span>
            <div className="text-[10px] text-gold-400/90 mt-1 font-bold">
              المبيعات - المشتريات - المصروفات
            </div>
          </div>
        </div>

        {/* The 12 Individual Month Cards (شهر 1، شهر 2... حتى شهر 12) */}
        {isYearlyCardsExpanded && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>تفصيل كل شهر على حدة (صافي ربح كل شهر = مبيعات الشهر - مشترياته - مصروفاته):</span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> ربح موجب
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> عجز / سالب
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {yearlyReport.months.map(m => {
                const isCurrentMonth = m.month === new Date().getMonth() + 1 && selectedYear === new Date().getFullYear();
                const isBestSales = yearlyReport.bestMonthBySales?.month === m.month && m.salesTotal > 0;
                const isBestProfit = yearlyReport.bestMonthByProfit?.month === m.month && m.netProfit > 0;
                const isProfit = m.netProfit >= 0;

                return (
                  <div
                    key={m.month}
                    className={`p-3.5 rounded-xl border transition relative flex flex-col justify-between space-y-2.5 ${
                      isCurrentMonth
                        ? 'bg-brown-950/70 border-gold-500 shadow-gold-glow ring-1 ring-gold-500/30'
                        : 'bg-darkbg-950/80 border-stone-800 hover:border-gold-600/40'
                    }`}
                  >
                    {/* Top Row: Month Name & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-darkbg-900 border border-gold-500/40 text-gold-300 font-mono font-bold text-xs flex items-center justify-center">
                          {m.month}
                        </span>
                        <span className="font-black text-white text-xs">{m.monthName}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isCurrentMonth && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-gold-500 text-darkbg-950 animate-pulse">
                            الحالي
                          </span>
                        )}
                        {isBestSales && !isCurrentMonth && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gold-950 text-gold-300 border border-gold-600/40" title="أعلى مبيعات">
                            🏆 أعلى بيع
                          </span>
                        )}
                        {isBestProfit && !isCurrentMonth && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40" title="أعلى صافي ربح">
                            💎 أعلى ربح
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Breakdown Numbers */}
                    <div className="space-y-1 text-[11px] pt-1 border-t border-stone-800/80">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">إجمالي المبيعات:</span>
                        <span className="font-bold text-white font-mono">
                          {m.salesTotal.toFixed(0)} {settings.currency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-stone-500">
                        <span>(كاش: {m.salesCash.toFixed(0)} • آجل: {m.salesCredit.toFixed(0)})</span>
                        <span className="text-emerald-400/80">+{m.debtCollected.toFixed(0)} سداد</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">مشتريات البضاعة:</span>
                        <span className="font-mono text-stone-300">
                          {m.purchasesTotal.toFixed(0)} {settings.currency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">المصروفات:</span>
                        <span className="font-mono text-rose-300">
                          {m.expensesTotal.toFixed(0)} {settings.currency}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Highlighted Net Profit for this Month */}
                    <div
                      className={`p-2 rounded-lg border text-center font-bold text-xs ${
                        isProfit
                          ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      <span className="text-[10px] text-stone-400 block font-normal">
                        صافي ربح شهر {m.month}:
                      </span>
                      <span className="text-sm font-black font-mono">
                        {m.netProfit >= 0 ? '+' : ''}
                        {m.netProfit.toFixed(2)} {settings.currency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Secondary Quick Metrics: Collections, Purchases, Expenses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Debt Collected Today */}
        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-bold">تحصيل ديون اليوم</div>
            <div className="text-base font-black text-emerald-400 font-mono">
              +{stats.debtCollected.toFixed(2)} {settings.currency}
            </div>
          </div>
        </div>

        {/* Purchases Today */}
        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brown-950 text-brown-300 border border-brown-600/30 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-bold">مشتريات بضاعة اليوم</div>
            <div className="text-base font-black text-white font-mono">
              {stats.purchasesTotal.toFixed(2)} {settings.currency}
            </div>
          </div>
        </div>

        {/* Expenses Today */}
        <div className="bg-darkbg-900 p-4 rounded-2xl border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-bold">مصروفات اليوم</div>
            <div className="text-base font-black text-rose-400 font-mono">
              -{stats.expensesTotal.toFixed(2)} {settings.currency}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. قسم أكثر المواد والسلع سحباً من المحل */}
      {/* ========================================================= */}
      <div className="bg-darkbg-900 border border-gold-600/30 rounded-2xl p-5 space-y-4 shadow-dark-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-800 pb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 flex items-center justify-center">
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gold-300">
                قسم أكثر المواد والسلع سحباً وطلباً من المحل
              </h3>
              <p className="text-[11px] text-stone-400">
                رصد حركة السحب الفعلي للبضائع من الرفوف والمخزن حسب الكميات والمبالغ المحققة
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('pillars')}
            className="text-xs text-gold-300 hover:text-gold-200 font-bold underline flex items-center gap-1 self-end sm:self-auto"
          >
            <span>تفاصيل قسم أكثر المواد سحباً</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="text-stone-400 border-b border-stone-800 font-bold bg-darkbg-950/60">
                <th className="p-2.5">#</th>
                <th className="p-2.5">المادة / السلعة</th>
                <th className="p-2.5">القسم</th>
                <th className="p-2.5">الكمية المسحوبة</th>
                <th className="p-2.5">عدد مرات السحب</th>
                <th className="p-2.5">إجمالي القيمة</th>
                <th className="p-2.5 text-center">نسبة السحب من المحل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 font-medium">
              {(pillars.mostPulledItemsPillar?.topItems || []).slice(0, 6).map((item, idx) => (
                <tr key={item.id} className="hover:bg-brown-950/20 transition">
                  <td className="p-2.5 font-bold font-mono text-gold-400">{idx + 1}</td>
                  <td className="p-2.5 font-bold text-white text-xs">{item.name}</td>
                  <td className="p-2.5 text-stone-300">
                    <span className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[10px]">
                      {item.categoryName}
                    </span>
                  </td>
                  <td className="p-2.5 font-black text-emerald-400 font-mono text-xs">
                    {item.totalQuantity} وحدة
                  </td>
                  <td className="p-2.5 text-stone-400 font-mono">{item.salesCount} مرة</td>
                  <td className="p-2.5 font-black text-gold-300 font-mono text-xs">
                    {item.totalSalesAmount.toFixed(2)} {settings.currency}
                  </td>
                  <td className="p-2.5 text-center min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-brown-500 to-gold-400 h-full rounded-full"
                          style={{ width: `${Math.min(item.percentageOfSales * 2, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gold-300 font-bold shrink-0">
                        {item.percentageOfSales}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Top Categories & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Categories Today */}
        <div className="bg-darkbg-900 p-5 rounded-2xl border border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
            <h3 className="font-bold text-sm text-gold-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold-400" />
              <span>أكثر الأقسام مبيعاً اليوم</span>
            </h3>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-gold-400 hover:text-gold-300 font-bold"
            >
              عرض التقرير
            </button>
          </div>

          {stats.topCategories.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              لم تسجل مبيعات اليوم بعد
            </div>
          ) : (
            <div className="space-y-3">
              {stats.topCategories.map((cat, idx) => {
                const percent = stats.salesTotal > 0 ? (cat.amount / stats.salesTotal) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-300">
                        {idx + 1}. {cat.name}
                      </span>
                      <span className="font-bold text-white font-mono">
                        {cat.amount.toFixed(2)} {settings.currency}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brown-500 to-gold-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>{cat.count} عمليات بيع</span>
                      <span>{percent.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Sales Table */}
        <div className="lg:col-span-2 bg-darkbg-900 p-5 rounded-2xl border border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
            <h3 className="font-bold text-sm text-gold-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>آخر العمليات المسجلة</span>
            </h3>
            <button
              onClick={() => onNavigate('pos')}
              className="text-xs text-gold-400 hover:text-gold-300 font-bold"
            >
              + بيع جديد
            </button>
          </div>

          {stats.recentSales.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              لا توجد عمليات بيع مسجلة حالياً
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="text-stone-400 border-b border-stone-800 font-bold">
                    <th className="pb-2.5">رقم الفاتورة</th>
                    <th className="pb-2.5">القسم</th>
                    <th className="pb-2.5">الدفع</th>
                    <th className="pb-2.5">العميل</th>
                    <th className="pb-2.5">المبلغ</th>
                    <th className="pb-2.5">الحالة</th>
                    {isAdmin && <th className="pb-2.5 text-center">إجراء</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80 font-medium">
                  {stats.recentSales.map(sale => {
                    const isCancelled = sale.status === 'cancelled';
                    return (
                      <tr key={sale.id} className={`hover:bg-brown-950/20 transition ${isCancelled ? 'opacity-60 bg-rose-950/20' : ''}`}>
                        <td className="py-2.5 font-bold font-mono text-white">
                          #{sale.saleNumber}
                        </td>
                        <td className="py-2.5 text-stone-300">
                          {sale.categoryName || 'عام'}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              sale.paymentType === 'cash'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {sale.paymentType === 'cash' ? 'كاش' : 'آجل'}
                          </span>
                        </td>
                        <td className="py-2.5 text-stone-300">
                          {sale.customerName || '—'}
                        </td>
                        <td className="py-2.5 font-black text-gold-300 font-mono">
                          {sale.totalAmount.toFixed(2)} {settings.currency}
                        </td>
                        <td className="py-2.5">
                          {isCancelled ? (
                            <span className="text-rose-400 font-bold text-[10px] flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              ملغاة
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              مكتملة
                            </span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="py-2.5 text-center">
                            {!isCancelled && (
                              <button
                                onClick={() => handleCancelSale(sale.id, sale.saleNumber)}
                                className="px-2 py-1 text-[10px] font-bold text-rose-400 hover:bg-rose-950/50 rounded-lg transition"
                                title="إلغاء العملية وعكس أثرها المالي بالخزينة والديون"
                              >
                                إلغاء
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
