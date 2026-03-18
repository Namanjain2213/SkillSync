import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HrService } from '../../core/services/hr.service';
import { ToastService } from '../../shared/toast.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-hr-employee-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="page" *ngIf="emp">

      <!-- Back + Actions -->
      <div class="top-bar">
        <button class="back-btn" (click)="router.navigate(['/hr/employees'])">
          <app-icon name="arrow-left" [size]="15" color="#00695c"></app-icon>
          Back
        </button>
        <div class="action-btns" *ngIf="emp.status === 'PENDING' || emp.status === 'REJECTED'">
          <button class="approve-btn" (click)="approve()" [disabled]="saving">
            <app-icon name="check-circle" [size]="15" color="#fff"></app-icon>
            Approve
          </button>
          <button class="reject-btn" (click)="openRejectModal()" [disabled]="saving">
            <app-icon name="x-circle" [size]="15" color="#fff"></app-icon>
            Reject
          </button>
        </div>
        <div class="action-btns" *ngIf="emp.status === 'APPROVED'">
          <span class="approved-badge">
            <app-icon name="check-circle" [size]="14" color="#2e7d32"></app-icon>
            Approved
          </span>
          <button class="reject-btn" (click)="openRejectModal()" [disabled]="saving">
            <app-icon name="x-circle" [size]="15" color="#fff"></app-icon>
            Reject
          </button>
        </div>
      </div>

      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar-big">{{ emp.name?.[0]?.toUpperCase() || '?' }}</div>
        <div class="profile-info">
          <h2>{{ emp.name }}</h2>
          <div class="profile-meta">
            <span><app-icon name="user" [size]="13" color="#888"></app-icon> {{ emp.username }}</span>
            <span><app-icon name="mail" [size]="13" color="#888"></app-icon> {{ emp.email }}</span>
            <span><app-icon name="phone" [size]="13" color="#888"></app-icon> {{ emp.contactNo }}</span>
          </div>
        </div>
        <span class="status-badge" [class]="'status-' + emp.status?.toLowerCase()">{{ emp.status }}</span>
      </div>

      <!-- Rejection Reason (if rejected) -->
      <div class="rejection-box" *ngIf="emp.status === 'REJECTED' && emp.rejectionReason">
        <app-icon name="alert-circle" [size]="16" color="#c62828"></app-icon>
        <div>
          <div class="rejection-title">Rejection Reason</div>
          <div class="rejection-text">{{ emp.rejectionReason }}</div>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="details-grid">

        <!-- Personal Info -->
        <div class="card">
          <div class="card-header">
            <app-icon name="user" [size]="16" color="#00695c"></app-icon>
            <span class="card-title">Personal Information</span>
          </div>
          <div class="info-rows">
            <div class="info-row"><span class="info-label">Address</span><span class="info-val">{{ emp.address }}</span></div>
            <div class="info-row"><span class="info-label">Qualification</span><span class="info-val">{{ emp.highestQualification }}</span></div>
            <div class="info-row"><span class="info-label">Profile Since</span><span class="info-val">{{ emp.createdAt | date:'mediumDate' }}</span></div>
          </div>
        </div>

        <!-- Skills -->
        <div class="card">
          <div class="card-header">
            <app-icon name="layers" [size]="16" color="#00695c"></app-icon>
            <span class="card-title">Skills ({{ emp.skills?.length || 0 }})</span>
          </div>
          <div class="skills-wrap">
            <span class="skill-tag" *ngFor="let s of emp.skills">{{ s }}</span>
            <span class="no-data" *ngIf="!emp.skills?.length">No skills added</span>
          </div>
        </div>

      </div>

      <!-- MCQ Tests -->
      <div class="card full-card">
        <div class="card-header">
          <app-icon name="file-text" [size]="16" color="#00695c"></app-icon>
          <span class="card-title">MCQ Test Results ({{ emp.mcqTests?.length || 0 }})</span>
        </div>
        <div class="tests-grid" *ngIf="emp.mcqTests?.length > 0">
          <div class="test-card" *ngFor="let t of emp.mcqTests">
            <div class="test-top">
              <span class="test-skill">{{ t.skill }}</span>
              <span class="test-badge" [class]="'tbadge-' + t.status?.toLowerCase()">{{ t.status }}</span>
            </div>
            <div class="score-row" *ngIf="t.score !== null && t.score !== undefined">
              <div class="score-bar-wrap">
                <div class="score-bar" [style.width.%]="t.score" [class]="t.score >= 60 ? 'bar-green' : 'bar-red'"></div>
              </div>
              <span class="score-num">{{ t.score }}%</span>
            </div>
            <div class="test-detail">{{ t.correctAnswers }}/{{ t.totalQuestions }} correct</div>
          </div>
        </div>
        <div class="no-data-center" *ngIf="!emp.mcqTests?.length">No tests taken yet</div>
      </div>

      <!-- Certifications -->
      <div class="card full-card">
        <div class="card-header">
          <app-icon name="award" [size]="16" color="#00695c"></app-icon>
          <span class="card-title">Certifications ({{ emp.certifications?.length || 0 }})</span>
        </div>
        <div class="certs-grid" *ngIf="emp.certifications?.length > 0">
          <div class="cert-card" *ngFor="let c of emp.certifications">
            <img [src]="getCertUrl(c.imagePath)" [alt]="c.name" class="cert-img"
                 (error)="onImgError($event)">
            <div class="cert-name">{{ c.name }}</div>
            <div class="cert-date">{{ c.uploadedAt | date:'mediumDate' }}</div>
          </div>
        </div>
        <div class="no-data-center" *ngIf="!emp.certifications?.length">No certifications uploaded</div>
      </div>

    </div>

    <!-- Loading -->
    <div class="loading" *ngIf="!emp && !error">
      <div class="spinner"></div> Loading...
    </div>
    <div class="error-state" *ngIf="error">Employee not found.</div>

    <!-- Reject Modal -->
    <div class="modal-overlay" *ngIf="showRejectModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Reject Profile</h3>
          <button class="modal-close" (click)="closeModal()">
            <app-icon name="x" [size]="18" color="#666"></app-icon>
          </button>
        </div>
        <p class="modal-sub">Please provide a reason so the employee knows what to fix.</p>
        <textarea [(ngModel)]="rejectReason" placeholder="e.g. Missing certifications, incomplete skills section..." class="reason-input" rows="4"></textarea>
        <div class="modal-actions">
          <button class="cancel-btn" (click)="closeModal()">Cancel</button>
          <button class="confirm-reject-btn" (click)="confirmReject()" [disabled]="!rejectReason.trim() || saving">
            <app-icon name="x-circle" [size]="14" color="#fff"></app-icon>
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 18px; }

    .top-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
    .back-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 10px;
      background: white; border: 1.5px solid #e0e0e0;
      color: #00695c; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .back-btn:hover { border-color: #00897b; background: #e0f2f1; }
    .action-btns { display: flex; align-items: center; gap: 10px; }
    .approve-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 9px 20px; border-radius: 10px;
      background: linear-gradient(135deg, #2e7d32, #43a047);
      border: none; color: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .approve-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(46,125,50,0.3); }
    .reject-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 9px 20px; border-radius: 10px;
      background: linear-gradient(135deg, #c62828, #e53935);
      border: none; color: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .reject-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(198,40,40,0.3); }
    .approve-btn:disabled, .reject-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .approved-badge {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 10px;
      background: #e8f5e9; color: #2e7d32; font-size: 13px; font-weight: 600;
    }

    .profile-header {
      display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
      background: white; border-radius: 16px; padding: 22px 24px;
      box-shadow: 0 1px 12px rgba(0,0,0,0.06);
    }
    .avatar-big {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #26a69a, #00796b);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 800; color: white; flex-shrink: 0;
    }
    .profile-info { flex: 1; }
    .profile-info h2 { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; }
    .profile-meta { display: flex; flex-wrap: wrap; gap: 14px; }
    .profile-meta span { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #666; }
    .status-badge { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .status-pending  { background: #fff3e0; color: #e65100; }
    .status-approved { background: #e8f5e9; color: #2e7d32; }
    .status-rejected { background: #ffebee; color: #c62828; }

    .rejection-box {
      display: flex; align-items: flex-start; gap: 12px;
      background: #ffebee; border: 1.5px solid #ef9a9a; border-radius: 12px; padding: 14px 18px;
    }
    .rejection-title { font-size: 13px; font-weight: 700; color: #c62828; margin-bottom: 4px; }
    .rejection-text { font-size: 13px; color: #b71c1c; line-height: 1.5; }

    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .details-grid { grid-template-columns: 1fr; } }

    .card, .full-card {
      background: white; border-radius: 16px;
      box-shadow: 0 1px 12px rgba(0,0,0,0.06); overflow: hidden;
    }
    .card-header {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 18px 12px; border-bottom: 1px solid #f0f0f0;
    }
    .card-title { font-size: 14px; font-weight: 700; color: #004d40; }

    .info-rows { padding: 4px 0; }
    .info-row { display: flex; padding: 10px 18px; border-bottom: 1px solid #f5f5f5; }
    .info-row:last-child { border-bottom: none; }
    .info-label { width: 120px; font-size: 11px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
    .info-val { font-size: 13.5px; color: #222; font-weight: 500; }

    .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; padding: 14px 18px; }
    .skill-tag { padding: 5px 13px; border-radius: 20px; background: #e0f2f1; color: #00695c; font-size: 12.5px; font-weight: 600; }
    .no-data { font-size: 13px; color: #bbb; font-style: italic; }

    .tests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; padding: 14px 18px; }
    .test-card { background: #f8fffe; border: 1px solid #e0f2f1; border-radius: 12px; padding: 14px; }
    .test-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .test-skill { font-size: 14px; font-weight: 700; color: #004d40; }
    .test-badge { padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
    .tbadge-pending  { background: #fff3e0; color: #e65100; }
    .tbadge-passed   { background: #e8f5e9; color: #2e7d32; }
    .tbadge-failed   { background: #ffebee; color: #c62828; }
    .score-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .score-bar-wrap { flex: 1; height: 7px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
    .score-bar { height: 100%; border-radius: 4px; }
    .bar-green { background: linear-gradient(90deg, #43a047, #66bb6a); }
    .bar-red   { background: linear-gradient(90deg, #e53935, #ef5350); }
    .score-num { font-size: 13px; font-weight: 700; color: #333; min-width: 34px; text-align: right; }
    .test-detail { font-size: 11px; color: #999; }

    .certs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; padding: 14px 18px; }
    .cert-card { border-radius: 12px; overflow: hidden; border: 1.5px solid #e0f2f1; }
    .cert-img { width: 100%; height: 110px; object-fit: cover; display: block; background: #f5f5f5; }
    .cert-name { font-size: 12.5px; font-weight: 600; color: #1a1a2e; padding: 8px 10px 2px; }
    .cert-date { font-size: 11px; color: #999; padding: 0 10px 8px; }

    .no-data-center { padding: 30px; text-align: center; color: #bbb; font-size: 13px; font-style: italic; }

    .loading { display: flex; align-items: center; gap: 10px; padding: 60px; justify-content: center; color: #888; font-size: 14px; }
    .spinner {
      width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid #e0f2f1; border-top-color: #00897b;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-state { padding: 60px; text-align: center; color: #e53935; font-size: 14px; }

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
    .modal-close:hover { background: #f5f5f5; }
    .modal-sub { font-size: 13px; color: #888; margin-bottom: 16px; line-height: 1.5; }
    .reason-input {
      width: 100%; border: 1.5px solid #e0e0e0; border-radius: 10px;
      padding: 12px 14px; font-size: 13.5px; font-family: inherit;
      resize: vertical; outline: none; transition: border-color 0.15s;
    }
    .reason-input:focus { border-color: #e53935; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
    .cancel-btn {
      padding: 9px 20px; border-radius: 10px;
      background: #f5f5f5; border: none; color: #555;
      font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .cancel-btn:hover { background: #e0e0e0; }
    .confirm-reject-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 9px 20px; border-radius: 10px;
      background: linear-gradient(135deg, #c62828, #e53935);
      border: none; color: white; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .confirm-reject-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .confirm-reject-btn:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(198,40,40,0.3); }
  `]
})
export class HrEmployeeDetailComponent implements OnInit {
  emp: any = null;
  error = false;
  saving = false;
  showRejectModal = false;
  rejectReason = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private hrService: HrService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.hrService.getEmployeeDetail(id).subscribe({
      next: (data) => this.emp = data,
      error: () => this.error = true
    });
  }

  approve(): void {
    this.saving = true;
    this.hrService.approveProfile(this.emp.id).subscribe({
      next: (updated) => {
        this.emp = updated;
        this.saving = false;
        this.toast.success(`${this.emp.name}'s profile has been approved.`);
      },
      error: () => { this.saving = false; this.toast.error('Failed to approve profile.'); }
    });
  }

  openRejectModal(): void { this.rejectReason = ''; this.showRejectModal = true; }
  closeModal(): void { this.showRejectModal = false; }

  confirmReject(): void {
    if (!this.rejectReason.trim()) return;
    this.saving = true;
    this.hrService.rejectProfile(this.emp.id, this.rejectReason).subscribe({
      next: (updated) => {
        this.emp = updated;
        this.saving = false;
        this.showRejectModal = false;
        this.toast.warning(`${this.emp.name}'s profile has been rejected.`);
      },
      error: () => { this.saving = false; this.toast.error('Failed to reject profile.'); }
    });
  }

  getCertUrl(path: string): string {
    if (!path) return '';
    const filename = path.split('/').pop() || path.split('\\').pop() || path;
    return `http://localhost:8080/api/uploads/certifications/${filename}`;
  }

  onImgError(event: any): void {
    event.target.style.display = 'none';
  }
}
