import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

interface ActivityItem {
  type: 'user' | 'system' | 'warning' | 'error';
  icon: string;
  title: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
  statusIcon: string;
}

interface AlertItem {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  icon: string;
  title: string;
  message: string;
  time: string;
  dismissed: boolean;
}

interface SystemHealth {
  database: number;
  api: number;
  storage: number;
  memory: number;
}

@Component({
  selector: 'app-admin-home',
  standalone: false,
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit, OnDestroy {
  // User data
  userName: string = '';
  totalUsers: number = 0;
  activeUsers: number = 875;
  newRegistrations: number = 25;
  users: any[] = [];

  // System data
  private systemHealth: SystemHealth = {
    database: 95,
    api: 98,
    storage: 78,
    memory: 82
  };

  // Activity and alerts
  private recentActivity: ActivityItem[] = [];
  private alerts: AlertItem[] = [];

  // Toast notifications
  showToast: boolean = false;
  toastType: 'success' | 'warning' | 'error' | 'info' = 'info';
  toastTitle: string = '';
  toastMessage: string = '';
  toastIcon: string = '';

  // Subscriptions
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.getUserNameFromToken();
    this.initializeData();
  }

  ngOnInit() {
    this.loadAllUsers();
    this.loadUserCount();
    this.generateMockData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getUserNameFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decodedToken: any = jwtDecode(token);
      this.userName = decodedToken.fullName || 'Admin';
    } catch (error) {
      console.error('Error decoding token:', error);
      this.userName = 'Admin';
    }
  }

  private initializeData() {
    this.generateRecentActivity();
    this.generateAlerts();
  }

  private generateMockData() {
    // Generate mock system health data
    this.systemHealth = {
      database: Math.floor(Math.random() * 10) + 90, // 90-99%
      api: Math.floor(Math.random() * 5) + 95, // 95-99%
      storage: Math.floor(Math.random() * 20) + 70, // 70-89%
      memory: Math.floor(Math.random() * 15) + 75 // 75-89%
    };
  }

  private generateRecentActivity() {
    const now = new Date();
    this.recentActivity = [
      {
        type: 'user',
        icon: 'fas fa-user-plus',
        title: 'New user registration: John Doe',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 5), // 5 minutes ago
        status: 'success',
        statusIcon: 'fas fa-check-circle'
      },
      {
        type: 'system',
        icon: 'fas fa-database',
        title: 'Database backup completed successfully',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 15), // 15 minutes ago
        status: 'success',
        statusIcon: 'fas fa-check-circle'
      },
      {
        type: 'warning',
        icon: 'fas fa-exclamation-triangle',
        title: 'High memory usage detected',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
        status: 'warning',
        statusIcon: 'fas fa-exclamation-triangle'
      },
      {
        type: 'user',
        icon: 'fas fa-user-edit',
        title: 'User profile updated: Sarah Johnson',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 45), // 45 minutes ago
        status: 'info',
        statusIcon: 'fas fa-info-circle'
      },
      {
        type: 'system',
        icon: 'fas fa-server',
        title: 'System maintenance scheduled',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 60), // 1 hour ago
        status: 'info',
        statusIcon: 'fas fa-info-circle'
      }
    ];
  }

  private generateAlerts() {
    const now = new Date();
    this.alerts = [
      {
        id: '1',
        severity: 'warning',
        icon: 'fas fa-exclamation-triangle',
        title: 'Storage Usage High',
        message: 'Server storage is at 78% capacity. Consider cleaning up old files.',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 10),
        dismissed: false
      },
      {
        id: '2',
        severity: 'info',
        icon: 'fas fa-info-circle',
        title: 'New Feature Available',
        message: 'Question generator v2.0 is now available for testing.',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 60 * 2),
        dismissed: false
      },
      {
        id: '3',
        severity: 'success',
        icon: 'fas fa-check-circle',
        title: 'Backup Completed',
        message: 'Daily backup has been completed successfully.',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 60 * 4),
        dismissed: false
      },
      {
        id: '4',
        severity: 'error',
        icon: 'fas fa-times-circle',
        title: 'API Error Rate High',
        message: 'API error rate has increased to 2.5%. Please investigate.',
        time: this.getRelativeTime(now.getTime() - 1000 * 60 * 60 * 6),
        dismissed: false
      }
    ];
  }

  // Public methods for template
  loadAllUsers() {
    const subscription = this.userService.getAllStudents().subscribe(
      (data) => {
        this.users = data.sort((a, b) => b.idUser - a.idUser).slice(0, 5);
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.showErrorToast('Error', 'Failed to load user data');
      }
    );
    this.subscriptions.add(subscription);
  }

  loadUserCount() {
    const subscription = this.userService.getUserCount().subscribe({
      next: (count) => {
        this.totalUsers = count;
      },
      error: (err) => {
        console.error('Failed to fetch user count', err);
        this.showErrorToast('Error', 'Failed to load user count');
      }
    });
    this.subscriptions.add(subscription);
  }

  // Statistics methods
  getGrowthRate(): number {
    // Mock growth rate calculation
    return Math.floor(Math.random() * 20) + 5; // 5-24%
  }

  getTotalQuestions(): string {
    // Mock total questions
    return '12,450';
  }

  getActiveSessions(): number {
    // Mock active sessions
    return Math.floor(Math.random() * 50) + 100; // 100-149
  }

  getAverageAccuracy(): number {
    // Mock average accuracy
    return Math.floor(Math.random() * 15) + 75; // 75-89%
  }

  getSystemUptime(): number {
    // Mock system uptime
    return Math.floor(Math.random() * 2) + 99; // 99-100%
  }

  // System health methods
  getDatabaseHealth(): number {
    return this.systemHealth.database;
  }

  getApiHealth(): number {
    return this.systemHealth.api;
  }

  getStorageHealth(): number {
    return this.systemHealth.storage;
  }

  getMemoryHealth(): number {
    return this.systemHealth.memory;
  }

  getSystemHealthStatus(): string {
    const avgHealth = (this.systemHealth.database + this.systemHealth.api + 
                      this.systemHealth.storage + this.systemHealth.memory) / 4;
    
    if (avgHealth >= 90) return 'healthy';
    if (avgHealth >= 75) return 'warning';
    return 'critical';
  }

  getSystemHealthIcon(): string {
    const status = this.getSystemHealthStatus();
    switch (status) {
      case 'healthy': return 'fas fa-check-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'critical': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  }

  getSystemHealthText(): string {
    const status = this.getSystemHealthStatus();
    switch (status) {
      case 'healthy': return 'All Systems Operational';
      case 'warning': return 'Some Issues Detected';
      case 'critical': return 'Critical Issues';
      default: return 'Unknown Status';
    }
  }

  // User management methods
  getUserAvatar(user: any): string {
    // Return a placeholder avatar or user's actual avatar
    return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=667eea&color=fff&size=100`;
  }

  getUserStatus(user: any): string {
    // Mock user status - in real app, this would come from user data
    const statuses = ['online', 'offline', 'away'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  // Activity and alerts methods
  getRecentActivity(): ActivityItem[] {
    return this.recentActivity.slice(0, 5);
  }

  getAlerts(): AlertItem[] {
    return this.alerts.filter(alert => !alert.dismissed).slice(0, 4);
  }

  // Action methods
  refreshData() {
    this.showInfoToast('Refreshing', 'Updating dashboard data...');
    this.loadAllUsers();
    this.loadUserCount();
    this.generateMockData();
    this.generateRecentActivity();
    
    setTimeout(() => {
      this.showSuccessToast('Success', 'Dashboard data refreshed successfully');
    }, 1000);
  }

  refreshStats() {
    this.generateMockData();
    this.showSuccessToast('Updated', 'System statistics refreshed');
  }

  toggleQuickActions() {
    // This could toggle a quick actions menu or show more options
    console.log('Toggle quick actions');
  }

  exportData() {
    this.showInfoToast('Exporting', 'Preparing data export...');
    // Mock export functionality
    setTimeout(() => {
      this.showSuccessToast('Export Complete', 'Data has been exported successfully');
    }, 2000);
  }

  viewUser(user: any) {
    console.log('View user:', user);
    this.showInfoToast('User Details', `Viewing details for ${user.firstName} ${user.lastName}`);
    // Navigate to user details page
    this.router.navigate(['/user-list'], { queryParams: { userId: user.idUser } });
  }

  editUser(user: any) {
    console.log('Edit user:', user);
    this.showInfoToast('Edit User', `Editing ${user.firstName} ${user.lastName}`);
    // Navigate to user edit page
    this.router.navigate(['/update-user', user.idUser]);
  }

  viewAllActivity() {
    console.log('View all activity');
    this.showInfoToast('Activity Log', 'Opening full activity log');
    // Navigate to activity log page
  }

  markAllAsRead() {
    this.alerts.forEach(alert => alert.dismissed = true);
    this.showSuccessToast('Alerts Cleared', 'All alerts have been marked as read');
  }

  dismissAlert(alert: AlertItem) {
    alert.dismissed = true;
    this.showSuccessToast('Alert Dismissed', 'Alert has been dismissed');
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      this.showSuccessToast('Logged Out', 'You have been successfully logged out');
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    }
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

  // Utility methods
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Method to simulate real-time updates
  startRealTimeUpdates() {
    // In a real application, this would connect to WebSocket or polling
    setInterval(() => {
      this.generateMockData();
      // Update UI if needed
    }, 30000); // Update every 30 seconds
  }

  // Method to handle system notifications
  handleSystemNotification(notification: any) {
    console.log('System notification:', notification);
    // Handle different types of system notifications
    switch (notification.type) {
      case 'user_registration':
        this.showInfoToast('New User', `New user registered: ${notification.data.name}`);
        break;
      case 'system_alert':
        this.showWarningToast('System Alert', notification.data.message);
        break;
      case 'error':
        this.showErrorToast('System Error', notification.data.message);
        break;
      default:
        this.showInfoToast('Notification', notification.data.message);
    }
  }
}