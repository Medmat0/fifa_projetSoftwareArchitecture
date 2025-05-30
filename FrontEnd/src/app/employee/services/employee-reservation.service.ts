import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../utils/config';
import { Reservation } from '../../shared/models/reservation';

export interface CreateReservationDto {
  slotId: string;
  startDate: string;
  endDate: string;
  halfDay?: boolean;
}

export interface ReservationResponse {
  id: string;
  slotId: string;
  startDate: string;
  endDate: string;
  halfDay: boolean;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeReservationService {
  private readonly apiUrl = `${API_URL}/reservation`;

  constructor(private http: HttpClient) {}

  createReservation(data: CreateReservationDto): Observable<any> {
    // Normalize dates to ensure consistent ISO format with timezone
    const payload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      halfDay: data.halfDay ?? false // Ensure halfDay is always provided
    };
    
    console.log('Envoi de la requête avec les données :', payload);
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

  getReservationsForSlot(slotId: string): Observable<ReservationResponse[]> {
    // Endpoint à adapter selon votre API
    return this.http.get<ReservationResponse[]>(`${this.apiUrl}/by-slot/${slotId}`, {
      withCredentials: true
    });
  }
}
