import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ListFormat } from 'typescript';
import { reportUnhandledError } from 'rxjs/internal/util/reportUnhandledError';
import { User } from '../models/user.model';


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

  updateUser(user: User): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/update/user`, user)
.pipe(
        catchError(error => {
          console.error('Error updating agency:', error);
          return throwError(() => error);
        })
      );
  }


  getUserById(iduser: number) {
    return this.http.get<User>(`${this.apiUrl}/view/${iduser}`);
  }

  }
