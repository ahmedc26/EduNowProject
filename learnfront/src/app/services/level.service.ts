import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Level } from '../components/level/level';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LevelService {
private apiUrl = 'http://localhost:8088/api/v1/users';
constructor( private http: HttpClient ){}

  getLevels():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/getLevels`)
  }

  addLevel(level: Level): Observable<Level> {
    return this.http.post<Level>(`${this.apiUrl}/addLevel`, level);
  }
  
}
