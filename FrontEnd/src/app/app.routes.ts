import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', loadChildren: () => import('./pages/home/home.routes').then(m => m.default)},
<<<<<<< Updated upstream
  {path: 'auth', loadChildren: () => import('./pages/authentication/authentication.routes').then(m => m.default)},
  {path:'reservation', loadChildren: () => import('./pages/reservation/reservation.routes').then(m => m.default)},
=======
  {path: 'reservation', loadChildren: () => import('./pages/reservation/reservation.routes').then(m => m.RESERVATION_ROUTES)},
>>>>>>> Stashed changes
  //if path does not match, it will load the home page
  {path:'**', redirectTo: '', pathMatch: 'full'},
];
