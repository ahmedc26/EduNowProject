import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthGuardService implements CanActivate{
   constructor(private router: Router) { }

   canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/register']);
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const isExpired = decodedToken.exp < Date.now() / 1000;

      if (isExpired) {
        localStorage.removeItem('token');
        this.router.navigate(['/register']);
        return false;
      }
 const StudentRole = decodedToken.authorities && 
                         decodedToken.authorities.includes('STUDENT');
      
      if (!StudentRole) {
        this.router.navigate(['/access-denied']);
        return false;
      }

      return true;

    } catch (error) {
      localStorage.removeItem('token');
      this.router.navigate(['/register']);
      return false;
    }
  }
}