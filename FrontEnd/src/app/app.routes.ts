import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', loadChildren: () => import('./pages/home/home.routes').then(m => m.default)},
  {path: 'auth', loadChildren: () => import('./pages/authentication/authentication.routes').then(m => m.default)},
  //if path does not match, it will load the home page
  {path:'**', redirectTo: '', pathMatch: 'full'},

];
