import { Injectable, inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { map, take, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConnectedGuard implements CanActivate {
  authService = inject(AuthService);
  constructor(private router: Router) {}

  canActivate() {
    return this.authService.authStatus$.pipe(
      take(1),
      map(status => {
        if (!status) {
          confirm('Vous devez être connecté pour accéder à cette page.');
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      })
    );
  }
}
