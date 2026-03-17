import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-pm-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="dash">
      <div class="banner">
        <div class="banner-left">
          <div class="banner-icon">
            <app-icon name="layers" [size]="28" color="#fff"></app-icon>
          </div>
          <div>
            <h2>Project Manager Dashboard</h2>
            <p>Manage your projects and find the right candidates</p>
          </div>
        </div>
        <button class="create-btn" (click)="router.navigate(['/pm/create'])">
          <app-icon name="plus-circle" [size]="16" color="#fff"></app-icon>
          New Project
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background:#e3f2fd">
            <app-icon name="layers" [size]="22" color="#1565c0"></app-icon>
          </div>
          <div class="stat-info">
            <div class="stat-val" style="color:#1565c0">{{ projects.length }}</div>
            <div class="stat-label">Total Projects</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#e8f5e9">
            <app-icon name="check-circle" [size]="22" color="#2e7d32"></app-icon>
          </div>
          <div class="stat-info">
            <div class="stat-val" style="color:#2e7d32">{{ countByStatus('ACTIVE') }}</div>
            <div class="stat-label">Active</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#fff3e0">
            <app-icon name="clock" [size]="22" color="#e65100"></app-icon>
          </div>
          <div class="stat-info">
            <div class="stat-val" style="color:#e65100">{{ countByStatus('ON_HOLD') }}</div>
            <div class="stat-label">On Hold</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#f3e5f5">
            <app-icon name="archive" [size]="22" color="#7b1fa2"></app-icon>
          </div>
          <div class="stat-info">
            <div class="stat-val" style="color:#7b1fa2">{{ countByStatus('COMPLETED') }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-title">Quick Actions</div>
      <div class="actions-grid">
        <button class="action-card" (click)="router.navigate(['/pm/create'])">
          <div class="action-icon" style="background:#e3f2fd">
            <app-icon name="plus-circle" [size]="24" color="#1565c0"></app-icon>
          </div>
          <div class="action-text">
            <div class="action-name">Create New Project</div>
            <div class="action-sub">Define requirements and required skills</div>
          </div>
          <app-icon name="chevron-right" [size]="18" color="#bbb"></app-icon>
        </button>
        <button class="action-card" (click)="router.navigate(['/pm/projects'])">
          <div class="action-icon" style="background:#e8f5e9">
            <app-icon name="layers" [size]="24" color="#2e7d32"></app-icon>
          </div>
          <div class="action-text">
            <div class="action-name">View All Projects</div>
            <div class="action-sub">{{ projects.length }} projects created</div>
          </div>
          <app-icon name="chevron-right" [size]="18" color="#bbb"></app-icon>
        </button>
      </div>

      <!-- Recent Projects -->
      <div class="section-title" style="margin-top:24px">Recent Projects</div>
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div><p>Loading...</p>
      </div>
      <div class="projects-list" *ngIf="!loading && projects.length > 0">
        <div class="project-row" *ngFor="let p of projects.slice(0,5)">
          <div class="project-info">
            <div class="project-name">{{ p.name }}</div>
            <div class="project-desc">{{ p.description || 'No description' }}</div>
            <div class="skills-row">
              <span class="skill-chip" *ngFor="let s of p.requiredSkills">{{ s }}</span>
            </div>
          </div>
          <span class="status-badge" [class]="'status-' + p.status.toLowerCase()">{{ p.status }}</span>
          <button class="view-btn" (click)="router.navigate(['/pm/projects', p.id, 'candidates'])">
            <app-icon name="users" [size]="14" color="#1565c0"></app-icon>
            Candidates
          </button>
        </div>
      </div>
      <div class="empty" *ngIf="!loading && projects.length === 0">
        <app-icon name="layers" [size]="40" color="#b0bec5"></app-icon>
        <p>No projects yet. Create your first project!</p>
        <button class="create-btn-empty" (click)="router.navigate(['/pm/create'])">Create Project</button>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .dash { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 20px; }

    .banner {
      background: linear-gradient(135deg, #0d2137, #0a5276);
      border-radius: 16px; padding: 22px 26px;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
    }
    .banner-left { display: flex; align-items: center; gap: 14px; }
    .banner-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .banner h2 { font-size: 18px; font-weight: 700; color: white; margin-bottom: 3px; }
    .banner p { font-size: 13px; color: rgba(255,255,255,0.6); }
    .create-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 50px;
      background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
      color: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .create-btn:hover { background: rgba(255,255,255,0.25); }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
    .stat-card {
      background: white; border-radius: 14px; padding: 18px 16px;
      display: flex; align-items: center; gap: 12px;
      box-shadow: 0 1px 10px rgba(0,0,0,0.06);
    }
    .stat-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-info { flex: 1; }
    .stat-val { font-size: 22px; font-weight: 800; }
    .stat-label { font-size: 11px; color: #888; margin-top: 2px; font-weight: 500; }

    .section-title { font-size: 15px; font-weight: 700; color: #0a5276; }

    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
    .action-card {
      display: flex; align-items: center; gap: 14px;
      padding: 16px 18px; border-radius: 14px;
      background: white; border: 1.5px solid #d6eaf8;
      cursor: pointer; transition: all 0.15s; text-align: left;
      box-shadow: 0 1px 8px rgba(0,0,0,0.05);
    }
    .action-card:hover { border-color: #1565c0; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(13,59,94,0.12); }
    .action-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .action-text { flex: 1; }
    .action-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .action-sub { font-size: 12px; color: #999; margin-top: 3px; }

    .loading { display: flex; align-items: center; gap: 12px; padding: 24px; }
    .loading p { font-size: 14px; color: #888; }
    .spinner { width: 24px; height: 24px; border-radius: 50%; border: 3px solid #d6eaf8; border-top-color: #1565c0; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .projects-list { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 10px rgba(0,0,0,0.06); }
    .project-row {
      display: flex; align-items: center; gap: 16px;
      padding: 16px 20px; border-bottom: 1px solid #f0f4f8;
    }
    .project-row:last-child { border-bottom: none; }
    .project-info { flex: 1; }
    .project-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .project-desc { font-size: 12px; color: #888; margin-top: 2px; }
    .skills-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
    .skill-chip {
      padding: 2px 8px; border-radius: 20px;
      background: #e3f2fd; color: #1565c0;
      font-size: 11px; font-weight: 600;
    }
    .status-badge {
      padding: 4px 12px; border-radius: 20px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; white-space: nowrap;
    }
    .status-active    { background: #e8f5e9; color: #2e7d32; }
    .status-on_hold   { background: #fff3e0; color: #e65100; }
    .status-completed { background: #f3e5f5; color: #7b1fa2; }
    .view-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px;
      background: #e3f2fd; border: none; color: #1565c0;
      font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap;
      transition: background 0.15s;
    }
    .view-btn:hover { background: #bbdefb; }

    .empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 48px; background: white; border-radius: 14px; }
    .empty p { font-size: 14px; color: #888; }
    .create-btn-empty {
      padding: 10px 24px; border-radius: 8px;
      background: #1565c0; border: none; color: white;
      font-size: 13px; font-weight: 600; cursor: pointer;
    }
  `]
})
export class PmDashboardComponent implements OnInit {
  projects: any[] = [];
  loading = true;

  constructor(public router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getMyProjects().subscribe({
      next: (p) => { this.projects = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  countByStatus(status: string): number {
    return this.projects.filter(p => p.status === status).length;
  }
}
