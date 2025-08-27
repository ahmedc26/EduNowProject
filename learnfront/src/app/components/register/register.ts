import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActivateDialog } from '../activate-dialog/activate-dialog';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
  template: `<p>{{message}}</p>`
})
export class Register {
  message = '';
 isSignUp = false;
  hidePassword = true;
  hideConfirmPassword = true;

  signInForm: FormGroup;
  signUpForm: FormGroup;

   user = {
    // Define your registration fields, e.g.:
    username: '',
    email: '',
    password: '',
    phoneNumber:''
  };

constructor(private fb: FormBuilder,private authService: AuthService,private route: ActivatedRoute,private dialog: MatDialog,private router: Router) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required]],
      phoneNumber: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        
      ]],
      /*confirmPassword:['',[Validators.required,
        Validators.minLength(8),]],
*/
       birthDate: ['', Validators.required], 
      agreeToTerms: [false, Validators.requiredTrue]
    }, );
  }
/*passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }*/
toggleForm() {
    this.isSignUp = !this.isSignUp;
  }

  onSignIn() {
    if (this.signInForm.valid) {
      
      const { email, password } = this.signInForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          console.log('Full response:', response);
         
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          const DecodedToken: any = jwtDecode(response.token);
          console.log('decoded token',DecodedToken)
          
          if(DecodedToken.authorities && DecodedToken.authorities.includes('USER')){
            this.router.navigate(['/Admin-home']);
            console.log("mrigl");
          }
          else
          this.router.navigate(['/user-home']);
            console.log("STUDENT");
        },
        error: (error) => {
          alert("Login failed");
          console.error('Login failed', error);
          
        }
      });
    }
  }


onSubmit() {
  if (this.signUpForm.valid) {
    const { firstName, lastName, email, phoneNumber, password,birthDate } = this.signUpForm.value;
    const registrationData = { firstName, lastName, email, phoneNumber, password,birthDate };
    this.authService.register(registrationData).subscribe({
      next: (response) => {
        const dialogRef = this.dialog.open(ActivateDialog);
        console.log('Registration successful', response);
        this.signUpForm.reset();
        this.toggleForm();
        dialogRef.afterClosed().subscribe(code => {
          if (code) {
            this.authService.activateAccount(code).subscribe({
              next: () => alert('Account activated successfully!'),
              
              error: () => alert('Activation failed. Please check your code.')
             
            });

             
              
          }
        });
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  } else {
    console.log('Form is invalid', this.signUpForm.errors, this.signUpForm.value);
  }
}





}
