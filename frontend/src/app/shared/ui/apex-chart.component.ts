import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-apex-chart',
  standalone: true,
  template: `<div #host></div>`,
})
export class ApexChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;
  @Input({ required: true }) options!: ApexCharts.ApexOptions;

  private chart?: ApexCharts;
  private ready = false;

  async ngAfterViewInit() {
    this.ready = true;
    this.chart = new ApexCharts(this.host.nativeElement, this.options);
    await this.chart.render();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.ready || !this.chart) return;
    if (!changes['options']) return;
    await this.chart.updateOptions(this.options as any, true, true);
  }

  async ngOnDestroy() {
    await this.chart?.destroy();
  }
}
