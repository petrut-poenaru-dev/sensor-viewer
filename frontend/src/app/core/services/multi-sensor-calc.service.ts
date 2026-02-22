import { Injectable } from '@angular/core';
import {
  CalcParameters,
  CalcResult,
  MultiSensorData,
  SensorDataRow,
  SensorDataset
} from '../models/multi-sensor.model';

@Injectable({ providedIn: 'root' })
export class MultiSensorCalcService {

  /**
   * Calculează rezultatele pentru toate timestamp-urile comune
   */
  calculateResults(
    data: MultiSensorData,
    params: CalcParameters
  ): CalcResult[] {
    if (!params.referenceTimestamp) {
      return [];
    }

    // Obține toate timestamp-urile unice din toate dataset-urile
    const allTimestamps = this.getAllTimestamps(data);
    
    // Calculează pentru fiecare timestamp
    return allTimestamps.map(ts => this.calculateForTimestamp(ts, data, params));
  }

  /**
   * Calculează rezultatul pentru un singur timestamp
   */
  private calculateForTimestamp(
    timestamp: Date,
    data: MultiSensorData,
    params: CalcParameters
  ): CalcResult {
    const refTs = params.referenceTimestamp!;

    // Găsește valorile pentru timestamp-ul curent și referință
    const z1Current = this.findRowByTimestamp(data.z1, timestamp);
    const z1Ref = this.findRowByTimestamp(data.z1, refTs);
    
    const z2Current = this.findRowByTimestamp(data.z2, timestamp);
    const z2Ref = this.findRowByTimestamp(data.z2, refTs);
    
    const z3Current = this.findRowByTimestamp(data.z3, timestamp);
    const z3Ref = this.findRowByTimestamp(data.z3, refTs);
    
    const z4Current = this.findRowByTimestamp(data.z4, timestamp);
    const z4Ref = this.findRowByTimestamp(data.z4, refTs);
    
    const xCurrent = this.findRowByTimestamp(data.x, timestamp);
    const xRef = this.findRowByTimestamp(data.x, refTs);
    
    const yCurrent = this.findRowByTimestamp(data.y, timestamp);
    const yRef = this.findRowByTimestamp(data.y, refTs);

    // Calculează delta-urile
    const z1Delta = this.calculateDelta(z1Current, z1Ref, params, 'z');
    const z2Delta = this.calculateDelta(z2Current, z2Ref, params, 'z');
    const z3Delta = this.calculateDelta(z3Current, z3Ref, params, 'z');
    const z4Delta = this.calculateDelta(z4Current, z4Ref, params, 'z');
    const xDelta = this.calculateDelta(xCurrent, xRef, params, 'x');
    const yDelta = this.calculateDelta(yCurrent, yRef, params, 'y');

    // Calculează ondulație, înclinări, twist
    const zDeltas = [z1Delta, z2Delta, z3Delta, z4Delta].filter(v => v !== null) as number[];
    
    const ondulatie = zDeltas.length > 0 
      ? Math.max(...zDeltas) - Math.min(...zDeltas) 
      : null;

    const inclinareL = zDeltas.length === 4
      ? (((z4Delta! + z3Delta!) / 2) - ((z1Delta! + z2Delta!) / 2)) / params.L
      : null;

    const inclinareLowerL = zDeltas.length === 4
      ? (((z2Delta! + z4Delta!) / 2) - ((z1Delta! + z3Delta!) / 2)) / params.l
      : null;

    const twist = zDeltas.length === 4
      ? ((z1Delta! + z3Delta!) / 2) - ((z2Delta! + z4Delta!) / 2)
      : null;

    // Direcție mișcare
    const directieMiscare = this.calculateDirectieMiscare(xDelta, yDelta);

    // Temperature medii
    const tempLaserMedie = this.calculateAverageTemp(
      [z1Current, z2Current, z3Current, z4Current, xCurrent, yCurrent],
      'laser'
    );

    const tempTiltMedie = this.calculateAverageTemp(
      [z1Current, z2Current, z3Current, z4Current, xCurrent, yCurrent],
      'tilt'
    );

    // Semnal OK?
    const semnalOk = this.checkSemnalOk(
      [z1Current, z2Current, z3Current, z4Current, xCurrent, yCurrent],
      params.signalThreshold
    );

    // Std tilt OK?
    const stdTiltOk = this.checkStdTiltOk(
      [z1Current, z2Current, z3Current, z4Current, xCurrent, yCurrent],
      params.stdTiltThreshold
    );

    return {
      timestamp,
      z1Delta,
      z2Delta,
      z3Delta,
      z4Delta,
      xDelta,
      yDelta,
      ondulatie,
      inclinareL,
      inclinareLowerL,
      twist,
      directieMiscare,
      tempLaserMedie,
      tempTiltMedie,
      semnalOk,
      stdTiltOk,
      note: ''
    };
  }

