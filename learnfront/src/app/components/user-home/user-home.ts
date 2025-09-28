import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ProgressService, StudentProgress, QuestionAttempt } from '../../services/progress.service';
import { Subscription } from 'rxjs';

interface ActivityItem {
  type: 'question' | 'progress' | 'achievement';
  icon: string;
  title: string;
  time: string;
  status: 'success' | 'warning' | 'info';
  statusIcon: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  current: number;
}

interface StudyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.html',
  styleUrl: './user-home.css'
})
export class UserHome implements OnInit, OnDestroy {
  userName: string = '';
  currentLevel: string = '';
  completedTopics: number = 0;
  studyStreak: number = 0;
  studentProgress: StudentProgress | null = null;
  private progressSubscription: Subscription = new Subscription();

  // Enhanced data properties
  private achievements: Achievement[] = [];
  private studyGoals: StudyGoal[] = [];
  private recentActivity: ActivityItem[] = [];

  // Toast notification properties
  showToast: boolean = false;
  toastType: 'success' | 'warning' | 'error' | 'info' = 'info';
  toastTitle: string = '';
  toastMessage: string = '';
  toastIcon: string = '';

  constructor(
    private router: Router,
    private progressService: ProgressService
  ) {
    this.getUserNameFromToken();
    this.initializeData();
  }

  ngOnInit() {
    this.progressSubscription = this.progressService.progress$.subscribe(progress => {
      this.studentProgress = progress;
      this.updateAchievements();
      this.updateStudyGoals();
    });
  }

  ngOnDestroy() {
    this.progressSubscription.unsubscribe();
  }

