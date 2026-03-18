import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { ToastService } from '../../shared/toast.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-pm-candidates',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="page">
      <div class="top-bar">
        <button class="back-btn" (click)="router.navigate(['/pm/projects'])">
          <app-icon name="arrow-left" [size]="16" color="#1565c0"></app-icon>
          Back to Projects
        </button>
      </div>

      <div class="project-banner" *ngIf="project">
        <div class="banner-left">
          <div class="banner-icon"><app-icon name="layers" [size]="24" color="#fff"></app-icon></div>
          <div>
            <h2>{{ project.name }}</h2>
            <p>{{ project.description || 'No description' }}</p>
          </div>
        </div>
        <div class="required-skills">
          <div class="skills-label">Required Skills:</div>
          <div class="skills-row">
            <span class="skill-chip req" *ngFor="let s of project.requiredSkills">{{ s }}</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button class="tab" [class.active]="activeTab === 'applications'" (click)="activeTab = 'applications'">
          <app-icon name="send" [size]="14"></app-icon>
          Applications
          <span class="tab-count">{{ applications.length }}</span>
        </button>
        <button class="tab" [class.active]="activeTab === 'suggested'" (click)="activeTab = 'suggested'">
          <app-icon name="users" [size]="14"></app-icon>
          Suggested Candidates
          <span class="tab-count">{{ candidates.length }}</span>
        </button>
      </div>

      <!-- APPLICATIONS TAB -->
      <ng-container *ngIf="activeTab === 'applications'">
        <div class="loading" *ngIf="loadingApps">
          <div class="spinner"></div><p>Loading applications...</p>
        </div>
        <div class="empty" *ngIf="!loadingApps && applications.length === 0">
          <app-icon name="inbox" [size]="44" color="#b0bec5"></app-icon>
          <p>No applications yet for this project.</p>
        </div>
        <div class="candidates-grid" *ngIf="!loadingApps && applications.length > 0">
          <div class="candidate-card" *ngFor="let app of applications">
            <div class="card-top">
              <div class="avatar">{{ app.employee?.name?.[0]?.toUpperCase() || '?' }}</div>
              <div class="candidate-info">
                <div class="candidate-name">{{ app.employee?.name }}</div>
                <div class="candidate-id">{{ app.employee?.username }}</div>
                <div class="candidate-email">{{ app.employee?.email }}</div>
              </div>
              <span class="status-badge" [class]="'sbadge-' + app.status?.toLowerCase()">{{ app.status }}</span>
            </div>

            <div class="detail-row">
              <app-icon name="book-open" [size]="13" color="#888"></app-icon>
              <span>{{ app.employee?.highestQualification }}</span>
            </div>
            <div class="detail-row">
              <app-icon name="phone" [size]="13" color="#888"></app-icon>
              <span>{{ app.employee?.contactNo }}</span>
            </div>

            <div class="skills-section">
              <div class="skills-label">Skills:</div>
              <div class="skills-row">
                <span class="skill-chip" *ngFor="let s of app.employee?.skills" [class.match]="isMatch(s)">
                  {{ s }}
                  <app-icon *ngIf="isMatch(s)" name="check" [size]="10" color="#1565c0"></app-icon>
                </span>
              </div>
            </div>

            <div class="match-bar" *ngIf="project">
              <div class="match-label">Skill Match</div>
              <div class="bar-track">
                <div class="bar-fill" [style.width]="getMatchPercent(app.employee) + '%'"></div>
              </div>
              <div class="match-pct">{{ getMatchPercent(app.employee) }}%</div>
            </div>

            <div class="tests-section" *ngIf="app.employee?.mcqTests?.length > 0">
              <div class="tests-label">Test Results:</div>
              <div class="tests-row">
                <span class="test-chip" *ngFor="let t of app.employee.mcqTests"
                      [class]="'test-' + (t.status || 'pending').toLowerCase()">
                  {{ t.skill }}: {{ t.score !== null && t.score !== undefined ? t.score + '%' : 'Pending' }}
                </span>
              </div>
            </div>

            <div class="certs-section" *ngIf="app.employee?.certifications?.length > 0">
              <div class="certs-label">Certifications ({{ app.employee.certifications.length }}):</div>
              <div class="certs-row">
                <div class="cert-thumb" *ngFor="let c of app.employee.certifications">
                  <img [src]="getCertUrl(c.imagePath)" [alt]="c.name" (error)="onImgError($event)">
                  <span>{{ c.name }}</span>
                </div>
              </div>
            </div>

            <div class="pm-note" *ngIf="app.pmNote">
              <app-icon name="message-square" [size]="12" color="#888"></app-icon>
              {{ app.pmNote }}
            </div>

            <div class="app-actions" *ngIf="app.status === 'PENDING'">
              <button class="approve-btn" (click)="openAction(app, 'approve')" [disabled]="saving === app.id">
                <app-icon name="check" [size]="13" color="#fff"></app-icon> Select
              </button>
              <button class="reject-btn" (click)="openAction(app, 'reject')" [disabled]="saving === app.id">
                <app-icon name="x" [size]="13" color="#fff"></app-icon> Reject
              </button>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- SUGGESTED CANDIDATES TAB -->
      <ng-container *ngIf="activeTab === 'suggested'">
        <div class="loading" *ngIf="loading">
          <div class="spinner"></div><p>Finding matching candidates...</p>
        </div>
        <div class="empty" *ngIf="!loading && candidates.length === 0">
          <app-icon name="users" [size]="48" color="#b0bec5"></app-icon>
          <p>No approved candidates match the required skills yet.</p>
        </div>
        <div class="candidates-grid" *ngIf="!loading && candidates.length > 0">
          <div class="candidate-card" *ngFor="let c of candidates">
            <div class="card-top">
              <div class="avatar">{{ c.name?.[0]?.toUpperCase() || '?' }}</div>
              <div class="candidate-info">
                <div class="candidate-name">{{ c.name }}</div>
                <div class="candidate-id">{{ c.username }}</div>
                <div class="candidate-email">{{ c.email }}</div>
              </div>
              <span class="approved-badge">
                <app-icon name="check-circle" [size]="12" color="#2e7d32"></app-icon> Approved
              </span>
            </div>
            <div class="detail-row">
              <app-icon name="book-open" [size]="13" color="#888"></app-icon>
              <span>{{ c.highestQualification }}</span>
            </div>
            <div class="skills-section">
              <div class="skills-label">Skills:</div>
              <div class="skills-row">
                <span class="skill-chip" *ngFor="let s of c.skills" [class.match]="isMatch(s)">
                  {{ s }}
                  <app-icon *ngIf="isMatch(s)" name="check" [size]="10" color="#1565c0"></app-icon>
                </span>
              </div>
            </div>
            <div class="match-bar" *ngIf="project">
              <div class="match-label">Skill Match</div>
              <div class="bar-track">
                <div class="bar-fill" [style.width]="getMatchPercent(c) + '%'"></div>
              </div>
              <div class="match-pct">{{ getMatchPercent(c) }}%</div>
            </div>
            <div class="tests-section" *ngIf="c.mcqTests?.length > 0">
              <div class="tests-label">Test Results:</div>
              <div class="tests-row">
                <span class="test-chip" *ngFor="let t of c.mcqTests"
                      [class]="'test-' + (t.status || 'pending').toLowerCase()">
                  {{ t.skill }}: {{ t.score !== null && t.score !== undefined ? t.score + '%' : 'Pending' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>

    <!-- Action Modal -->
    <div class="modal-overlay" *ngIf="actionTarget" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ actionType === 'approve' ? 'Select Candidate' : 'Reject Application' }}</h3>
          <button class="modal-close" (click)="closeModal()">
            <app-icon name="x" [size]="18" color="#666"></app-icon>
          </button>
        </div>
        <p class="modal-sub">
          {{ actionType === 'approve' ? 'Optional note for' : 'Reason for rejecting' }}
          <strong>{{ actionTarget?.employee?.name }}</strong>:
        </p>
        <textarea [(ngModel)]="actionNote"
          [placeholder]="actionType === 'approve' ? 'e.g. Great skill match!' : 'e.g. Skills do not match'"
          class="note-input" rows="3"></textarea>
        <div class="modal-actions">
          <button class="cancel-btn" (click)="closeModal()">Cancel</button>
          <button [class]="actionType === 'approve' ? 'confirm-approve-btn' : 'confirm-reject-btn'"
                  (click)="confirmAction()" [disabled]="saving === actionTarget?.id">
            <app-icon [name]="actionType === 'approve' ? 'check' : 'x'" [size]="13" color="#fff"></app-icon>
            {{ actionType === 'approve' ? 'Select' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 20px; }

    .top-bar { display: flex; align-items: center; }
    .back-btn {
      display: flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 8px;
      background: white; border: 1.5px solid #d6eaf8; color: #1565c0; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .back-btn:hover { background: #e3f2fd; }

    .project-banner {
      background: linear-gradient(135deg, #0d2137, #0a5276); border-radius: 16px; padding: 22px 26px;
      display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px;
    }
    .banner-left { display: flex; align-items: flex-start; gap: 14px; }
    .banner-icon {
      width: 48px; height: 48px; border-radius: 12px; background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .project-banner h2 { font-size: 17px; font-weight: 700; color: white; margin-bottom: 4px; }
    .project-banner p { font-size: 13px; color: rgba(255,255,255,0.6); }
    .required-skills { display: flex; flex-direction: column; gap: 6px; }
    .skills-label { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .skills-row { display: flex; flex-wrap: wrap; gap: 5px; }
    .skill-chip { padding: 3px 10px; border-radius: 20px; background: #e3f2fd; color: #1565c0; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .skill-chip.req { background: rgba(255,255,255,0.2); color: white; }
    .skill-chip.match { background: #e3f2fd; color: #1565c0; border: 1.5px solid #1565c0; }

    .tabs-bar { display: flex; gap: 8px; }
    .tab {
      display: flex; align-items: center; gap: 7px; padding: 9px 18px; border-radius: 10px;
      border: 1.5px solid #e0e0e0; background: white; font-size: 13px; font-weight: 600; color: #666; cursor: pointer; transition: all 0.15s;
    }
    .tab:hover { border-color: #1565c0; color: #1565c0; }
    .tab.active { background: #e3f2fd; border-color: #1565c0; color: #0d47a1; }
    .tab-count { background: #e0e0e0; color: #555; padding: 1px 7px; border-radius: 10px; font-size: 11px; }
    .tab.active .tab-count { background: #1565c0; color: white; }

    .loading { display: flex; align-items: center; gap: 12px; padding: 32px; }
    .loading p { font-size: 14px; color: #888; }
    .spinner { width: 24px; height: 24px; border-radius: 50%; border: 3px solid #d6eaf8; border-top-color: #1565c0; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 64px; background: white; border-radius: 14px; }
    .empty p { font-size: 14px; color: #888; text-align: center; }

    .candidates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .candidate-card {
      background: white; border-radius: 14px; padding: 20px;
      box-shadow: 0 1px 10px rgba(0,0,0,0.07); border: 1.5px solid #d6eaf8;
      display: flex; flex-direction: column; gap: 12px;
    }
    .card-top { display: flex; align-items: flex-start; gap: 12px; }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #29b6f6, #0277bd);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .candidate-info { flex: 1; }
    .candidate-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .candidate-id { font-size: 11px; color: #1565c0; font-weight: 600; margin-top: 1px; }
    .candidate-email { font-size: 11px; color: #888; margin-top: 1px; }
    .approved-badge {
      display: flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px;
      background: #e8f5e9; color: #2e7d32; font-size: 11px; font-weight: 700; white-space: nowrap;
    }
    .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
    .sbadge-pending  { background: #fff3e0; color: #e65100; }
    .sbadge-approved { background: #e8f5e9; color: #2e7d32; }
    .sbadge-rejected { background: #ffebee; color: #c62828; }

    .detail-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #666; }
    .skills-section, .tests-section, .certs-section { display: flex; flex-direction: column; gap: 6px; }
    .tests-label, .certs-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.4px; }
    .tests-row, .certs-row { display: flex; flex-wrap: wrap; gap: 5px; }
    .test-chip { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .test-passed  { background: #e8f5e9; color: #2e7d32; }
    .test-failed  { background: #ffebee; color: #c62828; }
    .test-pending { background: #fff3e0; color: #e65100; }
    .cert-thumb { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .cert-thumb img { width: 56px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid #e0e0e0; }
    .cert-thumb span { font-size: 10px; color: #888; max-width: 60px; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .match-bar { display: flex; align-items: center; gap: 8px; }
    .match-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; }
    .bar-track { flex: 1; height: 6px; border-radius: 3px; background: #e3f2fd; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #29b6f6, #1565c0); transition: width 0.4s; }
    .match-pct { font-size: 12px; font-weight: 700; color: #1565c0; min-width: 36px; text-align: right; }

    .pm-note {
      display: flex; align-items: flex-start; gap: 6px; font-size: 12px; color: #888; font-style: italic;
      background: #f9f9f9; border-radius: 8px; padding: 8px 10px;
    }
    .app-actions { display: flex; gap: 8px; padding-top: 4px; border-top: 1px solid #f0f0f0; }
    .approve-btn {
      display: flex; align-items: center; gap: 5px; padding: 7px 16px; border-radius: 8px;
      background: linear-gradient(135deg, #2e7d32, #43a047); border: none; color: white;
      font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .approve-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .reject-btn {
      display: flex; align-items: center; gap: 5px; padding: 7px 16px; border-radius: 8px;
      background: linear-gradient(135deg, #c62828, #e53935); border: none; color: white;
      font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .reject-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal {
      background: white; border-radius: 18px; padding: 28px;
      width: 100%; max-width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .modal-header h3 { font-size: 17px; font-weight: 800; color: #1a237e; }
    .modal-close { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 6px; }
    .modal-sub { font-size: 13px; color: #888; margin-bottom: 14px; line-height: 1.5; }
    .note-input {
      width: 100%; border: 1.5px solid #e0e0e0; border-radius: 10px;
      padding: 11px 13px; font-size: 13.5px; font-family: inherit; resize: vertical; outline: none;
    }
    .note-input:focus { border-color: #1565c0; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; }
    .cancel-btn { padding: 9px 20px; border-radius: 10px; background: #f5f5f5; border: none; color: #555; font-size: 13px; font-weight: 600; cursor: pointer; }
    .confirm-approve-btn {
      display: flex; align-items: center; gap: 6px; padding: 9px 20px; border-radius: 10px;
      background: linear-gradient(135deg, #2e7d32, #43a047); border: none; color: white; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .confirm-reject-btn {
      display: flex; align-items: center; gap: 6px; padding: 9px 20px; border-radius: 10px;
      background: linear-gradient(135deg, #c62828, #e53935); border: none; color: white; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .confirm-approve-btn:disabled, .confirm-reject-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class PmCandidatesComponent implements OnInit {
  project: any = null;
  candidates: any[] = [];
  applications: any[] = [];
  loading = true;
  loadingApps = true;
  projectId!: number;
  activeTab: 'applications' | 'suggested' = 'applications';
  saving: number | null = null;
  actionTarget: any = null;
  actionType: 'approve' | 'reject' = 'approve';
  actionNote = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.projectService.getProject(this.projectId).subscribe({
      next: (p) => { this.project = p; },
      error: () => {}
    });
    this.loadApplications();
    this.projectService.getCandidates(this.projectId).subscribe({
      next: (c) => { this.candidates = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadApplications(): void {
    this.loadingApps = true;
    this.projectService.getApplications(this.projectId).subscribe({
      next: (a) => { this.applications = a; this.loadingApps = false; },
      error: () => { this.loadingApps = false; }
    });
  }

  openAction(app: any, type: 'approve' | 'reject'): void {
    this.actionTarget = app;
    this.actionType = type;
    this.actionNote = '';
  }

  closeModal(): void { this.actionTarget = null; }

  confirmAction(): void {
    if (!this.actionTarget) return;
    this.saving = this.actionTarget.id;
    const obs = this.actionType === 'approve'
      ? this.projectService.approveApplication(this.actionTarget.id, this.actionNote)
      : this.projectService.rejectApplication(this.actionTarget.id, this.actionNote);

    obs.subscribe({
      next: (updated: any) => {
        const idx = this.applications.findIndex((a: any) => a.id === this.actionTarget.id);
        if (idx !== -1) this.applications[idx] = updated;
        this.saving = null;
        const name = updated.employee?.name;
        if (this.actionType === 'approve') this.toast.success(name + ' has been selected for the project.');
        else this.toast.warning(name + "'s application has been rejected.");
        this.actionTarget = null;
      },
      error: () => { this.saving = null; this.toast.error('Action failed. Please try again.'); }
    });
  }

  isMatch(skill: string): boolean {
    if (!this.project) return false;
    return this.project.requiredSkills.some((r: string) => r.toLowerCase() === skill.toLowerCase());
  }

  getMatchPercent(emp: any): number {
    if (!this.project || !emp?.skills?.length) return 0;
    const required: string[] = this.project.requiredSkills.map((s: string) => s.toLowerCase());
    const matches = emp.skills.filter((s: string) => required.includes(s.toLowerCase())).length;
    return Math.round((matches / required.length) * 100);
  }

  getCertUrl(path: string): string {
    if (!path) return '';
    const filename = path.split('/').pop() || path.split('\\').pop() || path;
    return 'http://localhost:8080/api/uploads/certifications/' + filename;
  }

  onImgError(event: any): void { event.target.style.display = 'none'; }
}
