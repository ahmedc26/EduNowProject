import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ListFormat } from 'typescript';
import { reportUnhandledError } from 'rxjs/internal/util/reportUnhandledError';
import { User } from '../models/user.model';
import { LoginHistory } from '../models/login-history.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8088/api/v1/users';
  constructor(private http: HttpClient) {}

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
}
  getAllStudents(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/allstudents`);

  }

 

  deleteUser(iduser:number):Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/delete/${iduser}`);
  }

  updateUser(user: User): Observable<{ message: string; token: string }> {
  return this.http.put<{ message: string; token: string }>(`${this.apiUrl}/update/user`, user)
  .pipe(
        catchError(error => {
          console.error('Error updating user:', error);
          return throwError(() => error);
        })
      );
  }


  getUserById(iduser: number) {
    return this.http.get<User>(`${this.apiUrl}/view-user/${iduser}`);
  }

  changePassword(payload: { currentPassword: string; newPassword: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, payload)
      .pipe(
        catchError(error => {
          console.error('Error changing password:', error);
          return throwError(() => error);
        })
      );
  }

 getUserLoginHistory(userId: number): Observable<LoginHistory[]> {
    return this.http.get<LoginHistory[]>(`http://localhost:8088/api/v1/auth/login-history/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching login history:', error);
          return throwError(() => error);
        })
      );
  }

  getLastLogin(userId: number): Observable<LoginHistory> {
    return this.http.get<LoginHistory>(`http://localhost:8088/api/v1/auth/last-login/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching last login:', error);
          return throwError(() => error);
        })
      );
  }

  logout(userId: number): Observable<void> {
    return this.http.post<void>(`http://localhost:8088/api/v1/auth/logout/${userId}`, {})
      .pipe(
        catchError(error => {
          console.error('Error logging out:', error);
          return throwError(() => error);
        })
      );
  }

  getAllLoginHistory(): Observable<LoginHistory[]> {
    return this.http.get<LoginHistory[]>(`http://localhost:8088/api/v1/auth/admin/login-history`)
      .pipe(
        catchError(error => {
          console.error('Error fetching all login history:', error);
          return throwError(() => error);
        })
      );
  }

  }

