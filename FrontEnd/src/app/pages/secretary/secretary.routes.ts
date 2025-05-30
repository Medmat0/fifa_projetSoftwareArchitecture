import { Routes } from '@angular/router';
import {SecretaryGuard} from '../../shared/guards/secretary.guards';

export default [
  { path: '', loadComponent: () => import('./components/secretary-home/secretary-home.component').then(m => m.SecretaryHomeComponent), canActivate:  [SecretaryGuard] },
  { path: 'edit-reservations', loadComponent: () => import('./components/edit-reservations/edit-reservations.component').then(m => m.EditReservationsComponent), canActivate: [SecretaryGuard] },
  { path: 'edit-users', loadComponent: () => import('./components/edit-users/edit-users.component').then(m => m.EditUsersComponent), canActivate: [SecretaryGuard] },
  { path: 'support-messages', loadComponent: () => import('./components/support-messages/support-messages.component').then(m => m.SupportMessagesComponent), canActivate: [SecretaryGuard] },

] as Routes;
