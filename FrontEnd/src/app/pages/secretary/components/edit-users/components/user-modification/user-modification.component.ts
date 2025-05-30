import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Role, User, VehicleType} from '../../../../../../shared/models/user';
import {SecretaryUserService} from '../../../../../../secretary/services/secretary-user.service';
import {FormsModule} from '@angular/forms';
import {UserDTO} from '../../../../../../shared/models/DTO/userDTO';
import {Reservation} from '../../../../../../shared/models/reservation';

@Component({
  selector: 'app-user-modification',
  imports: [
    FormsModule
  ],
  templateUrl: './user-modification.component.html',
  standalone: true,
  styleUrl: './user-modification.component.scss'
})
export class UserModificationComponent {

  @Input() user!: User;
  @Output() closeModification = new EventEmitter<void>();

  secretaryUserService = inject(SecretaryUserService);
  onModificationSubmit() {
    if (!this.user) return;

    // Création du DTO à partir des inputs du formulaire
    const userDTO = {
      email: this.user.email,
      name: this.user.name,
      password: this.user.password, // à adapter si le champ n'est pas modifiable
      role: this.user.role,
      vehicleType: this.user.vehicleType,
      reservations: this.user.reservations || []
    };

    console.log('DTO envoyé:', userDTO);

    this.secretaryUserService.modifyEmployee(this.user.id, userDTO).subscribe({
      next: (response) => {
        console.log('Utilisateur modifié avec succès:', response);
        this.closeModification.emit();
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
      }
    });
  }
}
