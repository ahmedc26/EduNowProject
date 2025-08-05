import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/v1/auth/register';
 constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  activateAccount(token: string):Observable<any>{
    return this.http.get(`/api/v1/auth/activate-account?token=${token}`);
  }

  login(credentials:{email: string, password: string}): Observable<any> {
    return this.http.post(`/api/v1/auth/authenticate`,credentials);
  }

}
