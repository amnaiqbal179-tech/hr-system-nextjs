'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Mail, Phone, Building, Shield, X } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  company?: { name: string };
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newEmp, setNewEmp] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    phone: '',
    companyId: '',
  });

  useEffect(() => {
    fetchEmployees();
    fetchCompanies();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const result = await res.json();
      if (result.success) setEmployees(result.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      const result = await res.json();
      if (result.success) setCompanies(result.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmployees([data.data, ...employees]);
        setNewEmp({ name: '', email: '', password: '', role: 'EMPLOYEE', phone: '', companyId: '' });
        setIsModalOpen(false);
      } else {
        alert(data.message || 'Failed to add employee.');
      }
    } catch (err) {
      console.error('Error saving employee:', err);
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
            <h1 className="text-2xl font-bold text-gray-900">Staff Directory & Employees</h1>
            <p className="text-sm text-gray-500">Manage all organization staff, admins, and HR personnel.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#00A8CC] hover:bg-[#0092b3] text-white text-sm font-medium rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Employee
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Company</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-900 flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 text-[#00A8CC] rounded-full flex items-center justify-center font-bold">
                      {emp.name.charAt(0)}
                    </div>
                    {emp.name}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-[#00A8CC] text-xs font-semibold rounded-full border border-blue-100">
                      {emp.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{emp.email}</td>
                  <td className="p-4 text-gray-500">{emp.phone || 'N/A'}</td>
                  <td className="p-4 text-gray-500">{emp.company?.name || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newEmp.password}
                    onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC] bg-white"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="HR">HR Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+92..."
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Company</label>
                <select
                  value={newEmp.companyId}
                  onChange={(e) => setNewEmp({ ...newEmp, companyId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC] bg-white"
                >
                  <option value="">Select Company</option>
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#00A8CC] text-white text-sm font-medium rounded-xl cursor-pointer disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}