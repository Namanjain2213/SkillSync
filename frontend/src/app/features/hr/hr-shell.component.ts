import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-hr-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-logo">
            <app-icon name="users" [size]="20" color="#fff"></app-icon>
          </div>
          <div>
            <div class="brand-name">EMS Pro</div>
            <div class="brand-sub">HR Panel</div>
          </div>
        </div>

        <div class="user-card">
          <div class="avatar">{{ getInitial() }}</div>
          <div>
            <div class="user-name">{{ currentUser?.username }}</div>
            <div class="user-role">HR Manager</div>
          </div>
        </div>

        <nav class="nav">
          <a *ngFor="let item of navItems"
             [routerLink]="item.route"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: item.exact }"
             class="nav-item">
            <app-icon [name]="item.icon" [size]="18"></app-icon>
            <span>{{ item.label }}</span>
          </a>
        </nav>

        <button class="logout-btn" (click)="logout()">
          <app-icon name="log-out" [size]="16" color="#ef9a9a"></app-icon>
          <span>Logout</span>
        </button>
      </aside>

      <div class="main">
        <header class="topbar">
          <div class="page-title">{{ getPageTitle() }}</div>
          <div class="topbar-right">
            <span class="welcome">Welcome, <strong>{{ currentUser?.username }}</strong></span>
          </div>
        </header>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .shell { display: flex; height: 100vh; font-family: 'Inter', 'Segoe UI', sans-serif; }

    .sidebar {
      width: 248px; min-width: 248px;
      background: linear-gradient(180deg, #004d40 0%, #00695c 50%, #00897b 100%);
      display: flex; flex-direction: column;
    }
    .sidebar-brand {
      display: flex; align-items: center; gap: 12px;
      padding: 22px 20px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .brand-logo {
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .brand-name { font-size: 18px; font-weight: 800; color: #fff; }
    .brand-sub { font-size: 11px; color: #b2dfdb; margin-top: 1px; }

    .user-card {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; margin: 14px 12px;
      background: rgba(255,255,255,0.08); border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, #26a69a, #00796b);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .user-name { font-size: 13px; font-weight: 600; color: white; }
    .user-role { font-size: 10px; color: #b2dfdb; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }

    .nav { flex: 1; padding: 6px 10px; display: flex; flex-direction: column; gap: 2px; }
    .nav-item {
      display: flex; align-items: center; gap: 11px;
      padding: 11px 14px; border-radius: 10px;
      color: #b2dfdb; text-decoration: none;
      font-size: 13.5px; font-weight: 500; transition: all 0.15s;
    }
    .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
    .nav-item.active {
      background: rgba(38,166,154,0.3); color: #e0f2f1; font-weight: 600;
      border: 1px solid rgba(38,166,154,0.4);
    }

    .logout-btn {
      display: flex; align-items: center; gap: 10px;
      margin: 10px 10px 14px; padding: 11px 14px; border-radius: 10px;
      background: rgba(239,154,154,0.08); border: 1px solid rgba(239,154,154,0.15);
      color: #ef9a9a; font-size: 13.5px; font-weight: 500;
      cursor: pointer; transition: all 0.15s;
    }
    .logout-btn:hover { background: rgba(239,154,154,0.18); }

    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #f0faf9; }
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 28px; height: 62px;
      background: white; box-shadow: 0 1px 10px rgba(0,0,0,0.07); flex-shrink: 0;
    }
    .page-title { font-size: 18px; font-weight: 700; color: #004d40; }
    .welcome { font-size: 13px; color: #666; }
    .welcome strong { color: #00695c; }
    .content { flex: 1; overflow-y: auto; padding: 24px; }
  `]
})
export class HrShellComponent {
  currentUser = this.authService.getCurrentUser();

  navItems = [
    { label: 'Dashboard',    icon: 'home',       route: '/hr',              exact: true  },
    { label: 'All Employees',icon: 'users',      route: '/hr/employees',    exact: false },
    { label: 'Pending Review',icon: 'clock',     route: '/hr/pending',      exact: false },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  getInitial(): string { return (this.currentUser?.username?.[0] ?? 'H').toUpperCase(); }

  getPageTitle(): string {
    const url = this.router.url;
    if (url === '/hr') return 'Dashboard';
    if (url.includes('/employees')) return 'Employee Management';
    if (url.includes('/pending')) return 'Pending Reviews';
    if (url.includes('/detail')) return 'Employee Detail';
    return 'HR Panel';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
