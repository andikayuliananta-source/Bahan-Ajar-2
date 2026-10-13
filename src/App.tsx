import React, { useState, useEffect } from 'react';
import {
  ModulAjarDocument,
  KokurikulerProgramDocument,
  SchoolProfile,
  UserProfile,
  UserRole
} from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ModulWizard } from './components/ModulWizard';
import { DocumentPreview } from './components/DocumentPreview';
import { KokurikulerWizard } from './components/KokurikulerWizard';
import { KokurikulerPreview } from './components/KokurikulerPreview';
import { AsesmenManager } from './components/AsesmenManager';
import { DeepLearningGuide } from './components/DeepLearningGuide';
import { CpTpManager } from './components/CpTpManager';
import { RemedialManager } from './components/RemedialManager';
import { TemplateBank } from './components/TemplateBank';
import { MyDocumentsView } from './components/MyDocumentsView';
import { KepalaSekolahReview } from './components/KepalaSekolahReview';
import { SettingsModal } from './components/SettingsModal';
import { ValidatorModal } from './components/ValidatorModal';
import { AIRefineModal } from './components/AIRefineModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [user, setUser] = useState<UserProfile>(StorageService.getUserProfile());
  const [school, setSchool] = useState<SchoolProfile>(StorageService.getSchoolProfile());
  const [modules, setModules] = useState<ModulAjarDocument[]>([]);
  const [programs, setPrograms] = useState<KokurikulerProgramDocument[]>([]);

  // Modals & Sub-views
  const [previewingModule, setPreviewingModule] = useState<ModulAjarDocument | null>(null);
  const [previewingProgram, setPreviewingProgram] = useState<KokurikulerProgramDocument | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModulAjarDocument | null>(null);
  const [isKokurikulerWizardOpen, setIsKokurikulerWizardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);
  const [isAIRefineOpen, setIsAIRefineOpen] = useState(false);
  const [activeModForValidationOrRefine, setActiveModForValidationOrRefine] = useState<ModulAjarDocument | null>(null);

  // Load initial data
  const loadData = async () => {
    const loadedMods = await StorageService.getModules();
    const loadedProgs = await StorageService.getKokurikulerPrograms();
    setModules(loadedMods);
    setPrograms(loadedProgs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (role: UserRole) => {
    const updated = { ...user, role };
    setUser(updated);
    StorageService.saveUserProfile(updated);
    if (role === 'kepala_sekolah') {
      setActiveTab('supervisi');
    }
  };

  const handleStartNewModule = () => {
    setEditingModule(null);
    setPreviewingModule(null);
    setIsWizardOpen(true);
  };

  const handleEditModule = (mod: ModulAjarDocument) => {
    setEditingModule(mod);
    setPreviewingModule(null);
    setIsWizardOpen(true);
  };

  const handleModuleFinished = (mod: ModulAjarDocument) => {
    setIsWizardOpen(false);
    setEditingModule(null);
    loadData();
    setPreviewingModule(mod);
  };

  const handleStartNewProgram = () => {
    setPreviewingProgram(null);
    setIsKokurikulerWizardOpen(true);
  };

  const handleProgramFinished = (prog: KokurikulerProgramDocument) => {
    setIsKokurikulerWizardOpen(false);
    loadData();
    setPreviewingProgram(prog);
  };

  const handleUseTemplate = (tpl: ModulAjarDocument) => {
    setEditingModule({
      ...tpl,
      id: 'modul-' + Date.now(),
      title: tpl.title + ' (Salinan Guru)',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: school.teacherName || user.name
    });
    setIsWizardOpen(true);
  };

  const handleTransferCpTpToModule = (cp: string, tpList: string[]) => {
    setEditingModule({
      ...modules[0],
      id: 'modul-' + Date.now(),
      title: `Modul Ajar dari CP Terpilih`,
      cp,
      tpList,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        user={user}
        school={school}
        onRoleChange={handleRoleChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setPreviewingModule(null);
            setPreviewingProgram(null);
            setIsWizardOpen(false);
            setIsKokurikulerWizardOpen(false);
          }}
          role={user.role}
          moduleCount={modules.length}
          kokuCount={programs.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* View 1: Previewing Single Module */}
            {previewingModule ? (
              <DocumentPreview
                document={previewingModule}
                onBack={() => setPreviewingModule(null)}
                onOpenAIRefine={() => {
                  setActiveModForValidationOrRefine(previewingModule);
                  setIsAIRefineOpen(true);
                }}
                onOpenValidator={() => {
                  setActiveModForValidationOrRefine(previewingModule);
                  setIsValidatorOpen(true);
                }}
                onEdit={() => handleEditModule(previewingModule)}
              />
            ) : previewingProgram ? (
              /* View 2: Previewing Single Kokurikuler Program */
              <KokurikulerPreview
                program={previewingProgram}
                onBack={() => setPreviewingProgram(null)}
              />
            ) : isWizardOpen ? (
              /* View 3: Modul Ajar 9-Step Wizard */
              <ModulWizard
                school={school}
                user={user}
                initialModule={editingModule}
                onFinish={handleModuleFinished}
                onCancel={() => {
                  setIsWizardOpen(false);
                  setEditingModule(null);
                }}
              />
            ) : isKokurikulerWizardOpen ? (
              /* View 4: Kokurikuler Wizard */
              <KokurikulerWizard
                school={school}
                user={user}
                onFinish={handleProgramFinished}
                onCancel={() => setIsKokurikulerWizardOpen(false)}
              />
            ) : (
              /* Standard Tabs */
              <>
                {activeTab === 'dashboard' && (
                  <Dashboard
                    modules={modules}
                    programs={programs}
                    role={user.role}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onPreviewModule={(mod) => setPreviewingModule(mod)}
                    onPreviewProgram={(prog) => setPreviewingProgram(prog)}
                    onNewModule={handleStartNewModule}
                    onNewProgram={handleStartNewProgram}
                  />
                )}

                {activeTab === 'modul_ajar' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Modul Ajar Pembelajaran Mendalam</h2>
                        <p className="text-xs text-slate-500">
                          Rancang Modul Ajar berstandar 8–3–3–4 Kemendikdasmen secara komprehensif.
                        </p>
                      </div>
                      <button
                        onClick={handleStartNewModule}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 cursor-pointer"
                      >
                        + Buat Modul Ajar Baru
                      </button>
                    </div>

                    <MyDocumentsView
                      modules={modules}
                      programs={[]}
                      onPreviewModule={(m) => setPreviewingModule(m)}
                      onPreviewProgram={(p) => setPreviewingProgram(p)}
                      onEditModule={handleEditModule}
                      onNewModule={handleStartNewModule}
                      onNewProgram={handleStartNewProgram}
                      onRefresh={loadData}
                    />
                  </div>
                )}

                {activeTab === 'cp_tp' && (
                  <CpTpManager onTransferToModule={handleTransferCpTpToModule} />
                )}

                {activeTab === 'deep_learning' && (
                  <DeepLearningGuide />
                )}

                {activeTab === 'asesmen' && (
                  <AsesmenManager />
                )}

                {activeTab === 'rubrik' && (
                  <AsesmenManager />
                )}

                {activeTab === 'remedial' && (
                  <RemedialManager />
                )}

                {activeTab === 'kokurikuler' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Program Kokurikuler Lintas Mapel</h2>
                        <p className="text-xs text-slate-500">
                          Integrasi 8 Dimensi Profil Lulusan dan 7 Kebiasaan Anak Indonesia Hebat.
                        </p>
                      </div>
                      <button
                        onClick={handleStartNewProgram}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        + Susun Program Kokurikuler
                      </button>
                    </div>

                    <MyDocumentsView
                      modules={[]}
                      programs={programs}
                      onPreviewModule={(m) => setPreviewingModule(m)}
                      onPreviewProgram={(p) => setPreviewingProgram(p)}
                      onEditModule={handleEditModule}
                      onNewModule={handleStartNewModule}
                      onNewProgram={handleStartNewProgram}
                      onRefresh={loadData}
                    />
                  </div>
                )}

                {activeTab === 'bank_template' && (
                  <TemplateBank onUseTemplate={handleUseTemplate} />
                )}

                {activeTab === 'ai_generator' && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center max-w-xl mx-auto my-8">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold">AI</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        Generator Cepat Sekali Klik
                      </h3>
                      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Mulai penyusunan instan dengan wizard otomatis yang mengisi seluruh sintaks 8-3-3-4 secara kohesif.
                      </p>
                      <button
                        onClick={handleStartNewModule}
                        className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                      >
                        Buka Generator Modul Ajar
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'my_documents' && (
                  <MyDocumentsView
                    modules={modules}
                    programs={programs}
                    onPreviewModule={(m) => setPreviewingModule(m)}
                    onPreviewProgram={(p) => setPreviewingProgram(p)}
                    onEditModule={handleEditModule}
                    onNewModule={handleStartNewModule}
                    onNewProgram={handleStartNewProgram}
                    onRefresh={loadData}
                  />
                )}

                {activeTab === 'supervisi' && (
                  <KepalaSekolahReview
                    modules={modules}
                    programs={programs}
                    onPreviewModule={(m) => setPreviewingModule(m)}
                    onPreviewProgram={(p) => setPreviewingProgram(p)}
                    onRefresh={loadData}
                  />
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-4">
                      Konfigurasi Satuan Pendidikan
                    </h3>
                    <p className="text-xs text-slate-600 mb-6">
                      Data ini akan otomatis tercantum pada Kop Surat resmi dokumen dan kolom tanda tangan.
                    </p>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Buka Form Pengaturan Lengkap
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>

      {/* Global Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          school={school}
          user={user}
          onClose={() => setIsSettingsOpen(false)}
          onSave={(updatedSchool, updatedUser) => {
            setSchool(updatedSchool);
            setUser(updatedUser);
          }}
        />
      )}

      {/* Global 17-Point Quality Validator Modal */}
      {isValidatorOpen && activeModForValidationOrRefine && (
        <ValidatorModal
          document={activeModForValidationOrRefine}
          onClose={() => {
            setIsValidatorOpen(false);
            setActiveModForValidationOrRefine(null);
          }}
          onRefineWithPrompt={(prompt) => {
            setIsValidatorOpen(false);
            setIsAIRefineOpen(true);
          }}
        />
      )}

      {/* Global AI Prompt Builder (Refine Modal) */}
      {isAIRefineOpen && activeModForValidationOrRefine && (
        <AIRefineModal
          document={activeModForValidationOrRefine}
          onClose={() => {
            setIsAIRefineOpen(false);
            setActiveModForValidationOrRefine(null);
          }}
          onUpdate={(refined) => {
            setPreviewingModule(refined);
            loadData();
          }}
        />
      )}
    </div>
  );
}
