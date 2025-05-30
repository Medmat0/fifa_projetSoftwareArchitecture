import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../utils/config';
import { Reservation } from '../../shared/models/reservation';
import { CreateReservationDto } from '../../employee/services/employee-reservation.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerReservationService {
  private readonly apiUrl = `${API_URL}/reservationManager`;

  constructor(private http: HttpClient) {}

  createReservation(data: CreateReservationDto): Observable<any> {
    // Normalize dates to ensure consistent ISO format with timezone
    const payload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      halfDay: data.halfDay ?? false
    };
    
    return this.http.post<{ status: number; data: { reservation: Reservation } | { message: string } }>(
      `${this.apiUrl}/create`,
      payload,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  getReservationsForSlot(slotId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/by-slot/${slotId}`, {
      withCredentials: true
    });
  }
}