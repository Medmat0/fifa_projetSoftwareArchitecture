import { Routes } from '@angular/router';
// Update the import path if the guard is located elsewhere, for example:
import { ManagerGuard } from '../shared/guards/manager.guard';
// Or correct the path according to your project structure.

export default [
  { 
    path: 'stats', 
    loadComponent: () => import('./components/stats-dashboard/stats-dashboard.component').then(m => m.StatsDashboardComponent),
    canActivate: [ManagerGuard] 
  }
] as Routes;
