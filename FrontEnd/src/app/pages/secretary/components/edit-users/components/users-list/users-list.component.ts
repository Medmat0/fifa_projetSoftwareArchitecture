import {Component, inject, Input} from '@angular/core';
import { User} from '../../../../../../shared/models/user';
import {NgForOf, NgIf} from '@angular/common';
import {UserCreationComponent} from '../user-creation/user-creation.component';
import {UserDescriptionComponent} from '../user-description/user-description.component';
import {UserModificationComponent} from '../user-modification/user-modification.component';
import {SecretaryUserService} from '../../../../../../secretary/services/secretary-user.service';

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
  secretaryUserService = inject(SecretaryUserService);


  toggleDescription(user: User) {
    this.showDescription = !this.showDescription;
    this.selectedUser = user;
  }

  toggleModification(user: User) {
    this.showModification = !this.showModification;
    this.selectedUser = user;
  }


  deleteUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.name} ?`)) {
      console.log(`Utilisateur ${user.name} supprimé.`);
      this.secretaryUserService.deleteEmployee(user.id).subscribe({
        next: (response) => {
          console.log('Utilisateur supprimé avec succès:', response);
          // Mettre à jour la liste des utilisateurs après la suppression
          this.users = this.users.filter(u => u.id !== user.id);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }

  }
}
