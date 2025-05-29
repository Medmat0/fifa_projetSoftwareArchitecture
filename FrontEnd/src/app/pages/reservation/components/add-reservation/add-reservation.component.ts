import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ],
  providers: [
    provideNativeDateAdapter()
  ],
  templateUrl: './add-reservation.component.html',
  styleUrl: './add-reservation.component.scss'
})
export class AddReservationComponent {
  reservationForm: FormGroup;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { spotId: string }
  ) {
    this.reservationForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    // Filter out weekends (Saturday = 6, Sunday = 0)
    return day !== 0 && day !== 6;
  };

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.dialogRef.close(this.reservationForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}