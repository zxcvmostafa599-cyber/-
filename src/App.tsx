import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { DatabaseService } from './db/dbService';
import { StoreSettings } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardScreen } from './screens/DashboardScreen';
import { POSScreen } from './screens/POSScreen';
import { DebtsScreen } from './screens/DebtsScreen';
import { PurchasesScreen } from './screens/PurchasesScreen';
import { SuppliersScreen } from './screens/SuppliersScreen';
import { TreasuryScreen } from './screens/TreasuryScreen';
import { ExpensesScreen } from './screens/ExpensesScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { FinancialPillarsScreen } from './screens/FinancialPillarsScreen';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { LoginModal } from './components/LoginModal';
import { MultiDeviceModal } from './components/MultiDeviceModal';
import { FirstTimeSetup } from './components/FirstTimeSetup';

const SupermarketApp: React.FC = () => {
  const db = DatabaseService.getInstance();
  const { currentUser } = useAuth();
  const { treasuryBalance: liveTreasury } = useShop();
  const [settings, setSettings] = useState<StoreSettings>(() => db.getSettings());
  const [treasuryBalance, setTreasuryBalance] = useState<number>(() => db.getTreasuryBalance());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedCustomerIdForDebts, setSelectedCustomerIdForDebts] = useState<string | undefined>(undefined);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTestsOpen, setIsTestsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMultiDeviceOpen, setIsMultiDeviceOpen] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Global refresh function
  const refreshGlobalState = useCallback(() => {
    setSettings(db.getSettings());
    setTreasuryBalance(db.getTreasuryBalance());
  }, [db]);

  // First-time Setup or Unauthenticated state (Strict Zero Baseline)
  const users = db.getUsers();
  if (!currentUser || users.length === 0) {
    return (
      <div className="min-h-screen bg-[#0C0F0D]" dir="rtl">
        <FirstTimeSetup
          onComplete={refreshGlobalState}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onOpenNewShop={() => setIsMultiDeviceOpen(true)}
        />
      </div>
    );
  }

  // Global Keyboard Shortcuts handler (Section 30)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1: بيع جديد (POS)
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveTab('pos');
      }
      // F2: العملاء والديون
      else if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('debts');
      }
      // F3: بحث شامل
      else if (e.key === 'F3') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // F4: تسجيل سداد دين
      else if (e.key === 'F4') {
        e.preventDefault();
        setActiveTab('debts');
      }
      // F5: تحديث البيانات
      else if (e.key === 'F5' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        refreshGlobalState();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshGlobalState]);

  const handleNavigateFromSearch = (tab: string, extraId?: string) => {
    if (tab === 'debts') {
      setSelectedCustomerIdForDebts(extraId);
      setActiveTab('debts');
    } else {
      setActiveTab(tab as NavTab);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0F0D] text-stone-100 flex flex-col font-sans select-none antialiased" dir="rtl">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        treasuryBalance={liveTreasury > 0 ? liveTreasury : treasuryBalance}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenTests={() => setIsTestsOpen(true)}
        onOpenMultiDevice={() => setIsMultiDeviceOpen(true)}
        onNavigateTreasury={() => setActiveTab('treasury')}
        onToggleSidebar={() => setIsSidebarMobileOpen(prev => !prev)}
      />

      {/* Main Layout: Sidebar + Screen View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Right Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={tab => {
            setSelectedCustomerIdForDebts(undefined);
            setActiveTab(tab);
          }}
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0C0F0D]">
          {activeTab === 'dashboard' && (
            <DashboardScreen
              onNavigate={tab => {
                setSelectedCustomerIdForDebts(undefined);
                setActiveTab(tab);
              }}
              onRefresh={refreshGlobalState}
            />
          )}

          {activeTab === 'pos' && (
            <POSScreen
              onRefreshTreasury={refreshGlobalState}
              onOpenCustomerLedger={customerId => {
                setSelectedCustomerIdForDebts(customerId);
                setActiveTab('debts');
              }}
            />
          )}

          {activeTab === 'pillars' && (
            <FinancialPillarsScreen
              onNavigateTab={(tab, extraId) => {
                if (extraId) setSelectedCustomerIdForDebts(extraId);
                setActiveTab(tab);
              }}
              onRefreshTreasury={refreshGlobalState}
            />
          )}

          {activeTab === 'debts' && (
            <DebtsScreen
              onRefreshTreasury={refreshGlobalState}
              selectedCustomerIdProp={selectedCustomerIdForDebts}
            />
          )}

          {activeTab === 'purchases' && (
            <PurchasesScreen onRefreshTreasury={refreshGlobalState} />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersScreen onRefreshTreasury={refreshGlobalState} />
          )}

          {activeTab === 'treasury' && (
            <TreasuryScreen onRefresh={refreshGlobalState} />
          )}

          {activeTab === 'expenses' && (
            <ExpensesScreen onRefreshTreasury={refreshGlobalState} />
          )}

          {activeTab === 'reports' && (
            <ReportsScreen />
          )}

          {activeTab === 'inventory' && (
            <InventoryScreen />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen onRefresh={refreshGlobalState} />
          )}
        </main>
      </div>

      {/* Universal Search Modal (F3) */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigateFromSearch}
      />

      {/* Test Suite Modal (Automated Verification of Section 40) */}
      <TestRunnerModal
        isOpen={isTestsOpen}
        onClose={() => setIsTestsOpen(false)}
        onRefresh={refreshGlobalState}
      />

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenNewShop={() => setIsMultiDeviceOpen(true)}
      />

      {/* Multi-Device & Cloud Sync Modal */}
      <MultiDeviceModal
        isOpen={isMultiDeviceOpen}
        onClose={() => setIsMultiDeviceOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <SupermarketApp />
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
