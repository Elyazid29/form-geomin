import { useCallback, useEffect, useState } from 'react';
import { BarChart2, Edit3, FileSpreadsheet, FileText, X } from 'lucide-react';
import RegisterForm from './components/RegisterForm';
import RegisterTable from './components/RegisterTable';
import { formConfig } from './constants/form';
import { REGISTER_TABLE, supabase } from './lib/supabase';
import type { RegisterAnswers, RegisterEntry } from './types';
import { exportRegistersToExcel } from './utils/exportExcel';

type ActiveTab = 'form' | 'table';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('form');
  const [registers, setRegisters] = useState<RegisterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRegisters = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from(REGISTER_TABLE)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      setErrorMessage(`Gagal memuat data register: ${error.message}`);
    } else {
      setRegisters((data ?? []) as RegisterEntry[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchRegisters();
  }, [fetchRegisters]);

  const createEntry = async (answers: RegisterAnswers) => {
    const { error } = await supabase.from(REGISTER_TABLE).insert([{ answers }]);

    if (error) {
      throw new Error(`Gagal menyimpan data: ${error.message}`);
    }

    await fetchRegisters();
  };

  const deleteEntry = async (entry: RegisterEntry) => {
    const label = entry.answers.nomor_surat || 'tanpa nomor';

    const confirmed = window.confirm(
      `Hapus data surat "${label}"?\n\nTindakan ini permanen dan tidak dapat dibatalkan.`,
    );
    if (!confirmed) return;

    const { error } = await supabase.from(REGISTER_TABLE).delete().eq('id', entry.id);

    if (error) {
      setErrorMessage(`Gagal menghapus data: ${error.message}`);
      return;
    }

    await fetchRegisters();
  };

  const handleExport = async () => {
    setExporting(true);
    setErrorMessage(null);

    try {
      await exportRegistersToExcel(registers);
    } catch {
      setErrorMessage('Gagal membuat file Excel. Silakan coba lagi.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-auto max-w-6xl flex-col items-center justify-between gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:px-6 sm:py-0">
          <div className="flex w-full items-center space-x-3 sm:w-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-geomin font-bold text-white shadow-md shadow-emerald-700/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-900 sm:text-lg">
                Register Surat &amp; Nota Dinas
              </h1>
              <p className="text-xs text-slate-500">Unit Geomin — ANTAM</p>
            </div>
          </div>

          <nav className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-1 sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center space-x-2 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-geomin shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>Input Form</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`flex items-center space-x-2 rounded-lg px-4 py-1.5 text-sm font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-white text-geomin shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Data Register</span>
              <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-geomin">
                {registers.length}
              </span>
            </button>
          </nav>

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting || registers.length === 0}
            className="flex items-center space-x-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>{exporting ? 'Menyiapkan...' : 'Ekspor Excel (.xlsx)'}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">
        {errorMessage && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Tutup pesan"
              className="text-rose-500 hover:text-rose-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {activeTab === 'form' ? (
          <RegisterForm
            config={formConfig}
            onSubmit={createEntry}
            onViewTable={() => setActiveTab('table')}
          />
        ) : (
          <RegisterTable
            registers={registers}
            loading={loading}
            exporting={exporting}
            onDelete={deleteEntry}
            onExport={handleExport}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Unit Geomin — Register Surat &amp; Nota Dinas
      </footer>
    </div>
  );
}
