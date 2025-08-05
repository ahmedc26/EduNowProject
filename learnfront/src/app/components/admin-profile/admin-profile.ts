import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { inject, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-profile',
  standalone: false,
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfile {
   constructor(private router: Router, private userService : UserService) {
    this.getUserNameFromToken();
  }
  currentUser: User | null = null;
userName: string = '';



  logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/']);
  }

private getUserNameFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

const nameParts = decodedToken.fullName?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      this.userName = decodedToken.fullName;

        this.currentUser = {
        idUser: decodedToken.iduser,
        firstName: firstName,
        lastName: lastName,
        email: decodedToken.sub,
        phoneNumber: decodedToken.phoneNumber,
        createdDate: new Date (decodedToken.createdDate),
          password: '',
          birthDate: new Date
        
         
      };
     this.userName= decodedToken.fullName;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }
}
