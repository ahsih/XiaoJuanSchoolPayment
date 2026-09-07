import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { InvitationCodeDTO } from '../../../interfaces/Auth.dto';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-invitation-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule, RouterLink],
  templateUrl: './invitation-management.component.html',
  styleUrls: ['./invitation-management.component.css'],
})
export class InvitationManagementComponent implements OnInit {
  invitations: InvitationCodeDTO[] = [];
  newInvitation?: InvitationCodeDTO;
  expiresInDays = 30;
  loading = false;
  isAdmin = false;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getRoles().some((role) => role.toLowerCase() === 'admin');
    this.load();
  }

  create(): void {
    if (this.loading) return;
    this.loading = true;
    this.authService.createInvitation(this.expiresInDays).subscribe({
      next: (invitation) => {
        this.loading = false;
        this.newInvitation = invitation;
        this.invitations = [invitation, ...this.invitations];
      },
      error: (error) => {
        this.loading = false;
        this.showError(error, '邀请码生成失败');
      },
    });
  }

  copy(code?: string): void {
    if (!code) return;
    navigator.clipboard.writeText(code).then(
      () => this.snackBar.open('邀请码已复制', '关闭', { duration: 2500 }),
      () => this.snackBar.open('复制失败，请手动选择邀请码', '关闭', { duration: 3500 }),
    );
  }

  revoke(invitation: InvitationCodeDTO): void {
    if (invitation.status !== '未使用') return;
    this.authService.revokeInvitation(invitation.id).subscribe({
      next: () => {
        invitation.status = '已撤销';
        invitation.revokedAt = new Date().toISOString();
      },
      error: (error) => this.showError(error, '邀请码撤销失败'),
    });
  }

  private load(): void {
    this.authService.getInvitations().subscribe({
      next: (items) => this.invitations = items,
      error: (error) => this.showError(error, '邀请码列表加载失败'),
    });
  }

  private showError(error: any, fallback: string): void {
    const message = typeof error?.error === 'string' ? error.error : error?.error?.message || fallback;
    this.snackBar.open(message, '关闭', { duration: 4500 });
  }
}
