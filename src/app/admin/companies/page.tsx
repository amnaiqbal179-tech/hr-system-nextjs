'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Globe, Mail, Phone, MapPin, X } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      const result = await res.json();
      if (result.success) {
        setCompanies(result.data);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name) return;

    setLoading(true);

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCompanies([data.data, ...companies]);
        setNewCompany({ name: '', email: '', phone: '', location: '', website: '' });
        setIsModalOpen(false);
      } else {
        alert(data.message || 'Failed to create company.');
      }
    } catch (error) {
      console.error('Error saving company:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
            <p className="text-sm text-gray-500">View and manage all corporate branches and offices.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#00A8CC] hover:bg-[#0092b3] text-white text-sm font-medium rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Company
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <div key={comp.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-[#00A8CC] rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-200">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{comp.name}</h3>
              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {comp.email || 'N/A'}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {comp.phone || 'N/A'}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {comp.location || 'N/A'}</p>
                <p className="flex items-center gap-2"><Globe className="w-4 h-4 text-gray-400" /> {comp.website || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Company</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Tech"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="info@company.com"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+92..."
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Lahore"
                    value={newCompany.location}
                    onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00A8CC]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-[#00A8CC] text-white text-sm font-medium rounded-xl cursor-pointer disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}