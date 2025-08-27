import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-home',
  standalone: false,
  templateUrl: './user-home.html',
  styleUrl: './user-home.css'
})
export class UserHome {
  userName: string = '';
  currentLevel: string = '';
  completedTopics: number = 0;
  studyStreak: number = 0;

  constructor(private router: Router) {
    this.getUserNameFromToken();
    this.seedDemoStats();
  }

  private getUserNameFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decodedToken: any = jwtDecode(token);
      this.userName = decodedToken.fullName || decodedToken.sub || '';
    } catch (e) {
      console.error('Failed to decode token', e);
    }
  }

  private seedDemoStats() {
    this.currentLevel = 'Beginner';
    this.completedTopics = 12;
    this.studyStreak = 5;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
}
