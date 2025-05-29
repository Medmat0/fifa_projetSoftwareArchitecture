import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ReservationRequest {
  spotNumber: string;
  startDate: Date;
  endDate: Date;
}

export interface ReservationResponse {
  id: string;
  spotNumber: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly STORAGE_KEY = 'parking_reservations';

  constructor() {
    // Initialize localStorage with empty array if not exists
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  private getReservations(): ReservationResponse[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveReservations(reservations: ReservationResponse[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reservations));
  }

  createReservation(reservation: ReservationRequest): Observable<ReservationResponse> {
    const reservations = this.getReservations();
    const newReservation: ReservationResponse = {
      id: Date.now().toString(), // Generate a simple unique ID
      ...reservation,
      startDate: new Date(reservation.startDate),
      endDate: new Date(reservation.endDate),
      status: 'confirmed'
    };
    
    reservations.push(newReservation);
    this.saveReservations(reservations);
    return of(newReservation);
  }

  getReservedSpots(): Observable<string[]> {
    const reservations = this.getReservations();
    const currentDate = new Date();
    
    // Only return spots that are currently reserved (not expired)
    const activeSpots = reservations
      .filter(res => new Date(res.endDate) >= currentDate)
      .map(res => res.spotNumber);
    
    return of(activeSpots);
  }

  cancelReservation(reservationId: string): Observable<void> {
    const reservations = this.getReservations();
    const updatedReservations = reservations.filter(res => res.id !== reservationId);
    this.saveReservations(updatedReservations);
    return of(void 0);
  }
}
