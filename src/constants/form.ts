import type { FormConfig } from '../types';

/**
 * Konfigurasi formulir register surat sesuai Lampiran 2 Unit Geomin.
 * Ubah di sini jika ada penambahan / pengurangan kolom.
 */
export const formConfig: FormConfig = {
  title: 'Form Register Surat dan Nota Dinas Unit Geomin',
  description:
    'Lampiran 2 - Formulir Pencatatan Register Surat Masuk & Surat Keluar / Nota Dinas Unit Geomin.',
  questions: [
    {
      id: 'nomor_surat',
      title: 'NOMOR SURAT / NOTA DINAS',
      type: 'short_text',
      required: true,
      placeholder: 'Contoh: 001/GEOMIN/2026',
    },
    {
      id: 'jenis_surat',
      title: 'JENIS',
      type: 'dropdown',
      required: true,
      options: ['MASUK', 'KELUAR'],
    },
    {
      id: 'tanggal',
      title: 'TANGGAL',
      type: 'date',
      required: true,
    },
    {
      id: 'perihal',
      title: 'PERIHAL',
      type: 'long_text',
      required: true,
      placeholder: 'Isi perihal surat atau nota dinas',
    },
    {
      id: 'tujuan_tembusan',
      title: 'TUJUAN / TEMBUSAN',
      type: 'short_text',
      required: true,
      placeholder: 'Penerima utama dan tembusan',
    },
    {
      id: 'satuan_kerja_konseptor',
      title: 'SATUAN KERJA KONSEPTOR',
      type: 'short_text',
      required: false,
      placeholder: 'Nama Satuan Kerja / Unit Konseptor',
    },
    {
      id: 'keterangan',
      title: 'KETERANGAN',
      type: 'long_text',
      required: false,
      placeholder: 'Catatan tambahan jika ada',
    },
  ],
};
