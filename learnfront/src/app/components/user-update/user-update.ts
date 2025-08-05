import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';


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
        if (this.userForm.valid) {
          // Prepare the user object (include disabled fields if needed)
          const updatedUser = { ...this.userForm.getRawValue() };
          this.userService.updateUser(updatedUser).subscribe({
            next: () => {
              this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
              this.router.navigate(['/user-list']);
            },
            error: () => {
              this.snackBar.open('Error updating user', 'Close', { duration: 3000 });
            }
          });
        }
      }
  ReturnToList() {
    this.router.navigate(['user-list']);
  }


    }

