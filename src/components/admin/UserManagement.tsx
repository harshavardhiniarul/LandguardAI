import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Mail,
  MapPin,
  Building,
  Plus,
  Search,
  Lock
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { USERS, DISTRICTS_LIST } from '../../data/mockData';

export const UserManagement: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>(USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('lao');
  const [newDistrict, setNewDistrict] = useState('Pune');
  const [newDesignation, setNewDesignation] = useState('Land Acquisition Officer');

  const filtered = usersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const created: User = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      designation: newDesignation.trim(),
      district: newRole === 'admin' ? 'All' : newDistrict,
      department: 'Revenue & Land Acquisition Administration',
      phone: '+91 98000 00000'
    };

    setUsersList([...usersList, created]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
  };

  const roleBadges: Record<UserRole, { title: string; style: string }> = {
    admin: { title: 'State Nodal Admin', style: 'bg-purple-100 text-purple-800' },
    collector: { title: 'District Collector', style: 'bg-blue-100 text-blue-800' },
    lao: { title: 'Land Acquisition Officer', style: 'bg-emerald-100 text-emerald-800' },
    tahsildar: { title: 'Tahsildar / Field Magistrate', style: 'bg-amber-100 text-amber-800' }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Administrative User Directory & Role-Based Access Control (RBAC)
          </h2>
          <p className="text-xs text-slate-500">
            District boundary jurisdictions · Statutory authorization matrix · Collector sanctions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Officer</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by officer name, district, or email..."
          className="w-full text-xs text-slate-900 bg-transparent focus:outline-none"
        />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="py-3 px-4">Officer Details</th>
              <th className="py-3 px-4">Role & Designation</th>
              <th className="py-3 px-4">District Jurisdiction</th>
              <th className="py-3 px-4">Department / Office</th>
              <th className="py-3 px-4 text-right">Access Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${roleBadges[user.role].style}`}>
                    {roleBadges[user.role].title}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-0.5">{user.designation}</div>
                </td>

                <td className="py-3.5 px-4 font-medium text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.district === 'All' ? 'Statewide (All Districts)' : `${user.district} District`}</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-slate-600">
                  {user.department}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Provision Authorized Revenue Officer
            </h3>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name & Honorific</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Smt. Neha R. Joshi, IAS"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Official NIC Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. lao.pune2@gov.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                  >
                    <option value="collector">District Collector</option>
                    <option value="lao">Land Acquisition Officer</option>
                    <option value="tahsildar">Tahsildar</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">District Boundary</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    disabled={newRole === 'admin'}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                  >
                    {DISTRICTS_LIST.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Designation</label>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                >
                  Create Officer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
