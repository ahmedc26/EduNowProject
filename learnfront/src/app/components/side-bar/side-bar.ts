import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css'
})
export class SideBar {
  userName: string = '';

  constructor() {
    this.getUserNameFromToken();
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  private getUserNameFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Use jwt-decode if available, otherwise just a placeholder
        const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
        this.userName = decodedToken.fullName || 'Admin';
      } catch (error) {
        this.userName = 'Admin';
      }
    }
  }

  
}
