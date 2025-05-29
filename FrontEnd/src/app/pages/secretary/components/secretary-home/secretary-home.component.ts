import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-secretary-home',
  imports: [
    RouterLink
  ],
  templateUrl: './secretary-home.component.html',
  standalone: true,
  styleUrl: './secretary-home.component.scss'
})
export class SecretaryHomeComponent {

}
