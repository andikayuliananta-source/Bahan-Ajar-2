import React, { useState } from 'react';
import { Settings, X, Save, School, User, CheckCircle2 } from 'lucide-react';
import { SchoolProfile, UserProfile } from '../types';
import { StorageService } from '../services/storageService';

interface SettingsModalProps {
  school: SchoolProfile;
  user: UserProfile;
  onClose: () => void;
  onSave: (school: SchoolProfile, user: UserProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  school,
  user,
  onClose,
  onSave,
}) => {
  const [schoolData, setSchoolData] = useState<SchoolProfile>({ ...school });
  const [userData, setUserData] = useState<UserProfile>({ ...user });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSchoolProfile(schoolData);
    StorageService.saveUserProfile(userData);
    onSave(schoolData, userData);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pengaturan Profil Sekolah & Guru</h3>
              <p className="text-xs text-slate-400">Data otomatis dicantumkan pada Kop Surat & Tanda Tangan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profil berhasil disimpan!</span>
            </div>
          )}

          {/* School Profile */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <School className="w-4 h-4 text-blue-600" />
              Identitas Satuan Pendidikan
            </h4>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan / Sekolah</label>
              <input
                type="text"
                required
                value={schoolData.schoolName}
                onChange={(e) => setSchoolData({ ...schoolData, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
                <input
                  type="text"
                  required
                  value={schoolData.npsn}
                  onChange={(e) => setSchoolData({ ...schoolData, npsn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kabupaten / Kota</label>
                <input
                  type="text"
                  value={schoolData.city}
                  onChange={(e) => setSchoolData({ ...schoolData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Sekolah</label>
              <input
                type="text"
                value={schoolData.address}
                onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolData.headmasterName}
                  onChange={(e) => setSchoolData({ ...schoolData, headmasterName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolData.headmasterNip}
                  onChange={(e) => setSchoolData({ ...schoolData, headmasterNip: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Teacher Profile */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <User className="w-4 h-4 text-emerald-600" />
              Identitas Pendidik (Guru)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Guru (dengan Gelar)</label>
                <input
                  type="text"
                  required
                  value={schoolData.teacherName}
                  onChange={(e) => {
                    setSchoolData({ ...schoolData, teacherName: e.target.value });
                    setUserData({ ...userData, name: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Guru</label>
                <input
                  type="text"
                  value={schoolData.teacherNip}
                  onChange={(e) => {
                    setSchoolData({ ...schoolData, teacherNip: e.target.value });
                    setUserData({ ...userData, nip: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
