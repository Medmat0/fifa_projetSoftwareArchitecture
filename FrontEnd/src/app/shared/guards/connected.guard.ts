import {Injectable} from "@angular/core";
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {API_URL} from "../../utils/config";


@Injectable({
    providedIn: 'root'
})

export class ConnectedGuard {
    private readonly apiUrl = `${API_URL}/auth`; // URL of the authentication API
    constructor(private http: HttpClient,private router: Router) {}

    canActivate(): Observable<any> {
        return this.http.get(`${this.apiUrl}/auth-check`, {
            withCredentials: true //envoi des credentials et reception cookies
        }).pipe(tap((response: any) => {
                if (response && response.authenticated === true) {
                    console.log('User is authenticated:', response);
                } else if (response.message === 'Invalid or expired token' && response.authenticated === false) {
                    console.error('Invalid or Expired access Token');
                    localStorage.removeItem('utilisateur');
                    this.router.navigate(['/auth/login']); // Redirect to login
                } else if (response.message === 'User not authenticated' && response.authenticated === false) {
                    console.log('User is not authenticated:', response);
                    localStorage.removeItem('utilisateur');
                    this.router.navigate(['/auth/login']); // Redirect to login
                }
            })
        );

    }
}
