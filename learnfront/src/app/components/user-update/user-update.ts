import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.html',
  styleUrls: ['./user-update.css'],
  standalone: false
})
export class UserUpdate {
  userForm: FormGroup;
  isLoading = true;
  

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {

    this.userForm = this.fb.group({
        idUser: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      birthDate:['']

    });
  }

  

  ngOnInit(){

    const id = this.route.snapshot.paramMap.get('idUser');
      if(id){
        this.userService.getUserById(+id).subscribe({
          next: (user:User)=>{
            this.userForm.patchValue({
          idUser: user.idUser,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          birthDate: user.birthDate
        });
            
            this.isLoading = false;
          },
          error: (error)=>{
            console.error('Error fetching user:', error);
            this.snackBar.open('Error fetching user', 'Close', {
              duration: 3000
            });
          }
        });
        
      }
      else {
    this.isLoading = false;
      }
    }

      onSubmit() {

        const token = localStorage.getItem('token');
        let hasAdminRole = false;
        let hasStudentRole = false;
        
        if (token) {
          const decodedToken: any = jwtDecode(token);
          hasAdminRole = decodedToken.authorities && decodedToken.authorities.includes('USER');
          hasStudentRole = decodedToken.authorities && decodedToken.authorities.includes('STUDENT');
        } else {

  console.error('No token found in localStorage');

      }
        if (this.userForm.valid) {
          const updatedUser = { ...this.userForm.getRawValue() };
          this.userService.updateUser(updatedUser).subscribe({
            next: (response) => {
              if (response?.token) {
                localStorage.setItem('token', response.token);
              }
              this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
              if(hasAdminRole)
                this.router.navigate(['/user-list']);
              else if (hasStudentRole)
                this.router.navigate(['/user-profile']);
            },
            error: () => {
              this.snackBar.open('Error updating user', 'Close', { duration: 3000 });
            }
          });
        }
      }

      private navigateAfterUpdate(hasAdminRole: boolean, hasStudentRole: boolean): void {
  if (hasAdminRole) {
    this.router.navigate(['/user-list']);
  } else if (hasStudentRole) {
    this.router.navigate(['/user-profile']);
  }}


  
  ReturnToList() {
    this.router.navigate(['user-list']);
  }


    }

