import { Injectable } from '@angular/core';
import Papa from 'papaparse';
import { Dataset, DatasetMeta, SensorRow } from '../models/dataset.model';

@Injectable({ providedIn: 'root' })
export class CsvImportService {
  parse(fileText: string): Dataset {
    const lines = fileText.split(/\r?\n/);

    const meta = this.extractMeta(lines);

    const headerLineIndex = lines.findIndex(l => l.includes('Date-and-time'));
    if (headerLineIndex < 0) {
      throw new Error('Nu găsesc header-ul "Date-and-time" în fișier.');
    }

    const csvBody = lines.slice(headerLineIndex).join('\n');

    const parsed = Papa.parse<Record<string, string>>(csvBody, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    if (parsed.errors?.length) {
      throw new Error(parsed.errors[0].message);
    }

    const rawRows = (parsed.data ?? []).filter(r => r['Date-and-time']);

    const columns = Object.keys(rawRows[0] ?? {}).filter(k => k !== 'Date-and-time');

    const rows: SensorRow[] = rawRows.map(r => ({
      timestamp: new Date(r['Date-and-time']),
      values: Object.fromEntries(
        columns.map(col => [col, this.toNumberOrNull(r[col])])
      ),
    }));

    return { meta, columns, rows };
  }

  private extractMeta(lines: string[]): DatasetMeta {

    const meta: DatasetMeta = {};
    for (const line of lines.slice(0, 30)) {
      const parts = line.split(',');
      if (parts.length < 2) continue;

      const key = parts[0]?.trim();
      const val = parts.slice(1).join(',').trim();

      if (key === 'Timezone') meta.timezone = val;
      if (key === 'Node ID') meta.nodeId = val;
      if (key === 'Model') meta.model = val;
      if (key === 'FW') meta.fw = val;
      if (key === 'HW') meta.hw = val;
      if (key === 'Started') meta.startedAt = val;
    }
    return meta;
  }

  private toNumberOrNull(v: unknown): number | null {
    if (v == null) return null;
    const s = String(v).trim();
    if (s === '') return null;


    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
}
