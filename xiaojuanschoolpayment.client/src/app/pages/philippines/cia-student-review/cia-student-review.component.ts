import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CIA_STUDENT_REVIEWS } from '../cia-school/cia-student-reviews.data';

@Component({
  selector: 'app-cia-student-review',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './cia-student-review.component.html',
  styleUrl: './cia-student-review.component.css',
})
export class CiaStudentReviewComponent {
  private readonly route = inject(ActivatedRoute);

  readonly review = CIA_STUDENT_REVIEWS.find(
    (item) => item.slug === this.route.snapshot.paramMap.get('slug'),
  );
}
