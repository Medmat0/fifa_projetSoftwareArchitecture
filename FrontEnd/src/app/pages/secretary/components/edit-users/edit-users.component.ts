import { Component, OnInit } from '@angular/core';
import { User} from '../../../../shared/models/user';
import { SecretaryUserService} from '../../../../secretary/services/secretary-user.service';
import { UserDescriptionComponent } from './components/user-description/user-description.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserCreationComponent } from './components/user-creation/user-creation.component';
import { UserModificationComponent } from './components/user-modification/user-modification.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-users',
  imports: [UserDescriptionComponent, UsersListComponent,
    UserCreationComponent, UserModificationComponent, NgIf],
  templateUrl: './edit-users.component.html',
  standalone: true,
  styleUrl: './edit-users.component.scss'
})

export class EditUsersComponent implements OnInit {
  users: User[] = [];
  showCreation = false;

  constructor(private secretaryUserService: SecretaryUserService) {}

  ngOnInit(): void {
    this.secretaryUserService.getAllEmployees().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error(err)
    });
  }


  toggleCreation() {
    this.showCreation = !this.showCreation;
  }

}
