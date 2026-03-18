import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="dash">

      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-left">
          <div class="welcome-avatar">{{ getInitial() }}</div>
          <div>
            <h2>Welcome back, {{ currentUser?.username }}!</h2>
            <p>Here's an overview of your profile and test status.</p>
          </div>
        </div>
        <div class="profile-badge" [class]="'badge-' + getStatusKey()">
          <app-icon [name]="getStatusIcon()" [size]="14" color="currentColor"></app-icon>
          {{ getStatusText() }}
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="stats-row">
        <div class="stat-card" *ngFor="let s of getStats()">
          <div class="stat-icon-wrap" [style.background]="s.bg">
            <app-icon [name]="s.icon" [size]="20" [color]="s.color"></app-icon>
          </div>
          <div>
            <div class="stat-val" [style.color]="s.color">{{ s.val }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="main-grid">

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Quick Actions</span>
          </div>
          <div class="actions-list">
            <button class="action-item" (click)="createProfile()">
              <span class="action-icon" style="background:#e3f2fd">
                <app-icon name="user" [size]="18" color="#1565c0"></app-icon>
              </span>
              <div class="action-text">
                <div class="action-name">{{ profile ? 'Update Profile' : 'Create Profile' }}</div>
                <div class="action-sub">Manage your personal information</div>
              </div>
              <app-icon name="chevron-right" [size]="16" color="#bbb"></app-icon>
            </button>

            <button class="action-item" (click)="takeTest()" [disabled]="!profile || !profile.skills?.length">
              <span class="action-icon" style="background:#e8f5e9">
                <app-icon name="file-text" [size]="18" color="#2e7d32"></app-icon>
              </span>
              <div class="action-text">
                <div class="action-name">Take MCQ Test</div>
                <div class="action-sub">{{ !profile ? 'Create profile first' : !profile.skills?.length ? 'Add skills to unlock' : 'Skill assessment tests' }}</div>
              </div>
              <app-icon name="chevron-right" [size]="16" color="#bbb"></app-icon>
            </button>

            <button class="action-item" (click)="uploadCertification()" [disabled]="!profile">
              <span class="action-icon" style="background:#f3e5f5">
                <app-icon name="upload" [size]="18" color="#6a1b9a"></app-icon>
              </span>
              <div class="action-text">
                <div class="action-name">Upload Certification</div>
                <div class="action-sub">Add your certificates</div>
              </div>
              <app-icon name="chevron-right" [size]="16" color="#bbb"></app-icon>
            </button>
          </div>
        </div>

        <!-- Profile Summary -->
        <div class="card" *ngIf="profile; else noProfile">
          <div class="card-header">
            <span class="card-title">Profile Summary</span>
            <button class="edit-btn" (click)="createProfile()">
              <app-icon name="edit-2" [size]="13" color="#1a237e"></app-icon>
              Edit
            </button>
          </div>
          <div class="profile-rows">
            <div class="profile-row">
              <span class="row-label">Name</span>
              <span class="row-val">{{ profile.name }}</span>
            </div>
            <div class="profile-row">
              <span class="row-label">Email</span>
              <span class="row-val">{{ profile.email }}</span>
            </div>
            <div class="profile-row">
              <span class="row-label">Contact</span>
              <span class="row-val">{{ profile.contactNo }}</span>
            </div>
            <div class="profile-row">
              <span class="row-label">Qualification</span>
              <span class="row-val">{{ profile.highestQualification }}</span>
            </div>
            <div class="profile-row align-start">
              <span class="row-label">Skills</span>
              <div class="skills-wrap">
                <span class="skill-tag" *ngFor="let s of profile.skills">{{ s }}</span>
              </div>
            </div>
          </div>
        </div>

        <ng-template #noProfile>
          <div class="card empty-card">
            <div class="empty-icon-wrap">
              <app-icon name="user" [size]="36" color="#9fa8da"></app-icon>
            </div>
            <h3>No Profile Yet</h3>
            <p>Create your profile to unlock all features</p>
            <button class="create-btn" (click)="createProfile()">
              Create Profile
              <app-icon name="arrow-right" [size]="16" color="#fff"></app-icon>
            </button>
          </div>
        </ng-template>

      </div>

      <!-- MCQ Tests -->
      <div class="card full-card" *ngIf="profile?.mcqTests?.length > 0">
        <div class="card-header">
          <span class="card-title">MCQ Test Results</span>
          <button class="edit-btn" (click)="takeTest()">
            <app-icon name="file-text" [size]="13" color="#1a237e"></app-icon>
            Take Test
          </button>
        </div>
        <div class="tests-grid">
          <div class="test-card" *ngFor="let test of profile.mcqTests">
            <div class="test-top">
              <div class="test-skill-row">
                <app-icon name="layers" [size]="15" color="#3949ab"></app-icon>
                <span class="test-skill">{{ test.skill }}</span>
              </div>
              <span class="test-badge" [class]="'tbadge-' + test.status.toLowerCase()">
                {{ test.status }}
              </span>
            </div>
            <div class="test-score-row" *ngIf="test.score !== null && test.score !== undefined">
              <div class="score-bar-wrap">
                <div class="score-bar" [style.width.%]="test.score"
                     [class]="test.score >= 60 ? 'bar-green' : 'bar-red'"></div>
              </div>
              <span class="score-num">{{ test.score }}%</span>
            </div>
            <div class="test-pending" *ngIf="test.status === 'PENDING'">
              <app-icon name="clock" [size]="13" color="#aaa"></app-icon>
              Not attempted yet
            </div>
          </div>
        </div>
      </div>

      <!-- Suggested Projects -->
      <div class="card full-card" *ngIf="suggestedProjects.length > 0">
        <div class="card-header">
          <span class="card-title">
            <app-icon name="layers" [size]="15" color="#1a237e"></app-icon>
            &nbsp;Suggested Projects
          </span>
          <span class="proj-count">{{ suggestedProjects.length }} match(es) based on your skills</span>
        </div>
        <div class="projects-grid">
          <div class="proj-card" *ngFor="let p of suggestedProjects">
            <div class="proj-top">
              <div class="proj-name">{{ p.name }}</div>
              <span class="proj-status status-{{ p.status.toLowerCase() }}">{{ p.status }}</span>
            </div>
            <div class="proj-desc">{{ p.description || 'No description provided.' }}</div>
            <div class="proj-skills">
              <span class="skill-tag match" *ngFor="let s of p.requiredSkills"
                    [class.match]="isSkillMatch(s)">{{ s }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .dash { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 20px; }

    /* BANNER */
    .welcome-banner {
      background: linear-gradient(135deg, #1a237e 0%, #1565c0 100%);
      border-radius: 16px; padding: 22px 26px;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
    }
    .welcome-left { display: flex; align-items: center; gap: 14px; }
    .welcome-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      background: rgba(255,255,255,0.18);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 800; color: white; flex-shrink: 0;
    }
    .welcome-banner h2 { font-size: 18px; font-weight: 700; color: white; margin-bottom: 3px; }
    .welcome-banner p { font-size: 13px; color: rgba(255,255,255,0.65); }
    .profile-badge {
      display: flex; align-items: center; gap: 7px;
      padding: 7px 16px; border-radius: 50px;
      font-size: 12px; font-weight: 600;
    }
    .badge-pending  { background: rgba(255,152,0,0.2);  color: #ffb74d; }
    .badge-approved { background: rgba(76,175,80,0.2);  color: #81c784; }
    .badge-rejected { background: rgba(244,67,54,0.2);  color: #e57373; }
    .badge-none     { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }

    /* STATS */
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
    .stat-card {
      background: white; border-radius: 14px; padding: 18px 16px;
      display: flex; align-items: center; gap: 14px;
      box-shadow: 0 1px 10px rgba(0,0,0,0.06);
    }
    .stat-icon-wrap {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .stat-val { font-size: 20px; font-weight: 800; }
    .stat-label { font-size: 11px; color: #888; margin-top: 2px; font-weight: 500; }

    /* CARDS */
    .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    @media (max-width: 768px) { .main-grid { grid-template-columns: 1fr; } }

    .card, .full-card {
      background: white; border-radius: 16px;
      box-shadow: 0 1px 12px rgba(0,0,0,0.06); overflow: hidden;
    }
    .card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px 13px; border-bottom: 1px solid #f0f0f0;
    }
    .card-title { font-size: 15px; font-weight: 700; color: #1a237e; }
    .edit-btn {
      display: flex; align-items: center; gap: 5px;
      font-size: 12px; padding: 5px 12px; border-radius: 20px;
      background: #f0f4ff; color: #1a237e; border: none; cursor: pointer;
      font-weight: 600; transition: background 0.15s;
    }
    .edit-btn:hover { background: #dde5ff; }

    /* ACTIONS */
    .actions-list { padding: 6px 0; }
    .action-item {
      display: flex; align-items: center; gap: 13px;
      width: 100%; padding: 13px 18px;
      background: none; border: none; cursor: pointer;
      text-align: left; transition: background 0.12s; border-bottom: 1px solid #fafafa;
    }
    .action-item:last-child { border-bottom: none; }
    .action-item:hover:not(:disabled) { background: #f8f9ff; }
    .action-item:disabled { opacity: 0.4; cursor: not-allowed; }
    .action-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .action-text { flex: 1; }
    .action-name { font-size: 13.5px; font-weight: 600; color: #1a1a2e; }
    .action-sub { font-size: 11.5px; color: #999; margin-top: 2px; }

    /* PROFILE */
    .profile-rows { padding: 4px 0; }
    .profile-row {
      display: flex; align-items: center;
      padding: 10px 20px; border-bottom: 1px solid #f5f5f5;
    }
    .profile-row:last-child { border-bottom: none; }
    .profile-row.align-start { align-items: flex-start; padding-top: 12px; }
    .row-label { width: 110px; font-size: 11px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
    .row-val { font-size: 13.5px; color: #222; font-weight: 500; }
    .skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag {
      padding: 3px 11px; border-radius: 20px;
      background: #e8eaf6; color: #3949ab;
      font-size: 12px; font-weight: 600;
    }

    /* EMPTY */
    .empty-card {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 44px 24px; text-align: center;
    }
    .empty-icon-wrap {
      width: 72px; height: 72px; border-radius: 50%;
      background: #e8eaf6; display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .empty-card h3 { font-size: 17px; font-weight: 700; color: #333; margin-bottom: 8px; }
    .empty-card p { font-size: 13px; color: #999; margin-bottom: 22px; }
    .create-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 11px 26px; border-radius: 50px;
      background: linear-gradient(135deg, #1a237e, #1565c0);
      color: white; border: none; font-size: 13.5px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .create-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(26,35,126,0.3); }

    /* TESTS */
    .tests-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; padding: 16px 18px; }
    .test-card {
      border-radius: 12px; padding: 14px 16px;
      background: #f8f9ff; border: 1px solid #e8eaf6;
    }
    .test-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .test-skill-row { display: flex; align-items: center; gap: 6px; }
    .test-skill { font-size: 14px; font-weight: 700; color: #1a237e; }
    .test-badge {
      padding: 3px 9px; border-radius: 20px;
      font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .tbadge-pending { background: #fff3e0; color: #e65100; }
    .tbadge-passed  { background: #e8f5e9; color: #2e7d32; }
    .tbadge-failed  { background: #ffebee; color: #c62828; }
    .test-score-row { display: flex; align-items: center; gap: 10px; }
    .score-bar-wrap { flex: 1; height: 7px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
    .score-bar { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
    .bar-green { background: linear-gradient(90deg, #43a047, #66bb6a); }
    .bar-red   { background: linear-gradient(90deg, #e53935, #ef5350); }
    .score-num { font-size: 13px; font-weight: 700; color: #333; min-width: 34px; text-align: right; }
    .test-pending { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #bbb; font-style: italic; }

    /* SUGGESTED PROJECTS */
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; padding: 16px 18px; }
    .proj-card {
      border-radius: 12px; padding: 16px;
      background: #f8fbff; border: 1.5px solid #d6eaf8;
      display: flex; flex-direction: column; gap: 8px;
      transition: border-color 0.15s;
    }
    .proj-card:hover { border-color: #1565c0; }
    .proj-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .proj-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .proj-desc { font-size: 12px; color: #777; line-height: 1.5; }
    .proj-skills { display: flex; flex-wrap: wrap; gap: 5px; }
    .proj-count { font-size: 12px; color: #1565c0; font-weight: 600; }
    .proj-status { padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
    .status-active    { background: #e8f5e9; color: #2e7d32; }
    .status-on_hold   { background: #fff3e0; color: #e65100; }
    .status-completed { background: #f3e5f5; color: #7b1fa2; }
    .skill-tag.match  { background: #e3f2fd; color: #1565c0; border: 1.5px solid #90caf9; }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  currentUser = this.authService.getCurrentUser();
  profile: any = null;
  suggestedProjects: any[] = [];

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeService.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        if (p?.skills?.length > 0) {
          this.employeeService.getSuggestedProjects().subscribe({
            next: (projects) => this.suggestedProjects = projects,
            error: () => {}
          });
        }
      },
      error: () => {}
    });
  }

  getInitial(): string { return (this.currentUser?.username?.[0] ?? 'U').toUpperCase(); }

  getStatusKey(): string {
    if (!this.profile) return 'none';
    return this.profile.status?.toLowerCase() ?? 'none';
  }

  getStatusIcon(): string {
    if (!this.profile) return 'info';
    switch (this.profile.status) {
      case 'APPROVED': return 'check-circle';
      case 'REJECTED': return 'x-circle';
      default: return 'clock';
    }
  }

  getStatusText(): string {
    if (!this.profile) return 'No Profile';
    switch (this.profile.status) {
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      default: return 'Pending Review';
    }
  }

  getStats() {
    return [
      { icon: 'user',        color: '#1565c0', bg: '#e3f2fd', val: this.profile ? 'Active' : 'None',              label: 'Profile' },
      { icon: 'check-circle',color: '#2e7d32', bg: '#e8f5e9', val: this.getPassedCount(),                          label: 'Tests Passed' },
      { icon: 'clock',       color: '#e65100', bg: '#fff3e0', val: this.getPendingCount(),                         label: 'Tests Pending' },
      { icon: 'award',       color: '#6a1b9a', bg: '#f3e5f5', val: this.getCertCount(),                            label: 'Certifications' },
    ];
  }

  getPassedCount():  number { return this.profile?.mcqTests?.filter((t: any) => t.status === 'PASSED').length  ?? 0; }
  getPendingCount(): number { return this.profile?.mcqTests?.filter((t: any) => t.status === 'PENDING').length ?? 0; }
  getCertCount():    number { return this.profile?.certifications?.length ?? 0; }

  createProfile():      void { this.router.navigate(['/employee/profile']); }
  uploadCertification():void { this.router.navigate(['/employee/certification']); }
  takeTest():           void { this.router.navigate(['/employee/test']); }

  isSkillMatch(skill: string): boolean {
    return this.profile?.skills?.some(
      (s: string) => s.toLowerCase() === skill.toLowerCase()
    ) ?? false;
  }
}
