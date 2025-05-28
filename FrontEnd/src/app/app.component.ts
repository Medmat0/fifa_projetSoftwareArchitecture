import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './shared/services/auth.service';
import {NavBarComponent} from './shared/components/nav-bar/nav-bar.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  template:`
    <main>
      <app-nav-bar></app-nav-bar>
      <router-outlet></router-outlet>
    </main>
  `,
  standalone: true,
  styles:[]
})
export class AppComponent implements OnInit {
  title = 'SpotReservation';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {

    /*
    this.authService.checkAuthStatus().subscribe({
      next: () => console.log('Auth status checked successfully'),
      error: (err) => {
        console.warn('User is not authenticated:', err.message || err);
      }
    });
    *
    *
    * */

  }
}
