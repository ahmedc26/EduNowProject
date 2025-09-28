import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgressService, QuestionAttempt } from './progress.service';

export interface GenerateQuestionRequest {
  level?: string;
  levelType?: string;
  subject?: string;
  topic?: string;
  skill?: string;
  subSkill?: string;
  subSubSkill?: string;
  importantOnly?: boolean;
}

export interface QuestionResponse {
  id: string;
  question: string;
  answer: string;
  subject?: string;
  topic?: string;
  difficulty?: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionGeneratorService {
  private apiUrl = '/api/v1/questions';

  constructor(
    private http: HttpClient,
    private progressService: ProgressService
  ) {}

  generateQuestion(request: GenerateQuestionRequest): Observable<QuestionResponse> {
    return this.http.post<QuestionResponse>(`${this.apiUrl}/generate`, request);
  }

  // Method to track when a question is answered
  trackQuestionAnswer(
    question: QuestionResponse,
    userAnswer: string,
    timeSpent: number
  ): void {
    const attempt: QuestionAttempt = {
      id: question.id || this.generateId(),
      question: question.question,
      userAnswer: userAnswer,
      correctAnswer: question.answer,
      isCorrect: userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim(),
      subject: question.subject || 'General',
      topic: question.topic || 'Mixed',
      difficulty: question.difficulty || 'Medium',
      timeSpent: timeSpent,
      timestamp: new Date().toISOString()
    };

    this.progressService.trackDetailedProgress(attempt).subscribe({
      next: (response) => {
        console.log('Progress tracked successfully:', response);
      },
      error: (error) => {
        console.error('Error tracking progress:', error);
      }
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
