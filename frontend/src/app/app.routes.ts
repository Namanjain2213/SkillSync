import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login.component';
import { ShellComponent } from './features/employee/shell.component';
import { EmployeeDashboardComponent } from './features/employee/employee-dashboard.component';
import { ProfileFormComponent } from './features/employee/profile-form.component';
import { McqTestComponent } from './features/employee/mcq-test.component';
import { AdminShellComponent } from './features/admin/admin-shell.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { AdminUsersComponent } from './features/admin/admin-users.component';
import { AdminCreateUserComponent } from './features/admin/admin-create-user.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'employee',
    component: ShellComponent,
    children: [
      { path: '', component: EmployeeDashboardComponent },
      { path: 'profile', component: ProfileFormComponent },
      { path: 'test', component: McqTestComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminShellComponent,
    children: [
      { path: '',       component: AdminDashboardComponent },
      { path: 'users',  component: AdminUsersComponent },
      { path: 'create', component: AdminCreateUserComponent },
    ]
  },
  { path: '**', redirectTo: '/' }
];
