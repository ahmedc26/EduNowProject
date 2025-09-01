import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { AdminHome } from './components/admin-home/admin-home';
import { StudentHome } from './components/student-home/student-home';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminProfile } from './components/admin-profile/admin-profile';
import { UserList } from './components/user-list/user-list';
import { UserUpdate } from './components/user-update/user-update';
import { EduLevel } from './components/edu-level/edu-level';
import { UserHome } from './components/user-home/user-home';
import { NavBar } from './components/nav-bar/nav-bar';
import { Courses } from './components/courses/courses';
import { UserProfile } from './components/user-profile/user-profile';
import { UserLevels } from './components/user-levels/user-levels';
import { AdminTopics } from './components/admin-topics/admin-topics';
import { UserTopic } from './components/user-topic/user-topic';
import { TopicsLevel } from './components/topics-level/topics-level';
import { StudentAuthGuardService } from './services/student-auth-guard.service';
import { AccessDenied } from './components/access-denied/access-denied';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'register', component:Register},
  { path: 'Admin-home', component:AdminHome,canActivate:[AuthGuardService]},
  { path: 'Admin-profile', component:AdminProfile,canActivate:[AuthGuardService]},
  { path: 'user-list', component:UserList, canActivate:[AuthGuardService]},
  { path: 'update-user/:idUser', component: UserUpdate, canActivate:[AuthGuardService]},
  { path: 'level', component: EduLevel, canActivate:[AuthGuardService]},
  
  { path: 'nav-bar', component: NavBar},
  

  { path: 'admin-topics',component:AdminTopics, canActivate:[AuthGuardService]},
  { path: 'Student-home', component:StudentHome},
  { path: 'level/:idLevel/topics', component: TopicsLevel },
  { path: 'user-home', component: UserHome, canActivate:[StudentAuthGuardService]},
  { path: 'courses', component: Courses, canActivate:[StudentAuthGuardService]},
  { path: 'user-profile',component:UserProfile, canActivate:[StudentAuthGuardService]},
  { path: 'user-levels',component:UserLevels, canActivate:[StudentAuthGuardService]},
  { path: 'user-topic', component:UserTopic, canActivate:[StudentAuthGuardService]},

  { path: 'access-denied', component: AccessDenied },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
23911613