import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';

@Component({
  selector: 'app-reservation-map',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './reservation-map.component.html',
  styleUrl: './reservation-map.component.scss'
})
export class ReservationMapComponent {
  selectedSpot: string | null = null;

  // Mock des places réservées
  reservedSpots: string[] = ['A03', 'B05', 'D07', 'F06'];

  parkingRows = [
    { label: 'A', spots: this.generateSpots('A') },
    { label: 'B', spots: this.generateSpots('B') },
    { label: 'C', spots: this.generateSpots('C') },
    { label: 'D', spots: this.generateSpots('D') },
    { label: 'E', spots: this.generateSpots('E') },
    { label: 'F', spots: this.generateSpots('F') },
  ];

  constructor(private dialog: MatDialog) {}

  generateSpots(row: string) {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${row}${(i + 1).toString().padStart(2, '0')}`
    }));
  }

  selectSpot(spotId: string) {
    if (this.reservedSpots.includes(spotId)) return;
    this.selectedSpot = spotId;
    this.openReservationDialog(spotId);
  }

  openReservationDialog(spotId: string): void {
    const dialogRef = this.dialog.open(AddReservationComponent, {
      width: '400px',
      data: { spotId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Simulate reservation by adding to reservedSpots
        this.reservedSpots.push(spotId);
        this.selectedSpot = null;
        console.log('Reservation made:', { spotId, ...result });
      }
    });
  }
}
