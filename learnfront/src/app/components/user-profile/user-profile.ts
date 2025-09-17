import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { inject, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile implements OnInit {
 constructor(private router: Router, private userService : UserService) {}
  currentUser: User | null = null;
userName: string = '';



  logout() {
      if (confirm('Are you sure you want to logout?')) {
        alert('Logging out...');}
    localStorage.removeItem('token'); 
    this.router.navigate(['/']);
  }

 ngOnInit(): void {
    this.readUserFromTokenOrFetch();
 }

private readUserFromTokenOrFetch() {
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
        createdDate: decodedToken.createdDate ? new Date(decodedToken.createdDate) : undefined as any,
          password: '',
          birthDate: new Date
        
         
      };
     this.userName= decodedToken.fullName;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.fetchUserFromApi();
      }
    } else {
      this.fetchUserFromApi();
    }
  }

  private fetchUserFromApi() {
    // Attempt to extract id from any existing currentUser or skip if not available
    const token = localStorage.getItem('token');
    if (!token) { return; }
    try {
      const decodedToken: any = jwtDecode(token);
      const id = decodedToken.iduser;
      if (id) {
        this.userService.getUserById(id).subscribe(user => {
          this.currentUser = user;
          this.userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        });
      }
    } catch {}
  }

  updateUser(idUser: number| undefined) {
    this.router.navigate(['update-user', idUser]);
  }

  changePassword() {
    this.router.navigate(['change-password']);
  }
}
