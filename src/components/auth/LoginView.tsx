import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Landmark,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { USERS } from '../../data/mockData';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('collector.pune@gov.in');
  const [password, setPassword] = useState('Password@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter valid official credentials.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Find matching user or fallback to collector
      const matched = USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || USERS[0];
      setLoading(false);
      onLoginSuccess(matched);
    }, 400);
  };

  const handleQuickRoleSelect = (roleUser: User) => {
    setEmail(roleUser.email);
    setPassword('GovSecure@2026');
    onLoginSuccess(roleUser);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 text-slate-100">
      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center overflow-hidden">
            <img
              src="/src/assets/images/emblem_civic_seal_1793072367567.jpg"
              alt="Civic Seal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <Landmark className="w-5 h-5 text-blue-400 hidden only:block" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              LandGuard AI
              <span className="text-[10px] font-mono font-medium text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                NEXORA
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Department of Land Resources & District Administration
            </div>
          </div>
        </div>

        <div className="hidden sm:block text-right text-xs text-slate-400">
          <span className="font-semibold text-slate-300">National RFCTLARR Portal</span>
          <div className="text-[10px] text-slate-500">Statutory Land Acquisition Monitoring</div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-white">
            Authorized Officer Single Sign-On
          </h2>
          <p className="text-xs text-slate-400">
            Secure authentication for Collectors, LAOs, Tahsildars & Administrators
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Official Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.name@gov.in"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to registered NIC administrative email.')}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs text-xs mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with Secure Credentials'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Role Selectors for Review / Demonstration */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
            One-Click Role Demonstration Login:
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {USERS.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickRoleSelect(u)}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-left transition-colors group"
              >
                <div className="font-bold text-slate-200 group-hover:text-blue-400 truncate">
                  {u.role === 'collector' ? 'District Collector' : u.role === 'lao' ? 'Land Acq Officer' : u.role === 'tahsildar' ? 'Tahsildar' : 'State Admin'}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {u.district} District
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mx-auto py-2 text-center text-[11px] text-slate-500 border-t border-slate-800">
        LandGuard AI – NEXORA Predictive Monitoring Platform · Compliant with RFCTLARR Act 2013 · Human-in-the-Loop Governance
      </div>
    </div>
  );
};
