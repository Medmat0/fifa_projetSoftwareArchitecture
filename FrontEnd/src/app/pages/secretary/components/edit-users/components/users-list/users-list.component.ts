import { Component, Input } from '@angular/core';
import { User} from '../../../../../../shared/models/user';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [
    NgForOf
  ],
  templateUrl: './users-list.component.html',
  standalone: true,
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  @Input() users: User[] = [];
}
