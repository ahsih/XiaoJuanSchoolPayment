import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { SchoolCommissionPolicyDTO } from '../../../interfaces/school-commission-policy.dto';
import { SchoolCommissionPolicyService } from '../../../services/school-commission-policy.service';

@Component({
  selector: 'app-admin-commission-policies',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './admin-commission-policies.component.html',
  styleUrl: './admin-commission-policies.component.css',
})
export class AdminCommissionPoliciesComponent implements OnInit {
  policies: SchoolCommissionPolicyDTO[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private readonly service: SchoolCommissionPolicyService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getAll().pipe(finalize(() => this.isLoading = false)).subscribe({
      next: policies => this.policies = policies,
      error: () => this.errorMessage = '内部佣金政策加载失败，请确认管理权限后重试。',
    });
  }
}
