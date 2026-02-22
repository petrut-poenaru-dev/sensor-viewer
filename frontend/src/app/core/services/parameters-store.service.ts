import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type CalcParams = {
  pA: number; // ex: "2"
  pB: number; // ex: "4"
};

@Injectable({ providedIn: 'root' })
export class ParametersStoreService {
  private readonly paramsSubject = new BehaviorSubject<CalcParams>({
    pA: 2,
    pB: 4,
  });

  readonly params$ = this.paramsSubject.asObservable();

  setParam<K extends keyof CalcParams>(key: K, value: CalcParams[K]) {
    const next = { ...this.paramsSubject.value, [key]: value };
    this.paramsSubject.next(next);
  }
}
