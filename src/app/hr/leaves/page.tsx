"use client";

import { useRouter } from "next/navigation";

export default function LeavesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Attendance & Leave Requests</h2>
          <button
            onClick={() => router.push("/hr/dashboard")}
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            ← Back to Dashboard
          </button>
        </div>
        <p className="text-gray-600">Here HR can view pending leave applications and approve or reject them.</p>
      </div>
    </div>
  );
}