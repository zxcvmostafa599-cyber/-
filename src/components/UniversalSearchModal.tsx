import React, { useState, useMemo } from 'react';
import { Search, X, User, ShoppingCart, Truck, Receipt, ArrowRight } from 'lucide-react';
import { DatabaseService } from '../db/dbService';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extraId?: string) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();

  const results = useMemo(() => {
    if (!query.trim()) return { customers: [], sales: [], suppliers: [], products: [] };
    const q = query.trim().toLowerCase();

    const customers = db.getCustomers().filter(
      c => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );

    const sales = db.getSales().filter(
      s =>
        s.saleNumber.includes(q) ||
        (s.customerName && s.customerName.toLowerCase().includes(q)) ||
        (s.categoryName && s.categoryName.toLowerCase().includes(q))
    ).slice(0, 8);

    const suppliers = db.getSuppliers().filter(
      s => s.name.toLowerCase().includes(q) || s.phone.includes(q)
    );

    const products = db.getProducts().filter(
      p => p.name.toLowerCase().includes(q)
    );

    return { customers, sales, suppliers, products };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-16 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Search input header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-6 h-6 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث بالاسم، رقم الهاتف، رقم الفاتورة، المورد، أو المنتج... (F3)"
            className="flex-1 bg-transparent text-lg font-bold text-slate-800 placeholder-slate-400 outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1 text-xs font-bold text-slate-500 bg-slate-200 rounded-lg hover:bg-slate-300">
            Esc
          </button>
        </div>

        {/* Results area */}
        <div className="p-4 max-h-[65vh] overflow-y-auto divide-y divide-slate-100">
          {!query.trim() && (
            <div className="text-center py-10 text-slate-400 text-sm">
              اكتب كلمة البحث للوصول الفوري لأي عميل أو عملية بيع أو مورد في النظام
            </div>
          )}

          {/* Customers */}
          {results.customers.length > 0 && (
            <div className="py-2">
              <h3 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>العملاء ({results.customers.length})</span>
              </h3>
              <div className="space-y-1">
                {results.customers.map(c => {
                  const debt = db.getCustomerBalance(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        onNavigate('debts', c.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer flex items-center justify-between transition group"
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{c.name}</div>
                        <div className="text-xs text-slate-500">هاتف: {c.phone} {c.address ? `• ${c.address}` : ''}</div>
                      </div>
                      <div className="text-left flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${debt > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {debt > 0 ? `مديونية: ${debt.toFixed(2)} ${settings.currency}` : 'لا توجد ديون'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sales */}
          {results.sales.length > 0 && (
            <div className="py-2">
              <h3 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                <span>عمليات البيع ({results.sales.length})</span>
              </h3>
              <div className="space-y-1">
                {results.sales.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onNavigate('reports');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer flex items-center justify-between transition group"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        فاتورة #{s.saleNumber} — {s.categoryName || 'مشتريات'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString('ar-EG')} • {s.paymentType === 'cash' ? 'كاش' : `آجل: ${s.customerName || 'عميل'}`}
                      </div>
                    </div>
                    <div className="text-left font-black text-slate-800">
                      {s.totalAmount.toFixed(2)} {settings.currency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suppliers */}
          {results.suppliers.length > 0 && (
            <div className="py-2">
              <h3 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-purple-500" />
                <span>الموردون ({results.suppliers.length})</span>
              </h3>
              <div className="space-y-1">
                {results.suppliers.map(sup => (
                  <div
                    key={sup.id}
                    onClick={() => {
                      onNavigate('suppliers');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center justify-between transition group"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{sup.name}</div>
                      <div className="text-xs text-slate-500">{sup.phone}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {results.products.length > 0 && (
            <div className="py-2">
              <h3 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-teal-500" />
                <span>المنتجات والمخزون ({results.products.length})</span>
              </h3>
              <div className="space-y-1">
                {results.products.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigate('inventory');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-teal-50 cursor-pointer flex items-center justify-between transition group"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-500">الرصيد: {p.stockQuantity} قطعة • سعر البيع: {p.sellingPrice} {settings.currency}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
