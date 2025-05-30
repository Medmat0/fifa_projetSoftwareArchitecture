import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', loadChildren: () => import('./pages/home/home.routes').then(m => m.default)},
  {path: 'auth', loadChildren: () => import('./pages/authentication/authentication.routes').then(m => m.default)},
  {path:'reservation', loadChildren: () => import('./pages/reservation/reservation.routes').then(m => m.default)},
  {path:'secretary', loadChildren: () => import('./pages/secretary/secretary.routes').then(m => m.default)},
  {path:'manager', loadChildren: () => import('./manager/manager.routes').then(m => m.default)},
  //if path does not match, it will load the home page
  {path:'**', redirectTo: '', pathMatch: 'full'},
];
