import { Component, ViewChild } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { inject, OnInit, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList {

   users: any[] = [];
   filteredUsers: any[] = []; 
   dataSource = new MatTableDataSource<any>(this.users);
   displayedUsers: any[] = []; 
   pageSize = 5;
   pageSizeOptions = [5, 10, 25, 100];
   totalItems = 0;
   searchControl = new FormControl(''); 


     @ViewChild(MatPaginator) paginator!: MatPaginator;
 constructor( private router:Router, private userService : UserService, private snackBar:MatSnackBar ){

 }

 ngOnInit(){
  this.loadAllUsers();
   this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // wait 300ms after each keystroke
        distinctUntilChanged() // only emit if value is different from previous
      )
      .subscribe(searchTerm => {
        this.applyFilter(searchTerm || '');
      });
 }

 ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
 loadAllUsers() {
    this.userService.getAllStudents().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];

        this.totalItems = this.users.length;
        this.updateDisplayedUsers(0, this.pageSize);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

private updateDisplayedUsers(startIndex: number, endIndex: number) {
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
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


 onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.updateDisplayedUsers(startIndex, endIndex);
  }

  applyFilter(filterValue: string) {
    const searchTerm = filterValue.trim().toLowerCase();
    
    if (!searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user => user.firstName.toLowerCase().includes(searchTerm))
    }
    
    this.totalItems = this.filteredUsers.length;
    this.updateDisplayedUsers(0, this.pageSize);
    
    // Reset to first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

}
