import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private showButtonsSubject = new BehaviorSubject<boolean>(true);
  showButtons$ = this.showButtonsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes = ['/auth/reset-password', '/auth/login', '/auth/register'];
        this.showButtonsSubject.next(!hiddenRoutes.includes(event.url));
      }
    });
  }
}
