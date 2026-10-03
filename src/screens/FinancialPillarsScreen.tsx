import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  Building2,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Truck,
  Wallet,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  FileText,
  BadgeDollarSign,
  Flame,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { FinancialPillarsSummary, StoreSettings } from '../types';
import { useAuth } from '../context/AuthContext';

interface FinancialPillarsScreenProps {
  onNavigateTab: (tab: any, extraId?: string) => void;
  onRefreshTreasury: () => void;
}

export const FinancialPillarsScreen: React.FC<FinancialPillarsScreenProps> = ({
  onNavigateTab,
  onRefreshTreasury,
}) => {
  const db = DatabaseService.getInstance();
  const settings: StoreSettings = db.getSettings();
  const { currentUser, isAdmin } = useAuth();

  const [activePillar, setActivePillar] = useState<'income' | 'debts_on_store' | 'debts_for_store' | 'most_pulled'>('income');
  const summary: FinancialPillarsSummary = db.getFinancialPillarsSummary();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Luxury Black, Gold & Brown Theme */}
      <div className="bg-gradient-to-r from-darkbg-950 via-brown-950 to-darkbg-900 border border-gold-600/30 rounded-2xl p-6 shadow-dark-card text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-gold-400" />
              <span>التقسيم المالي والتشغيلي الرباعي المستقل</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight gold-text-gradient">
              الأقسام الأربعة المستقلة: دخل المحل • ديون على المحل • ديون للمحل • أكثر المواد سحباً
            </h1>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              فصل كامل ومستقل لكل ركن: دخل المحل لوحده، ديون على المحل للموردين لوحده، ديون للمحل عند العملاء لوحده، وقسم أكثر المواد والسلع سحباً من المحل لوحده.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-darkbg-900/90 border border-gold-600/40 p-3 rounded-xl text-center min-w-[140px]">
              <span className="text-[10px] text-stone-400 font-bold block">رصيد الخزينة الحي</span>
              <span className="text-lg font-black text-gold-400 font-mono">
                {db.getTreasuryBalance().toFixed(2)} {settings.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The 4 Distinct Financial Pillars Header Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Pillar 1: دخل لوحده */}
        <button
          onClick={() => setActivePillar('income')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-3 ${
            activePillar === 'income'
              ? 'bg-gradient-to-b from-darkbg-900 to-brown-950 border-gold-400 shadow-gold-glow scale-[1.02]'
              : 'bg-darkbg-900/80 border-stone-800 hover:border-gold-500/40 text-stone-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              ١. دخل المحل (لوحده)
            </span>
            <div className="w-8 h-8 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-xs text-stone-400 font-bold">إجمالي المبيعات والتحصيل</div>
            <div className="text-xl font-black text-white font-mono mt-1">
              {summary.incomePillar.totalSales.toFixed(2)}{' '}
              <span className="text-xs font-sans text-gold-400">{settings.currency}</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-800/80 flex justify-between items-center w-full">
            <span>كاش: {summary.incomePillar.cashSales.toFixed(0)}</span>
            <span className="text-gold-300 font-bold">تحصيل: +{summary.incomePillar.debtCollections.toFixed(0)}</span>
          </div>
        </button>

        {/* Pillar 2: ديون على المحل لوحده (فلوس علينا للموردين) */}
        <button
          onClick={() => setActivePillar('debts_on_store')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-3 ${
            activePillar === 'debts_on_store'
              ? 'bg-gradient-to-b from-darkbg-900 to-brown-950 border-gold-400 shadow-gold-glow scale-[1.02]'
              : 'bg-darkbg-900/80 border-stone-800 hover:border-gold-500/40 text-stone-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black text-amber-300 bg-amber-950/80 border border-amber-600/40 px-2.5 py-1 rounded-lg">
              ٢. ديون على المحل (لوحده)
            </span>
            <div className="w-8 h-8 rounded-xl bg-brown-600/20 text-brown-300 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-xs text-stone-400 font-bold">التزامات للموردين والشركات</div>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">
              {summary.debtsOnStorePillar.totalPayables.toFixed(2)}{' '}
              <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-800/80 flex justify-between items-center w-full">
            <span>الموردين الدائنين: {summary.debtsOnStorePillar.suppliersCount}</span>
            <span className="text-stone-300">سددنا: {summary.debtsOnStorePillar.totalPaidToSuppliers.toFixed(0)}</span>
          </div>
        </button>

        {/* Pillar 3: ديون للمحل لوحده (فلوس لينا برة عند العملاء) */}
        <button
          onClick={() => setActivePillar('debts_for_store')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-3 ${
            activePillar === 'debts_for_store'
              ? 'bg-gradient-to-b from-darkbg-900 to-brown-950 border-gold-400 shadow-gold-glow scale-[1.02]'
              : 'bg-darkbg-900/80 border-stone-800 hover:border-gold-500/40 text-stone-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black text-gold-300 bg-gold-950/80 border border-gold-500/40 px-2.5 py-1 rounded-lg">
              ٣. ديون للمحل (لوحده)
            </span>
            <div className="w-8 h-8 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-xs text-stone-400 font-bold">مستحقات المحل عند العملاء (شكك)</div>
            <div className="text-xl font-black text-gold-300 font-mono mt-1">
              {summary.debtsForStorePillar.totalReceivables.toFixed(2)}{' '}
              <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-800/80 flex justify-between items-center w-full">
            <span>عدد المدينين: {summary.debtsForStorePillar.debtorsCount} عميل</span>
            <span className="text-emerald-400 font-bold">مسدد: {summary.debtsForStorePillar.totalCollected.toFixed(0)}</span>
          </div>
        </button>

        {/* Pillar 4: أكثر المواد سحباً من المحل (لوحده) */}
        <button
          onClick={() => setActivePillar('most_pulled')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-3 ${
            activePillar === 'most_pulled'
              ? 'bg-gradient-to-b from-darkbg-900 to-brown-950 border-gold-400 shadow-gold-glow scale-[1.02]'
              : 'bg-darkbg-900/80 border-stone-800 hover:border-gold-500/40 text-stone-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black text-rose-300 bg-rose-950/80 border border-rose-600/40 px-2.5 py-1 rounded-lg">
              ٤. أكثر المواد سحباً (لوحده)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-950/40 text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-xs text-stone-400 font-bold">إجمالي كمية المواد المسحوبة</div>
            <div className="text-xl font-black text-white font-mono mt-1">
              {summary.mostPulledItemsPillar.totalQuantityPulled}{' '}
              <span className="text-xs font-sans text-gold-400">قطعة / كجم</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-800/80 flex justify-between items-center w-full">
            <span>أعلى مادة: {summary.mostPulledItemsPillar.topItems[0]?.name.slice(0, 16) || '—'}</span>
            <span className="text-gold-300 font-bold">{summary.mostPulledItemsPillar.totalPulledValue.toFixed(0)} {settings.currency}</span>
          </div>
        </button>
      </div>

      {/* DETAIL CONTAINER FOR THE SELECTED PILLAR */}

      {/* PILLAR 1: دخل لوحده */}
      {activePillar === 'income' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-2xl p-6 space-y-5 text-white">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">قسم دخل المحل والإيرادات (مستقل)</h2>
                <p className="text-xs text-stone-400">تفصيل كامل لكافة مصادر الأموال الداخلة للمحل (مبيعات كاش، آجل، وتحصيل الديون)</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('pos')}
              className="px-4 py-2 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 hover:to-brown-600 text-darkbg-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
            >
              <span>+ تسجيل بيع جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي المبيعات (كاش + آجل)</span>
              <span className="text-2xl font-black text-gold-300 font-mono">
                {summary.incomePillar.totalSales.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">عدد العمليات: {summary.incomePillar.salesCount}</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">مبيعات كاش (نقدية سائلة)</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {summary.incomePillar.cashSales.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">دخلت الخزينة فوراً وقت البيع</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">مبيعات آجل (على الحساب)</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {summary.incomePillar.creditSales.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">مسجلة كشكك في دفتر العملاء</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">تحصيل ديون قديمة</span>
              <span className="text-2xl font-black text-gold-400 font-mono">
                +{summary.incomePillar.debtCollections.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">مبالغ سددها العملاء وتم إيداعها</p>
            </div>
          </div>

          <div className="bg-brown-950/40 border border-gold-600/20 p-4 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-gold-300">السيولة النقدية الفعلية المحصلة (كاش + تحصيل ديون):</span>
              <p className="text-stone-400 mt-0.5">هذه هي الأموال الحقيقية التي دخلت الدرج بالفعل كسيولة</p>
            </div>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {summary.incomePillar.totalCashInflow.toFixed(2)} {settings.currency}
            </span>
          </div>
        </div>
      )}

      {/* PILLAR 2: ديون للمحل لوحده (فلوس لينا برة) */}
      {activePillar === 'debts_for_store' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-2xl p-6 space-y-5 text-white">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-950 border border-gold-500/40 text-gold-300 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">قسم ديون للمحل (فلوس لينا برة عند العملاء)</h2>
                <p className="text-xs text-stone-400">متابعة دفتر الشكك، المديونيات المستحقة للمحل، وأكثر العملاء مديونية</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('debts')}
              className="px-4 py-2 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 text-darkbg-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
            >
              <span>فتح دفتر الديون كاملاً</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي ما للمحل بالخارج</span>
              <span className="text-3xl font-black text-gold-300 font-mono">
                {summary.debtsForStorePillar.totalReceivables.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">أموال مستحقة يجب تحصيلها</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي المبالغ المسددة من الديون</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {summary.debtsForStorePillar.totalCollected.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">تم تحصيلها بنجاح</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">عدد العملاء المدينين حالياً</span>
              <span className="text-3xl font-black text-white font-mono">
                {summary.debtsForStorePillar.debtorsCount} عميل
              </span>
              <p className="text-[11px] text-stone-400 mt-2">عليهم رصيد متبقي لم يسدد بالكامل</p>
            </div>
          </div>

          {/* Top Debtors Table */}
          <div className="bg-darkbg-950 rounded-xl border border-stone-800 p-4 space-y-3">
            <h3 className="text-xs font-bold text-gold-300">أكثر العملاء مديونية للمحل (أعلى الشكك):</h3>
            {summary.debtsForStorePillar.topDebtors.length === 0 ? (
              <p className="text-center py-6 text-stone-400 text-xs">لا توجد ديون مستحقة على العملاء حالياً (دفتر الشكك خالص تماماً)</p>
            ) : (
              <div className="divide-y divide-stone-800/80">
                {summary.debtsForStorePillar.topDebtors.map((debtor, idx) => (
                  <div key={debtor.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold-950 text-gold-300 border border-gold-600/40 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white text-sm">{debtor.name}</span>
                        <span className="text-stone-400 block text-[11px]">هاتف: {debtor.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-gold-300 font-mono text-sm">
                        {debtor.balance.toFixed(2)} {settings.currency}
                      </span>
                      <button
                        onClick={() => onNavigateTab('debts', debtor.id)}
                        className="px-2.5 py-1 bg-brown-800 hover:bg-brown-700 text-gold-200 rounded-lg text-[11px] font-bold transition"
                      >
                        سداد دين
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PILLAR 3: ديون على المحل لوحده (فلوس علينا للموردين) */}
      {activePillar === 'debts_on_store' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-2xl p-6 space-y-5 text-white">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">قسم ديون على المحل (التزامات للموردين والشركات)</h2>
                <p className="text-xs text-stone-400">متابعة فواتير توريد البضاعة الآجلة، المبالغ المسددة، والمتبقي كدين على المحل</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('purchases')}
              className="px-4 py-2 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 text-darkbg-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
            >
              <span>+ تسجيل فاتورة شراء</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي الديون على المحل (للموردين)</span>
              <span className="text-3xl font-black text-amber-300 font-mono">
                {summary.debtsOnStorePillar.totalPayables.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">التزام مالي قائم على المحل</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي مشتريات البضاعة الآجلة</span>
              <span className="text-3xl font-black text-white font-mono">
                {summary.debtsOnStorePillar.totalCreditPurchases.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">إجمالي البضاعة المستلمة بالأجل</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">المبالغ المسددة للموردين</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {summary.debtsOnStorePillar.totalPaidToSuppliers.toFixed(2)} {settings.currency}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">دفعات سددها المحل للمندوبين</p>
            </div>
          </div>

          {/* Suppliers Debt List */}
          <div className="bg-darkbg-950 rounded-xl border border-stone-800 p-4 space-y-3">
            <h3 className="text-xs font-bold text-amber-300">الشركات والموردون المستحق لهم مبالغ مالية:</h3>
            {summary.debtsOnStorePillar.topSuppliersOwed.length === 0 ? (
              <p className="text-center py-6 text-stone-400 text-xs">لا توجد ديون مستحقة على المحل للموردين حالياً (حساب الموردين خالص بالكامل)</p>
            ) : (
              <div className="divide-y divide-stone-800/80">
                {summary.debtsOnStorePillar.topSuppliersOwed.map((sup, idx) => (
                  <div key={sup.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brown-900 text-amber-300 border border-amber-600/40 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white text-sm">{sup.name}</span>
                        <span className="text-stone-400 block text-[11px]">هاتف المندوب: {sup.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-amber-300 font-mono text-sm">
                        {sup.balance.toFixed(2)} {settings.currency}
                      </span>
                      <button
                        onClick={() => onNavigateTab('suppliers')}
                        className="px-2.5 py-1 bg-brown-800 hover:bg-brown-700 text-amber-200 rounded-lg text-[11px] font-bold transition"
                      >
                        سداد للمورد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PILLAR 4: أكثر المواد سحباً من المحل (السلع الأكثر مبيعاً وسحباً + المسحوبات) */}
      {activePillar === 'most_pulled' && (
        <div className="bg-darkbg-900 border border-gold-600/30 rounded-2xl p-6 space-y-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-800 pb-3 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">قسم أكثر المواد سحباً من المحل</h2>
                <p className="text-xs text-stone-400">
                  تحليل السلع والأصناف الأكثر سحباً وطلباً من الرفوف والمخزن، والأقسام الأكثر حركة، مع رصد المسحوبات النقدية
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('pos')}
                className="px-3.5 py-2 bg-gradient-to-r from-gold-600 to-brown-700 hover:from-gold-500 text-darkbg-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <span>+ سحب بيع جديد (F1)</span>
              </button>
              <button
                onClick={() => onNavigateTab('treasury')}
                className="px-3.5 py-2 bg-darkbg-950 hover:bg-darkbg-850 text-rose-300 border border-rose-500/30 font-bold rounded-xl text-xs transition"
              >
                <span>سحب نقدي من الخزينة</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي كمية المواد المسحوبة</span>
              <span className="text-2xl font-black text-white font-mono">
                {summary.mostPulledItemsPillar.totalQuantityPulled}{' '}
                <span className="text-xs font-sans text-gold-400">قطعة / كجم</span>
              </span>
              <p className="text-[11px] text-stone-400 mt-2">سحبت من خلال عمليات البيع</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">إجمالي قيمة المواد المسحوبة</span>
              <span className="text-2xl font-black text-gold-300 font-mono">
                {summary.mostPulledItemsPillar.totalPulledValue.toFixed(2)}{' '}
                <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
              </span>
              <p className="text-[11px] text-stone-400 mt-2">قيمة السلع المسحوبة المباعة</p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">المادة الأكثر سحباً وطلباً</span>
              <span className="text-sm font-black text-emerald-400 block truncate">
                {summary.mostPulledItemsPillar.topItems[0]?.name || '—'}
              </span>
              <p className="text-[11px] text-stone-400 mt-2">
                مسحوب {summary.mostPulledItemsPillar.topItems[0]?.totalQuantity || 0} وحدة
              </p>
            </div>

            <div className="bg-darkbg-950 p-4 rounded-xl border border-stone-800">
              <span className="text-xs text-stone-400 font-bold block mb-1">المسحوبات النقدية من الخزينة</span>
              <span className="text-2xl font-black text-rose-400 font-mono">
                {summary.mostPulledItemsPillar.cashWithdrawalsTotal.toFixed(2)}{' '}
                <span className="text-xs font-sans text-stone-400">{settings.currency}</span>
              </span>
              <p className="text-[11px] text-stone-400 mt-2">
                {summary.mostPulledItemsPillar.cashWithdrawalsCount} مرات سحب نقدي
              </p>
            </div>
          </div>

          {/* Table: Most Pulled Materials & Goods */}
          <div className="bg-darkbg-950 rounded-xl border border-stone-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gold-300">
                  قائمة أكثر المواد والسلع سحباً ومبيعاً من المحل:
                </h3>
                <p className="text-[11px] text-stone-400">مرتبة تنازلياً حسب الأكثر سحباً وإيراداً</p>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                {summary.mostPulledItemsPillar.topItems.length} صنف مسجل
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="bg-brown-950/80 text-gold-300 border-b border-stone-800 font-bold">
                    <th className="p-3">#</th>
                    <th className="p-3">اسم المادة / السلعة</th>
                    <th className="p-3">القسم</th>
                    <th className="p-3">سعر الوحدة</th>
                    <th className="p-3">الكمية المسحوبة</th>
                    <th className="p-3">مرات البيع</th>
                    <th className="p-3">إجمالي القيمة المسحوبة</th>
                    <th className="p-3 text-center">نسبة السحب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80 font-medium">
                  {summary.mostPulledItemsPillar.topItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-brown-950/20 transition">
                      <td className="p-3 font-mono font-bold text-gold-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-white text-sm">{item.name}</td>
                      <td className="p-3 text-stone-300">
                        <span className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[11px]">
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-stone-300">{item.unitPrice.toFixed(2)} {settings.currency}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400 text-sm">
                        {item.totalQuantity} وحدة
                      </td>
                      <td className="p-3 font-mono text-stone-400">{item.salesCount} مرة</td>
                      <td className="p-3 font-mono font-black text-gold-300 text-sm">
                        {item.totalSalesAmount.toFixed(2)} {settings.currency}
                      </td>
                      <td className="p-3 text-center min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-stone-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-brown-500 to-gold-400 h-full rounded-full"
                              style={{ width: `${Math.min(item.percentageOfSales * 2, 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-gold-300 font-bold shrink-0">
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

          {/* Section: Most Pulled Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top Categories Pulled */}
            <div className="bg-darkbg-950 rounded-xl border border-stone-800 p-5 space-y-3">
              <h3 className="text-xs font-bold text-gold-300">أكثر الأقسام سحباً للبضائع والمنتجات:</h3>
              <div className="space-y-3 pt-1">
                {summary.mostPulledItemsPillar.topCategories.map((cat, idx) => (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">
                        {idx + 1}. {cat.name}
                      </span>
                      <span className="font-black text-gold-300 font-mono">
                        {cat.totalSalesAmount.toFixed(2)} {settings.currency} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brown-600 via-gold-500 to-gold-300 h-full rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Withdrawals Breakdown */}
            <div className="bg-darkbg-950 rounded-xl border border-stone-800 p-5 space-y-3">
              <h3 className="text-xs font-bold text-rose-300">المسحوبات النقدية من الخزينة وأسبابها:</h3>
              {summary.mostPulledItemsPillar.topWithdrawalReasons.length === 0 ? (
                <p className="text-center py-8 text-stone-500 text-xs">لا توجد حركات سحب نقدية مسجلة</p>
              ) : (
                <div className="space-y-3 pt-1">
                  {summary.mostPulledItemsPillar.topWithdrawalReasons.map((w, idx) => (
                    <div key={idx} className="p-2.5 bg-darkbg-900 rounded-xl border border-stone-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{w.reason}</span>
                        <span className="text-[11px] text-stone-400">{w.count} مرات سحب</span>
                      </div>
                      <span className="font-black text-rose-400 font-mono text-sm">
                        {w.amount.toFixed(2)} {settings.currency}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
