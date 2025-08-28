'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Session {
  _id: string;
  sessionTitle: string;
}

interface Expense {
  _id: string;
  title: string;
  qty: number;
  price: number;
  total: number;
  category: { name: string };
  session: { sessionTitle: string };
  semester: 'first' | 'second';
  description?: string;
}

interface ExpenseByCategory {
  category: string;
  totalAmount: number;
}

interface ProfitLoss {
  income: number;
  expense: number;
}

interface StudentPaymentsResult {
  students: {
    name: string;
    matricNo: string;
    payments: Record<string, number>;
  }[];
  categories: string[];
}

interface CategorySummary {
  category: string;
  totalAmount: number;
  studentCount: number;
}

export default function AdminReports() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<'first' | 'second' | ''>('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [studentPayments, setStudentPayments] = useState<StudentPaymentsResult | null>(null);
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);
  const [expenditures, setExpenditures] = useState<Expense[]>([]);
  const [expendituresByCategory, setExpendituresByCategory] = useState<ExpenseByCategory[]>([]);
  const [profitLoss, setProfitLoss] = useState<ProfitLoss>({ income: 0, expense: 0 });

  useEffect(() => {
    api.get<Session[]>('/sessions')
      .then(res => setSessions(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSession || !selectedSemester) {
      setStudentPayments(null);
      setCategorySummaries([]);
      setExpenditures([]);
      setExpendituresByCategory([]);
      setProfitLoss({ income: 0, expense: 0 });
      return;
    }

    if (selectedLevel) {
      api.get<StudentPaymentsResult>(
        `/reports/student-payments?session=${selectedSession}&semester=${selectedSemester}&level=${selectedLevel}`
      )
        .then(res => setStudentPayments(res.data))
        .catch(() => setStudentPayments(null));
    } else {
      setStudentPayments(null);
    }

    api.get<CategorySummary[]>(
      `/reports/payment-categories?session=${selectedSession}&semester=${selectedSemester}`
    ).then(res => setCategorySummaries(res.data))
      .catch(() => setCategorySummaries([]));

    api.get<Expense[]>(`/expenditures/session/${selectedSession}/semester/${selectedSemester}`)
      .then(res => setExpenditures(res.data))
      .catch(() => setExpenditures([]));

    api.get<ProfitLoss>(`/reports/profit-loss?session=${selectedSession}&semester=${selectedSemester}`)
      .then(res => setProfitLoss(res.data))
      .catch(() => setProfitLoss({ income: 0, expense: 0 }));
  }, [selectedSession, selectedSemester, selectedLevel]);

  useEffect(() => {
    if (expenditures.length === 0) {
      setExpendituresByCategory([]);
      return;
    }

    const grouped: Record<string, number> = {};
    for (const ex of expenditures) {
      const cat = ex.category?.name || 'Uncategorized';
      grouped[cat] = (grouped[cat] || 0) + ex.total;
    }

    const result: ExpenseByCategory[] = Object.entries(grouped).map(([category, totalAmount]) => ({
      category,
      totalAmount,
    }));

    setExpendituresByCategory(result);
  }, [expenditures]);

  const exportReport = async (type: string) => {
    if (!selectedSession || !selectedSemester) {
      alert('Please select session and semester first.');
      return;
    }

    try {
      const params: Record<string, string> = {
        type,
        session: selectedSession,
        semester: selectedSemester,
      };
      if (type === 'student-level' && selectedLevel) {
        params.level = selectedLevel;
      }

      const response = await api.get(`/reports/download-pdf`, {
        params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        // @ts-expect-error: Ignore type error due to legacy API mismatch
        alert(`Failed to download report: ${error.response?.data?.message || 'Unknown error'}`);
      } else if (error instanceof Error) {
        alert(`Failed to download report: ${error.message}`);
      } else {
        alert('Failed to download report: Unknown error');
      }
    }
  };

  return (
    <div className="admin-reports-wrapper">
      {/* ... (no changes above) ... */}

      {selectedSemester && expenditures.length > 0 && (
        <>
          <h3 className="admin-reports-subtitle">3. Expenditures</h3>
          <div className="admin-reports-table-wrapper">
            <table className="admin-reports-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Category</th>
                  <th>Session</th>
                  <th>Semester</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((e, i) => (
                  <tr key={i}>
                    <td>{e.title}</td>
                    <td>{e.qty}</td>
                    <td>₦{e.price.toLocaleString()}</td>
                    <td>₦{e.total.toLocaleString()}</td>
                    <td>{e.category?.name || '—'}</td>
                    <td>{e.session?.sessionTitle || '—'}</td>
                    <td>{e.semester}</td>
                    <td>{e.description || '-'}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3}><strong>Total</strong></td>
                  <td><strong>₦{expenditures.reduce((sum, e) => sum + e.total, 0).toLocaleString()}</strong></td>
                  <td colSpan={4}></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            className="admin-reports-btn"
            onClick={() => exportReport('expenditures')}
            type="button"
          >
            Download PDF
          </button>
        </>
      )}

      {selectedSemester && expendituresByCategory.length > 0 && (
        <>
          <h3 className="admin-reports-subtitle">4. Expenditures by Category</h3>
          <div className="admin-reports-table-wrapper">
            <table className="admin-reports-table">
              <thead><tr><th>Category</th><th>Total</th></tr></thead>
              <tbody>
                {expendituresByCategory.map((bc, i) => (
                  <tr key={i}><td>{bc.category}</td><td>₦{bc.totalAmount.toLocaleString()}</td></tr>
                ))}
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>₦{expendituresByCategory.reduce((sum, bc) => sum + bc.totalAmount, 0).toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            className="admin-reports-btn"
            onClick={() => exportReport('expenditures-category')}
            type="button"
          >
            Download PDF
          </button>
        </>
      )}

      {selectedSemester && (
        <>
          <h3 className="admin-reports-subtitle">5. Income / Expenditure Summary</h3>
          <div className="admin-reports-summary">
            <p className="admin-reports-summary-item">
              <strong>Total Income for the semester:</strong> ₦{profitLoss.income.toLocaleString()}
            </p>
            <p className="admin-reports-summary-item">
              <strong>Total Expense for the Semester:</strong> ₦{expenditures.reduce((sum, e) => sum + e.total, 0).toLocaleString()}
            </p>
            <p className="admin-reports-summary-item">
              <strong>Balance:</strong> ₦{(profitLoss.income - expenditures.reduce((sum, e) => sum + e.total, 0)).toLocaleString()}
            </p>
          </div>

          <button
            className="admin-reports-btn"
            onClick={() => exportReport('summary')}
            type="button"
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}
