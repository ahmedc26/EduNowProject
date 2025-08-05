import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-home',
  standalone: false,
  templateUrl: './student-home.html',
  styleUrl: './student-home.css'
})
export class StudentHome {
  userName: string = '';
  constructor(private router:Router){
  this.getUserNameFromToken();
  }

private getUserNameFromToken() {
  const token = localStorage.getItem('token');
  if(token){
    try{
    const DecodedToken: any = jwtDecode(token);
    this.userName=DecodedToken.fullName;
  } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/']);
  }
}

