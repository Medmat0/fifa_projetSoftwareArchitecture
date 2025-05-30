import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Role } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userStr = localStorage.getItem('utilisateur');
    if (!userStr) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role === Role.MANAGER) {
        return true;
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }

    this.router.navigate(['/']);
    return false;
  }
}
