import { Download, Trash2 } from 'lucide-react';
import type { RegisterEntry } from '../types';

interface RegisterTableProps {
  registers: RegisterEntry[];
  loading: boolean;
  exporting: boolean;
  onDelete: (entry: RegisterEntry) => void;
  onExport: () => void;
}

export default function RegisterTable({
  registers,
  loading,
  exporting,
  onDelete,
  onExport,
}: RegisterTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Form Register Surat dan Nota Dinas</h2>
          <p className="text-xs text-slate-500">
            Unit Geomin — Total: {registers.length} dokumen terdaftar
          </p>
        </div>

        <button
          type="button"
          onClick={onExport}
          disabled={exporting || registers.length === 0}
          className="flex items-center space-x-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          <Download className="h-4 w-4" />
          <span>{exporting ? 'Menyiapkan...' : 'Unduh File Excel (.XLSX)'}</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 font-bold uppercase text-slate-700">
                <th className="w-12 border-r border-slate-300 p-3 text-center">NO</th>
                <th className="min-w-[160px] border-r border-slate-300 p-3">
                  NOMOR SURAT / NOTA DINAS
                </th>
                <th className="min-w-[90px] border-r border-slate-300 p-3 text-center">JENIS</th>
                <th className="min-w-[110px] border-r border-slate-300 p-3">TANGGAL</th>
                <th className="min-w-[200px] border-r border-slate-300 p-3">PERIHAL</th>
                <th className="min-w-[160px] border-r border-slate-300 p-3">TUJUAN / TEMBUSAN</th>
                <th className="min-w-[160px] border-r border-slate-300 p-3">
                  SATUAN KERJA KONSEPTOR
                </th>
                <th className="min-w-[150px] border-r border-slate-300 p-3">KETERANGAN</th>
                <th className="p-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Memuat data register...
                  </td>
                </tr>
              ) : registers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    Belum ada data surat yang dicatat. Silakan gunakan tab &quot;Input Form&quot;.
                  </td>
                </tr>
              ) : (
                registers.map((entry, index) => {
                  const answers = entry.answers;

                  return (
                    <tr key={entry.id} className="transition-colors hover:bg-slate-50">
                      <td className="border-r border-slate-200 p-3 text-center font-bold text-slate-500">
                        {index + 1}
                      </td>
                      <td className="border-r border-slate-200 p-3 font-semibold text-slate-900">
                        {answers.nomor_surat || '-'}
                      </td>
                      <td className="border-r border-slate-200 p-3 text-center">
                        <span
                          className={`rounded px-2 py-1 text-[10px] font-bold ${
                            answers.jenis_surat === 'MASUK'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {answers.jenis_surat || '-'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap border-r border-slate-200 p-3">
                        {answers.tanggal || '-'}
                      </td>
                      <td className="border-r border-slate-200 p-3">{answers.perihal || '-'}</td>
                      <td className="border-r border-slate-200 p-3">
                        {answers.tujuan_tembusan || '-'}
                      </td>
                      <td className="border-r border-slate-200 p-3">
                        {answers.satuan_kerja_konseptor || '-'}
                      </td>
                      <td className="border-r border-slate-200 p-3">{answers.keterangan || '-'}</td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => onDelete(entry)}
                          aria-label={`Hapus surat ${answers.nomor_surat}`}
                          title="Hapus data"
                          className="text-rose-500 transition-colors hover:text-rose-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
