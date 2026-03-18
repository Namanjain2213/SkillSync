import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HrService } from '../../core/services/hr.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="dash">

      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-left">
          <div class="welcome-avatar">HR</div>
          <div>
            <h2>HR Dashboard</h2>
            <p>Manage employee profiles, approvals, and skill insights.</p>
          </div>
        </div>
        <button class="pending-btn" (click)="router.navigate(['/hr/pending'])">
          <app-icon name="clock" [size]="15" color="#fff"></app-icon>
          {{ stats?.pending || 0 }} Pending Reviews
        </button>
      </div>

      <!-- Stat Cards -->
      <div class="stats-row">
        <div class="stat-card" *ngFor="let s of getStatCards()">
          <div class="stat-icon-wrap" [style.background]="s.bg">
            <app-icon [name]="s.icon" [size]="20" [color]="s.color"></app-icon>
          </div>
          <div>
            <div class="stat-val" [style.color]="s.color">{{ s.val }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- Skill Distribution -->
      <div class="card" *ngIf="skillEntries.length > 0">
        <div class="card-header">
          <span class="card-title">Skill Distribution</span>
          <span class="sub-text">Employees per skill</span>
        </div>
        <div class="skill-bars">
          <div class="skill-row" *ngFor="let entry of skillEntries">
            <div class="skill-name">{{ entry.skill }}</div>
            <div class="bar-wrap">
              <div class="bar-fill" [style.width.%]="getBarWidth(entry.count)"></div>
            </div>
            <div class="skill-count">{{ entry.count }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Quick Actions</span>
        </div>
        <div class="actions-grid">
          <button class="action-card" (click)="router.navigate(['/hr/pending'])">
            <div class="action-icon-wrap" style="background:#fff3e0">
              <app-icon name="clock" [size]="22" color="#e65100"></app-icon>
            </div>
            <div class="action-label">Review Pending</div>
            <div class="action-count">{{ stats?.pending || 0 }} waiting</div>
          </button>
          <button class="action-card" (click)="router.navigate(['/hr/employees'])">
            <div class="action-icon-wrap" style="background:#e3f2fd">
              <app-icon name="users" [size]="22" color="#1565c0"></app-icon>
            </div>
            <div class="action-label">All Employees</div>
            <div class="action-count">{{ stats?.total || 0 }} total</div>
          </button>
          <button class="action-card" (click)="router.navigate(['/hr/employees'], { queryParams: { status: 'APPROVED' } })">
            <div class="action-icon-wrap" style="background:#e8f5e9">
              <app-icon name="check-circle" [size]="22" color="#2e7d32"></app-icon>
            </div>
            <div class="action-label">Approved</div>
            <div class="action-count">{{ stats?.approved || 0 }} profiles</div>
          </button>
          <button class="action-card" (click)="router.navigate(['/hr/employees'], { queryParams: { status: 'REJECTED' } })">
            <div class="action-icon-wrap" style="background:#ffebee">
              <app-icon name="x-circle" [size]="22" color="#c62828"></app-icon>
            </div>
            <div class="action-label">Rejected</div>
            <div class="action-count">{{ stats?.rejected || 0 }} profiles</div>
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .dash { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 20px; }

    .welcome-banner {
      background: linear-gradient(135deg, #004d40 0%, #00897b 100%);
      border-radius: 16px; padding: 22px 26px;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;
    }
    .welcome-left { display: flex; align-items: center; gap: 14px; }
    .welcome-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      background: rgba(255,255,255,0.18);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 800; color: white; flex-shrink: 0;
    }
    .welcome-banner h2 { font-size: 18px; font-weight: 700; color: white; margin-bottom: 3px; }
    .welcome-banner p { font-size: 13px; color: rgba(255,255,255,0.65); }
    .pending-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 9px 18px; border-radius: 50px;
      background: rgba(255,152,0,0.25); border: 1px solid rgba(255,152,0,0.4);
      color: #ffcc80; font-size: 13px; font-weight: 600; cursor: pointer;
      transition: all 0.15s;
    }
    .pending-btn:hover { background: rgba(255,152,0,0.4); }

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
    .stat-val { font-size: 22px; font-weight: 800; }
    .stat-label { font-size: 11px; color: #888; margin-top: 2px; font-weight: 500; }

    .card {
      background: white; border-radius: 16px;
      box-shadow: 0 1px 12px rgba(0,0,0,0.06); overflow: hidden;
    }
    .card-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px 13px; border-bottom: 1px solid #f0f0f0;
    }
    .card-title { font-size: 15px; font-weight: 700; color: #004d40; }
    .sub-text { font-size: 12px; color: #999; }

    .skill-bars { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
    .skill-row { display: flex; align-items: center; gap: 12px; }
    .skill-name { width: 100px; font-size: 13px; font-weight: 600; color: #333; flex-shrink: 0; }
    .bar-wrap { flex: 1; height: 10px; background: #e0f2f1; border-radius: 5px; overflow: hidden; }
    .bar-fill { height: 100%; background: linear-gradient(90deg, #00897b, #26a69a); border-radius: 5px; transition: width 0.6s ease; }
    .skill-count { width: 28px; font-size: 13px; font-weight: 700; color: #00695c; text-align: right; }

    .actions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; padding: 16px; }
    .action-card {
      display: flex; flex-direction: column; align-items: center; gap: 10px;
      padding: 20px 16px; border-radius: 14px;
      background: #f9fffe; border: 1.5px solid #e0f2f1;
      cursor: pointer; transition: all 0.15s; text-align: center;
    }
    .action-card:hover { border-color: #00897b; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,137,123,0.15); }
    .action-icon-wrap {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .action-label { font-size: 13px; font-weight: 700; color: #1a1a2e; }
    .action-count { font-size: 11px; color: #888; }
  `]
})
export class HrDashboardComponent implements OnInit {
  stats: any = null;
  skillEntries: { skill: string; count: number }[] = [];
  maxSkillCount = 1;

  constructor(public router: Router, private hrService: HrService) {}

  ngOnInit(): void {
    this.hrService.getStats().subscribe({
      next: (s) => {
        this.stats = s;
        const dist = s.skillDistribution || {};
        this.skillEntries = Object.entries(dist).map(([skill, count]) => ({ skill, count: count as number }));
        this.maxSkillCount = Math.max(1, ...this.skillEntries.map(e => e.count));
      },
      error: () => {}
    });
  }

  getBarWidth(count: number): number {
    return Math.round((count / this.maxSkillCount) * 100);
  }

  getStatCards() {
    return [
      { icon: 'users',       color: '#1565c0', bg: '#e3f2fd', val: this.stats?.total    ?? 0, label: 'Total Employees' },
      { icon: 'clock',       color: '#e65100', bg: '#fff3e0', val: this.stats?.pending  ?? 0, label: 'Pending Review' },
      { icon: 'check-circle',color: '#2e7d32', bg: '#e8f5e9', val: this.stats?.approved ?? 0, label: 'Approved' },
      { icon: 'x-circle',    color: '#c62828', bg: '#ffebee', val: this.stats?.rejected ?? 0, label: 'Rejected' },
    ];
  }
}
