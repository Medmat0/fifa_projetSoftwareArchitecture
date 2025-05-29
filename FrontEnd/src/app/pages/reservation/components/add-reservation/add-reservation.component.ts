import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReservationService } from '../../../../shared/services/reservation.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class AddReservationComponent {
  reservationForm: FormGroup;
  minDate: Date = new Date();

  constructor(
    private dialogRef: MatDialogRef<AddReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { spotNumber: string },
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {
    this.reservationForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }
    const day = date.getDay();
    // Filter out weekends (Saturday is 6, Sunday is 0)
    return day !== 0 && day !== 6;
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      const reservation = {
        ...this.reservationForm.value,
        spotNumber: this.data.spotNumber
      };

      this.reservationService.createReservation(reservation).subscribe({
        next: (response) => {
          this.snackBar.open('Réservation créée avec succès !', 'Fermer', {
            duration: 3000
          });
          this.dialogRef.close(response);
        },
        error: () => {
          this.snackBar.open(
            'Erreur lors de la création de la réservation',
            'Fermer',
            { duration: 5000 }
          );
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}