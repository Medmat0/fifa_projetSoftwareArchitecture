import {Injectable} from '@angular/core';
import {API_URL} from '../../utils/config';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {Role, User, VehicleType} from '../../shared/models/user';
import {Reservation} from '../../shared/models/reservation';
import {UserDTO} from '../../shared/models/DTO/userDTO';

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


  addEmployee(employeeData: UserDTO): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/employees`, employeeData, {
      withCredentials: true //envoi des credentials et reception cookies
    }).pipe(tap((response: any) => {
      console.log('Add Employee successful:', response);
      }),
      catchError((error) => {
        console.error('Add Employee error', error);
        return throwError(() => new Error('Error adding employee'));
      })
    );
  }

  deleteEmployee(employeeId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/employees/${employeeId}`, {
      withCredentials: true //envoi des credentials et reception cookies
    }).pipe(tap((response: any) => {
      console.log('Delete Employee successful:', response);
      }),
      catchError((error) => {
        console.error('Delete Employee error', error);
        return throwError(() => new Error('Error deleting employee'));
      })
    );
  }

  modifyEmployee(employeeId: string, employeeData:UserDTO): Observable<any> {

    return this.httpClient.patch(`${this.apiUrl}/employees/${employeeId}`, employeeData, {
      withCredentials: true //envoi des credentials et reception cookies
    }).pipe(tap((response: any) => {
      console.log('Modify Employee successful:', response);
      }),
      catchError((error) => {
        console.error('Modify Employee error', error);
        return throwError(() => new Error('Error modifying employee'));
      })
    );
  }

}
