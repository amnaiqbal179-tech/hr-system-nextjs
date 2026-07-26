"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEmployeePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "EMPLOYEE",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add employee");

      alert("Employee added successfully!");
      router.push("/hr/dashboard"); // Wapas dashboard par redirect kar dega
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
          <button
            onClick={() => router.push("/hr/dashboard")}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            ← Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ali Khan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ali@company.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-800 bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="HR">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary ($)</label>
              <input
                type="number"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600 text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition shadow-md disabled:opacity-50 mt-4"
          >
            {loading ? "Saving Employee..." : "Save and Register Employee"}
          </button>
        </form>
      </div>
    </div>
  );
}