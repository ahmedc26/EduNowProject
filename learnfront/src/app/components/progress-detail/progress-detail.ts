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

  constructor(
    private progressService: ProgressService,
    private questionService: QuestionGeneratorService
  ) {}

  ngOnInit(): void {
    this.loadProgressData();
  }

  loadProgressData(): void {
    this.isLoading = true;
    
    // Get current progress
    this.progress = this.progressService.getProgress();
    
    // Load detailed stats (this would come from backend in real implementation)
    this.loadDetailedStats();
    
    this.isLoading = false;
  }

  loadDetailedStats(): void {
    // Get detailed stats from the enhanced progress service
    this.progressStats = this.progressService.getDetailedStats();
    
    // If no data exists, create some sample data for demonstration
    if (this.progressStats.totalQuestions === 0) {
      this.createSampleData();
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

    // Save sample data to the service
    sampleAttempts.forEach(attempt => {
      this.progressService.saveQuestionAttempt(attempt);
    });

    // Reload stats with the new data
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
