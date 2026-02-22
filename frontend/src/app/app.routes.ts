import { Routes } from '@angular/router';
import { ImportPage } from './features/import/import.page';
import { SensorsPage } from './features/sensors/sensors.page';
import { LoginPage } from './features/auth/login.page';
import { MultiSensorPage } from './features/multi-sensor/multi-sensor.page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage, title: 'Login - SensorViewer' },
  { path: '', pathMatch: 'full', redirectTo: 'import' },
  { path: 'import', component: ImportPage, title: 'Import CSV', canActivate: [authGuard] },
  { path: 'sensors', component: SensorsPage, title: 'Senzori', canActivate: [authGuard] },
  { path: 'multi-sensor', component: MultiSensorPage, title: 'Calcul 6 Senzori', canActivate: [authGuard] },
  { path: '**', redirectTo: 'import' },
];
