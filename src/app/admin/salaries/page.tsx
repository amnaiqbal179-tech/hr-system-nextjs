'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, User, Calendar, X } from 'lucide-react';

interface Salary {
  id: string;
  amount: number;
  bonus: number;
  deductions: number;
  status: string;
  payDate: string;
  user?: { name: string; email: string };
}

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newSal, setNewSal] = useState({
    amount: '',
    bonus: '',
    deductions: '',
    status: 'Paid',
    userId: '',
  });

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await fetch('/api/salaries');
      const result = await res.json();
      if (result.success) setSalaries(result.data);
    } catch (err) {
      console.error('Error fetching salaries:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const result = await res.json();
      if (result.success) setEmployees(result.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleAddSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSal),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSalaries([data.data, ...salaries]);
        setNewSal({ amount: '', bonus: '', deductions: '', status: 'Paid', userId: '' });
        setIsModalOpen(false);
      } else {
        alert(data.message || 'Failed to add salary.');
      }
    } catch (err) {
      console.error('Error saving salary:', err);
      alert('Database connection error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll & Salaries</h1>
            <p className="text-sm text-gray-500">Manage employee compensation, bonuses, and payment history.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#00A8CC] hover:bg-[#0092b3] text-white text-sm font-medium rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Salary Record
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Employee</th>
                <th className="p-4">Base Amount</th>
                <th className="p-4">Bonus</th>
                <th className="p-4">Deductions</th>
                <th className="p-4">Net Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {salaries.map((sal) => {
                const net = sal.amount + (sal.bonus || 0) - (sal.deductions || 0);
                return (
                  <tr key={sal.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-gray-900 flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                        {sal.user?.name ? sal.user.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <p>{sal.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{sal.user?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">${sal.amount.toLocaleString()}</td>
                    <td className="p-4 text-emerald-600">+${sal.bonus || 0}</td>
                    <td className="p-4 text-rose-600">-${sal.deductions || 0}</td>
                    <td className="p-4 font-bold text-gray-900">${net.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100">
                        {sal.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add Salary Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSalary} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee *</label>
                <select
                  required
                  value={newSal.userId}
                  onChange={(e) => setNewSal({ ...newSal, userId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC] bg-white"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount ($) *</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={newSal.amount}
                  onChange={(e) => setNewSal({ ...newSal, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bonus ($)</label>
                  <input
                    type="number"
                    placeholder="200"
                    value={newSal.bonus}
                    onChange={(e) => setNewSal({ ...newSal, bonus: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deductions ($)</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newSal.deductions}
                    onChange={(e) => setNewSal({ ...newSal, deductions: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={newSal.status}
                  onChange={(e) => setNewSal({ ...newSal, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC] bg-white"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#00A8CC] text-white text-sm font-medium rounded-xl cursor-pointer disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Salary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}