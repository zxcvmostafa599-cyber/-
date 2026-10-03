import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  X,
  Package,
  Layers,
  ArrowRightLeft,
  Check,
  Edit,
} from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { Product, Category, InventoryCount } from '../types';
import { useAuth } from '../context/AuthContext';

export const InventoryScreen: React.FC = () => {
  const db = DatabaseService.getInstance();
  const settings = db.getSettings();
  const { currentUser } = useAuth();

  const [products, setProducts] = useState<Product[]>(() => db.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => db.getCategories());
  const [inventoryLogs, setInventoryLogs] = useState<InventoryCount[]>(() => db.getInventoryCounts());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditTargetProduct, setAuditTargetProduct] = useState<Product | null>(null);
  const [actualQtyInput, setActualQtyInput] = useState('');

  // Form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodCost, setProdCost] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodQty, setProdQty] = useState('');
  const [prodMin, setProdMin] = useState('5');

  const refreshList = () => {
    setProducts(db.getProducts());
    setInventoryLogs(db.getInventoryCounts());
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCatFilter === 'all' || p.categoryId === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = products.filter(p => p.stockQuantity <= p.minimumStock).length;

  const handleOpenAddEdit = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdCategory(product.categoryId);
      setProdCost(product.purchasePrice.toString());
      setProdPrice(product.sellingPrice.toString());
      setProdQty(product.stockQuantity.toString());
      setProdMin(product.minimumStock.toString());
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdCategory(categories[0]?.id || 'cat-grocery');
      setProdCost('');
      setProdPrice('');
      setProdQty('0');
      setProdMin('5');
    }
    setIsAddEditModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProduct) {
      db.updateProduct(
        {
          ...editingProduct,
          name: prodName.trim(),
          categoryId: prodCategory,
          purchasePrice: parseFloat(prodCost) || 0,
          sellingPrice: parseFloat(prodPrice) || 0,
          stockQuantity: parseFloat(prodQty) || 0,
          minimumStock: parseFloat(prodMin) || 0,
        },
        currentUser!
      );
    } else {
      db.addProduct(
        {
          name: prodName.trim(),
          categoryId: prodCategory,
          purchasePrice: parseFloat(prodCost) || 0,
          sellingPrice: parseFloat(prodPrice) || 0,
          stockQuantity: parseFloat(prodQty) || 0,
          minimumStock: parseFloat(prodMin) || 0,
          active: true,
        },
        currentUser!
      );
    }

    setIsAddEditModalOpen(false);
    refreshList();
  };

  // Perform Physical Count check
  const handleOpenAudit = (product: Product) => {
    setAuditTargetProduct(product);
    setActualQtyInput(product.stockQuantity.toString());
    setIsAuditModalOpen(true);
  };

  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditTargetProduct) return;
    const actual = parseFloat(actualQtyInput);
    if (isNaN(actual) || actual < 0) {
      alert('من فضلك أدخل كمية صحيحة');
      return;
    }

    db.recordInventoryCheck({
      productId: auditTargetProduct.id,
      actualQty: actual,
      user: currentUser!,
    });

    setIsAuditModalOpen(false);
    refreshList();
    alert('تم تسجيل نتيجة الجرد وتحديث المخزون بنجاح');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">الجرد البسيط والمخزون</h2>
            <p className="text-xs text-slate-500">
              إدارة أسعار الشراء والبيع والكميات المسجلة، وإجراء جرد فعلي لمقارنة العجز والزيادة
            </p>
          </div>
        </div>

        <button
          onClick={() => handleOpenAddEdit()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة صنف للمخزون</span>
        </button>
      </div>

      {/* Low stock alert badge if any */}
      {lowStockCount > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>تنبيه نواقص: يوجد ({lowStockCount}) أصناف وصلت للحد الأدنى من المخزون وتتطلب الشراء</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث عن منتج..."
            className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">القسم:</span>
          <select
            value={selectedCatFilter}
            onChange={e => setSelectedCatFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
          >
            <option value="all">جميع الأقسام ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="p-3.5">اسم الصنف</th>
                <th className="p-3.5">القسم</th>
                <th className="p-3.5">سعر الشراء (التكلفة)</th>
                <th className="p-3.5">سعر البيع</th>
                <th className="p-3.5">الرصيد الدفتري</th>
                <th className="p-3.5">الحد الأدنى</th>
                <th className="p-3.5 text-center">جرد فعلي / تعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map(p => {
                const cat = categories.find(c => c.id === p.categoryId);
                const isLow = p.stockQuantity <= p.minimumStock;

                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3.5 text-slate-600">{cat?.name || 'عام'}</td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {p.purchasePrice.toFixed(2)} {settings.currency}
                    </td>
                    <td className="p-3.5 font-bold font-mono text-emerald-800">
                      {p.sellingPrice.toFixed(2)} {settings.currency}
                    </td>
                    <td className="p-3.5 font-black font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          isLow ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {p.stockQuantity} قطعة
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">{p.minimumStock}</td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenAudit(p)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg text-xs flex items-center gap-1"
                          title="تسجيل كمية الجرد الفعلي على الرف"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>جرد يدوي</span>
                        </button>
                        <button
                          onClick={() => handleOpenAddEdit(p)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Physical Count Audit */}
      {isAuditModalOpen && auditTargetProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveAudit}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-200" />
                <h3 className="font-bold text-sm">جرد فعلي: {auditTargetProduct.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1 rounded-lg text-teal-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600">الكمية المسجلة بالدفتر:</span>
                <span className="text-base font-black text-slate-800 font-mono">
                  {auditTargetProduct.stockQuantity} قطعة
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الكمية الفعلية الموجودة على الرف حالياً *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={actualQtyInput}
                  onChange={e => setActualQtyInput(e.target.value)}
                  className="w-full h-12 text-center text-2xl font-black font-mono text-teal-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  autoFocus
                />
              </div>

              {/* Status Comparison */}
              {actualQtyInput && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl font-bold flex justify-between items-center">
                  <span>النتيجة:</span>
                  <span
                    className={
                      parseFloat(actualQtyInput) === auditTargetProduct.stockQuantity
                        ? 'text-emerald-700'
                        : parseFloat(actualQtyInput) < auditTargetProduct.stockQuantity
                        ? 'text-rose-700'
                        : 'text-blue-700'
                    }
                  >
                    {parseFloat(actualQtyInput) === auditTargetProduct.stockQuantity
                      ? 'مطابق تماماً'
                      : parseFloat(actualQtyInput) < auditTargetProduct.stockQuantity
                      ? `عجز: ${parseFloat(actualQtyInput) - auditTargetProduct.stockQuantity} قطعة`
                      : `زيادة: +${parseFloat(actualQtyInput) - auditTargetProduct.stockQuantity} قطعة`}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl"
              >
                اعتماد وتحديث المخزون
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add / Edit Product */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد للمخزون'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الصنف / المنتج *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  placeholder="مثال: شاي العروسة 250 جم"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">القسم:</label>
                <select
                  value={prodCategory}
                  onChange={e => setProdCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سعر الشراء (التكلفة)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodCost}
                    onChange={e => setProdCost(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سعر البيع للجمهور *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={e => setProdPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الكمية الحالية بالرصيد</label>
                  <input
                    type="number"
                    value={prodQty}
                    onChange={e => setProdQty(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">حد النواقص (الأدنى)</label>
                  <input
                    type="number"
                    value={prodMin}
                    onChange={e => setProdMin(e.target.value)}
                    placeholder="5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
              >
                حفظ الصنف
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
