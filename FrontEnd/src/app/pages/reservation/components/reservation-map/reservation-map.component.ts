import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';
import { MapService } from '../../services/map.service';
import { Role } from '../../../../shared/models/user';

interface Reservation {
  startDate: string;
  endDate: string;
}

interface SlotStatus {
  slotId: string;
  status: 'dispo' | 'reserved';
  reservations?: Reservation[];
}

@Component({
  selector: 'app-reservation-map',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './reservation-map.component.html',
  styleUrl: './reservation-map.component.scss'
})
export class ReservationMapComponent implements OnInit {
  selectedSpot: string | null = null;
  slotsStatus: SlotStatus[] = [];
  userRole: Role = Role.EMPLOYEE;

  parkingRows = [
    { label: 'A', spots: this.generateSpots('A') },
    { label: 'B', spots: this.generateSpots('B') },
    { label: 'C', spots: this.generateSpots('C') },
    { label: 'D', spots: this.generateSpots('D') },
    { label: 'E', spots: this.generateSpots('E') },
    { label: 'F', spots: this.generateSpots('F') },
  ];

  constructor(
    private dialog: MatDialog,
    private http: HttpClient
  ) {
    // Get user info from localStorage
    const userStr = localStorage.getItem('utilisateur');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userRole = user.role as Role;
      } catch (e) {
        console.error('Error parsing user info:', e);
      }
    }
  }

  ngOnInit() {
    this.loadSlotStatus();
  }

  loadSlotStatus() {
    this.http.get<SlotStatus[]>('http://localhost:3000/mapStatus/all').subscribe({
      next: (status) => {
        console.log('Status des places:', status);
        this.slotsStatus = status;
      },
      error: (error) => {
        console.error('Error loading slot status:', error);
      }
    });
  }

  getSpotStatus(spotId: string): string {
    const spot = this.slotsStatus.find(s => s.slotId === spotId);
    return spot?.status || 'dispo';
  }

  generateSpots(row: string) {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `${row}${(i + 1).toString().padStart(2, '0')}`
    }));
  }

  selectSpot(spotId: string) {
    this.selectedSpot = spotId;
    this.openReservationDialog(spotId);
  }

  openReservationDialog(spotId: string): void {
    const spotStatus = this.slotsStatus.find(s => s.slotId === spotId);
    const dialogRef = this.dialog.open(AddReservationComponent, {
      width: '400px',
      data: { 
        spotId,
        userRole: this.userRole,
        existingReservations: spotStatus?.reservations || []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadSlotStatus();
        this.selectedSpot = null;
      }
    });
  }
}
