import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: false,
  templateUrl: './access-denied.html',
  styleUrl: './access-denied.css'
})

export class AccessDenied {
 constructor(private router: Router) {}

  goHome() {
    const token = localStorage.getItem('token');
     if (token) {
      try {
        const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
     if (decodedToken.authorities && decodedToken.authorities.includes('USER')) {
          this.router.navigate(['/Admin-home']);
        } else {
          this.router.navigate(['/user-home']);
        }
      } catch (error) {
        this.router.navigate(['/register']);
      }
    } else {
      this.router.navigate(['/register']);
    }
  }
}