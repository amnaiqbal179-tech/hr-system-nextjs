"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function HRDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [employees, setEmployees] = useState<any[]>([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
      }
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-teal-700 mb-8">HR Portal</h1>
          <nav className="space-y-2">
            <Link
              href="/hr/dashboard"
              className={`block py-2.5 px-4 rounded-lg font-medium transition ${
                pathname === "/hr/dashboard"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/hr/add-employee"
              className={`block py-2.5 px-4 rounded-lg font-medium transition ${
                pathname === "/hr/add-employee"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Manage Employees
            </Link>
            <Link
              href="/hr/payroll"
              className={`block py-2.5 px-4 rounded-lg font-medium transition ${
                pathname === "/hr/payroll"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Payroll & Salaries
            </Link>
            <Link
              href="/hr/leaves"
              className={`block py-2.5 px-4 rounded-lg font-medium transition ${
                pathname === "/hr/leaves"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Attendance & Leaves
            </Link>
          </nav>
        </div>

        <div>
          <Link
            href="/login"
            className="block py-2.5 px-4 rounded-lg text-red-600 hover:bg-red-50 font-medium transition text-center"
          >
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">HR Dashboard</h2>
            <p className="text-sm text-gray-500">Manage company employees, records, and payroll</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/hr/add-employee")}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition shadow-md"
            >
              + Add New Employee
            </button>
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
              H
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Employees</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{employees.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Payroll Status</p>
            <h3 className="text-3xl font-bold text-teal-600 mt-2">Active</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Leave Approvals</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">Up to date</h3>
          </div>
        </div>

        {/* Employees List Table */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Employees List</h3>
          {employees.length === 0 ? (
            <p className="text-gray-500 text-sm">No employees added yet. Click &quot;Add New Employee&quot; above to add one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600 text-sm">
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm text-gray-800">
                      <td className="py-3 px-4 font-medium">{emp.name}</td>
                      <td className="py-3 px-4 text-gray-600">{emp.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                          {emp.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}