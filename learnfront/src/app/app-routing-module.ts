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

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'register', component:Register},
  { path: 'Admin-home', component:AdminHome,canActivate:[AuthGuardService]},
  { path: 'Student-home', component:StudentHome},
  { path: 'Admin-profile', component:AdminProfile,canActivate:[AuthGuardService]},
  { path: 'user-list', component:UserList, canActivate:[AuthGuardService]},
  { path: 'update-user/:idUser', component: UserUpdate, canActivate:[AuthGuardService]},
  { path: 'level', component: EduLevel, canActivate:[AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
23911613