import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface StudentProgress {
  correctAnswersCount: number;
  totalQuestionsCount: number;
  lastUpdated: string;
  accuracyPercentage: number;
}

export interface ProgressRequest {
  userId: string;
  isCorrect: boolean;
  questionId?: string;
  subject?: string;
  topic?: string;
  skill?: string;
  timeSpent?: number;
}

export interface ProgressResponse {
  correctAnswersCount: number;
  totalQuestionsCount: number;
  accuracyPercentage: number;
  lastUpdated: string;
  message: string;
}

export interface QuestionAttempt {
  id: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  subject: string;
  topic: string;
  difficulty: string;
  timeSpent: number;
  timestamp: string;
}

export interface ProgressStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  averageTimePerQuestion: number;
  totalTimeSpent: number;
  subjectBreakdown: SubjectStats[];
  difficultyBreakdown: DifficultyStats[];
  recentActivity: QuestionAttempt[];
  streak: number;
  bestStreak: number;
}

export interface SubjectStats {
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
}

export interface DifficultyStats {
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = '/api/progress';
  private progressSubject = new BehaviorSubject<StudentProgress>({
    correctAnswersCount: 0,
    totalQuestionsCount: 0,
    lastUpdated: new Date().toISOString(),
    accuracyPercentage: 0
  });

