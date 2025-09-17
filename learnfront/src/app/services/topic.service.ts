import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = 'http://localhost:8088/api/v1/users';
constructor( private http: HttpClient ){}

addTopicWithFile(topic: Topic, file: File): Observable<any> {
    const formData = new FormData();
    
    formData.append('topic', JSON.stringify(topic));
    if (file) {
      formData.append('file', file, file.name);
    }

    return this.http.post<Topic>(`${this.apiUrl}/add-topic-with-file`, formData);
  }
 getAllTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl}/getAllTopics`);
  }
 getTopicById(id: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/get-topic/${id}`);
  }
 deleteTopic(topic: Topic): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete-topic`, {
      body: topic
    });
  }

addTopic(topic: Topic): Observable<Topic> {
    return this.http.post<Topic>(`${this.apiUrl}/add-topic`, topic);
  }

downloadFile(filePath: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filePath}`, {
      responseType: 'blob'
    });
  }
  
 viewFile(filePath: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/view/${filePath}`, {
      responseType: 'blob'
    });
  }

   getTopicsCount(idSubject:number):Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/count-topics/${idSubject}`)
  }

  getTopicsByLevel(idLevel:number):Observable<Topic[]>{
    return this.http.get<Topic[]>(`${this.apiUrl}/getTopics/${idLevel}`)
  }

  getTopicsBySubjectAndLevel(idLevel:number,idSubject:number):Observable<Topic[]>{
    return this.http.get<Topic[]>(`${this.apiUrl}/getTopics/${idSubject}/${idLevel}`)
  }

}
