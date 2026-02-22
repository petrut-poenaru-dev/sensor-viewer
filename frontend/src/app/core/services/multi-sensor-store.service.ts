import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import {
  CalcParameters,
  CalcResult,
  MultiSensorData,
  SensorDataset
} from '../models/multi-sensor.model';
import { MultiSensorCalcService } from './multi-sensor-calc.service';

@Injectable({ providedIn: 'root' })
export class MultiSensorStoreService {
  // State pentru cele 6 CSV-uri
  private z1Subject = new BehaviorSubject<SensorDataset | null>(null);
  private z2Subject = new BehaviorSubject<SensorDataset | null>(null);
  private z3Subject = new BehaviorSubject<SensorDataset | null>(null);
  private z4Subject = new BehaviorSubject<SensorDataset | null>(null);
  private xSubject = new BehaviorSubject<SensorDataset | null>(null);
  private ySubject = new BehaviorSubject<SensorDataset | null>(null);

  // Parametri de configurare
  private parametersSubject = new BehaviorSubject<CalcParameters>({
    unit: 'm',
    L: 2,
    l: 4,
    signalThreshold: 70,
    stdTiltThreshold: 0.5,
    directionX: 'FATA',
    directionY: 'DREAPTA',
    directionZ: 'IN SUS',
    referenceTimestamp: null
  });

  // Observables publice
  readonly z1$ = this.z1Subject.asObservable();
  readonly z2$ = this.z2Subject.asObservable();
  readonly z3$ = this.z3Subject.asObservable();
  readonly z4$ = this.z4Subject.asObservable();
  readonly x$ = this.xSubject.asObservable();
  readonly y$ = this.ySubject.asObservable();
  readonly parameters$ = this.parametersSubject.asObservable();

  // Combined data
  readonly multiSensorData$: Observable<MultiSensorData> = combineLatest([
    this.z1$,
    this.z2$,
    this.z3$,
    this.z4$,
    this.x$,
    this.y$
  ]).pipe(
    map(([z1, z2, z3, z4, x, y]) => ({ z1, z2, z3, z4, x, y }))
  );

  // Rezultate calculate
  readonly calcResults$: Observable<CalcResult[]> = combineLatest([
    this.multiSensorData$,
    this.parameters$
  ]).pipe(
    map(([data, params]) => {
      if (!params.referenceTimestamp) return [];
      return this.calcService.calculateResults(data, params);
    })
  );

  // Status: câte CSV-uri sunt încărcate
  readonly loadedCount$: Observable<number> = this.multiSensorData$.pipe(
    map(data => {
      let count = 0;
      if (data.z1) count++;
      if (data.z2) count++;
      if (data.z3) count++;
      if (data.z4) count++;
      if (data.x) count++;
      if (data.y) count++;
      return count;
    })
  );

  // Timestamp-uri disponibile pentru T0
  readonly availableTimestamps$: Observable<Date[]> = this.multiSensorData$.pipe(
    map(data => {
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
    })
  );

  constructor(private calcService: MultiSensorCalcService) {}

  // Setters pentru fiecare senzor
  setZ1(dataset: SensorDataset | null): void {
    this.z1Subject.next(dataset);
  }

  setZ2(dataset: SensorDataset | null): void {
    this.z2Subject.next(dataset);
  }

  setZ3(dataset: SensorDataset | null): void {
    this.z3Subject.next(dataset);
  }

  setZ4(dataset: SensorDataset | null): void {
    this.z4Subject.next(dataset);
  }

  setX(dataset: SensorDataset | null): void {
    this.xSubject.next(dataset);
  }

  setY(dataset: SensorDataset | null): void {
    this.ySubject.next(dataset);
  }

  // Setter pentru parametri
  updateParameters(params: Partial<CalcParameters>): void {
    this.parametersSubject.next({
      ...this.parametersSubject.value,
      ...params
    });
  }

  // Reset complet
  clearAll(): void {
    this.z1Subject.next(null);
    this.z2Subject.next(null);
    this.z3Subject.next(null);
    this.z4Subject.next(null);
    this.xSubject.next(null);
    this.ySubject.next(null);
    this.parametersSubject.next({
      unit: 'm',
      L: 2,
      l: 4,
      signalThreshold: 70,
      stdTiltThreshold: 0.5,
      directionX: 'FATA',
      directionY: 'DREAPTA',
      directionZ: 'IN SUS',
      referenceTimestamp: null
    });
  }

  // Getters pentru valori curente
  get currentParameters(): CalcParameters {
    return this.parametersSubject.value;
  }

  get currentData(): MultiSensorData {
    return {
      z1: this.z1Subject.value,
      z2: this.z2Subject.value,
      z3: this.z3Subject.value,
      z4: this.z4Subject.value,
      x: this.xSubject.value,
      y: this.ySubject.value
    };
  }
}
