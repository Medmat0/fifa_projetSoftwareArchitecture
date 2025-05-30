import { Component, Input } from '@angular/core';
import { User} from '../../../../../../shared/models/user';
import {NgForOf, NgIf} from '@angular/common';
import {UserCreationComponent} from '../user-creation/user-creation.component';
import {UserDescriptionComponent} from '../user-description/user-description.component';
import {UserModificationComponent} from '../user-modification/user-modification.component';

@Component({
  selector: 'app-users-list',
  imports: [
    NgForOf,
    NgIf,
    UserCreationComponent,
    UserDescriptionComponent,
    UserModificationComponent
  ],
  templateUrl: './users-list.component.html',
  standalone: true,
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  @Input() users: User[] = [];
  showDescription = false;
  showModification = false;
  selectedUser: User | null = null;




  toggleDescription(user: User) {
    this.showDescription = !this.showDescription;
    this.selectedUser = user;
  }

  toggleModification() {
    this.showModification = !this.showModification;
  }


}