  public progress$ = this.progressSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProgressFromStorage();
  }

  getProgress(): StudentProgress {
    return this.progressSubject.value;
  }

  updateProgress(correctAnswers: number, totalQuestions: number): void {
    const accuracyPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    const progress: StudentProgress = {
      correctAnswersCount: correctAnswers,
      totalQuestionsCount: totalQuestions,
      lastUpdated: new Date().toISOString(),
      accuracyPercentage
    };

    this.progressSubject.next(progress);
    this.saveProgressToStorage(progress);
  }

  incrementCorrectAnswers(): void {
    const current = this.getProgress();
    this.updateProgress(current.correctAnswersCount + 1, current.totalQuestionsCount + 1);
  }

  incrementTotalQuestions(): void {
    const current = this.getProgress();
    this.updateProgress(current.correctAnswersCount, current.totalQuestionsCount + 1);
  }

  resetProgress(): void {
    this.updateProgress(0, 0);
  }

  trackProgress(request: ProgressRequest): Observable<ProgressResponse> {
    return this.http.post<ProgressResponse>(`${this.apiUrl}/track`, request).pipe(
      map(response => {

        this.updateProgress(response.correctAnswersCount, response.totalQuestionsCount);
        return response;
      }),
      catchError(error => {
        console.error('Error tracking progress:', error);

        this.incrementTotalQuestions();
        throw error;
      })
    );
  }

  getProgressFromBackend(userId: string): Observable<ProgressResponse> {
    return this.http.get<ProgressResponse>(`${this.apiUrl}/${userId}`).pipe(
      map(response => {

        this.updateProgress(response.correctAnswersCount, response.totalQuestionsCount);
        return response;
      }),
      catchError(error => {
        console.error('Error getting progress from backend:', error);
        const localProgress = this.getProgress();
        return new Observable<ProgressResponse>(observer => {
          observer.next({
            correctAnswersCount: localProgress.correctAnswersCount,
            totalQuestionsCount: localProgress.totalQuestionsCount,
            accuracyPercentage: localProgress.accuracyPercentage,
            lastUpdated: localProgress.lastUpdated,
            message: 'Using local progress data'
          });
          observer.complete();
        });
      })
    );
  }

  resetProgressOnBackend(userId: string): Observable<ProgressResponse> {
    return this.http.delete<ProgressResponse>(`${this.apiUrl}/${userId}/reset`).pipe(
      map(response => {
        this.updateProgress(0, 0);
        return response;
      }),
      catchError(error => {
        console.error('Error resetting progress on backend:', error);

        this.resetProgress();
        throw error;
      })
    );
  }

  private loadProgressFromStorage(): void {
    const savedProgress = localStorage.getItem('studentProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        const accuracyPercentage = progress.totalQuestionsCount > 0 ? 
          Math.round((progress.correctAnswersCount / progress.totalQuestionsCount) * 100) : 0;
        
        this.progressSubject.next({
          correctAnswersCount: progress.correctAnswersCount || 0,
          totalQuestionsCount: progress.totalQuestionsCount || 0,
          lastUpdated: progress.lastUpdated || new Date().toISOString(),
          accuracyPercentage
        });
      } catch (error) {
        console.error('Error loading progress from storage:', error);
      }
    }
  }

  private saveProgressToStorage(progress: StudentProgress): void {
    localStorage.setItem('studentProgress', JSON.stringify(progress));
  }

  // Enhanced methods for detailed question tracking
  saveQuestionAttempt(attempt: QuestionAttempt): void {
    const attempts = this.getQuestionAttempts();
    attempts.unshift(attempt); // Add to beginning
    
    // Keep only last 100 attempts to prevent storage bloat
    if (attempts.length > 100) {
      attempts.splice(100);
    }
    
    localStorage.setItem('questionAttempts', JSON.stringify(attempts));
  }

  getQuestionAttempts(): QuestionAttempt[] {
    const attempts = localStorage.getItem('questionAttempts');
    return attempts ? JSON.parse(attempts) : [];
  }

  getDetailedStats(): ProgressStats {
    const attempts = this.getQuestionAttempts();
    return this.calculateDetailedStats(attempts);
  }

  private calculateDetailedStats(attempts: QuestionAttempt[]): ProgressStats {
    const totalQuestions = attempts.length;
    const correctAnswers = attempts.filter(a => a.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracyPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    const totalTimeSpent = attempts.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0;

    // Subject breakdown
    const subjectMap = new Map<string, { total: number; correct: number }>();
    attempts.forEach(attempt => {
      const current = subjectMap.get(attempt.subject) || { total: 0, correct: 0 };
      current.total++;
      if (attempt.isCorrect) current.correct++;
      subjectMap.set(attempt.subject, current);
    });

    const subjectBreakdown: SubjectStats[] = Array.from(subjectMap.entries()).map(([subject, stats]) => ({
      subject,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      accuracyPercentage: Math.round((stats.correct / stats.total) * 100)
    }));

    // Difficulty breakdown
    const difficultyMap = new Map<string, { total: number; correct: number }>();
    attempts.forEach(attempt => {
      const current = difficultyMap.get(attempt.difficulty) || { total: 0, correct: 0 };
      current.total++;
      if (attempt.isCorrect) current.correct++;
      difficultyMap.set(attempt.difficulty, current);
    });

    const difficultyBreakdown: DifficultyStats[] = Array.from(difficultyMap.entries()).map(([difficulty, stats]) => ({
      difficulty,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      accuracyPercentage: Math.round((stats.correct / stats.total) * 100)
    }));

    // Calculate streak
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (let i = attempts.length - 1; i >= 0; i--) {
      if (attempts[i].isCorrect) {
        tempStreak++;
        if (i === attempts.length - 1) {
          currentStreak = tempStreak;
        }
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracyPercentage,
      averageTimePerQuestion,
      totalTimeSpent,
      subjectBreakdown,
      difficultyBreakdown,
      recentActivity: attempts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      streak: currentStreak,
      bestStreak
    };
  }

  clearQuestionHistory(): void {
    localStorage.removeItem('questionAttempts');
  }

  // Enhanced track progress method that also saves question attempt
  trackDetailedProgress(attempt: QuestionAttempt): Observable<ProgressResponse> {
    // Save the question attempt locally
    this.saveQuestionAttempt(attempt);
    
    // Update overall progress
    const current = this.getProgress();
    const newCorrect = attempt.isCorrect ? current.correctAnswersCount + 1 : current.correctAnswersCount;
    const newTotal = current.totalQuestionsCount + 1;
    
    this.updateProgress(newCorrect, newTotal);
    
    // Send to backend
    const request: ProgressRequest = {
      userId: 'current-user', // This should come from auth service
      isCorrect: attempt.isCorrect,
      questionId: attempt.id,
      subject: attempt.subject,
      topic: attempt.topic,
      timeSpent: attempt.timeSpent
    };
    
    return this.trackProgress(request);
  }
}
