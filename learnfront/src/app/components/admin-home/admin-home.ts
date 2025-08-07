import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { inject, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-admin-home',
  standalone: false,
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome {
totalUsers: number = 0;

  renderer = inject(Renderer2);
  styleSelectorToggle!: boolean;
  setFontFamily!: string;
userName: string = '';
 users: any[] = [];
  activeUsers: number = 875;
  newRegistrations: number = 25;

  constructor(private router: Router, private userService : UserService) {
    this.getUserNameFromToken();
    
  }
logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/']);
  }

private getUserNameFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.userName = decodedToken.fullName; 
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

 ngOnInit() {
  this.loadAllUsers();
    this.userService.getUserCount().subscribe({
      next: (count) => this.totalUsers = count,
      error: (err) => console.error('Failed to fetch user count', err)
    });
  }

loadAllUsers() {
    this.userService.getAllStudents().subscribe(
      (data) => {
        this.users = data.sort((a, b) => b.idUser - a.idUser).slice(0, 5);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }


}
