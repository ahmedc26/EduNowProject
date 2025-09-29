import { Component, OnInit } from '@angular/core';
import { ProgressService, StudentProgress, QuestionAttempt, ProgressStats, SubjectStats, DifficultyStats } from '../../services/progress.service';
import { QuestionGeneratorService } from '../../services/question-generator.service';

@Component({
  standalone: false,
  selector: 'app-progress-detail',
  templateUrl: './progress-detail.html',
  styleUrls: ['./progress-detail.css']
})
export class ProgressDetailComponent implements OnInit {
  progress: StudentProgress | null = null;
  progressStats: ProgressStats | null = null;
  isLoading = true;
  selectedTab = 'overview';
  selectedSubject = 'all';
  selectedDifficulty = 'all';
   totalQuestionsCount = 0;
  correctAnswersCount = 0;
  accuracyPercentage = 0;

  
  constructor(
    private progressService: ProgressService,
    private questionService: QuestionGeneratorService
  ) {}

  ngOnInit(): void {
    this.loadProgressData();
  }

  loadProgressData(): void {
    this.isLoading = true;
    

    this.progress = this.progressService.getProgress();
    this.loadMainProgressMetrics();

    this.loadDetailedStats();
    
    this.isLoading = false;
  }

  loadMainProgressMetrics(): void {

    const currentProgress = this.progressService.getProgress();
    
    this.totalQuestionsCount = currentProgress.totalQuestionsCount;
    this.correctAnswersCount = currentProgress.correctAnswersCount;
    this.accuracyPercentage = currentProgress.accuracyPercentage;
    
    console.log('Progress Metrics:', {
      total: this.totalQuestionsCount,
      correct: this.correctAnswersCount,
      accuracy: this.accuracyPercentage
    });
  }

  loadDetailedStats(): void {
    this.progressStats = this.progressService.getDetailedStats();
    if (this.progressStats.totalQuestions === 0 && this.totalQuestionsCount > 0) {
      this.createStatsFromProgress();
    } else if (this.progressStats.totalQuestions === 0) {
      this.createSampleData();
    }
  }

  private createStatsFromProgress(): void {
    // Create basic stats from the main progress data
    const attempts = this.progressService.getQuestionAttempts();
    
    if (attempts.length === 0 && this.totalQuestionsCount > 0) {
      // If we have progress but no detailed attempts, create a basic structure
      this.progressStats = {
        totalQuestions: this.totalQuestionsCount,
        correctAnswers: this.correctAnswersCount,
        incorrectAnswers: this.totalQuestionsCount - this.correctAnswersCount,
        accuracyPercentage: this.accuracyPercentage,
        averageTimePerQuestion: 0,
        totalTimeSpent: 0,
        subjectBreakdown: [],
        difficultyBreakdown: [],
        recentActivity: [],
        streak: 0,
        bestStreak: 0
      };
    } else {
      this.progressStats = this.progressService.getDetailedStats();
    }
  }


  private createSampleData(): void {
    const sampleAttempts: QuestionAttempt[] = [
      {
        id: '1',
        question: 'What is the capital of France?',
        userAnswer: 'Paris',
        correctAnswer: 'Paris',
        isCorrect: true,
        subject: 'Geography',
        topic: 'European Capitals',
        difficulty: 'Easy',
        timeSpent: 15,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        question: 'What is 2 + 2?',
        userAnswer: '5',
        correctAnswer: '4',
        isCorrect: false,
        subject: 'Mathematics',
        topic: 'Basic Arithmetic',
        difficulty: 'Easy',
        timeSpent: 8,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: '3',
        question: 'What is the chemical symbol for water?',
        userAnswer: 'H2O',
        correctAnswer: 'H2O',
        isCorrect: true,
        subject: 'Science',
        topic: 'Chemistry',
        difficulty: 'Medium',
        timeSpent: 25,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: '4',
        question: 'Who wrote Romeo and Juliet?',
        userAnswer: 'Charles Dickens',
        correctAnswer: 'William Shakespeare',
        isCorrect: false,
        subject: 'Literature',
        topic: 'Classic Authors',
        difficulty: 'Medium',
        timeSpent: 20,
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString()
      },
      {
        id: '5',
        question: 'What is the largest planet in our solar system?',
        userAnswer: 'Jupiter',
        correctAnswer: 'Jupiter',
        isCorrect: true,
        subject: 'Science',
        topic: 'Astronomy',
        difficulty: 'Easy',
        timeSpent: 12,
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      }
    ];


    sampleAttempts.forEach(attempt => {
      this.progressService.saveQuestionAttempt(attempt);
    });

    this.progressStats = this.progressService.getDetailedStats();
  }


  getFilteredQuestions(): QuestionAttempt[] {
    if (!this.progressStats) return [];
    
    let filtered = this.progressStats.recentActivity;
    
    if (this.selectedSubject !== 'all') {
      filtered = filtered.filter(q => q.subject === this.selectedSubject);
    }
    
    if (this.selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === this.selectedDifficulty);
    }
    
    return filtered;
  }

  getSubjects(): string[] {
    if (!this.progressStats) return [];
    return ['all', ...new Set(this.progressStats.recentActivity.map(q => q.subject))];
  }

  getDifficulties(): string[] {
    if (!this.progressStats) return [];
    return ['all', ...new Set(this.progressStats.recentActivity.map(q => q.difficulty))];
  }

  formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAccuracyColor(percentage: number): string {
    if (percentage >= 80) return '#10b981'; // green
    if (percentage >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  }

  resetProgress(): void {
    if (confirm('Are you sure you want to reset your progress? This action cannot be undone.')) {
      this.progressService.resetProgress();
      this.progressService.clearQuestionHistory();
      this.loadProgressData();
    }
  }
}
