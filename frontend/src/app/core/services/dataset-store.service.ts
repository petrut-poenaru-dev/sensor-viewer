import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Dataset } from '../models/dataset.model';

export type DateRange = { from: Date | null; to: Date | null };

@Injectable({ providedIn: 'root' })
export class DatasetStoreService {
  private readonly datasetSubject = new BehaviorSubject<Dataset | null>(null);
  readonly dataset$ = this.datasetSubject.asObservable();

  private readonly selectedColumnSubject = new BehaviorSubject<string | null>(null);
  readonly selectedColumn$ = this.selectedColumnSubject.asObservable();

  private readonly dateRangeSubject = new BehaviorSubject<DateRange>({ from: null, to: null });
  readonly dateRange$ = this.dateRangeSubject.asObservable();

  readonly filteredRows$ = combineLatest([this.dataset$, this.dateRange$]).pipe(
    map(([ds, range]) => {
      if (!ds) return [];
      const { from, to } = range;

      return ds.rows.filter(r => {
        const t = r.timestamp.getTime();
        if (from && t < from.getTime()) return false;
        if (to && t > to.getTime()) return false;
        return true;
      });
    })
  );

  setDataset(ds: Dataset) {
    this.datasetSubject.next(ds);
    this.selectedColumnSubject.next(ds.columns[0] ?? null);

    const first = ds.rows[0]?.timestamp ?? null;
    const last = ds.rows[ds.rows.length - 1]?.timestamp ?? null;
    this.dateRangeSubject.next({ from: first, to: last });
  }

  setSelectedColumn(col: string) {
    this.selectedColumnSubject.next(col);
  }

  setDateRange(range: DateRange) {
    this.dateRangeSubject.next(range);
  }

  clear() {
    this.datasetSubject.next(null);
    this.selectedColumnSubject.next(null);
    this.dateRangeSubject.next({ from: null, to: null });
  }
}
