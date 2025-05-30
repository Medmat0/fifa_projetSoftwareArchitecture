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
import { ManagerReservationService } from '../../../../manager/services/manager-reservation.service';
import { Role } from '../../../../shared/models/user';

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
  maxWorkingDays = 5;
  maxEndDate: Date | null = null;
  userRole: Role = Role.EMPLOYEE;

  constructor(
    private fb: FormBuilder,
    private employeeReservationService: EmployeeReservationService,
    private managerReservationService: ManagerReservationService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      spotId: string;
      userRole: Role;
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

    this.userRole = this.data.userRole;
    this.maxWorkingDays = this.userRole === Role.MANAGER ? 30 : 5;

    this.reservationForm.get('startDate')?.valueChanges.subscribe((value) => {
      this.reservationForm.get('endDate')?.setValue(null);
      if (value) {
        const startDate = new Date(value);
        this.maxEndDate = this.calculateMaxEndDate(startDate);
        console.log('Date de fin maximale:', this.maxEndDate);
      } else {
        this.maxEndDate = null;
      }
      this.reservationForm.get('endDate')?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    if (this.data.existingReservations?.length) {
      console.log('Existing reservations for this spot:', this.data.existingReservations);
    }
  }

  calculateMaxEndDate(startDate: Date): Date {
    const maxDate = new Date(startDate);
    let workingDaysCount = 1; 
    
    while (workingDaysCount < this.maxWorkingDays) {
      maxDate.setDate(maxDate.getDate() + 1);
      const dayOfWeek = maxDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { 
        workingDaysCount++;
      }
    }

    return maxDate;
  }

  getWorkingDaysCount(startDate: Date, endDate: Date): number {
    let count = 1; 
    const curDate = new Date(startDate);
    curDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(endDate);
    lastDate.setHours(0, 0, 0, 0);

    while (curDate < lastDate) { 
      curDate.setDate(curDate.getDate() + 1);
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
    }
    return count;
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    
    // Filter out weekends
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    // Check if the date
    if (this.data.existingReservations?.length) {
      for (const reservation of this.data.existingReservations) {
        const reservationStart = new Date(reservation.startDate);
        const reservationEnd = new Date(reservation.endDate);
        reservationStart.setHours(0, 0, 0, 0);
        reservationEnd.setHours(0, 0, 0, 0);
        
        if (currentDate >= reservationStart && currentDate <= reservationEnd) {
          return false;
        }
      }
    }

    const startDateValue = this.reservationForm.get('startDate')?.value;
    
    if (startDateValue && this.reservationForm.get('endDate')?.touched) {
      const startDate = new Date(startDateValue);
      startDate.setHours(0, 0, 0, 0);

      if (currentDate < startDate) {
        return false;
      }

      if (this.maxEndDate && currentDate > this.maxEndDate) {
        return false;
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

      // Verify working days count
      const workingDays = this.getWorkingDaysCount(startDate, endDate);
      if (workingDays > this.maxWorkingDays) {
        this.snackBar.open(`La réservation ne peut pas dépasser ${this.maxWorkingDays} jours ouvrables`, 'Fermer', {
          duration: 5000
        });
        this.isLoading = false;
        return;
      }

      // Définir les heures pour le début et la fin
      startDate.setHours(8, 0, 0, 0); // 8h00
      endDate.setHours(23, 0, 0, 0);  // 23h00

      const reservationData = {
        slotId: this.data.spotId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      console.log('Envoi de la réservation :', reservationData);

      const service = this.userRole === Role.MANAGER ? 
        this.managerReservationService : 
        this.employeeReservationService;

      service.createReservation(reservationData).subscribe({
        next: (response: any) => {
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
        error: (error: any) => {
          console.error('Erreur détaillée:', error);
          this.isLoading = false;
          let errorMessage = 'Une erreur est survenue';
          
          if (error.error?.data?.message) {
            errorMessage = error.error.data.message;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 403) {
            errorMessage = `Vous n'avez pas les droits nécessaires pour effectuer cette réservation`;
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