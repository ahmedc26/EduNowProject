import { Component, OnInit, OnDestroy } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ProgressService, StudentProgress } from '../../services/progress.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-home',
  standalone: false,
  templateUrl: './student-home.html',
  styleUrl: './student-home.css'
})
export class StudentHome implements OnInit, OnDestroy {
  userName: string = '';
  studentProgress: StudentProgress | null = null;
  private progressSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private progressService: ProgressService
  ) {
    this.getUserNameFromToken();
  }

  ngOnInit() {
    this.progressSubscription = this.progressService.progress$.subscribe(progress => {
      this.studentProgress = progress;
    });
  }

  ngOnDestroy() {
    this.progressSubscription.unsubscribe();
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

