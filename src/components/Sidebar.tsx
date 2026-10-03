import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Truck,
  Wallet,
  Receipt,
  BarChart3,
  ClipboardList,
  Settings,
  X,
  Keyboard,
  Layers,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'pos'
  | 'pillars'
  | 'debts'
  | 'treasury'
  | 'expenses'
  | 'purchases'
  | 'suppliers'
  | 'inventory'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'الرئيسية', icon: LayoutDashboard, badge: null, adminOnly: false },
    { id: 'pos' as NavTab, label: 'بيع جديد (F1)', icon: ShoppingCart, badge: 'سريع', adminOnly: false, highlight: true },
    { id: 'pillars' as NavTab, label: 'الأركان ٤ (دخل، ديون، سحب)', icon: Layers, badge: 'جديد', adminOnly: false, luxuryHighlight: true },
    { id: 'debts' as NavTab, label: 'العملاء والديون (F2)', icon: Users, badge: null, adminOnly: false },
    { id: 'treasury' as NavTab, label: 'الخزينة والدرج', icon: Wallet, badge: null, adminOnly: false },
    { id: 'expenses' as NavTab, label: 'المصروفات اليومية', icon: Receipt, badge: null, adminOnly: false },
    { id: 'purchases' as NavTab, label: 'المشتريات', icon: Package, badge: null, adminOnly: false },
    { id: 'suppliers' as NavTab, label: 'الموردون', icon: Truck, badge: null, adminOnly: false },
    { id: 'inventory' as NavTab, label: 'الجرد والمخزون', icon: ClipboardList, badge: null, adminOnly: false },
    { id: 'reports' as NavTab, label: 'التقارير وسنة وأشهر', icon: BarChart3, badge: null, adminOnly: !isAdmin },
    { id: 'settings' as NavTab, label: 'الإعدادات والنسخ', icon: Settings, badge: null, adminOnly: false },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-40 w-64 bg-darkbg-950 border-l border-gold-600/30 text-stone-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-61px)] ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full'
        } no-print shadow-2xl`}
      >
        {/* Mobile Header */}
        <div className="p-4 flex items-center justify-between border-b border-stone-800 lg:hidden">
          <span className="font-bold text-sm text-gold-300">القائمة الرئيسية</span>
          <button onClick={onCloseMobile} className="p-1 rounded-lg text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition active:scale-98 ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-600 to-brown-700 text-darkbg-950 shadow-md font-black'
                    : item.luxuryHighlight
                    ? 'bg-brown-950/80 text-gold-300 hover:bg-brown-900 border border-gold-500/40'
                    : item.highlight
                    ? 'bg-darkbg-900 text-gold-400 hover:bg-darkbg-850 border border-gold-600/30'
                    : 'text-stone-300 hover:bg-darkbg-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-darkbg-950' : item.luxuryHighlight || item.highlight ? 'text-gold-400' : 'text-stone-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-darkbg-950 text-gold-300'
                        : 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Keyboard Shortcuts cheat sheet footer */}
        <div className="p-3 bg-darkbg-900/90 border-t border-stone-800 text-[11px] text-stone-400">
          <div className="flex items-center gap-1.5 text-gold-300 font-bold mb-1.5">
            <Keyboard className="w-3.5 h-3.5 text-gold-400" />
            <span>اختصارات لوحة المفاتيح:</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
            <div><kbd className="bg-stone-800 border border-stone-700 px-1 py-0.5 rounded text-gold-300 font-mono">F1</kbd> بيع جديد</div>
            <div><kbd className="bg-stone-800 border border-stone-700 px-1 py-0.5 rounded text-gold-300 font-mono">F2</kbd> العملاء</div>
            <div><kbd className="bg-stone-800 border border-stone-700 px-1 py-0.5 rounded text-gold-300 font-mono">F3</kbd> بحث شامل</div>
            <div><kbd className="bg-stone-800 border border-stone-700 px-1 py-0.5 rounded text-gold-300 font-mono">F4</kbd> سداد دين</div>
            <div><kbd className="bg-stone-800 border border-stone-700 px-1 py-0.5 rounded text-white font-mono">Esc</kbd> إلغاء</div>
            <div><kbd className="bg-stone-800 border border-stone-700 px-1 py-0.5 rounded text-white font-mono">Enter</kbd> حفظ</div>
          </div>
        </div>
      </aside>
    </>
  );
};
