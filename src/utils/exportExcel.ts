import type { RegisterEntry } from '../types';

interface Column {
  header: string;
  width: number;
  value: (entry: RegisterEntry) => string | number;
  align?: 'left' | 'center';
}

const COLUMNS: Column[] = [
  { header: 'NO', width: 6, value: (_entry) => 0, align: 'center' },
  {
    header: 'NOMOR SURAT / NOTA DINAS',
    width: 30,
    value: (entry) => entry.answers.nomor_surat,
  },
  { header: 'JENIS', width: 12, value: (entry) => entry.answers.jenis_surat, align: 'center' },
  { header: 'TANGGAL', width: 14, value: (entry) => entry.answers.tanggal, align: 'center' },
  { header: 'PERIHAL', width: 45, value: (entry) => entry.answers.perihal },
  { header: 'TUJUAN / TEMBUSAN', width: 30, value: (entry) => entry.answers.tujuan_tembusan },
  {
    header: 'SATUAN KERJA KONSEPTOR',
    width: 30,
    value: (entry) => entry.answers.satuan_kerja_konseptor,
  },
  { header: 'KETERANGAN', width: 35, value: (entry) => entry.answers.keterangan },
];

const thinBorder = {
  top: { style: 'thin', color: { rgb: '9CA3AF' } },
  bottom: { style: 'thin', color: { rgb: '9CA3AF' } },
  left: { style: 'thin', color: { rgb: '9CA3AF' } },
  right: { style: 'thin', color: { rgb: '9CA3AF' } },
};

const HEADER_STYLE = {
  font: { bold: true, sz: 10, color: { rgb: '065F46' } },
  fill: { patternType: 'solid', fgColor: { rgb: 'D1FAE5' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: thinBorder,
};

const bodyStyle = (align: 'left' | 'center') => ({
  font: { sz: 10 },
  alignment: { horizontal: align, vertical: 'top', wrapText: true },
  border: thinBorder,
});

/**
 * Ekspor seluruh data register ke file .xlsx.
 * Library Excel dimuat dinamis agar bundle awal tetap ringan.
 */
export async function exportRegistersToExcel(registers: RegisterEntry[]): Promise<void> {
  const XLSX = await import('xlsx-js-style');

  const headerRow = COLUMNS.map((column) => column.header);
  const dataRows = registers.map((entry, index) =>
    COLUMNS.map((column) => (column.header === 'NO' ? index + 1 : column.value(entry))),
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);

  worksheet['!cols'] = COLUMNS.map((column) => ({ wch: column.width }));
  worksheet['!rows'] = [{ hpt: 32 }];

  COLUMNS.forEach((column, colIndex) => {
    const headerAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    if (worksheet[headerAddress]) {
      worksheet[headerAddress].s = HEADER_STYLE;
    }

    for (let rowIndex = 1; rowIndex <= registers.length; rowIndex += 1) {
      const address = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      if (worksheet[address]) {
        worksheet[address].s = bodyStyle(column.align ?? 'left');
      }
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Register');

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Register_Surat_Geomin_${today}.xlsx`, { compression: true });
}
