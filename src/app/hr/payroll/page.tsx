"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PayrollPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [bonus, setBonus] = useState("");
  const [deductions, setDeductions] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEmployeesAndSalaries = async () => {
    try {
      const res = await fetch("/api/salaries");
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (err) {
      console.error("Failed to fetch payroll data", err);
    }
  };

  useEffect(() => {
    fetchEmployeesAndSalaries();
  }, []);

  const handleSaveSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount, bonus, deductions }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save salary");

      alert("Salary added successfully!");
      setUserId("");
      setAmount("");
      setBonus("");
      setDeductions("");
      fetchEmployeesAndSalaries();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-teal-700 mb-8">HR Portal</h1>
          <nav className="space-y-2">
            <a href="/hr/dashboard" className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">Dashboard</a>
            <a href="/hr/add-employee" className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">Manage Employees</a>
            <a href="/hr/payroll" className="block py-2.5 px-4 rounded-lg bg-teal-50 text-teal-700 font-medium">Payroll & Salaries</a>
            <a href="/hr/leaves" className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">Attendance & Leaves</a>
          </nav>
        </div>
        <div>
          <a href="/login" className="block py-2.5 px-4 rounded-lg text-red-600 hover:bg-red-50 font-medium text-center">Logout</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payroll & Salaries Management</h2>
            <p className="text-sm text-gray-500">Assign and manage monthly salaries for employees</p>
          </div>
          <button
            onClick={() => router.push("/hr/dashboard")}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* Add Salary Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Salary to Employee</h3>
          <form onSubmit={handleSaveSalary} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
              <select
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-teal-600"
              >
                <option value="">Choose Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount ($)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bonus ($)</label>
              <input
                type="number"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deductions ($)</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition shadow-md disabled:opacity-50"
              >
                {loading ? "Saving Salary..." : "Save & Process Salary"}
              </button>
            </div>
          </form>
        </div>

        {/* Salaries Directory Table */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employees Salary Records</h3>
          {employees.length === 0 ? (
            <p className="text-gray-500 text-sm">No employees found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600 text-sm">
                    <th className="py-3 px-4 font-semibold">Employee Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Base Salary</th>
                    <th className="py-3 px-4 font-semibold">Bonus</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const latestSalary = emp.salaries?.[0];
                    return (
                      <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm text-gray-800">
                        <td className="py-3 px-4 font-medium">{emp.name}</td>
                        <td className="py-3 px-4 text-gray-600">{emp.email}</td>
                        <td className="py-3 px-4 font-semibold text-teal-700">
                          {latestSalary ? `$${latestSalary.amount}` : "Not Assigned"}
                        </td>
                        <td className="py-3 px-4">{latestSalary ? `$${latestSalary.bonus}` : "-"}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${latestSalary ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                            {latestSalary ? latestSalary.status : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}