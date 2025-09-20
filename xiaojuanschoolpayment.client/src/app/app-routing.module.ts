import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RoleGuard } from '../guard/role.guard';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { AdminSchoolLessonsComponent } from './pages/admin-school-lessons/admin-school-lessons.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    data: { role: 'admin' },
    canActivate: [RoleGuard],
    children: [
      { path: '', component: AdminComponent },
      { path: 'school-lessons', component: AdminSchoolLessonsComponent },
    ],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
