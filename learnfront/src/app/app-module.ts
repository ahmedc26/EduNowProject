import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Register } from './components/register/register';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioButton, MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { Home } from './components/home/home';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { ActivateDialog } from './components/activate-dialog/activate-dialog';
import { AdminHome } from './components/admin-home/admin-home';
import { StudentHome } from './components/student-home/student-home';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatToolbar } from '@angular/material/toolbar';
import { SideBar } from './components/side-bar/side-bar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { ChangePasswordComponent } from './components/change-password/change-password';
import { UserTopic } from './components/user-topic/user-topic';
import { TopicsLevel } from './components/topics-level/topics-level';
import { AccessDenied } from './components/access-denied/access-denied';
import { TopicsSubject } from './components/topics-subject/topics-subject';
import { NotificationBellComponent } from './components/notification-bell/notification-bell';
import { NotificationsComponent } from './components/notifications/notifications';
import { ProgressDetailComponent } from './components/progress-detail/progress-detail';
import { AdminLoginHistory } from './components/admin-login-history/admin-login-history';
import { StudentQuestionGenerator } from './components/student-question-generation/student-question-generation';





@NgModule({
  declarations: [
    App,
    Register,
    Home,
    AdminHome,
    StudentHome,
    SideBar,
    AdminProfile,
    UserList,
    UserUpdate,
    EduLevel,
    UserHome,
    NavBar,
    Courses,
    UserProfile,
    ChangePasswordComponent,
    UserLevels,
    AdminTopics,
    UserTopic,
    TopicsLevel,
    AccessDenied,
    TopicsSubject,
    NotificationBellComponent,
    NotificationsComponent,
    ProgressDetailComponent,
    AdminLoginHistory,
    StudentQuestionGenerator


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioButton,
    MatRadioGroup,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    ActivateDialog,
    MatCardModule,
    MatTableModule,
    MatToolbar,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatDivider,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginator,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
