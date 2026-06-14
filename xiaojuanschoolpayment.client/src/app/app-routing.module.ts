import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RoleGuard } from '../guard/role.guard';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { AdminSchoolLessonsComponent } from './pages/admin-school-lessons/admin-school-lessons.component';
import { AdminSchoolRoomsComponent } from './pages/admin-school-rooms/admin-school-rooms.component';
import { AdminSchoolFeesComponent } from './pages/admin-school-fees/admin-school-fees.component';
import { AdminSchoolNotesComponent } from './pages/admin-school-notes/admin-school-notes.component';
import { MainNavbarComponent } from './pages/main-navbar/main-navbar.component';
import { WhyPhilippinesStudyComponent } from './pages/philippines/why-philippines-study/why-philippines-study.component';
import { CebuStudyComponent } from './pages/philippines/cebu-study/cebu-study.component';
import { BaguioStudyComponent } from './pages/philippines/baguio-study/baguio-study.component';
import { ClarkStudyComponent } from './pages/philippines/clark-study/clark-study.component';
import { ManilaStudyComponent } from './pages/philippines/manila-study/manila-study.component';
import { CitySchoolsComponent } from './pages/philippines/city-schools/city-schools.component';
import { BoracayStudyComponent } from './pages/philippines/boracay-study/boracay-study.component';
import { BacolodStudyComponent } from './pages/philippines/bacolod-study/bacolod-study.component';
import { RegionalCityStudyComponent } from './pages/philippines/regional-city-study/regional-city-study.component';
import { SchoolRecommendationComponent } from './pages/philippines/school-recommendation/school-recommendation.component';
import { SchoolLibraryComponent } from './pages/philippines/school-library/school-library.component';
import { PhilippinesInfoPageComponent } from './pages/philippines/info-page/philippines-info-page.component';
import { IrelandInfoPageComponent } from './pages/ireland/info-page/ireland-info-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainNavbarComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      {
        path: 'ireland-study/experience-ireland',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'experience' },
      },
      {
        path: 'ireland-study/education-system',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'educationSystem' },
      },
      {
        path: 'ireland-study/working-in-ireland',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'working' },
      },
      {
        path: 'ireland-study/economy-careers',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'economyCareers' },
      },
      {
        path: 'ireland-study/work-study',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'workStudy' },
      },
      {
        path: 'ireland-study/schools/admission-info',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'admissionInfo' },
      },
      {
        path: 'ireland-study/schools/scholarships',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'scholarships' },
      },
      {
        path: 'ireland-study/schools/universities',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'universities' },
      },
      {
        path: 'philippines-study/why-philippines',
        component: WhyPhilippinesStudyComponent,
      },
      { path: 'philippines-study/cebu', component: CebuStudyComponent },
      { path: 'philippines-study/baguio', component: BaguioStudyComponent },
      { path: 'philippines-study/clark', component: ClarkStudyComponent },
      { path: 'philippines-study/manila', component: ManilaStudyComponent },
      { path: 'philippines-study/schools/by-city', component: CitySchoolsComponent },
      { path: 'philippines-study/boracay', component: BoracayStudyComponent },
      { path: 'philippines-study/bacolod', component: BacolodStudyComponent },
      {
        path: 'philippines-study/iloilo',
        component: RegionalCityStudyComponent,
        data: { cityKey: 'iloilo' },
      },
      {
        path: 'philippines-study/davao',
        component: RegionalCityStudyComponent,
        data: { cityKey: 'davao' },
      },
      {
        path: 'philippines-study/subic',
        component: RegionalCityStudyComponent,
        data: { cityKey: 'subic' },
      },
      {
        path: 'philippines-study/recommendations/ielts-schools',
        component: SchoolRecommendationComponent,
        data: { recommendationKey: 'ielts' },
      },
      {
        path: 'philippines-study/recommendations/budget-schools',
        component: SchoolRecommendationComponent,
        data: { recommendationKey: 'budget' },
      },
      {
        path: 'philippines-study/recommendations/family-schools',
        component: SchoolRecommendationComponent,
        data: { recommendationKey: 'family' },
      },
      {
        path: 'philippines-study/recommendations/junior-camp',
        component: SchoolRecommendationComponent,
        data: { recommendationKey: 'juniorCamp' },
      },
      {
        path: 'philippines-study/recommendations/sparta-schools',
        component: SchoolRecommendationComponent,
        data: { recommendationKey: 'sparta' },
      },
      {
        path: 'philippines-study/schools/by-course',
        component: SchoolLibraryComponent,
        data: { libraryKey: 'course' },
      },
      {
        path: 'philippines-study/schools/by-style',
        component: SchoolLibraryComponent,
        data: { libraryKey: 'style' },
      },
      {
        path: 'philippines-study/schools/popular',
        component: SchoolLibraryComponent,
        data: { libraryKey: 'popular' },
      },
      {
        path: 'philippines-study/offers',
        component: PhilippinesInfoPageComponent,
        data: { infoKey: 'offers' },
      },
      {
        path: 'philippines-study/cost',
        component: PhilippinesInfoPageComponent,
        data: { infoKey: 'cost' },
      },
      {
        path: 'philippines-study/faq',
        component: PhilippinesInfoPageComponent,
        data: { infoKey: 'faq' },
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    data: { role: 'admin' },
    canActivate: [RoleGuard],
    children: [
      { path: '', component: AdminComponent },
      { path: 'school-lessons', component: AdminSchoolLessonsComponent },
      { path: 'school-rooms', component: AdminSchoolRoomsComponent },
      { path: 'school-fees', component: AdminSchoolFeesComponent },
      { path: 'school-notes', component: AdminSchoolNotesComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
