import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type PlateParams = {
  L: number;     // dimensiune pe X (ex: 2)
  l: number;     // dimensiune pe Y (ex: 4)
  nx: number;    // puncte pe X pentru grid
  ny: number;    // puncte pe Y pentru grid
};

@Injectable({ providedIn: 'root' })
export class PlateParamsStoreService {
  private readonly subject = new BehaviorSubject<PlateParams>({
    L: 2,
    l: 4,
    nx: 21,
    ny: 21,
  });

  readonly params$ = this.subject.asObservable();

  get value(): PlateParams {
    return this.subject.value;
  }

  set<K extends keyof PlateParams>(key: K, v: PlateParams[K]) {
    this.subject.next({ ...this.subject.value, [key]: v });
  }
}
