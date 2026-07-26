"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [companies, setCompanies] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalEmployees: 0, totalHRs: 0 });
  
  // Edit modal states
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      if (data.success) {
        setCompanies(data.companies);
        setStats({
          totalEmployees: data.totalEmployees || 0,
          totalHRs: data.totalHRs || 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await fetch(`/api/companies/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      alert("Company deleted successfully!");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditClick = (comp: any) => {
    setEditingCompany(comp);
    setName(comp.name);
    setEmail(comp.email || "");
    setPhone(comp.phone || "");
    setLocation(comp.location || "");
    setWebsite(comp.website || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    try {
      const res = await fetch(`/api/companies/${editingCompany.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, location, website }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      alert("Company updated successfully!");
      setEditingCompany(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
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
              className={`block py-2.5 px-4 rounded-lg font-medium transition ${
                pathname === "/admin/dashboard"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Dashboard & Companies
            </Link>
            <Link
              href="/admin/hrs"
              className={`block py-2.5 px-4 rounded-lg font-medium transition ${
                pathname === "/admin/hrs"
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
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
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">System-wide analytics and company management</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/add-company")}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition shadow-md"
            >
              + Add New Company
            </button>
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Companies</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{companies.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Active HRs</p>
            <h3 className="text-3xl font-bold text-teal-600 mt-2">{stats.totalHRs}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Employees</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEmployees}</h3>
          </div>
        </div>

        {/* Companies Cards Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Companies Directory</h3>
          {companies.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
              <p className="text-gray-500 text-sm">No companies registered yet. Click &quot;Add New Company&quot; above to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((comp) => (
                <div key={comp.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{comp.name}</h4>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {comp.email || "N/A"}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {comp.phone || "N/A"}</p>
                    <p className="text-sm text-gray-600 mb-1"><strong>Location:</strong> {comp.location || "N/A"}</p>
                    <p className="text-sm text-gray-600 mb-4"><strong>Website:</strong> {comp.website || "N/A"}</p>
                  </div>
                  <div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center mb-3">
                      <button
                        onClick={() => handleEditClick(comp)}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => handleDelete(comp.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
                      >
                        Delete Company
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Registered on</span>
                      <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Company Modal */}
        {editingCompany && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Company</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingCompany(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}