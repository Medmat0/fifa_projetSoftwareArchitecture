import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SecretaryUserService} from '../../../../../../secretary/services/secretary-user.service';
import {NgIf} from '@angular/common';
import {UserDTO} from '../../../../../../shared/models/DTO/userDTO';
import {User} from '../../../../../../shared/models/user';

@Component({
  selector: 'app-user-creation',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './user-creation.component.html',
  standalone: true,
  styleUrl: './user-creation.component.scss'
})
export class UserCreationComponent {
  userDTO: UserDTO = {
    email: '',
    name: '',
    password: '',
    role: '' as any,
    vehicleType: '' as any,
    reservations: []
  };
  @Input() showCreation = false;
  @Output() closeCreation = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<User>();


  secretaryUserService = inject(SecretaryUserService);


  onCreationSubmit() {
    if (!this.userDTO) return;

    const userDTO = {
      email: this.userDTO.email,
      name: this.userDTO.name,
      password: this.userDTO.password,
      role: this.userDTO.role,
      vehicleType: this.userDTO.vehicleType,
      reservations: this.userDTO.reservations || []
    };

    console.log('DTO envoyé:', userDTO);

    this.secretaryUserService.addEmployee(userDTO).subscribe({
      next: (response) => {

        console.log('Utilisateur créé avec succès:', response);

        this.userCreated.emit(response);
        this.closeCreation.emit();
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
      }
    });
  }


}
