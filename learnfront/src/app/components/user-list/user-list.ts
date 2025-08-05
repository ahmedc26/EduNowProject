import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { inject, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {

 users: any[] = [];

 constructor( private router:Router, private userService : UserService, private snackBar:MatSnackBar ){

 }

 ngOnInit(){
  this.loadAllUsers();
 }

 loadAllUsers() {
    this.userService.getAllStudents().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }



  deleteUser(idUser: number) {
  if (confirm('Are you sure you want to delete this user?')) {
    this.userService.deleteUser(idUser).subscribe({
      next: () => {
        this.loadAllUsers();
        this.snackBar.open('User deleted successfully', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.snackBar.open('Error deleting user', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}

  updateUser(idUser: number) {
    this.router.navigate(['update-user', idUser]);
  }
}
