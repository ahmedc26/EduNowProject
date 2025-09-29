import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { inject, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { LoginHistory } from '../../models/login-history.model';

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
lastLogin: LoginHistory | null = null;
loginHistory: LoginHistory[] = [];
showLoginHistory: boolean = false;



  logout() {
      if (confirm('Are you sure you want to logout?')) {
        // Record logout in backend
        if (this.currentUser?.idUser) {
          this.userService.logout(this.currentUser.idUser).subscribe({
            next: () => {
              console.log('Logout recorded successfully');
            },
            error: (error) => {
              console.error('Error recording logout:', error);
            }
          });
        }
        alert('Logging out...');
      }
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
      // Fetch last login information
      this.loadLastLogin(decodedToken.iduser);
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
          // Fetch last login information
          this.loadLastLogin(id);
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

  private loadLastLogin(userId: number) {
    this.userService.getLastLogin(userId).subscribe({
      next: (loginHistory) => {
        this.lastLogin = loginHistory;
      },
      error: (error) => {
        console.error('Error loading last login:', error);
        // Don't show error to user, just log it
      }
    });
  }

  // Method to get full login history
  getLoginHistory() {
    if (this.currentUser?.idUser) {
      this.userService.getUserLoginHistory(this.currentUser.idUser).subscribe({
        next: (history) => {
          this.loginHistory = history;
          this.showLoginHistory = true;
        },
        error: (error) => {
          console.error('Error loading login history:', error);
        }
      });
    }
  }

  hideLoginHistory() {
    this.showLoginHistory = false;
  }
}
