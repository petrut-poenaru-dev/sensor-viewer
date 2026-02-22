import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { SensorDataRow, SensorDataset } from '../models/multi-sensor.model';

@Injectable({ providedIn: 'root' })
export class MultiSensorImportService {

  /**
   * Parsează un fișier CSV pentru un senzor
   */
  parseSensorCSV(csvText: string, sensorName: string): SensorDataset {
    // Găsește linia cu header-ul real (conține "Date-and-time")
    const lines = csvText.split('\n');
    let headerLineIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Date-and-time') || lines[i].includes('Date-and')) {
        headerLineIndex = i;
        break;
      }
    }

    if (headerLineIndex === -1) {
      throw new Error(`CSV ${sensorName}: Nu s-a găsit header-ul cu "Date-and-time"`);
    }

    // Extrage doar liniile de la header în jos
    const csvWithoutMetadata = lines.slice(headerLineIndex).join('\n');

    const result = Papa.parse(csvWithoutMetadata, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false
    });

    if (result.errors.length > 0) {
      throw new Error(`Eroare la parsare CSV ${sensorName}: ${result.errors[0].message}`);
    }

    if (result.data.length === 0) {
      throw new Error(`CSV ${sensorName}: Nu conține date`);
    }

    // Debug: afișează header-ul găsit
    const firstRow = result.data[0] as any;
    console.log(`[${sensorName}] Coloane găsite în CSV:`, Object.keys(firstRow));

    const rows: SensorDataRow[] = [];
    
    for (const row of result.data as any[]) {
      // Găsește coloana de timestamp (poate fi "Date-and-time" sau variații)
      const timestampKey = Object.keys(row).find(k => 
        k.toLowerCase().includes('date') || k.toLowerCase().includes('time')
      );

      if (!timestampKey || !row[timestampKey]) {
        continue; // Skip rânduri fără timestamp
      }

      // Găsește coloanele pentru fiecare parametru (case-insensitive și cu spații)
      const findColumn = (possibleNames: string[]): string | undefined => {
        return Object.keys(row).find(k => {
          const normalized = k.toLowerCase().trim();
          return possibleNames.some(name => normalized.includes(name.toLowerCase()));
        });
      };

      const distanceKey = findColumn(['distance', 'dist']);
      const signalKey = findColumn(['signalstrength', 'signal']);
      const gainKey = findColumn(['gain']);
      const tempLaserKey = findColumn(['temperaturelaser', 'templaser']);
      const tempTiltKey = findColumn(['temperaturetilt', 'temptilt']);
      const xTiltKey = findColumn(['xaxistilt', 'xtilt']);
      const yTiltKey = findColumn(['yaxistilt', 'ytilt']);
      const zTiltKey = findColumn(['zaxistilt', 'ztilt']);
      const xStdKey = findColumn(['xaxisstd', 'xstd']);
      const yStdKey = findColumn(['yaxisstd', 'ystd']);
      const zStdKey = findColumn(['zaxisstd', 'zstd']);

      try {
        const parsedRow: SensorDataRow = {
          timestamp: this.parseTimestamp(row[timestampKey]),
          distance: distanceKey ? this.parseNumber(row[distanceKey]) : 0,
          signalStrength: signalKey ? this.parseNumber(row[signalKey]) : 0,
          gain: gainKey ? this.parseNumber(row[gainKey]) : 0,
          temperatureLaser: tempLaserKey ? this.parseNumber(row[tempLaserKey]) : 0,
          temperatureTilt: tempTiltKey ? this.parseNumber(row[tempTiltKey]) : 0,
          xaxisTilt: xTiltKey ? this.parseNumber(row[xTiltKey]) : 0,
          yaxisTilt: yTiltKey ? this.parseNumber(row[yTiltKey]) : 0,
          zaxisTilt: zTiltKey ? this.parseNumber(row[zTiltKey]) : 0,
          xaxisStd: xStdKey ? this.parseNumber(row[xStdKey]) : 0,
          yaxisStd: yStdKey ? this.parseNumber(row[yStdKey]) : 0,
          zaxisStd: zStdKey ? this.parseNumber(row[zStdKey]) : 0
        };

        rows.push(parsedRow);
      } catch (error: any) {
        console.warn(`Skip rând cu eroare: ${error.message}`);
      }
    }

    if (rows.length === 0) {
      throw new Error(`CSV ${sensorName}: Nu s-au putut parsa date valide`);
    }

    // Debug: afișează primele 3 rânduri parsate
    console.log(`[${sensorName}] Parsate ${rows.length} rânduri. Primele 3:`, rows.slice(0, 3));

    return {
      name: sensorName,
      rows
    };
  }

  /**
   * Parsează timestamp din format CSV
   * Format: "1/20/2026 14:10" sau "20.01.2026 14:10"
   */
  private parseTimestamp(value: string): Date {
    if (!value) throw new Error('Timestamp lipsă');

    // Încearcă format american: M/D/YYYY H:mm
    if (value.includes('/')) {
      const [datePart, timePart] = value.split(' ');
      const [month, day, year] = datePart.split('/').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hour, minute);
    }

    // Încearcă format european: DD.MM.YYYY H:mm
    if (value.includes('.')) {
      const [datePart, timePart] = value.split(' ');
      const [day, month, year] = datePart.split('.').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hour, minute);
    }

    // Fallback: încearcă Date.parse
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Format timestamp invalid: ${value}`);
    }
    return date;
  }

  /**
   * Parsează număr din string
   */
  private parseNumber(value: string | number): number {
    if (typeof value === 'number') return value;
    if (!value || value === '') return 0;
    
    // Înlocuiește virgula cu punct pentru zecimale
    const cleaned = value.toString().replace(',', '.');
    const num = parseFloat(cleaned);
    
    if (isNaN(num)) return 0;
    return num;
  }

  /**
   * Validează că toate CSV-urile au timestamp-uri compatibile
   */
  validateTimestamps(datasets: (SensorDataset | null)[]): boolean {
    const validDatasets = datasets.filter(ds => ds !== null) as SensorDataset[];
    
    if (validDatasets.length === 0) return false;

    // Verifică că există cel puțin un timestamp comun
    const firstTimestamps = new Set(
      validDatasets[0].rows.map(r => r.timestamp.getTime())
    );

    for (let i = 1; i < validDatasets.length; i++) {
      const hasCommon = validDatasets[i].rows.some(r => 
        firstTimestamps.has(r.timestamp.getTime())
      );
      
      if (!hasCommon) {
        return false;
      }
    }

    return true;
  }
}
