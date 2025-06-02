import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_URL } from '../../../../app/utils/config';

@Injectable({
  providedIn: 'root'
})
export class SecretaryReservationService {
  private apiUrl = `${API_URL}/secretary/reservations`;

  constructor(private httpClient: HttpClient) {}

  getAllReservations(): Observable<any> {
    return this.httpClient.get(this.apiUrl, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('Fetch Reservations successful:', response);
      }),
      catchError((error) => {
        console.error('Fetch Reservations error:', error);
        return throwError(() => new Error('Error fetching reservations'));
      })
    );
  }

  deleteReservation(reservationId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/delete/${reservationId}`, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        console.log('Delete Reservation successful:', response);
      }),
      catchError((error) => {
        console.error('Delete Reservation error:', error);
        return throwError(() => new Error('Error deleting reservation'));
      })
    );
  }
}
