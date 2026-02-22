// Model pentru datele din CSV-uri
export interface SensorDataRow {
  timestamp: Date;
  distance: number;
  signalStrength: number;
  gain: number;
  temperatureLaser: number;
  temperatureTilt: number;
  xaxisTilt: number;
  yaxisTilt: number;
  zaxisTilt: number;
  xaxisStd: number;
  yaxisStd: number;
  zaxisStd: number;
}

export interface SensorDataset {
  name: string; // Z1, Z2, Z3, Z4, X, Y
  rows: SensorDataRow[];
}

export interface MultiSensorData {
  z1: SensorDataset | null; // Colț Față-Stânga
  z2: SensorDataset | null; // Colț Față-Dreapta
  z3: SensorDataset | null; // Colț Spate-Stânga
  z4: SensorDataset | null; // Colț Spate-Dreapta
  x: SensorDataset | null;  // Fața-Spate
  y: SensorDataset | null;  // Stânga-Dreapta
}

// Parametri de configurare (din Excel)
export interface CalcParameters {
  unit: 'm' | 'mm';                    // B4 - Unitate măsură
  L: number;                           // B5 - Dimensiune pe L
  l: number;                           // B6 - Dimensiune pe l (lowercase L)
  signalThreshold: number;             // B7 - Prag semnal OK (min)
  stdTiltThreshold: number;            // B8 - Prag Std tilt (max)
  directionX: 'FATA' | 'SPATE';       // E5 - Direcție X
  directionY: 'STANGA' | 'DREAPTA';   // E6 - Direcție Y
  directionZ: 'IN SUS' | 'IN JOS';    // E8 - Direcție Z
  referenceTimestamp: Date | null;     // E10 - Timestamp referință (T0)
}

// Rezultat calcul pentru un timestamp
export interface CalcResult {
  timestamp: Date;
  z1Delta: number | null;              // mm
  z2Delta: number | null;              // mm
  z3Delta: number | null;              // mm
  z4Delta: number | null;              // mm
  xDelta: number | null;               // mm
  yDelta: number | null;               // mm
  ondulatie: number | null;            // mm
  inclinareL: number | null;           // mm/m
  inclinareLowerL: number | null;      // mm/m (pe l)
  twist: number | null;                // mm
  directieMiscare: string;             // text descriptiv
  tempLaserMedie: number | null;       // °C
  tempTiltMedie: number | null;        // °C
  semnalOk: 'OK' | 'NU' | '';
  stdTiltOk: 'OK' | 'NU' | '';
  note: string;
}
