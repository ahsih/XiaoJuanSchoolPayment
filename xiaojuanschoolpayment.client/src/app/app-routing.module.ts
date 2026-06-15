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
        path: 'ireland-study/schools/technology-universities',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'technologyUniversities' },
      },
      {
        path: 'ireland-study/schools/private-colleges',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'privateSchools' },
      },
      {
        path: 'ireland-study/schools/language-schools',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'languageSchools' },
      },
      {
        path: 'ireland-study/schools/nci',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'nci' },
      },
      {
        path: 'ireland-study/schools/schm',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'schm' },
      },
      {
        path: 'ireland-study/schools/mic',
        component: IrelandInfoPageComponent,
        data: { infoKey: 'mic' },
      },
      {
        path: 'ireland-study/undergraduate-application',
        loadComponent: () =>
          import('./pages/ireland/undergraduate-application/undergraduate-application.component').then(
            (m) => m.UndergraduateApplicationComponent,
          ),
      },
      {
        path: 'ireland-study/master-application',
        loadComponent: () =>
          import('./pages/ireland/master-application/master-application.component').then(
            (m) => m.MasterApplicationComponent,
          ),
      },
      {
        path: 'ireland-study/foundation-application',
        loadComponent: () =>
          import('./pages/ireland/foundation-application/foundation-application.component').then(
            (m) => m.FoundationApplicationComponent,
          ),
      },
      {
        path: 'ireland-study/application/undergraduate-course',
        loadComponent: () =>
          import('./pages/ireland/undergraduate-process/undergraduate-process.component').then(
            (m) => m.UndergraduateProcessComponent,
          ),
      },
      {
        path: 'ireland-study/application/postgraduate-course',
        loadComponent: () =>
          import('./pages/ireland/postgraduate-process/postgraduate-process.component').then(
            (m) => m.PostgraduateProcessComponent,
          ),
      },
      {
        path: 'ireland-study/visa-guide',
        loadComponent: () =>
          import('./pages/ireland/visa-guide/visa-guide.component').then((m) => m.VisaGuideComponent),
      },
      {
        path: 'ireland-study/accommodation-guide',
        loadComponent: () =>
          import('./pages/ireland/accommodation-guide/accommodation-guide.component').then(
            (m) => m.AccommodationGuideComponent,
          ),
      },
      {
        path: 'ireland-study/living-in-ireland',
        loadComponent: () =>
          import('./pages/ireland/living-in-ireland/living-in-ireland.component').then(
            (m) => m.LivingInIrelandComponent,
          ),
      },
      {
        path: 'ireland-study/banking',
        loadComponent: () =>
          import('./pages/ireland/banking/banking.component').then((m) => m.BankingComponent),
      },
      {
        path: 'ireland-study/health-safety',
        loadComponent: () =>
          import('./pages/ireland/health-safety/health-safety.component').then(
            (m) => m.HealthSafetyComponent,
          ),
      },
      {
        path: 'ireland-study/pre-departure',
        loadComponent: () =>
          import('./pages/ireland/pre-departure/pre-departure.component').then(
            (m) => m.PreDepartureComponent,
          ),
      },
      {
        path: 'philippines-study/why-philippines',
        component: WhyPhilippinesStudyComponent,
      },
      {
        path: 'philippines-study/cebu/cia-cebu-international-academy',
        loadComponent: () =>
          import('./pages/philippines/cia-school/cia-school.component').then((m) => m.CiaSchoolComponent),
      },
      {
        path: 'philippines-study/cebu/ev-academy',
        loadComponent: () =>
          import('./pages/philippines/ev-school/ev-school.component').then((m) => m.EvSchoolComponent),
      },
      {
        path: 'philippines-study/cebu/cpi-cebu-pelis-institute',
        loadComponent: () =>
          import('./pages/philippines/cpi-school/cpi-school.component').then((m) => m.CpiSchoolComponent),
      },
      {
        path: 'philippines-study/cebu/cpils',
        loadComponent: () =>
          import('./pages/philippines/cpils-school/cpils-school.component').then((m) => m.CpilsSchoolComponent),
      },
      {
        path: 'philippines-study/cebu/english-fella',
        loadComponent: () =>
          import('./pages/philippines/fella-school/fella-school.component').then((m) => m.FellaSchoolComponent),
      },
      {
        path: 'philippines-study/cebu/philinter-academy',
        loadComponent: () =>
          import('./pages/philippines/philinter-school/philinter-school.component').then((m) => m.PhilinterSchoolComponent),
      },
      {
        path: 'philippines-study/cebu',
        loadComponent: () =>
          import('./pages/philippines/cebu-study/cebu-study.component').then((m) => m.CebuStudyComponent),
      },
      {
        path: 'philippines-study/baguio/pines-international-academy',
        loadComponent: () =>
          import('./pages/philippines/pines-school/pines-school.component').then((m) => m.PinesSchoolComponent),
      },
      {
        path: 'philippines-study/baguio/beci-international-language-academy',
        loadComponent: () =>
          import('./pages/philippines/beci-school/beci-school.component').then((m) => m.BeciSchoolComponent),
      },
      {
        path: 'philippines-study/baguio/baguio-jic-academy',
        loadComponent: () =>
          import('./pages/philippines/jic-school/jic-school.component').then((m) => m.JicSchoolComponent),
      },
      {
        path: 'philippines-study/baguio/monol',
        loadComponent: () =>
          import('./pages/philippines/monol-school/monol-school.component').then((m) => m.MonolSchoolComponent),
      },
      {
        path: 'philippines-study/baguio',
        loadComponent: () =>
          import('./pages/philippines/baguio-study/baguio-study.component').then((m) => m.BaguioStudyComponent),
      },
      {
        path: 'philippines-study/clark/cip-english-kepos',
        loadComponent: () =>
          import('./pages/philippines/cip-school/cip-school.component').then((m) => m.CipSchoolComponent),
      },
      {
        path: 'philippines-study/clark/eg-academy',
        loadComponent: () =>
          import('./pages/philippines/eg-school/eg-school.component').then((m) => m.EgSchoolComponent),
      },
      {
        path: 'philippines-study/clark/clark-we-academy',
        loadComponent: () =>
          import('./pages/philippines/we-school/we-school.component').then((m) => m.WeSchoolComponent),
      },
      {
        path: 'philippines-study/clark/help-english-clark',
        loadComponent: () =>
          import('./pages/philippines/help-school/help-school.component').then((m) => m.HelpSchoolComponent),
      },
      {
        path: 'philippines-study/clark/aelc-native-focused-clark-schools',
        loadComponent: () =>
          import('./pages/philippines/aelc-school/aelc-school.component').then((m) => m.AelcSchoolComponent),
      },
      {
        path: 'philippines-study/clark',
        loadComponent: () =>
          import('./pages/philippines/clark-study/clark-study.component').then((m) => m.ClarkStudyComponent),
      },
      {
        path: 'philippines-study/manila',
        loadComponent: () =>
          import('./pages/philippines/manila-study/manila-study.component').then((m) => m.ManilaStudyComponent),
      },
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
      {
        path: 'online-english/free-english-test',
        loadComponent: () =>
          import('./pages/online-english/free-english-test/free-english-test.component').then(
            (m) => m.FreeEnglishTestComponent,
          ),
      },
      {
        path: 'online-english/courses',
        loadComponent: () =>
          import('./pages/online-english/online-english-courses/online-english-courses.component').then(
            (m) => m.OnlineEnglishCoursesComponent,
          ),
      },
      {
        path: 'online-english/filipino-teacher-1v1',
        loadComponent: () =>
          import('./pages/online-english/filipino-teacher-1v1/filipino-teacher-1v1.component').then(
            (m) => m.FilipinoTeacher1v1Component,
          ),
      },
      {
        path: 'online-english/ielts-speaking-writing',
        loadComponent: () =>
          import('./pages/online-english/ielts-speaking-writing/ielts-speaking-writing.component').then(
            (m) => m.IeltsSpeakingWritingComponent,
          ),
      },
      {
        path: 'online-english/junior-courses',
        loadComponent: () =>
          import('./pages/online-english/junior-online-english/junior-online-english.component').then(
            (m) => m.JuniorOnlineEnglishComponent,
          ),
      },
      {
        path: 'online-english/adult-speaking',
        loadComponent: () =>
          import('./pages/online-english/adult-speaking/adult-speaking.component').then(
            (m) => m.AdultSpeakingComponent,
          ),
      },
      {
        path: 'online-english/trial-booking',
        loadComponent: () =>
          import('./pages/online-english/trial-booking/trial-booking.component').then(
            (m) => m.TrialBookingComponent,
          ),
      },
      {
        path: 'online-english/faq',
        loadComponent: () =>
          import('./pages/online-english/online-english-faq/online-english-faq.component').then(
            (m) => m.OnlineEnglishFaqComponent,
          ),
      },
      {
        path: 'overseas-study-tour/offers',
        loadComponent: () =>
          import('./pages/overseas-study-tour/exclusive-offers/exclusive-offers.component').then(
            (m) => m.ExclusiveOffersComponent,
          ),
      },
      {
        path: 'overseas-study-tour/ireland',
        loadComponent: () =>
          import('./pages/overseas-study-tour/ireland-tour/ireland-tour.component').then(
            (m) => m.IrelandTourComponent,
          ),
      },
      {
        path: 'overseas-study-tour/uk',
        loadComponent: () =>
          import('./pages/overseas-study-tour/uk-tour/uk-tour.component').then((m) => m.UkTourComponent),
      },
      {
        path: 'overseas-study-tour/singapore',
        loadComponent: () =>
          import('./pages/overseas-study-tour/singapore-tour/singapore-tour.component').then(
            (m) => m.SingaporeTourComponent,
          ),
      },
      {
        path: 'overseas-study-tour/malaysia',
        loadComponent: () =>
          import('./pages/overseas-study-tour/malaysia-tour/malaysia-tour.component').then(
            (m) => m.MalaysiaTourComponent,
          ),
      },
      {
        path: 'overseas-study-tour/canada',
        loadComponent: () =>
          import('./pages/overseas-study-tour/canada-tour/canada-tour.component').then(
            (m) => m.CanadaTourComponent,
          ),
      },
      {
        path: 'overseas-study-tour/australia',
        loadComponent: () =>
          import('./pages/overseas-study-tour/australia-tour/australia-tour.component').then(
            (m) => m.AustraliaTourComponent,
          ),
      },
      {
        path: 'overseas-study-tour/usa',
        loadComponent: () =>
          import('./pages/overseas-study-tour/usa-tour/usa-tour.component').then((m) => m.UsaTourComponent),
      },
      {
        path: 'overseas-study-tour/france',
        loadComponent: () =>
          import('./pages/overseas-study-tour/france-tour/france-tour.component').then(
            (m) => m.FranceTourComponent,
          ),
      },
      {
        path: 'overseas-study-tour/germany',
        loadComponent: () =>
          import('./pages/overseas-study-tour/germany-tour/germany-tour.component').then(
            (m) => m.GermanyTourComponent,
          ),
      },
      {
        path: 'overseas-study-tour/vietnam',
        loadComponent: () =>
          import('./pages/overseas-study-tour/vietnam-tour/vietnam-tour.component').then(
            (m) => m.VietnamTourComponent,
          ),
      },
      {
        path: 'study-tour-guide/cost',
        loadComponent: () =>
          import('./pages/study-tour-guide/tour-cost-guide/tour-cost-guide.component').then(
            (m) => m.TourCostGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/choose-language-school',
        loadComponent: () =>
          import('./pages/study-tour-guide/choose-language-school/choose-language-school.component').then(
            (m) => m.ChooseLanguageSchoolComponent,
          ),
      },
      {
        path: 'study-tour-guide/philippines',
        loadComponent: () =>
          import('./pages/study-tour-guide/philippines-guide/philippines-guide.component').then(
            (m) => m.PhilippinesGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/online-english',
        loadComponent: () =>
          import('./pages/study-tour-guide/online-english-guide/online-english-guide.component').then(
            (m) => m.OnlineEnglishGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/family',
        loadComponent: () =>
          import('./pages/study-tour-guide/family-tour-guide/family-tour-guide.component').then(
            (m) => m.FamilyTourGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/holiday',
        loadComponent: () =>
          import('./pages/study-tour-guide/holiday-tour-guide/holiday-tour-guide.component').then(
            (m) => m.HolidayTourGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/ielts',
        loadComponent: () =>
          import('./pages/study-tour-guide/ielts-tour-guide/ielts-tour-guide.component').then(
            (m) => m.IeltsTourGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/gap-year',
        loadComponent: () =>
          import('./pages/study-tour-guide/gap-year-guide/gap-year-guide.component').then(
            (m) => m.GapYearGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/accommodation',
        loadComponent: () =>
          import('./pages/study-tour-guide/tour-accommodation-guide/tour-accommodation-guide.component').then(
            (m) => m.TourAccommodationGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/visa',
        loadComponent: () =>
          import('./pages/study-tour-guide/tour-visa-guide/tour-visa-guide.component').then(
            (m) => m.TourVisaGuideComponent,
          ),
      },
      {
        path: 'study-tour-guide/pre-departure',
        loadComponent: () =>
          import('./pages/study-tour-guide/tour-pre-departure/tour-pre-departure.component').then(
            (m) => m.TourPreDepartureComponent,
          ),
      },
      {
        path: 'study-tour-guide/faq',
        loadComponent: () =>
          import('./pages/study-tour-guide/tour-faq/tour-faq.component').then((m) => m.TourFaqComponent),
      },
      {
        path: 'study-abroad-guide/ireland-cost',
        loadComponent: () =>
          import('./pages/study-abroad-guide/ireland-study-cost/ireland-study-cost.component').then(
            (m) => m.IrelandStudyCostComponent,
          ),
      },
      {
        path: 'study-abroad-guide/ireland-application-timeline',
        loadComponent: () =>
          import(
            './pages/study-abroad-guide/ireland-application-timeline/ireland-application-timeline.component'
          ).then((m) => m.IrelandApplicationTimelineComponent),
      },
      {
        path: 'study-abroad-guide/ireland-school-selection',
        loadComponent: () =>
          import('./pages/study-abroad-guide/ireland-school-selection/ireland-school-selection.component').then(
            (m) => m.IrelandSchoolSelectionComponent,
          ),
      },
      {
        path: 'study-abroad-guide/ireland-work-study',
        loadComponent: () =>
          import('./pages/study-abroad-guide/ireland-work-study-guide/ireland-work-study-guide.component').then(
            (m) => m.IrelandWorkStudyGuideComponent,
          ),
      },
      {
        path: 'study-abroad-guide/undergraduate',
        loadComponent: () =>
          import('./pages/study-abroad-guide/undergraduate-guide/undergraduate-guide.component').then(
            (m) => m.UndergraduateGuideComponent,
          ),
      },
      {
        path: 'study-abroad-guide/master',
        loadComponent: () =>
          import('./pages/study-abroad-guide/master-guide/master-guide.component').then(
            (m) => m.MasterGuideComponent,
          ),
      },
      {
        path: 'study-abroad-guide/foundation',
        loadComponent: () =>
          import('./pages/study-abroad-guide/foundation-guide/foundation-guide.component').then(
            (m) => m.FoundationGuideComponent,
          ),
      },
      {
        path: 'study-abroad-guide/major-selection',
        loadComponent: () =>
          import('./pages/study-abroad-guide/major-selection-guide/major-selection-guide.component').then(
            (m) => m.MajorSelectionGuideComponent,
          ),
      },
      {
        path: 'study-abroad-guide/application-materials',
        loadComponent: () =>
          import('./pages/study-abroad-guide/application-materials/application-materials.component').then(
            (m) => m.ApplicationMaterialsComponent,
          ),
      },
      {
        path: 'study-abroad-guide/visa',
        loadComponent: () =>
          import('./pages/study-abroad-guide/study-visa-guide/study-visa-guide.component').then(
            (m) => m.StudyVisaGuideComponent,
          ),
      },
      {
        path: 'study-abroad-guide/pre-departure',
        loadComponent: () =>
          import('./pages/study-abroad-guide/study-pre-departure/study-pre-departure.component').then(
            (m) => m.StudyPreDepartureComponent,
          ),
      },
      {
        path: 'study-abroad-guide/faq',
        loadComponent: () =>
          import('./pages/study-abroad-guide/study-faq/study-faq.component').then(
            (m) => m.StudyFaqComponent,
          ),
      },
      {
        path: 'student-feedback/study-tour',
        loadComponent: () =>
          import('./pages/student-feedback/study-tour-feedback/study-tour-feedback.component').then(
            (m) => m.StudyTourFeedbackComponent,
          ),
      },
      {
        path: 'student-feedback/study-abroad',
        loadComponent: () =>
          import('./pages/student-feedback/study-abroad-feedback/study-abroad-feedback.component').then(
            (m) => m.StudyAbroadFeedbackComponent,
          ),
      },
      {
        path: 'about-sida/about',
        loadComponent: () => import('./pages/about-sida/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'about-sida/services',
        loadComponent: () =>
          import('./pages/about-sida/services/services.component').then((m) => m.ServicesComponent),
      },
      {
        path: 'about-sida/advantages',
        loadComponent: () =>
          import('./pages/about-sida/advantages/advantages.component').then((m) => m.AdvantagesComponent),
      },
      {
        path: 'about-sida/consultants',
        loadComponent: () =>
          import('./pages/about-sida/consultants/consultants.component').then((m) => m.ConsultantsComponent),
      },
      {
        path: 'about-sida/pricing',
        loadComponent: () =>
          import('./pages/about-sida/pricing/pricing.component').then((m) => m.PricingComponent),
      },
      {
        path: 'about-sida/contact',
        loadComponent: () =>
          import('./pages/about-sida/contact/contact.component').then((m) => m.ContactComponent),
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
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
