"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

 const handleLogout = () => {
    // Saari local aur session storage saaf karein
    localStorage.clear();
    sessionStorage.clear();
    
    // Browser cookie ko foran expire karein
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Hard reload ke sath logout API par bhejin taake cache ka koi chakar na rahe
    window.location.replace("/api/auth/logout");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4 min-h-screen">
      {/* Top Links */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-teal-700 px-2">Admin Portal</h2>
        <nav className="space-y-2">
          <Link 
            href="/admin/dashboard" 
            className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg font-medium transition"
          >
            Dashboard & Companies
          </Link>
          <Link 
            href="/admin/users" 
            className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg font-medium transition"
          >
            Manage HR Users
          </Link>
        </nav>
      </div>

      {/* Logout Button at Bottom */}
      <div className="pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-red-600 bg-red-50/50 hover:bg-red-50 rounded-lg transition font-semibold border border-red-100 cursor-pointer"
        >
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}