import {Injectable} from '@angular/core';
import {API_URL} from '../../utils/config';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SecretaryUserService {
  private readonly apiUrl = `${API_URL}/secretary`; // URL of the secretary API
  constructor(private httpClient: HttpClient) {}


  getAllEmployees() :Observable<any>{
    return this.httpClient.get(`${this.apiUrl}/employees`, {
      withCredentials: true //envoi des credentials et reception cookies
    }).pipe(tap((response: any) => {
        console.log('Fetch Employees successful:', response);


      }),
      catchError((error) => {
        console.error('Fetch Employees error', error);
        return throwError(() => new Error('Error fetching employees'));
      })
    );

    }

}
