import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerStatsService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  getReservationStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reservationHistory/stats`, {
      withCredentials: true
    });
  }
}