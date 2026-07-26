"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminHRManagement() {
  const router = useRouter();
  const pathname = usePathname();
  const [hrs, setHrs] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const hrRes = await fetch("/api/admin/hr");
      const hrData = await hrRes.json();
      if (hrData.success) setHrs(hrData.hrUsers);

      const compRes = await fetch("/api/companies");
      const compData = await compRes.json();
      if (compData.success) setCompanies(compData.companies);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateHR = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/hr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, companyId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create HR");

      alert("HR account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setCompanyId("");
      fetchData();
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
          <h1 className="text-xl font-bold text-teal-700 mb-8">Admin Portal</h1>
          <nav className="space-y-2">
            <Link
              href="/admin/dashboard"
              className="block py-2.5 px-4 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
            >
              Dashboard & Companies
            </Link>
            <Link
              href="/admin/hrs"
              className="block py-2.5 px-4 rounded-lg bg-teal-50 text-teal-700 font-medium transition"
            >
              Manage HR Users
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
            <h2 className="text-2xl font-bold text-gray-900">Manage HR Accounts</h2>
            <p className="text-sm text-gray-500">Create and assign HR managers to companies</p>
          </div>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* Create HR Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New HR Account</h3>
          <form onSubmit={handleCreateHR} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HR Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ayesha Khan"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ayesha@company.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Company</label>
              <select
                required
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-teal-600"
              >
                <option value="">Select Company</option>
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>{comp.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition shadow-md disabled:opacity-50"
              >
                {loading ? "Creating HR..." : "Create HR Account"}
              </button>
            </div>
          </form>
        </div>

        {/* HR List Table */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered HR Users</h3>
          {hrs.length === 0 ? (
            <p className="text-gray-500 text-sm">No HR accounts created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600 text-sm">
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Assigned Company</th>
                  </tr>
                </thead>
                <tbody>
                  {hrs.map((hr) => (
                    <tr key={hr.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm text-gray-800">
                      <td className="py-3 px-4 font-medium">{hr.name}</td>
                      <td className="py-3 px-4 text-gray-600">{hr.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                          {hr.company ? hr.company.name : "Not Assigned"}
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