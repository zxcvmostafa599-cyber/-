import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  Users,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Info,
  Printer,
  ChevronDown,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  CalendarRange,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { Sale, Expense, Category, Product, MonthFinancialStat } from '../types';

export const ReportsScreen: React.FC = () => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [period, setPeriod] = useState<'today' | 'yesterday' | 'week' | 'month' | 'custom'>('today');
  const [customStartDate, setCustomStartDate] = useState(
    new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  );
  const [customEndDate, setCustomEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Tab inside reports
  const [activeReportTab, setActiveReportTab] = useState<
    'yearly_months' | 'sales' | 'categories' | 'customers' | 'expenses' | 'profit'
  >('yearly_months');

  // Yearly breakdown data from DB
  const yearlyReport = useMemo(() => {
    return db.getYearlyMonthlyReport(selectedYear);
  }, [selectedYear]);

  // Date range filter calculation for custom periods
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (period === 'today') {
      return { startDate: todayStr, endDate: todayStr };
    }
    if (period === 'yesterday') {
      const y = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
      return { startDate: y, endDate: y };
    }
    if (period === 'week') {
      const w = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
      return { startDate: w, endDate: todayStr };
    }
    if (period === 'month') {
      const m = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      return { startDate: m, endDate: todayStr };
    }
    return { startDate: customStartDate, endDate: customEndDate };
  }, [period, customStartDate, customEndDate]);

  // Filter sales & expenses for the selected range
  const filteredSales = useMemo(() => {
    return db.getSales().filter(s => {
      if (s.status !== 'completed') return false;
      const sDate = s.createdAt.split('T')[0];
      return sDate >= startDate && sDate <= endDate;
    });
  }, [startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    return db.getExpenses().filter(e => {
      if (e.status !== 'completed') return false;
      const eDate = e.createdAt.split('T')[0];
      return eDate >= startDate && eDate <= endDate;
    });
  }, [startDate, endDate]);

  // Sales Stats
  const totalSales = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const cashSales = filteredSales.filter(s => s.paymentType === 'cash').reduce((acc, s) => acc + s.totalAmount, 0);
  const creditSales = filteredSales.filter(s => s.paymentType === 'credit').reduce((acc, s) => acc + s.totalAmount, 0);
  const salesCount = filteredSales.length;
  const avgSaleAmount = salesCount > 0 ? totalSales / salesCount : 0;

  // Category Stats
  const categoryStats = useMemo(() => {
    const map = new Map<string, { id: string; name: string; amount: number; count: number }>();
    filteredSales.forEach(s => {
      const existing = map.get(s.categoryId) || {
        id: s.categoryId,
        name: s.categoryName || 'عام',
        amount: 0,
        count: 0,
      };
      existing.amount += s.totalAmount;
      existing.count += 1;
      map.set(s.categoryId, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [filteredSales]);

  // Customers Debt Stats
  const customerDebtList = useMemo(() => {
    return db.getCustomers().map(c => {
      const summary = db.getCustomerSummary(c.id);
      return {
        customer: c,
        totalCredit: summary.totalCredit,
        totalPaid: summary.totalPaid,
        balance: summary.balance,
      };
    }).sort((a, b) => b.balance - a.balance);
  }, []);

  // Expenses Breakdown
  const expensesBreakdown = useMemo(() => {
    const map = new Map<string, { label: string; amount: number; count: number }>();
    filteredExpenses.forEach(e => {
      const existing = map.get(e.category) || { label: e.categoryLabel, amount: 0, count: 0 };
      existing.amount += e.amount;
      existing.count += 1;
      map.set(e.category, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses]);
  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  // Profit Analysis
  const products = db.getProducts();
  const salesWithCost = filteredSales.filter(s => Boolean(s.productId));
  const salesWithoutCost = filteredSales.filter(s => !s.productId);

  const costOfGoodsSold = salesWithCost.reduce((sum, s) => {
    const prod = products.find(p => p.id === s.productId);
    return sum + (prod ? prod.purchasePrice : 0);
  }, 0);

  const revenueWithCost = salesWithCost.reduce((sum, s) => sum + s.totalAmount, 0);
  const revenueWithoutCost = salesWithoutCost.reduce((sum, s) => sum + s.totalAmount, 0);
  const grossProfitKnown = revenueWithCost - costOfGoodsSold;
  const netProfitEstimated = grossProfitKnown - totalExpenses;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Luxury Black, Gold & Brown Theme */}
      <div className="bg-gradient-to-r from-darkbg-950 via-brown-950 to-darkbg-900 border border-gold-600/30 rounded-2xl p-6 shadow-dark-card text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black gold-text-gradient">التقارير المالية وإيرادات السنة الشهرية</h1>
            <p className="text-xs text-stone-300 mt-0.5">
              تفصيل إيرادات وأرباح السنة شهراً بشهر (شهر 1، شهر 2...)، وتحليل المبيعات والأقسام والديون
            </p>
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2 bg-darkbg-900 border border-gold-600/40 px-3 py-1.5 rounded-xl">
          <Calendar className="w-4 h-4 text-gold-400" />
          <span className="text-xs text-stone-300 font-bold">السنة المالية:</span>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="bg-transparent text-sm font-black text-gold-300 outline-none cursor-pointer"
          >
            {[2026, 2025, 2024, 2023].map(y => (
              <option key={y} value={y} className="bg-darkbg-950 text-white">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Sub-tabs */}
      <div className="flex border-b border-stone-800 text-xs font-bold bg-darkbg-900/80 rounded-t-2xl px-2 pt-2 overflow-x-auto gap-1">
        {[
          { id: 'yearly_months', label: '📅 إيرادات السنة وصافي ربح كل شهر (مفصل)', highlight: true },
          { id: 'sales', label: 'المبيعات العامة والفترات', highlight: false },
          { id: 'categories', label: 'الأقسام والنسب', highlight: false },
          { id: 'customers', label: 'ديون العملاء', highlight: false },
          { id: 'expenses', label: 'المصروفات', highlight: false },
          { id: 'profit', label: 'تحليل الأرباح والتكلفة', highlight: false },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`py-3 px-4 rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeReportTab === tab.id
                ? 'bg-brown-950 text-gold-300 border-t-2 border-x border-gold-400 font-black shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-darkbg-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: تقرير إيرادات السنة مفصلة لكل شهر على حدة مع صافي الربح */}
      {/* ========================================================================= */}
      {activeReportTab === 'yearly_months' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-b-2xl p-6 space-y-6 text-white">
          {/* Yearly Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي إيرادات مبيعات سنة {selectedYear}</span>
              <span className="text-2xl font-black text-gold-300 font-mono">
                {yearlyReport.totals.salesTotal.toFixed(2)}{' '}
                <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
              </span>
              <div className="text-[11px] text-stone-400 mt-2">
                كاش: {yearlyReport.totals.salesCash.toFixed(0)} • آجل: {yearlyReport.totals.salesCredit.toFixed(0)}
              </div>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي مشتريات البضاعة</span>
              <span className="text-2xl font-black text-stone-200 font-mono">
                {yearlyReport.totals.purchasesTotal.toFixed(2)}{' '}
                <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
              </span>
              <div className="text-[11px] text-stone-400 mt-2">تكاليف توريدات البضاعة</div>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي المصروفات والمسحوبات</span>
              <span className="text-2xl font-black text-rose-400 font-mono">
                {(yearlyReport.totals.expensesTotal + yearlyReport.totals.withdrawalsTotal).toFixed(2)}{' '}
                <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
              </span>
              <div className="text-[11px] text-stone-400 mt-2">
                مصروفات: {yearlyReport.totals.expensesTotal.toFixed(0)} • مسحوبات: {yearlyReport.totals.withdrawalsTotal.toFixed(0)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-brown-950 to-darkbg-950 p-4 rounded-xl border border-gold-500/40">
              <span className="text-xs text-gold-300 font-bold block mb-1">صافي أرباح سنة {selectedYear} (الإجمالي)</span>
              <span
                className={`text-2xl font-black font-mono ${
                  yearlyReport.totals.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {yearlyReport.totals.netProfit >= 0 ? '+' : ''}
                {yearlyReport.totals.netProfit.toFixed(2)}{' '}
                <span className="text-xs font-sans text-stone-300">{settings.currency}</span>
              </span>
              <div className="text-[11px] text-gold-400/80 mt-2">
                المبيعات - المشتريات - المصروفات
              </div>
            </div>
          </div>

          {/* Highlights: Best Month */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-darkbg-950 rounded-xl border border-gold-600/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-stone-400 font-bold block">أعلى شهر في المبيعات:</span>
                <span className="text-sm font-black text-white">
                  {yearlyReport.bestMonthBySales?.monthName} — {yearlyReport.bestMonthBySales?.salesTotal.toFixed(2)} {settings.currency}
                </span>
              </div>
            </div>

            <div className="p-4 bg-darkbg-950 rounded-xl border border-emerald-600/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-stone-400 font-bold block">أعلى شهر في صافي الأرباح:</span>
                <span className="text-sm font-black text-emerald-400">
                  {yearlyReport.bestMonthByProfit?.monthName} — {yearlyReport.bestMonthByProfit?.netProfit.toFixed(2)} {settings.currency}
                </span>
              </div>
            </div>
          </div>

          {/* The Detailed 12 Months Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gold-300">
                جدول إيرادات ومصروفات وصافي ربح كل شهر من أشهر سنة {selectedYear} بالتفصيل:
              </h3>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-brown-900 hover:bg-brown-800 text-gold-200 border border-gold-600/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة تقرير السنة</span>
              </button>
            </div>

            <div className="border border-stone-800 rounded-xl overflow-hidden bg-darkbg-950">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="bg-brown-950/80 text-gold-300 font-bold border-b border-stone-800">
                      <th className="p-3.5">الشهر</th>
                      <th className="p-3.5">مبيعات كاش</th>
                      <th className="p-3.5">مبيعات آجل</th>
                      <th className="p-3.5">إجمالي المبيعات</th>
                      <th className="p-3.5">تحصيل ديون</th>
                      <th className="p-3.5">المشتريات</th>
                      <th className="p-3.5">المصروفات</th>
                      <th className="p-3.5">المسحوبات</th>
                      <th className="p-3.5 text-center">صافي ربح الشهر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80 font-medium">
                    {yearlyReport.months.map(m => {
                      const isProfit = m.netProfit >= 0;
                      const hasActivity = m.salesTotal > 0 || m.purchasesTotal > 0 || m.expensesTotal > 0;

                      return (
                        <tr
                          key={m.month}
                          className={`hover:bg-brown-950/30 transition ${
                            hasActivity ? 'text-white' : 'text-stone-500'
                          }`}
                        >
                          <td className="p-3.5 font-bold text-white">
                            <span className="flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded-full bg-darkbg-900 border border-gold-600/30 text-gold-400 flex items-center justify-center text-[10px] font-bold">
                                {m.month}
                              </span>
                              <span>{m.monthName}</span>
                            </span>
                          </td>

                          <td className="p-3.5 font-mono text-emerald-400">
                            {m.salesCash > 0 ? m.salesCash.toFixed(2) : '—'}
                          </td>

                          <td className="p-3.5 font-mono text-amber-300">
                            {m.salesCredit > 0 ? m.salesCredit.toFixed(2) : '—'}
                          </td>

                          <td className="p-3.5 font-black font-mono text-gold-300 text-sm">
                            {m.salesTotal > 0 ? m.salesTotal.toFixed(2) : '0.00'}
                          </td>

                          <td className="p-3.5 font-mono text-emerald-300">
                            {m.debtCollected > 0 ? `+${m.debtCollected.toFixed(2)}` : '—'}
                          </td>

                          <td className="p-3.5 font-mono text-stone-300">
                            {m.purchasesTotal > 0 ? m.purchasesTotal.toFixed(2) : '—'}
                          </td>

                          <td className="p-3.5 font-mono text-rose-300">
                            {m.expensesTotal > 0 ? m.expensesTotal.toFixed(2) : '—'}
                          </td>

                          <td className="p-3.5 font-mono text-rose-400">
                            {m.withdrawals > 0 ? m.withdrawals.toFixed(2) : '—'}
                          </td>

                          <td className="p-3.5 text-center">
                            <span
                              className={`px-3 py-1 rounded-lg font-black font-mono text-xs inline-block min-w-[90px] ${
                                !hasActivity
                                  ? 'bg-stone-900 text-stone-500'
                                  : isProfit
                                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                                  : 'bg-rose-950 border border-rose-500/40 text-rose-400'
                              }`}
                            >
                              {m.netProfit >= 0 ? '+' : ''}
                              {m.netProfit.toFixed(2)} {settings.currency}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {/* Total Row */}
                    <tr className="bg-brown-950 text-gold-300 font-black border-t-2 border-gold-600/40">
                      <td className="p-3.5 text-sm">إجمالي السنة:</td>
                      <td className="p-3.5 font-mono">{yearlyReport.totals.salesCash.toFixed(2)}</td>
                      <td className="p-3.5 font-mono">{yearlyReport.totals.salesCredit.toFixed(2)}</td>
                      <td className="p-3.5 font-mono text-base">{yearlyReport.totals.salesTotal.toFixed(2)}</td>
                      <td className="p-3.5 font-mono">+{yearlyReport.totals.debtCollected.toFixed(2)}</td>
                      <td className="p-3.5 font-mono">{yearlyReport.totals.purchasesTotal.toFixed(2)}</td>
                      <td className="p-3.5 font-mono">{yearlyReport.totals.expensesTotal.toFixed(2)}</td>
                      <td className="p-3.5 font-mono">{yearlyReport.totals.withdrawalsTotal.toFixed(2)}</td>
                      <td className="p-3.5 text-center text-sm font-mono text-emerald-400">
                        {yearlyReport.totals.netProfit >= 0 ? '+' : ''}
                        {yearlyReport.totals.netProfit.toFixed(2)} {settings.currency}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Sales Report */}
      {/* ========================================================================= */}
      {activeReportTab === 'sales' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-b-2xl p-6 space-y-5 text-white">
          {/* Period Filter for standard reports */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <span className="text-xs text-stone-400 font-bold">تحديد فترة التقرير:</span>
            <div className="flex flex-wrap items-center gap-1.5 bg-darkbg-950 p-1.5 rounded-xl text-xs font-bold border border-stone-800">
              {[
                { id: 'today', label: 'اليوم' },
                { id: 'yesterday', label: 'أمس' },
                { id: 'week', label: 'هذا الأسبوع' },
                { id: 'month', label: 'هذا الشهر' },
                { id: 'custom', label: 'فترة مخصصة' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    period === p.id
                      ? 'bg-brown-900 text-gold-300 border border-gold-600/40 font-black'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي المبيعات بالفترة</span>
              <span className="text-xl font-black text-gold-300 font-mono">
                {totalSales.toFixed(2)} {settings.currency}
              </span>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">مبيعات كاش</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {cashSales.toFixed(2)} {settings.currency}
              </span>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">مبيعات آجل</span>
              <span className="text-xl font-black text-amber-300 font-mono">
                {creditSales.toFixed(2)} {settings.currency}
              </span>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">متوسط قيمة العملية</span>
              <span className="text-xl font-black text-blue-400 font-mono">
                {avgSaleAmount.toFixed(2)} {settings.currency}
              </span>
              <div className="text-[11px] text-stone-400 mt-1">عدد العمليات: {salesCount}</div>
            </div>
          </div>

          <div className="bg-darkbg-950 rounded-xl border border-stone-800 p-4">
            <h3 className="font-bold text-sm text-gold-300 mb-3">
              فواتير البيع المسجلة ({filteredSales.length} فاتورة)
            </h3>
            {filteredSales.length === 0 ? (
              <div className="text-center py-10 text-stone-500 text-xs">لا توجد عمليات بيع في هذه الفترة</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="bg-brown-950/60 text-gold-300 font-bold border-b border-stone-800">
                      <th className="p-2.5">رقم الفاتورة</th>
                      <th className="p-2.5">الوقت</th>
                      <th className="p-2.5">القسم</th>
                      <th className="p-2.5">طريقة الدفع</th>
                      <th className="p-2.5">العميل</th>
                      <th className="p-2.5">المبلغ</th>
                      <th className="p-2.5">الكاشير</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80 font-medium">
                    {filteredSales.map(s => (
                      <tr key={s.id} className="hover:bg-brown-950/20">
                        <td className="p-2.5 font-bold font-mono text-white">#{s.saleNumber}</td>
                        <td className="p-2.5 text-stone-400">
                          {new Date(s.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-2.5 text-stone-300">{s.categoryName || 'عام'}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.paymentType === 'cash' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {s.paymentType === 'cash' ? 'كاش' : 'آجل'}
                          </span>
                        </td>
                        <td className="p-2.5 text-stone-300">{s.customerName || '—'}</td>
                        <td className="p-2.5 font-black font-mono text-gold-300">
                          {s.totalAmount.toFixed(2)} {settings.currency}
                        </td>
                        <td className="p-2.5 text-stone-400">{s.createdByName || 'الكاشير'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: Categories Report */}
      {/* ========================================================================= */}
      {activeReportTab === 'categories' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-b-2xl p-6 space-y-4 text-white">
          <h3 className="font-bold text-sm text-gold-300">ترتيب الأقسام حسب إجمالي المبيعات ونسبة المساهمة:</h3>
          {categoryStats.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">لم تسجل مبيعات في هذه الفترة</div>
          ) : (
            <div className="space-y-3">
              {categoryStats.map((cat, idx) => {
                const percent = totalSales > 0 ? (cat.amount / totalSales) * 100 : 0;
                return (
                  <div key={cat.id} className="p-3.5 bg-darkbg-950 rounded-xl border border-stone-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gold-950 text-gold-300 border border-gold-600/40 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">{cat.name}</span>
                      </div>
                      <span className="font-black text-gold-300 font-mono text-sm">
                        {cat.amount.toFixed(2)} {settings.currency}
                      </span>
                    </div>

                    <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brown-500 to-gold-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>عدد العمليات: {cat.count} عملية</span>
                      <span>نسبة مساهمة القسم: {percent.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: Customers Report */}
      {/* ========================================================================= */}
      {activeReportTab === 'customers' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-b-2xl p-6 space-y-4 text-white">
          <h3 className="font-bold text-sm text-gold-300">تقرير ديون وحسابات العملاء (دفتر الشكك)</h3>
          <div className="overflow-x-auto bg-darkbg-950 border border-stone-800 rounded-xl">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-brown-950/60 text-gold-300 font-bold border-b border-stone-800">
                  <th className="p-3">اسم العميل</th>
                  <th className="p-3">الهاتف</th>
                  <th className="p-3">إجمالي الشراء الآجل</th>
                  <th className="p-3">إجمالي المسدد</th>
                  <th className="p-3">المتبقي (المديونية)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 font-medium">
                {customerDebtList.map(item => (
                  <tr key={item.customer.id} className="hover:bg-brown-950/20">
                    <td className="p-3 font-bold text-white">{item.customer.name}</td>
                    <td className="p-3 text-stone-400">{item.customer.phone}</td>
                    <td className="p-3 font-mono text-stone-300">{item.totalCredit.toFixed(2)} {settings.currency}</td>
                    <td className="p-3 font-mono text-emerald-400">{item.totalPaid.toFixed(2)} {settings.currency}</td>
                    <td className="p-3 font-mono font-black text-gold-300">
                      {item.balance.toFixed(2)} {settings.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: Expenses Report */}
      {activeReportTab === 'expenses' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-b-2xl p-6 space-y-4 text-white">
          <div className="flex justify-between items-center pb-2 border-b border-stone-800">
            <h3 className="font-bold text-sm text-gold-300">تقرير المصروفات التشغيلية حسب البند</h3>
            <span className="font-black text-rose-400 font-mono text-base">
              الإجمالي: {totalExpenses.toFixed(2)} {settings.currency}
            </span>
          </div>

          {expensesBreakdown.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">لم تسجل أي مصروفات في هذه الفترة</div>
          ) : (
            <div className="space-y-3">
              {expensesBreakdown.map((exp, idx) => {
                const percent = totalExpenses > 0 ? (exp.amount / totalExpenses) * 100 : 0;
                return (
                  <div key={idx} className="p-3.5 bg-darkbg-950 rounded-xl border border-stone-800 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">{exp.label}</span>
                      <span className="text-rose-400 font-mono">
                        {exp.amount.toFixed(2)} {settings.currency} ({percent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: Profit & Cost Report (Honest disclaimer) */}
      {/* ========================================================================= */}
      {activeReportTab === 'profit' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-b-2xl p-6 space-y-5 text-white">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">تحليل الأرباح والتكلفة الصريح (مبدأ الشفافية)</h3>
              <p className="text-xs text-stone-400">حساب الربح الحقيقي وفق أسعار الشراء الفعلية دون اختراع أرقام وهمية</p>
            </div>
          </div>

          <div className="p-3.5 bg-brown-950/60 border border-gold-600/30 rounded-xl flex items-start gap-2.5 text-xs text-gold-200">
            <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">قاعدة الشفافية المحاسبية الصارمة:</span>
              <p className="mt-0.5 text-stone-300 leading-relaxed">
                بما أن نظام البيع السريع يعتمد أساساً على إدخال &quot;مبلغ البيع المباشر بدون باركود&quot;، فإن البرنامج
                لا يخترع نسبة ربح عشوائية. احتساب الربح الدقيق يتم للعمليات المرتبطة بمنتجات محددة التكلفة، بينما المبيعات
                المباشرة تظهر بكامل قيمتها الإجمالية.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي المبيعات بالفترة</span>
              <span className="text-xl font-black text-gold-300 font-mono">
                {totalSales.toFixed(2)} {settings.currency}
              </span>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">مبيعات مرتبطة بتكلفة شراء معروفة</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {revenueWithCost.toFixed(2)} {settings.currency}
              </span>
              <div className="text-[11px] text-stone-400 mt-1">تكلفة الشراء: {costOfGoodsSold.toFixed(2)} {settings.currency}</div>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">مبيعات سريعة مباشرة (غير مقيدة بتكلفة)</span>
              <span className="text-xl font-black text-stone-200 font-mono">
                {revenueWithoutCost.toFixed(2)} {settings.currency}
              </span>
              <div className="text-[11px] text-stone-400 mt-1">مسجلة كمبلغ بيع مباشر بدون ربط مسبق بالصنف</div>
            </div>
          </div>

          {revenueWithCost > 0 && (
            <div className="p-4 bg-brown-950/40 border border-gold-600/30 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-gold-300">الأرباح المحققة من البضاعة المعرفة التكلفة:</h4>
              <div className="flex justify-between items-center text-stone-300">
                <span>مجمل الربح (المبيعات - التكلفة):</span>
                <span className="font-black text-emerald-400 font-mono text-sm">
                  +{grossProfitKnown.toFixed(2)} {settings.currency}
                </span>
              </div>
              <div className="flex justify-between items-center text-stone-300">
                <span>المصروفات التشغيلية للفترة:</span>
                <span className="font-black text-rose-400 font-mono text-sm">
                  -{totalExpenses.toFixed(2)} {settings.currency}
                </span>
              </div>
              <div className="flex justify-between items-center text-white font-bold pt-1 border-t border-stone-800">
                <span>صافي الربح التقديري:</span>
                <span className="font-black font-mono text-base text-gold-400">
                  {netProfitEstimated.toFixed(2)} {settings.currency}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
