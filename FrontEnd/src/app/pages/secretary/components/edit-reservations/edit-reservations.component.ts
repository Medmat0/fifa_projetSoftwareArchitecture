import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SecretaryReservationService } from '../../services/secretary-reservation.service';

@Component({
  selector: 'app-edit-reservations',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './edit-reservations.component.html',
  standalone: true,
  styleUrl: './edit-reservations.component.scss',
  providers: [SecretaryReservationService]
})
export class EditReservationsComponent implements OnInit {
  reservations: any[] = [];
  displayedColumns: string[] = ['id', 'userName', 'slotId', 'startDate', 'endDate', 'actions'];

  constructor(private reservationService: SecretaryReservationService) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
      }
    });
  }

  deleteReservation(id: string) {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.loadReservations(); // Reload the list after deletion
      },
      error: (error) => {
        console.error('Error deleting reservation:', error);
      }
    });
  }
}
