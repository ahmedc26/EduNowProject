import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
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
  if (confirm('Are you sure you want to logout?')) {
        alert('Logging out...');}
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