  /**
   * Formula Excel pentru delta:
   * =IFERROR(IF($B$4="m";(current-ref)*1000;(current-ref)))*direction
   */
  private calculateDelta(
    current: SensorDataRow | null,
    ref: SensorDataRow | null,
    params: CalcParameters,
    axis: 'x' | 'y' | 'z'
  ): number | null {
    if (!current || !ref) return null;

    const delta = current.distance - ref.distance;
    const deltaInMm = params.unit === 'm' ? delta * 1000 : delta;

    // Aplică direcția
    let direction = 1;
    if (axis === 'x') {
      direction = params.directionX === 'SPATE' ? 1 : -1;
    } else if (axis === 'y') {
      direction = params.directionY === 'DREAPTA' ? 1 : -1;
    } else if (axis === 'z') {
      direction = params.directionZ === 'IN JOS' ? -1 : 1;
    }

    const result = deltaInMm * direction;
    
    // Debug pentru primul calcul
    if (axis === 'z') {
      console.log(`Delta ${axis}:`, {
        currentDistance: current.distance,
        refDistance: ref.distance,
        delta,
        deltaInMm,
        direction,
        result
      });
    }

    return result;
  }

  /**
   * Formula Excel pentru direcție mișcare
   */
  private calculateDirectieMiscare(xDelta: number | null, yDelta: number | null): string {
    if (xDelta === null && yDelta === null) return '';

    const parts: string[] = [];

    if (xDelta !== null && xDelta !== 0) {
      if (xDelta > 0) {
        parts.push(`SPATE ${Math.abs(xDelta).toFixed(1)} mm`);
      } else {
        parts.push(`FATA ${Math.abs(xDelta).toFixed(1)} mm`);
      }
    }

    if (yDelta !== null && yDelta !== 0) {
      if (yDelta > 0) {
        parts.push(`DREAPTA ${Math.abs(yDelta).toFixed(1)} mm`);
      } else {
        parts.push(`STANGA ${Math.abs(yDelta).toFixed(1)} mm`);
      }
    }

    return parts.join(', ');
  }

  /**
   * Calculează media temperaturilor
   */
  private calculateAverageTemp(
    rows: (SensorDataRow | null)[],
    type: 'laser' | 'tilt'
  ): number | null {
    const values = rows
      .filter(r => r !== null)
      .map(r => type === 'laser' ? r!.temperatureLaser : r!.temperatureTilt)
      .filter(v => v !== null && !isNaN(v));

    if (values.length === 0) return null;

    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Formula Excel pentru Semnal OK:
   * Verifică dacă toate semnalele sunt >= prag
   */
  private checkSemnalOk(
    rows: (SensorDataRow | null)[],
    threshold: number
  ): 'OK' | 'NU' | '' {
    const signals = rows
      .filter(r => r !== null)
      .map(r => r!.signalStrength);

    if (signals.length === 0) return '';

    const minSignal = Math.min(...signals);
    return minSignal >= threshold ? 'OK' : 'NU';
  }

  /**
   * Formula Excel pentru Std tilt OK:
   * Verifică dacă MAX(ABS(ZaxisStd)) <= prag
   */
  private checkStdTiltOk(
    rows: (SensorDataRow | null)[],
    threshold: number
  ): 'OK' | 'NU' | '' {
    const stdValues = rows
      .filter(r => r !== null)
      .map(r => Math.abs(r!.zaxisStd));

    if (stdValues.length === 0) return '';

    const maxStd = Math.max(...stdValues);
    return maxStd <= threshold ? 'OK' : 'NU';
  }

  /**
   * Găsește rândul pentru un timestamp specific
   */
  private findRowByTimestamp(
    dataset: SensorDataset | null,
    timestamp: Date
  ): SensorDataRow | null {
    if (!dataset) return null;

    return dataset.rows.find(row => 
      row.timestamp.getTime() === timestamp.getTime()
    ) || null;
  }

  /**
   * Obține toate timestamp-urile unice din toate dataset-urile
   */
  private getAllTimestamps(data: MultiSensorData): Date[] {
    const timestampSet = new Set<number>();

    [data.z1, data.z2, data.z3, data.z4, data.x, data.y]
      .filter(ds => ds !== null)
      .forEach(ds => {
        ds!.rows.forEach(row => {
          timestampSet.add(row.timestamp.getTime());
        });
      });

    return Array.from(timestampSet)
      .sort((a, b) => a - b)
      .map(ts => new Date(ts));
  }
}
