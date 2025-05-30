import {inject, Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'

})

export class SecretaryGuard implements CanActivate {
  authService = inject(AuthService);
  constructor(private router: Router) {}

  canActivate(): Observable<any> {
    return this.authService.checkRole().pipe(
      tap((response: any) => {
        if (response.authenticated && response.role === 'SECRETARY') {
          console.log('User has the required role:', response);
        } else {
          confirm("Vous n'êtes pas habilité à accéder à cette page");
          console.log('User does not have the required role:', response);
          this.router.navigate(['']);
        }
      }),
      catchError((error) => {
        console.error('Error checking user role', error);
        this.router.navigate(['']);
        return throwError(() => new Error('Error checking user role'));
      })
    );
  }
}
