import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeReservationService } from '../../../../employee/services/employee-reservation.service';

@Component({
  selector: 'app-add-reservation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-reservation.component.html',
  styleUrl: './add-reservation.component.scss'
})
export class AddReservationComponent implements OnInit {
  reservationForm: FormGroup;
  minDate = new Date();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private reservationService: EmployeeReservationService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      spotId: string;
      existingReservations?: {
        startDate: string;
        endDate: string;
      }[];
    }
  ) {
    this.reservationForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });

    // Écouter les changements de la date de début
    this.reservationForm.get('startDate')?.valueChanges.subscribe(() => {
      this.reservationForm.get('endDate')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    if (this.data.existingReservations?.length) {
      console.log('Existing reservations for this spot:', this.data.existingReservations);
    }
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    
    // Filter out weekends (Saturday = 6, Sunday = 0)
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    
    // Check if date is in any reserved range
    if (this.data.existingReservations?.length) {
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);
      
      // Check each reservation period
      for (const reservation of this.data.existingReservations) {
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        // Block the date if it's within any existing reservation
        if (currentDate >= startDate && currentDate <= endDate) {
          return false;
        }
      }
    }
    
    return true;
  };

  onSubmit(): void {
    if (this.reservationForm.valid && !this.isLoading) {
      this.isLoading = true;
      const formValue = this.reservationForm.value;
      
      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);
      
      // Définir les heures pour le début et la fin
      startDate.setHours(8, 0, 0, 0); // 8h00
      endDate.setHours(18, 0, 0, 0);  // 18h00

      const reservationData = {
        slotId: this.data.spotId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      console.log('Envoi de la réservation :', reservationData);

      this.reservationService.createReservation(reservationData).subscribe({
        next: (response) => {
          console.log('Réponse du serveur :', response);
          this.isLoading = false;
          
          if (response.reservation) {
            this.snackBar.open('Reservation créée avec succès!', 'Fermer', {
              duration: 3000
            });
            this.dialogRef.close(response.reservation);
          } else {
            const errorMsg = response.message || 'Une erreur est survenue';
            this.snackBar.open(errorMsg, 'Fermer', {
              duration: 5000
            });
          }
        },
        error: (error) => {
          console.error('Erreur détaillée:', error);
          this.isLoading = false;
          let errorMessage = 'Une erreur est survenue';
          
          if (error.error?.data?.message) {
            errorMessage = error.error.data.message;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 403) {
            errorMessage = 'Vous devez être connecté en tant qu\'employé pour faire une réservation';
          }
          
          this.snackBar.open(errorMessage, 'Fermer', {
            duration: 5000
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}