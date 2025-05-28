// src/app/shared/components/nav-bar/nav-bar.component.ts
import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';
import { NavbarService } from '../../services/navbar.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, NgIf],
  templateUrl: './nav-bar.component.html',
  standalone: true,
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  showButtons: boolean = true;
  isAuthenticated: boolean = false;
  username: string | null = null;

  constructor(
    private authService: AuthService,
    private navbarService: NavbarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.navbarService.showButtons$.subscribe((show: boolean) => {
      this.showButtons = show;
    });

    this.authService.authStatus$.subscribe((status) => {
      this.isAuthenticated = status;
      console.log('Authentication status test:', status);
      if (status) {
        const user = localStorage.getItem('utilisateur');
        this.username = user ? JSON.parse(user).prenom : null;
      } else {
        this.username = null;
      }
      this.cdr.detectChanges();
    });
  }


  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Error during logout:', err);
      }
    });
  }
}
