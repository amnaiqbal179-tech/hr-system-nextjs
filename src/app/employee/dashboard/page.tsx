"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Leave application state
  const [leaveType, setLeaveType] = useState("Sick Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const currentUserId = parsedUser?.id || parsedUser?._id;
      
      if (parsedUser && currentUserId) {
        setUserId(currentUserId);
        fetchAllData(currentUserId);
      } else {
        router.push("/login");
      }
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  const fetchAllData = async (currentUserId: string) => {
    try {
      // 1. Fetch Profile & Projects
      const profileRes = await fetch(`/api/employee/profile?userId=${currentUserId}`);
      const profileData = await profileRes.json();
      if (profileData.success) {
        setEmployee(profileData.employee);
      }

      // 2. Fetch Leaves
      const leaveRes = await fetch(`/api/employee/leave?userId=${currentUserId}`);
      const leaveData = await leaveRes.json();
      if (leaveData.success) {
        setLeaves(leaveData.leaves);
      }

      // 3. Fetch Salaries
      const salaryRes = await fetch(`/api/employee/salaries?userId=${currentUserId}`);
      const salaryData = await salaryRes.json();
      if (salaryData.success) {
        setSalaries(salaryData.salaries);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/employee/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, leaveType, startDate, endDate, reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit leave");

      alert("Leave application submitted successfully!");
      setStartDate("");
      setEndDate("");
      setReason("");
      fetchAllData(userId);
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Secure Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-teal-700 font-semibold text-lg animate-pulse">Loading Employee Dashboard...</p>
      </div>
    );
  }

  const latestSalary = salaries.length > 0 ? salaries[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-teal-700 mb-8">Employee Portal</h1>
          <nav className="space-y-2">
            <Link
              href="/employee/dashboard"
              className="block py-2.5 px-4 rounded-lg font-medium bg-teal-50 text-teal-700 transition"
            >
              My Dashboard
            </Link>
          </nav>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-lg text-red-600 hover:bg-red-50 font-medium transition text-center"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {employee ? employee.name : "Employee"}
            </h2>
            <p className="text-sm text-gray-500">
              Company: {employee?.company?.name || "N/A"} | Designation: {employee?.designation?.title || "Staff"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
            {employee && employee.name ? employee.name.charAt(0).toUpperCase() : "E"}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Leave Requests</p>
            <h3 className="text-3xl font-bold text-teal-600 mt-2">{leaves.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Latest Salary</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">
              {latestSalary ? `$${latestSalary.amount}` : "Not Assigned"}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Assigned Projects</p>
            <h3 className="text-3xl font-bold text-teal-700 mt-2">
              {employee?.projects?.length || 0}
            </h3>
          </div>
        </div>

        {/* Grid for Leave Application & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Apply for Leave Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for Leave</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly explain the reason for leave..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-teal-600"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition shadow-md disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Leave Application"}
              </button>
            </form>
          </div>

          {/* Leave History List */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Leave History</h3>
            {leaves.length === 0 ? (
              <p className="text-gray-500 text-sm">No leave applications found.</p>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {leaves.map((leave) => (
                  <div key={leave.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{leave.leaveType}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">{leave.reason}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      leave.status === "Approved" ? "bg-green-50 text-green-700" :
                      leave.status === "Rejected" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section for Assigned Projects & Salary History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned Projects */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Assigned Projects</h3>
            {!employee?.projects || employee.projects.length === 0 ? (
              <p className="text-gray-500 text-sm">No projects assigned yet.</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {employee.projects.map((proj: any) => (
                  <div key={proj.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900 text-sm">{proj.title}</h4>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{proj.description || "No description provided."}</p>
                    {proj.deadline && (
                      <p className="text-xs text-gray-500 mt-2">
                        Deadline: {new Date(proj.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Salary History */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary History</h3>
            {salaries.length === 0 ? (
              <p className="text-gray-500 text-sm">No salary records found.</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {salaries.map((sal: any) => (
                  <div key={sal.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Amount: ${sal.amount}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Bonus: ${sal.bonus} | Deductions: ${sal.deductions}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Date: {new Date(sal.payDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                      {sal.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}