import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EduLevel } from '../components/edu-level/edu-level';
import { Observable } from 'rxjs';
import { Level } from '../models/level.model';
import { Subject } from '../models/subject.model';
@Injectable({
  providedIn: 'root'
})
export class LevelService {
private apiUrl = 'http://localhost:8088/api/v1/users';
constructor( private http: HttpClient ){}

  getLevels():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/getLevels`)
  }

  addLevel(level: Level): Observable<EduLevel> {
    return this.http.post<EduLevel>(`${this.apiUrl}/addLevel`, level);
  }
  
  deleteLevel(idLevel:number):Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/delete-Level/${idLevel}`);
  }

  getSubjects():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/getallSubjects`)
  }

  addSubject(subject: Subject): Observable<EduLevel> {
    return this.http.post<EduLevel>(`${this.apiUrl}/addSubject`, subject);
  }

  deleteSubject(idSubject:number):Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/Delete-Subject/${idSubject}`);
  }

    addEntity(entityType: 'level' | 'subject', entityData: Level | Subject):Observable<EduLevel>{
      const endpointMap = {
    level: 'addLevel',
    subject: 'addSubject'
      };
      return this.http.post<EduLevel>(`${this.apiUrl}/${endpointMap[entityType]}`, entityData);
    }
  
    deleteEntity(entityType: 'level' | 'Subject', id:number):Observable<void>{
    const endpointMap = {
      level: 'delete-Level',
      Subject: 'Delete-Subject'};
      return this.http.delete<void>(`${this.apiUrl}/${endpointMap[entityType]}/${id}`);

    }
}
