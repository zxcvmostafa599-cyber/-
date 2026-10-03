import React from 'react';
import { Sale, StoreSettings } from '../types';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale | null;
  customerPreviousBalance?: number;
  customerNewBalance?: number;
  settings: StoreSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  sale,
  customerPreviousBalance = 0,
  customerNewBalance = 0,
  settings,
  onClose,
}) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(sale.createdAt).toLocaleString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">تم تسجيل البيع بنجاح</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div id="thermal-receipt" className="p-6 bg-white text-slate-900 font-mono text-xs select-text">
          {/* Store Info */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
            <h2 className="text-base font-black font-sans text-slate-900">{settings.storeName}</h2>
            <p className="text-slate-500 font-sans mt-0.5">{settings.address}</p>
            <p className="text-slate-500 font-sans">هاتف: {settings.phone}</p>
          </div>

          {/* Receipt Meta */}
          <div className="border-b border-dashed border-slate-300 pb-2 mb-3 space-y-1 font-sans text-slate-600">
            <div className="flex justify-between">
              <span>رقم الفاتورة:</span>
              <span className="font-bold text-slate-900">#{sale.saleNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>التاريخ:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>الكاشير:</span>
              <span>{sale.createdByName || 'الكاشير'}</span>
            </div>
            <div className="flex justify-between">
              <span>طريقة الدفع:</span>
              <span className={`font-bold ${sale.paymentType === 'cash' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {sale.paymentType === 'cash' ? 'نقداً (كاش)' : 'آجل (شكك)'}
              </span>
            </div>
            {sale.customerName && (
              <div className="flex justify-between">
                <span>اسم العميل:</span>
                <span className="font-bold text-slate-900">{sale.customerName}</span>
              </div>
            )}
          </div>

          {/* Line Items / Category */}
          <div className="border-b border-dashed border-slate-300 pb-3 mb-3">
            <div className="flex justify-between text-slate-500 mb-1.5 font-bold font-sans">
              <span>البيان / القسم</span>
              <span>القيمة</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold font-sans text-slate-900 py-1">
              <span>
                {sale.categoryName || 'مشتريات عامة'}
                {sale.productName ? ` (${sale.productName})` : ''}
              </span>
              <span>
                {sale.totalAmount.toFixed(2)} {settings.currency}
              </span>
            </div>
            {sale.notes && (
              <p className="text-[11px] text-slate-500 font-sans italic mt-1">ملاحظة: {sale.notes}</p>
            )}
          </div>

          {/* Total Amount */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3">
            <div className="flex justify-between items-center text-base font-black font-sans text-slate-900">
              <span>إجمالي الحساب:</span>
              <span className="text-emerald-700 text-lg">
                {sale.totalAmount.toFixed(2)} {settings.currency}
              </span>
            </div>
          </div>

          {/* Credit Account Breakdown if applicable */}
          {sale.paymentType === 'credit' && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 mb-3 text-[11px] font-sans space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>الرصيد السابق:</span>
                <span>{customerPreviousBalance.toFixed(2)} {settings.currency}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>قيمة العملية:</span>
                <span>+{sale.totalAmount.toFixed(2)} {settings.currency}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-900 pt-1 border-t border-amber-200 text-xs">
                <span>إجمالي الدين الحالي:</span>
                <span>{customerNewBalance.toFixed(2)} {settings.currency}</span>
              </div>
            </div>
          )}

          {/* Footer message */}
          <div className="text-center text-slate-500 font-sans text-[11px] pt-1">
            <p>{settings.receiptFooter}</p>
            <p className="text-[10px] text-slate-400 mt-1">نظام كاشير وسوبر ماركت الذكي السريع</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الإيصال (Enter)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition"
          >
            إغلاق (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
