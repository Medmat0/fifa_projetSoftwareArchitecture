import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {API_URL} from '../../utils/config';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${API_URL}/auth`; // URL of the authentication API
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatusSubject.asObservable();
  errorMessage: string | null = null;

  constructor(
    private http : HttpClient,
    private router: Router
  ) {}


  login(email: string | null | undefined, password: string | null | undefined): Observable<any> {
    const body = {email, password};
    return this.http.post(`${this.apiUrl}/login`, body, {
      withCredentials: true //envoi des credentials et reception cookies
    }).pipe(tap((response: any) => {
        if (response.utilisateur) {
          localStorage.setItem('utilisateur', JSON.stringify(response.utilisateur));
          console.log('Login successful:', response);
          this.authStatusSubject.next(true);
        }
      }),
      catchError((error) => {
        this.errorMessage = error.error.message;
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true //envoi des credentials
    }).pipe(
      tap(() => {
        localStorage.removeItem('utilisateur');
        this.authStatusSubject.next(false);
        this.router.navigate(['/']);
        console.log('Logout successful');
      }),
      catchError((error) => {
        console.error('Logout failed', error);
        return throwError(() => new Error('Logout failed'));
      })
    );
  }


  checkAuthStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth-check`, {
      withCredentials: true // Send credentials and receive cookies
    }).pipe(
      tap((response: any) => {
        if (response && response.authenticated === true) {
          localStorage.setItem('utilisateur', JSON.stringify(response.utilisateur));
          console.log('User is authenticated:', response);
          this.authStatusSubject.next(true);
          console.log('Authentication status test ll:',this.authStatusSubject.value);
        } else if (response.message === 'Invalid or expired token' && response.authenticated === false) {
          console.error('Invalid or Expired access Token');
          localStorage.removeItem('utilisateur');
          this.logout().subscribe({
            next: () => {
              console.log('User logged out due to invalid or expired token');
              confirm('Your session has expired. Please log in again.');
              this.authStatusSubject.next(false);
              this.router.navigate(['/']); // Redirect to home
            },
            error: (err) => {
              console.error('Error during logout:', err);
            }
          });
        }else if (response.message === 'User not authenticated' && response.authenticated === false){
          console.log('User is not authenticated:', response);
          this.authStatusSubject.next(false);
          localStorage.removeItem('utilisateur');
        }
      }),
      catchError((error) => {
        console.error('Error checking authentication status', error);
        this.authStatusSubject.next(false);
        localStorage.removeItem('utilisateur');
        this.router.navigate(['/']); // Redirect to home on error

        return throwError(() => new Error('Error checking authentication status'));
      })
    );
  }


  checkRole(): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-role`, {
      withCredentials: true //envoi des credentials et reception cookies
    }).pipe(
      tap((response: any) => {
        if (response && response.role) {
          console.log('User role:', response.role);
          return response.role;
        } else {
          console.error('Role not found in response');
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error checking user role', error);
        return throwError(() => new Error('Error checking user role'));
      })
    );
  }


}
