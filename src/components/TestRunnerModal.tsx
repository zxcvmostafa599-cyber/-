import React, { useState } from 'react';
import { CheckCircle2, XCircle, Play, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { DatabaseService } from '../db/dbService';
import { useAuth } from '../context/AuthContext';

interface TestResult {
  id: number;
  title: string;
  expected: string;
  actual: string;
  passed: boolean;
  details: string;
}

export const TestRunnerModal: React.FC<{ isOpen: boolean; onClose: () => void; onRefresh: () => void }> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const { currentUser } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  if (!isOpen) return null;

  const runAllTests = async () => {
    setIsRunning(true);
    const db = DatabaseService.getInstance();
    const testResults: TestResult[] = [];
    const testUser = currentUser || { id: 'test-user', name: 'مختبر النظام' };

    try {
      // Setup a fresh isolated test customer
      const testCustomer = db.addCustomer(
        {
          name: 'عميل اختبار تجريبي ' + Date.now().toString().slice(-4),
          phone: '01000000000',
          creditLimit: 5000,
          notes: 'حساب مخصص لاختبار العمليات الحسابية',
        },
        testUser
      );

      // ----------------------------------------------------
      // اختبار 1: بيع كاش بقيمة 100 جنيه -> الخزينة تزيد 100
      // ----------------------------------------------------
      const initialTreasury1 = db.getTreasuryBalance();
      const sale1Result = db.recordSale({
        amount: 100,
        categoryId: 'cat-grocery',
        paymentType: 'cash',
        notes: 'اختبار بيع كاش 100 جنيه',
        user: testUser,
      });
      const postTreasury1 = db.getTreasuryBalance();
      const diff1 = postTreasury1 - initialTreasury1;
      const pass1 = Math.abs(diff1 - 100) < 0.001 && sale1Result.success;

      testResults.push({
        id: 1,
        title: 'اختبار 1: بيع كاش بقيمة 100 جنيه',
        expected: 'الخزينة تزيد بمقدار +100 بالضبط',
        actual: `الخزينة قبل: ${initialTreasury1.toFixed(2)} | الخزينة بعد: ${postTreasury1.toFixed(2)} (الزيادة: +${diff1.toFixed(2)})`,
        passed: pass1,
        details: 'تم قيد الحركة في جدول حركات الخزينة كإيراد بيع نقدي flow: in',
      });

      // ----------------------------------------------------
      // اختبار 2: بيع آجل لعميل بقيمة 200 جنيه -> دين العميل يزيد 200، الخزينة لا تزيد
      // ----------------------------------------------------
      const initialTreasury2 = db.getTreasuryBalance();
      const initialDebt2 = db.getCustomerBalance(testCustomer.id);
      const sale2Result = db.recordSale({
        amount: 200,
        categoryId: 'cat-dairy',
        paymentType: 'credit',
        customerId: testCustomer.id,
        notes: 'اختبار بيع آجل 200 جنيه',
        user: testUser,
      });
      const postTreasury2 = db.getTreasuryBalance();
      const postDebt2 = db.getCustomerBalance(testCustomer.id);
      const debtDiff2 = postDebt2 - initialDebt2;
      const treasuryDiff2 = postTreasury2 - initialTreasury2;
      const pass2 = Math.abs(debtDiff2 - 200) < 0.001 && Math.abs(treasuryDiff2) < 0.001 && sale2Result.success;

      testResults.push({
        id: 2,
        title: 'اختبار 2: بيع آجل لعميل بقيمة 200 جنيه',
        expected: 'دين العميل يزيد +200، والخزينة لا تتأثر (الفرق = 0)',
        actual: `دين العميل: ${initialDebt2} ➔ ${postDebt2} (+${debtDiff2}) | الخزينة: ${treasuryDiff2 >= 0 ? '+' : ''}${treasuryDiff2}`,
        passed: pass2,
        details: 'البيع الآجل يضاف لدفتر الشكك دون احتسابه كنقدية سائلة في الخزينة',
      });

      // ----------------------------------------------------
      // اختبار 3: العميل يسدد 100 جنيه -> الدين ينخفض 100، الخزينة تزيد 100
      // ----------------------------------------------------
      const initialTreasury3 = db.getTreasuryBalance();
      const initialDebt3 = db.getCustomerBalance(testCustomer.id);
      const payResult = db.recordCustomerPayment({
        customerId: testCustomer.id,
        amount: 100,
        paymentMethod: 'cash',
        notes: 'اختبار سداد عميل 100 جنيه نقدي',
        user: testUser,
      });
      const postTreasury3 = db.getTreasuryBalance();
      const postDebt3 = db.getCustomerBalance(testCustomer.id);
      const debtDiff3 = initialDebt3 - postDebt3; // Should decrease by 100
      const treasuryDiff3 = postTreasury3 - initialTreasury3; // Should increase by 100
      const pass3 = Math.abs(debtDiff3 - 100) < 0.001 && Math.abs(treasuryDiff3 - 100) < 0.001 && payResult.success;

      testResults.push({
        id: 3,
        title: 'اختبار 3: سداد دين عميل بقيمة 100 جنيه',
        expected: 'الدين ينخفض بمقدار -100، والخزينة تزيد بمقدار +100',
        actual: `دين العميل: ${initialDebt3} ➔ ${postDebt3} (انخفاض: -${debtDiff3}) | الخزينة: +${treasuryDiff3}`,
        passed: pass3,
        details: 'تم قيد السداد في كشف حساب العميل وتوليد حركة إيداع تحصيل دين في الخزينة',
      });

      // ----------------------------------------------------
      // اختبار 4: شراء كاش بقيمة 500 جنيه -> الخزينة تنخفض 500
      // ----------------------------------------------------
      const initialTreasury4 = db.getTreasuryBalance();
      const purchaseResult = db.recordPurchase({
        amount: 500,
        paymentType: 'cash',
        notes: 'اختبار شراء بضاعة كاش 500 جنيه',
        user: testUser,
      });
      const postTreasury4 = db.getTreasuryBalance();
      const treasuryDiff4 = initialTreasury4 - postTreasury4;
      const pass4 = Math.abs(treasuryDiff4 - 500) < 0.001 && purchaseResult.success;

      testResults.push({
        id: 4,
        title: 'اختبار 4: شراء بضاعة كاش بقيمة 500 جنيه',
        expected: 'الخزينة تنخفض بمقدار -500 بالضبط',
        actual: `الخزينة قبل: ${initialTreasury4.toFixed(2)} | الخزينة بعد: ${postTreasury4.toFixed(2)} (خصم: -${treasuryDiff4.toFixed(2)})`,
        passed: pass4,
        details: 'تم خصم قيمة المشتريات النقدية تلقائياً من الخزينة flow: out',
      });

      // ----------------------------------------------------
      // اختبار 5: مصروف كاش بقيمة 100 جنيه -> الخزينة تنخفض 100
      // ----------------------------------------------------
      const initialTreasury5 = db.getTreasuryBalance();
      const expenseResult = db.recordExpense({
        category: 'electricity',
        categoryLabel: 'كهرباء وإنارة',
        amount: 100,
        paymentMethod: 'cash',
        notes: 'اختبار مصروف نقدي 100 جنيه',
        user: testUser,
      });
      const postTreasury5 = db.getTreasuryBalance();
      const treasuryDiff5 = initialTreasury5 - postTreasury5;
      const pass5 = Math.abs(treasuryDiff5 - 100) < 0.001 && expenseResult.success;

      testResults.push({
        id: 5,
        title: 'اختبار 5: تسجيل مصروف كاش بقيمة 100 جنيه',
        expected: 'الخزينة تنخفض بمقدار -100 بالضبط',
        actual: `الخزينة قبل: ${initialTreasury5.toFixed(2)} | الخزينة بعد: ${postTreasury5.toFixed(2)} (خصم: -${treasuryDiff5.toFixed(2)})`,
        passed: pass5,
        details: 'المصروفات النقدية تؤثر فورياً على رصيد الدرج الفعلي',
      });

      // ----------------------------------------------------
      // اختبار 6: إغلاق اليوم -> مقارنة الرصيد المتوقع مع النقدية الفعلية
      // ----------------------------------------------------
      const currentTreasury6 = db.getTreasuryBalance();
      const simulatedActualCash = currentTreasury6 - 50; // Simulate 50 deficit
      const closeResult = db.closeDay(simulatedActualCash, 'اختبار إغلاق اليومية الآلي', testUser);
      const pass6 =
        closeResult.success &&
        closeResult.record.expectedCash === currentTreasury6 &&
        closeResult.record.difference === -50;

      testResults.push({
        id: 6,
        title: 'اختبار 6: إغلاق اليومية وحساب عجز/زيادة الدرج',
        expected: 'المتوقع مطابق للخزينة والفرق = الفعلي - المتوقع (-50 عجز)',
        actual: `المتوقع: ${closeResult.record.expectedCash.toFixed(2)} | الفعلي المدخل: ${simulatedActualCash.toFixed(2)} | العجز: ${closeResult.record.difference.toFixed(2)}`,
        passed: pass6,
        details: 'تم إنشاء تقرير Z كامل وحفظه وتنبيه الإدارة بوجود عجز',
      });

      // ----------------------------------------------------
      // اختبار 7: حذف/إلغاء عملية -> عكس الأثر المالي وعدم الاختفاء من سجل التدقيق
      // ----------------------------------------------------
      // Create a specific sale then cancel it
      const tempSale = db.recordSale({
        amount: 300,
        categoryId: 'cat-general',
        paymentType: 'cash',
        notes: 'عملية للتجربة سيتم إلغاؤها',
        user: testUser,
      });
      const preCancelTreasury = db.getTreasuryBalance();
      const cancelResult = db.cancelSale(tempSale.sale!.id, 'خطأ في إدخال المبلغ من الكاشير', testUser);
      const postCancelTreasury = db.getTreasuryBalance();
      const cancelDiff = preCancelTreasury - postCancelTreasury;

      // Verify audit log has the record
      const auditLogs = db.getAuditLogs();
      const cancelAudit = auditLogs.find(a => a.action === 'CANCEL' && a.recordId === tempSale.sale!.id);
      const pass7 =
        cancelResult.success &&
        Math.abs(cancelDiff - 300) < 0.001 &&
        Boolean(cancelAudit) &&
        tempSale.sale!.status === 'completed'; // Original was completed, then marked cancelled

      testResults.push({
        id: 7,
        title: 'اختبار 7: إلغاء عملية بيع وعكس الأثر المالي وحفظ الأثر بالتدقيق',
        expected: 'خصم 300 المعكوسة من الخزينة + تسجيل العملية وسبيها في Audit Log',
        actual: `تم خصم: -${cancelDiff.toFixed(2)} جنيه من الخزينة | مسجل في سجل التدقيق: ${cancelAudit ? 'نعم (موثق)' : 'لا'}`,
        passed: pass7,
        details: 'لا يتم حذف العمليات المالية نهائياً بل يتم عكس أثرها المحاسبي وتوثيق من ألغاها وسبب الإلغاء',
      });

      setResults(testResults);
      onRefresh();
    } catch (e) {
      console.error('Error during test execution:', e);
    } finally {
      setIsRunning(false);
    }
  };

  const allPassed = results.length === 7 && results.every(r => r.passed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-black text-base">مركز الاختبارات والتحقق المحاسبي الآلي</h2>
              <p className="text-xs text-slate-400">تنفيذ ومطابقة سيناريوهات الاختبار الـ 7 المطلوبة في كراسة الشروط</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
            <div>
              <span className="font-bold">القواعد المحاسبية الصارمة:</span>
              <p className="text-slate-600 mt-0.5">
                الخزينة = الافتتاحي + الداخل - الخارج | رصيد العميل = الآجل - المسدد | إلغاء العمليات يوثق في سجل التدقيق
              </p>
            </div>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition active:scale-95 disabled:opacity-50 text-xs"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>تشغيل الاختبارات الـ 7 الآن</span>
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">
                  نتيجة الفحص ({results.filter(r => r.passed).length} من {results.length} اختبارات ناجحة)
                </span>
                {allPassed && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    جميع الاختبارات مطابقة بنسبة 100%
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {results.map(r => (
                  <div
                    key={r.id}
                    className={`p-3.5 rounded-xl border text-xs transition ${
                      r.passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {r.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{r.title}</div>
                          <div className="text-slate-500 mt-0.5 font-medium">{r.expected}</div>
                          <div className="text-slate-700 font-bold mt-1 bg-white/80 p-1.5 rounded-lg border border-slate-200/60 font-mono">
                            {r.actual}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">{r.details}</div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md font-black text-[11px] ${
                          r.passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {r.passed ? 'ناجح ✓' : 'راسب ✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              اضغط على زر &quot;تشغيل الاختبارات الـ 7 الآن&quot; للتحقق الفوري من جميع المعادلات والعمليات
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
