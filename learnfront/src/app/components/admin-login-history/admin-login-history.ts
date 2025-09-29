import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LoginHistory } from '../../models/login-history.model';

@Component({
  selector: 'app-admin-login-history',
  standalone: false,
  templateUrl: './admin-login-history.html',
  styleUrl: './admin-login-history.css'
})
export class AdminLoginHistory implements OnInit {
  loginHistory: LoginHistory[] = [];
  isLoading: boolean = false;
  error: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAllLoginHistory();
  }

  loadAllLoginHistory(): void {
    this.isLoading = true;
    this.error = '';
    
    this.userService.getAllLoginHistory().subscribe({
      next: (history) => {
        this.loginHistory = history;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading login history:', error);
        this.error = 'Failed to load login history';
        this.isLoading = false;
      }
    });
  }

  refreshHistory(): void {
    this.loadAllLoginHistory();
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Logged Out';
  }
}


