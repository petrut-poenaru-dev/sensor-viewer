import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';

import { DatasetStoreService } from './dataset-store.service';
import { PlateParamsStoreService } from './plate-params-store.service';
import { PlateCalcService, PlateResult } from './plate-calc.service';

@Injectable({ providedIn: 'root' })
export class PlateStoreService {
  readonly plateResult$: Observable<PlateResult | null>;

  constructor(
    private readonly datasetStore: DatasetStoreService,
    private readonly params: PlateParamsStoreService,
    private readonly calc: PlateCalcService
  ) {
    this.plateResult$ = combineLatest([
      this.datasetStore.filteredRows$,
      this.datasetStore.selectedColumn$,
      this.params.params$,
    ]).pipe(
      map(([rows, col, p]) => {
        if (!col || rows.length < 4) return null;

        // DEMO: ia ultimele 4 puncte drept Z1..Z4
        const r4 = rows.slice(-4);
        const z = r4.map(r => r.values[col]).map(v => (v == null ? 0 : v));

        const corners = { z1: z[0], z2: z[1], z3: z[2], z4: z[3] };
        return this.calc.compute(corners, p);
      })
    );
  }
}
