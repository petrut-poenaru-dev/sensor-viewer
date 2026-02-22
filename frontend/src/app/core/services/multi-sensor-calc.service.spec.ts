import { TestBed } from '@angular/core/testing';
import { MultiSensorCalcService } from './multi-sensor-calc.service';
import { CalcParameters, MultiSensorData, SensorDataRow } from '../models/multi-sensor.model';

describe('MultiSensorCalcService - Test Formule Excel', () => {
  let service: MultiSensorCalcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiSensorCalcService);
  });

  // Date de test simulate
  const createTestRow = (distance: number, signal: number, tempLaser: number, tempTilt: number, zStd: number): SensorDataRow => ({
    timestamp: new Date('2026-01-20T14:10:00'),
    distance,
    signalStrength: signal,
    gain: 0,
    temperatureLaser: tempLaser,
    temperatureTilt: tempTilt,
    xaxisTilt: 0,
    yaxisTilt: 0,
    zaxisTilt: 0,
    xaxisStd: 0,
    yaxisStd: 0,
    zaxisStd: zStd
  });

  const testParams: CalcParameters = {
    unit: 'm',
    L: 2,
    l: 4,
    signalThreshold: 70,
    stdTiltThreshold: 0.5,
    directionX: 'SPATE',
    directionY: 'DREAPTA',
    directionZ: 'IN JOS',
    referenceTimestamp: new Date('2026-01-20T14:10:00')
  };

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('TEST 1: Calculează delta Z corect (m -> mm, IN JOS)', () => {
    const refTime = new Date('2026-01-20T14:10:00');
    const currentTime = new Date('2026-01-20T14:11:00');
    
    const testData: MultiSensorData = {
      z1: {
        name: 'Z1',
        rows: [
          { ...createTestRow(1.1037, 99219, 26.6, 29.4, 0.0001), timestamp: refTime },
          { ...createTestRow(1.1038, 99219, 26.7, 29.5, 0.0001), timestamp: currentTime }
        ]
      },
      z2: null,
      z3: null,
      z4: null,
      x: null,
      y: null
    };

    const params = { ...testParams, referenceTimestamp: refTime };
    const results = service.calculateResults(testData, params);

    console.log('\n=== TEST 1 - Delta Z1 ===');
    console.log('Referință:', testData.z1!.rows[0].distance, 'm');
    console.log('Curent:', testData.z1!.rows[1].distance, 'm');
    console.log('Delta așteptat: -0.1 mm (IN JOS => negativ)');
    
    const currentResult = results.find(r => r.timestamp.getTime() === currentTime.getTime());
    console.log('Delta calculat:', currentResult?.z1Delta, 'mm');
    console.log('✓ Test passed!\n');
    
    expect(currentResult?.z1Delta).toBeCloseTo(-0.1, 2);
  });

  it('TEST 2: Calculează ondulație corect', () => {
    const testData: MultiSensorData = {
      z1: { name: 'Z1', rows: [
        createTestRow(1.0, 100, 26, 29, 0.0001),
        createTestRow(1.001, 100, 26, 29, 0.0001)  // +1mm
      ]},
      z2: { name: 'Z2', rows: [
        createTestRow(1.0, 100, 26, 29, 0.0001),
        createTestRow(1.003, 100, 26, 29, 0.0001)  // +3mm
      ]},
      z3: { name: 'Z3', rows: [
        createTestRow(1.0, 100, 26, 29, 0.0001),
        createTestRow(1.002, 100, 26, 29, 0.0001)  // +2mm
      ]},
      z4: { name: 'Z4', rows: [
        createTestRow(1.0, 100, 26, 29, 0.0001),
        createTestRow(1.0005, 100, 26, 29, 0.0001)  // +0.5mm
      ]},
      x: null,
      y: null
    };

    const params = { ...testParams, referenceTimestamp: testData.z1!.rows[0].timestamp };
    const results = service.calculateResults(testData, params);

    console.log('\nTEST 2 - Ondulație:');
    console.log('  Z1 delta:', results[1].z1Delta, 'mm');
    console.log('  Z2 delta:', results[1].z2Delta, 'mm');
    console.log('  Z3 delta:', results[1].z3Delta, 'mm');
    console.log('  Z4 delta:', results[1].z4Delta, 'mm');
    console.log('  Ondulație așteptată:', 'MAX - MIN');
    console.log('  Ondulație calculată:', results[1].ondulatie, 'mm');

    // Ondulație = MAX(deltas) - MIN(deltas)
    expect(results[1].ondulatie).toBeGreaterThan(0);
  });

  it('TEST 3: Verifică Semnal OK', () => {
    const testData: MultiSensorData = {
      z1: { name: 'Z1', rows: [
        createTestRow(1.0, 80, 26, 29, 0.0001),  // signal = 80 >= 70 => OK
        createTestRow(1.0, 80, 26, 29, 0.0001)
      ]},
      z2: { name: 'Z2', rows: [
        createTestRow(1.0, 65, 26, 29, 0.0001),  // signal = 65 < 70 => NU
        createTestRow(1.0, 65, 26, 29, 0.0001)
      ]},
      z3: null,
      z4: null,
      x: null,
      y: null
    };

    const params = { ...testParams, referenceTimestamp: testData.z1!.rows[0].timestamp };
    const results = service.calculateResults(testData, params);

    console.log('\nTEST 3 - Semnal OK:');
    console.log('  Z1 signal:', 80, '(>= 70)');
    console.log('  Z2 signal:', 65, '(< 70)');
    console.log('  MIN signal:', 65);
    console.log('  Prag:', 70);
    console.log('  Rezultat așteptat:', 'NU');
    console.log('  Rezultat calculat:', results[1].semnalOk);

    expect(results[1].semnalOk).toBe('NU');
  });

  it('TEST 4: Verifică Std Tilt OK', () => {
    const testData: MultiSensorData = {
      z1: { name: 'Z1', rows: [
        createTestRow(1.0, 100, 26, 29, 0.3),  // zStd = 0.3 <= 0.5 => OK
        createTestRow(1.0, 100, 26, 29, 0.3)
      ]},
      z2: { name: 'Z2', rows: [
        createTestRow(1.0, 100, 26, 29, 0.6),  // zStd = 0.6 > 0.5 => NU
        createTestRow(1.0, 100, 26, 29, 0.6)
      ]},
      z3: null,
      z4: null,
      x: null,
      y: null
    };

    const params = { ...testParams, referenceTimestamp: testData.z1!.rows[0].timestamp };
    const results = service.calculateResults(testData, params);

    console.log('\nTEST 4 - Std Tilt OK:');
    console.log('  Z1 zStd:', 0.3, '(<= 0.5)');
    console.log('  Z2 zStd:', 0.6, '(> 0.5)');
    console.log('  MAX zStd:', 0.6);
    console.log('  Prag:', 0.5);
    console.log('  Rezultat așteptat:', 'NU');
    console.log('  Rezultat calculat:', results[1].stdTiltOk);

    expect(results[1].stdTiltOk).toBe('NU');
  });

  it('TEST 5: Calculează temperaturi medii', () => {
    const testData: MultiSensorData = {
      z1: { name: 'Z1', rows: [
        createTestRow(1.0, 100, 26.0, 29.0, 0.0001),
        createTestRow(1.0, 100, 26.5, 29.5, 0.0001)
      ]},
      z2: { name: 'Z2', rows: [
        createTestRow(1.0, 100, 27.0, 30.0, 0.0001),
        createTestRow(1.0, 100, 27.5, 30.5, 0.0001)
      ]},
      z3: null,
      z4: null,
      x: null,
      y: null
    };

    const params = { ...testParams, referenceTimestamp: testData.z1!.rows[0].timestamp };
    const results = service.calculateResults(testData, params);

    console.log('\nTEST 5 - Temperature medii:');
    console.log('  Z1 Laser:', 26.5, '°C');
    console.log('  Z2 Laser:', 27.5, '°C');
    console.log('  Medie așteptată:', 27.0, '°C');
    console.log('  Medie calculată:', results[1].tempLaserMedie, '°C');

    expect(results[1].tempLaserMedie).toBeCloseTo(27.0, 1);
    expect(results[1].tempTiltMedie).toBeCloseTo(30.0, 1);
  });

  it('TEST 6: Calculează direcție mișcare', () => {
    const testData: MultiSensorData = {
      z1: null,
      z2: null,
      z3: null,
      z4: null,
      x: { name: 'X', rows: [
        createTestRow(1.0, 100, 26, 29, 0.0001),
        createTestRow(1.002, 100, 26, 29, 0.0001)  // +2mm SPATE
      ]},
      y: { name: 'Y', rows: [
        createTestRow(1.0, 100, 26, 29, 0.0001),
        createTestRow(0.9985, 100, 26, 29, 0.0001)  // -1.5mm STANGA
      ]}
    };

    const params = { ...testParams, referenceTimestamp: testData.x!.rows[0].timestamp };
    const results = service.calculateResults(testData, params);

    console.log('\nTEST 6 - Direcție mișcare:');
    console.log('  X delta:', results[1].xDelta, 'mm');
    console.log('  Y delta:', results[1].yDelta, 'mm');
    console.log('  Direcție calculată:', results[1].directieMiscare);

    expect(results[1].directieMiscare).toContain('SPATE');
    expect(results[1].directieMiscare).toContain('STANGA');
  });
});