  private getUserNameFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decodedToken: any = jwtDecode(token);
      this.userName = decodedToken.fullName || decodedToken.sub || 'Student';
    } catch (e) {
      console.error('Failed to decode token', e);
      this.userName = 'Student';
    }
  }

  private initializeData() {
    this.seedDemoStats();
    this.initializeAchievements();
    this.initializeStudyGoals();
    this.generateRecentActivity();
  }

  private seedDemoStats() {
    this.currentLevel = 'Intermediate';
    this.completedTopics = 12;
    this.studyStreak = 5;
  }

  private initializeAchievements() {
    this.achievements = [
      {
        id: 'first_question',
        title: 'First Steps',
        description: 'Answer your first question',
        icon: 'fas fa-baby',
        unlocked: true,
        requirement: 1,
        current: 1
      },
      {
        id: 'streak_5',
        title: 'Consistent Learner',
        description: 'Maintain a 5-day study streak',
        icon: 'fas fa-fire',
        unlocked: this.studyStreak >= 5,
        requirement: 5,
        current: this.studyStreak
      },
      {
        id: 'accuracy_80',
        title: 'Accuracy Master',
        description: 'Achieve 80% accuracy rate',
        icon: 'fas fa-bullseye',
        unlocked: (this.studentProgress?.accuracyPercentage || 0) >= 80,
        requirement: 80,
        current: this.studentProgress?.accuracyPercentage || 0
      },
      {
        id: 'topics_10',
        title: 'Topic Explorer',
        description: 'Complete 10 different topics',
        icon: 'fas fa-compass',
        unlocked: this.completedTopics >= 10,
        requirement: 10,
        current: this.completedTopics
      },
      {
        id: 'questions_50',
        title: 'Question Master',
        description: 'Answer 50 questions',
        icon: 'fas fa-trophy',
        unlocked: (this.studentProgress?.totalQuestionsCount || 0) >= 50,
        requirement: 50,
        current: this.studentProgress?.totalQuestionsCount || 0
      },
      {
        id: 'streak_30',
        title: 'Dedication Champion',
        description: 'Maintain a 30-day study streak',
        icon: 'fas fa-crown',
        unlocked: this.studyStreak >= 30,
        requirement: 30,
        current: this.studyStreak
      }
    ];
  }

  private initializeStudyGoals() {
    this.studyGoals = [
      {
        id: 'daily_questions',
        title: 'Daily Questions',
        target: 10,
        current: this.getDailyProgress(),
        unit: 'questions'
      },
      {
        id: 'weekly_accuracy',
        title: 'Weekly Accuracy',
        target: 85,
        current: this.getWeeklyAccuracy(),
        unit: '%'
      },
      {
        id: 'monthly_topics',
        title: 'Topics This Month',
        target: 20,
        current: this.completedTopics,
        unit: 'topics'
      }
    ];
  }

  private generateRecentActivity() {
    const now = new Date();
    this.recentActivity = [
      {
        type: 'question',
        icon: 'fas fa-question-circle',
        title: 'Answered Mathematics question',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 15), // 15 minutes ago
        status: 'success',
        statusIcon: 'fas fa-check-circle'
      },
      {
        type: 'progress',
        icon: 'fas fa-chart-line',
        title: 'Accuracy improved to 75%',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 60), // 1 hour ago
        status: 'success',
        statusIcon: 'fas fa-arrow-up'
      },
      {
        type: 'achievement',
        icon: 'fas fa-medal',
        title: 'Unlocked "First Steps" achievement',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: 'info',
        statusIcon: 'fas fa-star'
      },
      {
        type: 'question',
        icon: 'fas fa-question-circle',
        title: 'Answered Science question',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 60 * 3), // 3 hours ago
        status: 'warning',
        statusIcon: 'fas fa-times-circle'
      },
      {
        type: 'progress',
        icon: 'fas fa-fire',
        title: 'Study streak: 5 days',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
        status: 'success',
        statusIcon: 'fas fa-fire'
      }
    ];
  }

  private updateAchievements() {
    this.achievements.forEach(achievement => {
      switch (achievement.id) {
        case 'streak_5':
        case 'streak_30':
          achievement.current = this.studyStreak;
          achievement.unlocked = this.studyStreak >= achievement.requirement;
          break;
        case 'accuracy_80':
          achievement.current = this.studentProgress?.accuracyPercentage || 0;
          achievement.unlocked = achievement.current >= achievement.requirement;
          break;
        case 'topics_10':
          achievement.current = this.completedTopics;
          achievement.unlocked = this.completedTopics >= achievement.requirement;
          break;
        case 'questions_50':
          achievement.current = this.studentProgress?.totalQuestionsCount || 0;
          achievement.unlocked = achievement.current >= achievement.requirement;
          break;
      }
    });
  }

  private updateStudyGoals() {
    this.studyGoals.forEach(goal => {
      switch (goal.id) {
        case 'daily_questions':
          goal.current = this.getDailyProgress();
          break;
        case 'weekly_accuracy':
          goal.current = this.getWeeklyAccuracy();
          break;
        case 'monthly_topics':
          goal.current = this.completedTopics;
          break;
      }
    });
  }

  // Public methods for template
  getCurrentLevel(): string {
    const accuracy = this.studentProgress?.accuracyPercentage || 0;
    if (accuracy < 40) return 'Beginner';
    if (accuracy < 70) return 'Intermediate';
    return 'Advanced';
  }

  getFocusArea(): string {
    // This would be calculated based on performance data
    const areas = ['Mathematics', 'Science', 'Geography', 'Literature'];
    return areas[Math.floor(Math.random() * areas.length)];
  }

  getBestTime(): string {
    // This would be calculated based on performance data
    const times = ['morning', 'afternoon', 'evening'];
    return times[Math.floor(Math.random() * times.length)];
  }

  


  getRecentActivity(): ActivityItem[] {
    return this.recentActivity.slice(0, 4); // Show only last 4 activities
  }

  getAchievements(): Achievement[] {
    return this.achievements.slice(0, 4); // Show only first 4 achievements
  }

  getDailyProgress(): number {
    // Mock data - in real app, this would come from daily progress tracking
    return Math.min(10, Math.floor(Math.random() * 12));
  }

  getWeeklyAccuracy(): number {
    // Mock data - in real app, this would be calculated from weekly performance
    const baseAccuracy = this.studentProgress?.accuracyPercentage || 0;
    return Math.min(100, baseAccuracy + Math.floor(Math.random() * 15));
  }

  getRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  }

  // Action methods
  refreshStats() {
    // Simulate refreshing stats
    this.studentProgress = this.progressService.getProgress();
    this.updateAchievements();
    this.updateStudyGoals();
    
    // Show a brief loading state
    setTimeout(() => {
      console.log('Stats refreshed');
    }, 1000);
  }

  editGoals() {
    // This would open a modal or navigate to goals editing page
    console.log('Edit goals clicked');
    // For now, just show an alert
    alert('Goals editing feature coming soon!');
  }

  viewAllAchievements() {
    // This would navigate to a full achievements page
    console.log('View all achievements clicked');
    alert('Full achievements page coming soon!');
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      this.router.navigate(['/home']);
    }
  }

  // Utility methods for enhanced functionality
  getPerformanceColor(percentage: number): string {
    if (percentage >= 80) return '#10b981'; // green
    if (percentage >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  }

  getStreakMessage(): string {
    if (this.studyStreak >= 30) return 'Incredible dedication!';
    if (this.studyStreak >= 7) return 'Great consistency!';
    if (this.studyStreak >= 3) return 'Keep it up!';
    return 'Start your streak today!';
  }

  getMotivationalMessage(): string {
    const messages = [
      'Every question brings you closer to mastery!',
      'Learning is a journey, not a destination.',
      'Your progress is inspiring!',
      'Knowledge is power - keep building yours!',
      'Every expert was once a beginner.',
      'The only way to learn is to keep trying!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Method to simulate adding a new question attempt
  simulateQuestionAttempt() {
    const subjects = ['Mathematics', 'Science', 'Geography', 'Literature'];
    const topics = ['Algebra', 'Physics', 'World Capitals', 'Classic Authors'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    const attempt: QuestionAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      question: 'Sample question for demonstration',
      userAnswer: 'Sample answer',
      correctAnswer: 'Correct answer',
      isCorrect: Math.random() > 0.3, // 70% chance of being correct
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      topic: topics[Math.floor(Math.random() * topics.length)],
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      timeSpent: Math.floor(Math.random() * 60) + 10, // 10-70 seconds
      timestamp: new Date().toISOString()
    };

    this.progressService.trackDetailedProgress(attempt).subscribe({
      next: (response) => {
        console.log('Question attempt tracked:', response);
        this.refreshStats();
        this.showSuccessToast(
          'Question Added!',
          `You answered a ${attempt.difficulty} ${attempt.subject} question ${attempt.isCorrect ? 'correctly' : 'incorrectly'}.`
        );
      },
      error: (error) => {
        console.error('Error tracking question attempt:', error);
        this.showErrorToast(
          'Error',
          'Failed to track question attempt. Please try again.'
        );
      }
    });
  }

  // Toast notification methods
  showSuccessToast(title: string, message: string) {
    this.toastType = 'success';
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastIcon = 'fas fa-check-circle';
    this.showToast = true;
    this.autoHideToast();
  }

  showWarningToast(title: string, message: string) {
    this.toastType = 'warning';
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastIcon = 'fas fa-exclamation-triangle';
    this.showToast = true;
    this.autoHideToast();
  }

  showErrorToast(title: string, message: string) {
    this.toastType = 'error';
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastIcon = 'fas fa-times-circle';
    this.showToast = true;
    this.autoHideToast();
  }

  showInfoToast(title: string, message: string) {
    this.toastType = 'info';
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastIcon = 'fas fa-info-circle';
    this.showToast = true;
    this.autoHideToast();
  }

  hideToast() {
    this.showToast = false;
  }

  private autoHideToast() {
    setTimeout(() => {
      this.showToast = false;
    }, 5000); // Auto-hide after 5 seconds
  }
}