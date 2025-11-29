import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { EditSchoolDialogComponent } from './pages/admin/edit-school-dialog/edit-school-dialog.component';
import { AdminSchoolLessonsComponent } from './pages/admin-school-lessons/admin-school-lessons.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { EditSchoolLessonDialogComponent } from './pages/admin-school-lessons/edit-school-lesson-dialog/edit-school-lesson-dialog.component';
import { AdminSchoolRoomsComponent } from './pages/admin-school-rooms/admin-school-rooms.component';
import { EditSchoolRoomDialogComponent } from './pages/admin-school-rooms/edit-school-room-dialog/edit-school-room-dialog.component';
import { AdminSchoolFeesComponent } from './pages/admin-school-fees/admin-school-fees.component';
import { EditSchoolFeeDialogComponent } from './pages/admin-school-fees/edit-school-fee-dialog/edit-school-fee-dialog.component';
import { AdminSchoolNotesComponent } from './pages/admin-school-notes/admin-school-notes.component';
import { EditSchoolNoteDialogComponent } from './pages/admin-school-notes/edit-school-note-dialog/edit-school-note-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    AdminLayoutComponent,
    EditSchoolDialogComponent,
    AdminSchoolLessonsComponent,
    EditSchoolLessonDialogComponent,
    EditSchoolRoomDialogComponent,
    EditSchoolFeeDialogComponent,
    EditSchoolNoteDialogComponent,
    AdminSchoolRoomsComponent,
    AdminSchoolFeesComponent,
    AdminSchoolNotesComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
