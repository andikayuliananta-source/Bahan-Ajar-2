import React, { useState } from 'react';
import { Sparkles, School, User, ShieldCheck, LogIn, LogOut, Settings, Award } from 'lucide-react';
import { UserRole, UserProfile, SchoolProfile } from '../types';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

interface NavbarProps {
  user: UserProfile;
  school: SchoolProfile;
  onRoleChange: (role: UserRole) => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  school,
  onRoleChange,
  onOpenSettings,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.warn('Google sign-in popup closed or bypassed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                  PENDEKAR MODUL AJAR & KOKURIKULER AI
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Kemendikdasmen 8–3–3–4
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Merancang Pembelajaran Mendalam • <span className="text-slate-600 font-semibold">Dev: Andika Yuliananta, S.Pd.</span>
              </p>
            </div>
          </div>

          {/* School Badge & User Role Bar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* School identity badge */}
            <div 
              onClick={onOpenSettings}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 cursor-pointer transition-colors"
              title="Klik untuk konfigurasi identitas sekolah"
            >
              <School className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold max-w-[160px] truncate">{school.schoolName || 'Satuan Pendidikan'}</span>
              <span className="text-[10px] text-slate-400">NPSN: {school.npsn || '-'}</span>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => onRoleChange('guru')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  user.role === 'guru'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Beralih ke tampilan Guru"
              >
                Guru
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('kepala_sekolah')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  user.role === 'kepala_sekolah'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Beralih ke tampilan Kepala Sekolah (Supervisi)"
              >
                Kepsek
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('admin')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  user.role === 'admin'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Beralih ke tampilan Administrator"
              >
                Admin
              </button>
            </div>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
              title="Pengaturan Profil Sekolah & Guru"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Auth button */}
            {auth.currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:inline-block text-xs font-medium text-slate-700 truncate max-w-[120px]">
                  {auth.currentUser.displayName || auth.currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                  title="Keluar dari akun Firebase"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isSigningIn ? 'Masuk...' : 'Masuk Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
