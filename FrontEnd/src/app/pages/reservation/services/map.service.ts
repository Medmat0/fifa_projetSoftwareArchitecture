import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../../utils/config';

export interface SlotStatus {
  slotId: string;
  status: 'dispo' | 'reserved';
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private http: HttpClient) {}

  getSlotStatus(): Observable<SlotStatus[]> {
    return this.http.get<SlotStatus[]>(`${API_URL}/mapStatus/all`);
  }
}
