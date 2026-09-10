import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { SchoolContentReviewDTO } from '../../../interfaces/school-content.dto';
import { StudentApplicationDTO, StudentPaymentDTO } from '../../../interfaces/student-application.dto';
import { SchoolContentService } from '../../../services/school-content.service';
import { StudentApplicationService } from '../../../services/student-application.service';

@Component({
  selector: 'app-admin-content-reviews',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './admin-content-reviews.component.html',
  styleUrl: './admin-content-reviews.component.css',
})
export class AdminContentReviewsComponent implements OnInit {
  reviews: SchoolContentReviewDTO[] = [];
  studentReviews: StudentApplicationDTO[] = [];
  paymentReviews: StudentPaymentDTO[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly schoolContent: SchoolContentService,
    private readonly studentApplications: StudentApplicationService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    forkJoin({
      schoolReviews: this.schoolContent.getPendingReviews(),
      studentReviews: this.studentApplications.getPendingReviews(),
      paymentReviews: this.studentApplications.getPendingPaymentReviews(),
    })
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: ({ schoolReviews, studentReviews, paymentReviews }) => {
          this.reviews = schoolReviews;
          this.studentReviews = studentReviews;
          this.paymentReviews = paymentReviews;
        },
        error: () => this.errorMessage = '审核列表加载失败，请稍后重试。',
      });
  }
}
