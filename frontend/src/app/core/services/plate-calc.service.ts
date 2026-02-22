import { Injectable } from '@angular/core';
import { PlateParams } from './plate-params-store.service';

export type PlateCorners = {
  // colțuri Z (mm)
  // Convenție:
  // Z1 = (0, 0)
  // Z2 = (L, 0)
  // Z3 = (L, l)
  // Z4 = (0, l)
  z1: number;
  z2: number;
  z3: number;
  z4: number;
};

export type PlateResult = {
  p2p: number;
  twist: number;
  minZ: number;
  maxZ: number;
  grid: number[][];
  xs: number[];
  ys: number[];
};

@Injectable({ providedIn: 'root' })
export class PlateCalcService {

  compute(c: PlateCorners, p: PlateParams): PlateResult {
    const zs = [c.z1, c.z2, c.z3, c.z4];
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const p2p = maxZ - minZ;

    const twist = (c.z1 + c.z3) / 2 - (c.z2 + c.z4) / 2;

    const { xs, ys } = this.linspaceGrid(p.L, p.l, p.nx, p.ny);
    const grid = ys.map(y => xs.map(x => this.bilinear(c, p.L, p.l, x, y)));

    return { p2p, twist, minZ, maxZ, grid, xs, ys };
  }

  private bilinear(c: PlateCorners, L: number, l: number, x: number, y: number): number {

    const tx = L === 0 ? 0 : x / L;
    const ty = l === 0 ? 0 : y / l;

    const z00 = c.z1;
    const z10 = c.z2;
    const z11 = c.z3;
    const z01 = c.z4;

    return (1 - tx) * (1 - ty) * z00
      + (tx)     * (1 - ty) * z10
      + (tx)     * (ty)     * z11
      + (1 - tx) * (ty)     * z01;
  }

  private linspaceGrid(L: number, l: number, nx: number, ny: number) {
    const xs = Array.from({ length: nx }, (_, i) => (nx === 1 ? 0 : (L * i) / (nx - 1)));
    const ys = Array.from({ length: ny }, (_, i) => (ny === 1 ? 0 : (l * i) / (ny - 1)));
    return { xs, ys };
  }
}
