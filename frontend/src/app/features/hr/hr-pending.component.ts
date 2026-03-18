import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HrService } from '../../core/services/hr.service';
import { ToastService } from '../../shared/toast.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-hr-pending',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="page">

      <div class="page-info">
        <app-icon name="clock" [size]="18" color="#e65100"></app-icon>
        <span>{{ employees.length }} profile(s) awaiting review</span>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div> Loading...
      </div>

      <div class="empty" *ngIf="!loading && employees.length === 0">
        <app-icon name="check-circle" [size]="44" color="#b2dfdb"></app-icon>
        <p>All caught up! No pending profiles.</p>
      </div>

      <div class="cards-grid" *ngIf="!loading && employees.length > 0">
        <div class="emp-card" *ngFor="let emp of employees">
          <div class="emp-top">
            <div class="emp-avatar">{{ emp.name?.[0]?.toUpperCase() || '?' }}</div>
            <div class="emp-info">
              <div class="emp-name">{{ emp.name }}</div>
              <div class="emp-id">{{ emp.username }} · {{ emp.email }}</div>
            </div>
            <span class="pending-badge">PENDING</span>
          </div>

          <div class="emp-details">
            <div class="detail-row">
              <span class="detail-label">Qualification</span>
              <span class="detail-val">{{ emp.highestQualification }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Skills</span>
              <div class="skills-wrap">
                <span class="skill-tag" *ngFor="let s of emp.skills">{{ s }}</span>
                <span class="no-skill" *ngIf="!emp.skills?.length">None</span>
              </div>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tests</span>
              <span class="detail-val">{{ emp.mcqTests?.length || 0 }} taken</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Certs</span>
              <span class="detail-val">{{ emp.certifications?.length || 0 }} uploaded</span>
            </div>
          </div>

          <div class="emp-actions">
            <button class="view-btn" (click)="router.navigate(['/hr/employees', emp.id])">
              <app-icon name="eye" [size]="14" color="#00695c"></app-icon>
              Full Profile
            </button>
            <button class="approve-btn" (click)="approve(emp)" [disabled]="saving === emp.id">
              <app-icon name="check" [size]="14" color="#fff"></app-icon>
              Approve
            </button>
            <button class="reject-btn" (click)="openReject(emp)" [disabled]="saving === emp.id">
              <app-icon name="x" [size]="14" color="#fff"></app-icon>
              Reject
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Reject Modal -->
    <div class="modal-overlay" *ngIf="rejectTarget" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Reject Profile</h3>
          <button class="modal-close" (click)="closeModal()">
            <app-icon name="x" [size]="18" color="#666"></app-icon>
          </button>
        </div>
        <p class="modal-sub">Rejecting <strong>{{ rejectTarget?.name }}</strong>. Provide a reason:</p>
        <textarea [(ngModel)]="rejectReason" placeholder="e.g. Missing certifications, skills not verified..." class="reason-input" rows="4"></textarea>
        <div class="modal-actions">
          <button class="cancel-btn" (click)="closeModal()">Cancel</button>
          <button class="confirm-btn" (click)="confirmReject()" [disabled]="!rejectReason.trim()">
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 16px; }

    .page-info {
      display: flex; align-items: center; gap: 8px;
      background: #fff3e0; border: 1px solid #ffe0b2; border-radius: 10px;
      padding: 10px 16px; font-size: 13.5px; font-weight: 600; color: #e65100;
    }

    .loading { display: flex; align-items: center; gap: 10px; padding: 60px; justify-content: center; color: #888; font-size: 14px; }
    .spinner {
      width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid #e0f2f1; border-top-color: #00897b;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px; color: #aaa; font-size: 14px; }

    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .emp-card {
      background: white; border-radius: 16px;
      box-shadow: 0 1px 12px rgba(0,0,0,0.06);
      border: 1.5px solid #fff3e0; overflow: hidden;
    }
    .emp-top { display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-bottom: 1px solid #f5f5f5; }
    .emp-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(135deg, #26a69a, #00796b);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .emp-info { flex: 1; }
    .emp-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .emp-id { font-size: 11px; color: #999; margin-top: 2px; }
    .pending-badge { padding: 4px 10px; border-radius: 20px; background: #fff3e0; color: #e65100; font-size: 10px; font-weight: 700; }

    .emp-details { padding: 12px 18px; display: flex; flex-direction: column; gap: 8px; }
    .detail-row { display: flex; align-items: flex-start; gap: 10px; }
    .detail-label { width: 90px; font-size: 11px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; flex-shrink: 0; padding-top: 2px; }
    .detail-val { font-size: 13px; color: #333; }
    .skills-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
    .skill-tag { padding: 2px 9px; border-radius: 20px; background: #e0f2f1; color: #00695c; font-size: 11px; font-weight: 600; }
    .no-skill { font-size: 12px; color: #bbb; font-style: italic; }

    .emp-actions { display: flex; gap: 8px; padding: 12px 18px; border-top: 1px solid #f5f5f5; }
    .view-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 7px 14px; border-radius: 8px;
      background: #e0f2f1; border: none; color: #00695c;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .view-btn:hover { background: #b2dfdb; }
    .approve-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 7px 14px; border-radius: 8px;
      background: linear-gradient(135deg, #2e7d32, #43a047);
      border: none; color: white; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .approve-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .reject-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 7px 14px; border-radius: 8px;
      background: linear-gradient(135deg, #c62828, #e53935);
      border: none; color: white; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .reject-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    /* MODAL */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal {
      background: white; border-radius: 18px; padding: 28px;
      width: 100%; max-width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .modal-header h3 { font-size: 18px; font-weight: 800; color: #c62828; }
    .modal-close { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; }
    .modal-sub { font-size: 13px; color: #888; margin-bottom: 16px; line-height: 1.5; }
    .reason-input {
      width: 100%; border: 1.5px solid #e0e0e0; border-radius: 10px;
      padding: 12px 14px; font-size: 13.5px; font-family: inherit;
      resize: vertical; outline: none;
    }
    .reason-input:focus { border-color: #e53935; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
    .cancel-btn { padding: 9px 20px; border-radius: 10px; background: #f5f5f5; border: none; color: #555; font-size: 13px; font-weight: 600; cursor: pointer; }
    .confirm-btn {
      padding: 9px 20px; border-radius: 10px;
      background: linear-gradient(135deg, #c62828, #e53935);
      border: none; color: white; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .confirm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class HrPendingComponent implements OnInit {
  employees: any[] = [];
  loading = true;
  saving: number | null = null;
  rejectTarget: any = null;
  rejectReason = '';

  constructor(
    public router: Router,
    private hrService: HrService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.hrService.getPendingEmployees().subscribe({
      next: (data) => { this.employees = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  approve(emp: any): void {
    this.saving = emp.id;
    this.hrService.approveProfile(emp.id).subscribe({
      next: () => {
        this.saving = null;
        this.toast.success(`${emp.name}'s profile approved.`);
        this.employees = this.employees.filter(e => e.id !== emp.id);
      },
      error: () => { this.saving = null; this.toast.error('Failed to approve.'); }
    });
  }

  openReject(emp: any): void { this.rejectTarget = emp; this.rejectReason = ''; }
  closeModal(): void { this.rejectTarget = null; }

  confirmReject(): void {
    if (!this.rejectReason.trim() || !this.rejectTarget) return;
    this.saving = this.rejectTarget.id;
    this.hrService.rejectProfile(this.rejectTarget.id, this.rejectReason).subscribe({
      next: () => {
        this.saving = null;
        this.toast.warning(`${this.rejectTarget.name}'s profile rejected.`);
        this.employees = this.employees.filter(e => e.id !== this.rejectTarget.id);
        this.rejectTarget = null;
      },
      error: () => { this.saving = null; this.toast.error('Failed to reject.'); }
    });
  }
}
