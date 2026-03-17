import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="dash">

      <!-- Banner -->
      <div class="banner">
        <div class="banner-left">
          <div class="banner-icon">
            <app-icon name="shield" [size]="28" color="#fff"></app-icon>
          </div>
          <div>
            <h2>Admin Dashboard</h2>
            <p>Full system overview and user management</p>
          </div>
        </div>
        <button class="create-btn" (click)="router.navigate(['/admin/create'])">
          <app-icon name="plus-circle" [size]="16" color="#fff"></app-icon>
          Create User
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card" *ngFor="let s of getStatCards()">
          <div class="stat-icon" [style.background]="s.bg">
            <app-icon [name]="s.icon" [size]="22" [color]="s.color"></app-icon>
          </div>
          <div class="stat-info">
            <div class="stat-val" [style.color]="s.color">{{ s.val }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
          <div class="stat-trend" [style.color]="s.color">
            <app-icon name="trending-up" [size]="14" color="currentColor"></app-icon>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="!stats">
        <div class="spinner"></div>
        <p>Loading stats...</p>
      </div>

      <!-- Quick Actions -->
      <div class="section-title">Quick Actions</div>
      <div class="actions-grid">
        <button class="action-card" (click)="router.navigate(['/admin/create'])">
          <div class="action-icon" style="background:#f3e5f5">
            <app-icon name="plus-circle" [size]="24" color="#7b1fa2"></app-icon>
          </div>
          <div class="action-text">
            <div class="action-name">Create New User</div>
            <div class="action-sub">Add employee, HR, PM or admin</div>
          </div>
          <app-icon name="chevron-right" [size]="18" color="#bbb"></app-icon>
        </button>

        <button class="action-card" (click)="router.navigate(['/admin/users'])">
          <div class="action-icon" style="background:#e8eaf6">
            <app-icon name="users" [size]="24" color="#3949ab"></app-icon>
          </div>
          <div class="action-text">
            <div class="action-name">Manage Users</div>
            <div class="action-sub">Activate, deactivate or delete users</div>
          </div>
          <app-icon name="chevron-right" [size]="18" color="#bbb"></app-icon>
        </button>

        <button class="action-card" (click)="filterByRole('EMPLOYEE')">
          <div class="action-icon" style="background:#e8f5e9">
            <app-icon name="user" [size]="24" color="#2e7d32"></app-icon>
          </div>
          <div class="action-text">
            <div class="action-name">View Employees</div>
            <div class="action-sub">{{ stats?.totalEmployees ?? 0 }} employees registered</div>
          </div>
          <app-icon name="chevron-right" [size]="18" color="#bbb"></app-icon>
        </button>

        <button class="action-card" (click)="filterByRole('HR')">
          <div class="action-icon" style="background:#e3f2fd">
            <app-icon name="briefcase" [size]="24" color="#1565c0"></app-icon>
          </div>
          <div class="action-text">
            <div class="action-name">View HR Managers</div>
            <div class="action-sub">{{ stats?.totalHR ?? 0 }} HR managers registered</div>
          </div>
          <app-icon name="chevron-right" [size]="18" color="#bbb"></app-icon>
        </button>
      </div>

      <!-- Recent Users -->
      <div class="section-title" style="margin-top:24px">Recent Users</div>
      <div class="users-table" *ngIf="recentUsers.length > 0">
        <div class="table-header">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
        </div>
        <div class="table-row" *ngFor="let u of recentUsers">
          <div class="user-cell">
            <div class="user-avatar" [style.background]="getRoleColor(u.role)">{{ (u.fullName || u.employeeId)[0].toUpperCase() }}</div>
            <div>
              <div class="user-name">{{ u.fullName || u.employeeId }}</div>
              <div class="user-email">{{ u.employeeId }} · {{ u.email }}</div>
            </div>
          </div>
          <span class="role-badge" [class]="'role-' + u.role.toLowerCase()">{{ u.role }}</span>
          <span class="status-badge" [class]="u.active ? 'status-active' : 'status-inactive'">
            {{ u.active ? 'Active' : 'Inactive' }}
          </span>
          <span class="date-cell">{{ u.createdAt | date:'dd MMM yyyy' }}</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .dash { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 20px; }

    .banner {
      background: linear-gradient(135deg, #1a0533, #4a1080);
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

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; }
    .stat-card {
      background: white; border-radius: 14px; padding: 18px 16px;
      display: flex; align-items: center; gap: 12px;
      box-shadow: 0 1px 10px rgba(0,0,0,0.06);
    }
    .stat-icon {
      width: 46px; height: 46px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .stat-info { flex: 1; }
    .stat-val { font-size: 22px; font-weight: 800; }
    .stat-label { font-size: 11px; color: #888; margin-top: 2px; font-weight: 500; }
    .stat-trend { opacity: 0.5; }

    .loading { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px; }
    .loading p { font-size: 14px; color: #888; }
    .spinner {
      width: 28px; height: 28px; border-radius: 50%;
      border: 3px solid #e8eaf6; border-top-color: #7b1fa2;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .section-title { font-size: 15px; font-weight: 700; color: #4a1080; }

    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
    .action-card {
      display: flex; align-items: center; gap: 14px;
      padding: 16px 18px; border-radius: 14px;
      background: white; border: 1.5px solid #f0e6ff;
      cursor: pointer; transition: all 0.15s; text-align: left;
      box-shadow: 0 1px 8px rgba(0,0,0,0.05);
    }
    .action-card:hover { border-color: #7b1fa2; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(74,16,128,0.12); }
    .action-icon {
      width: 46px; height: 46px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .action-text { flex: 1; }
    .action-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .action-sub { font-size: 12px; color: #999; margin-top: 3px; }

    .users-table { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 10px rgba(0,0,0,0.06); }
    .table-header {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 12px 18px; background: #f5f0ff;
      font-size: 11px; font-weight: 700; color: #7b1fa2; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .table-row {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 13px 18px; align-items: center;
      border-top: 1px solid #f5f0ff; transition: background 0.12s;
    }
    .table-row:hover { background: #fdf8ff; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .user-name { font-size: 13px; font-weight: 600; color: #1a1a2e; }
    .user-email { font-size: 11px; color: #999; }
    .role-badge {
      padding: 3px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;
      display: inline-block;
    }
    .role-employee        { background: #e8f5e9; color: #2e7d32; }
    .role-hr              { background: #e3f2fd; color: #1565c0; }
    .role-project_manager { background: #fff3e0; color: #e65100; }
    .role-admin           { background: #f3e5f5; color: #7b1fa2; }
    .status-badge {
      padding: 3px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 700; display: inline-block;
    }
    .status-active   { background: #e8f5e9; color: #2e7d32; }
    .status-inactive { background: #ffebee; color: #c62828; }
    .date-cell { font-size: 12px; color: #888; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  recentUsers: any[] = [];

  constructor(public router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getStats().subscribe({ next: (s) => this.stats = s, error: () => {} });
    this.adminService.getAllUsers().subscribe({
      next: (users) => this.recentUsers = users.slice(0, 8),
      error: () => {}
    });
  }

  getStatCards() {
    if (!this.stats) return [];
    return [
      { icon: 'users',      color: '#7b1fa2', bg: '#f3e5f5', val: this.stats.totalUsers,          label: 'Total Users' },
      { icon: 'user',       color: '#2e7d32', bg: '#e8f5e9', val: this.stats.totalEmployees,       label: 'Employees' },
      { icon: 'briefcase',  color: '#1565c0', bg: '#e3f2fd', val: this.stats.totalHR,              label: 'HR Managers' },
      { icon: 'layers',     color: '#e65100', bg: '#fff3e0', val: this.stats.totalProjectManagers, label: 'Project Managers' },
      { icon: 'shield',     color: '#6a1b9a', bg: '#ede7f6', val: this.stats.totalAdmins,          label: 'Admins' },
      { icon: 'check-circle',color: '#2e7d32',bg: '#e8f5e9', val: this.stats.activeUsers,          label: 'Active' },
      { icon: 'x-circle',   color: '#c62828', bg: '#ffebee', val: this.stats.inactiveUsers,        label: 'Inactive' },
    ];
  }

  getRoleColor(role: string): string {
    const map: any = { EMPLOYEE: '#43a047', HR: '#1e88e5', PROJECT_MANAGER: '#fb8c00', ADMIN: '#8e24aa' };
    return map[role] ?? '#9e9e9e';
  }

  filterByRole(role: string): void {
    this.router.navigate(['/admin/users'], { queryParams: { role } });
  }
}
