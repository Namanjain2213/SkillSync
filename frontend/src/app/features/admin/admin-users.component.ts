import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { IconComponent } from '../../shared/icon.component';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="users-page">

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-wrap">
          <app-icon name="user" [size]="15" color="#999"></app-icon>
          <input [(ngModel)]="searchTerm" placeholder="Search by username or email..." class="search-input">
        </div>
        <div class="filter-tabs">
          <button class="tab" [class.active]="activeFilter === ''" (click)="setFilter('')">All</button>
          <button class="tab" [class.active]="activeFilter === 'EMPLOYEE'"       (click)="setFilter('EMPLOYEE')">Employees</button>
          <button class="tab" [class.active]="activeFilter === 'HR'"             (click)="setFilter('HR')">HR</button>
          <button class="tab" [class.active]="activeFilter === 'PROJECT_MANAGER'"(click)="setFilter('PROJECT_MANAGER')">PM</button>
          <button class="tab" [class.active]="activeFilter === 'ADMIN'"          (click)="setFilter('ADMIN')">Admin</button>
        </div>
        <button class="add-btn" (click)="router.navigate(['/admin/create'])">
          <app-icon name="plus-circle" [size]="15" color="#fff"></app-icon>
          Add User
        </button>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div><p>Loading users...</p>
      </div>

      <!-- Table -->
      <div class="table-wrap" *ngIf="!loading">
        <div class="table-header">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
          <span>Actions</span>
        </div>

        <div class="table-row" *ngFor="let u of filteredUsers">
          <div class="user-cell">
            <div class="avatar" [style.background]="getRoleColor(u.role)">{{ (u.fullName || u.employeeId)[0].toUpperCase() }}</div>
            <div>
              <div class="uname">{{ u.fullName || u.employeeId }}</div>
              <div class="uemail">{{ u.employeeId }} · {{ u.email }}</div>
            </div>
          </div>

          <span class="role-badge" [class]="'role-' + u.role.toLowerCase()">
            {{ getRoleLabel(u.role) }}
          </span>

          <span class="status-badge" [class]="u.active ? 'status-on' : 'status-off'">
            <app-icon [name]="u.active ? 'check-circle' : 'x-circle'" [size]="12" color="currentColor"></app-icon>
            {{ u.active ? 'Active' : 'Inactive' }}
          </span>

          <span class="date">{{ u.createdAt | date:'dd MMM yyyy' }}</span>

          <div class="actions">
            <button class="action-btn toggle-btn"
                    [class.deactivate]="u.active"
                    [class.activate]="!u.active"
                    (click)="toggleStatus(u)"
                    [title]="u.active ? 'Deactivate' : 'Activate'">
              <app-icon [name]="u.active ? 'x-circle' : 'check-circle'" [size]="14" color="currentColor"></app-icon>
              {{ u.active ? 'Deactivate' : 'Activate' }}
            </button>
            <button class="action-btn delete-btn" (click)="confirmDelete(u)" title="Delete">
              <app-icon name="x-circle" [size]="14" color="currentColor"></app-icon>
            </button>
          </div>
        </div>

        <div class="empty" *ngIf="filteredUsers.length === 0">
          <app-icon name="users" [size]="40" color="#d1c4e9"></app-icon>
          <p>No users found</p>
        </div>
      </div>

      <!-- Confirm Delete Modal -->
      <div class="modal-overlay" *ngIf="deleteTarget" (click)="deleteTarget = null">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-icon">
            <app-icon name="x-circle" [size]="32" color="#c62828"></app-icon>
          </div>
          <h3>Delete User?</h3>
          <p>Are you sure you want to delete <strong>{{ deleteTarget?.username }}</strong>? This cannot be undone.</p>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="deleteTarget = null">Cancel</button>
            <button class="btn-delete" (click)="deleteUser()">Delete</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .users-page { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 16px; }

    .toolbar {
      display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
      background: white; padding: 14px 18px; border-radius: 14px;
      box-shadow: 0 1px 8px rgba(0,0,0,0.06);
    }
    .search-wrap {
      display: flex; align-items: center; gap: 8px;
      border: 1.5px solid #e8eaf6; border-radius: 10px;
      padding: 9px 14px; flex: 1; min-width: 200px; background: #fafafa;
    }
    .search-wrap:focus-within { border-color: #7b1fa2; background: white; }
    .search-input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; font-family: inherit; }

    .filter-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
    .tab {
      padding: 7px 14px; border-radius: 20px; border: 1.5px solid #e8eaf6;
      background: white; font-size: 12px; font-weight: 600; color: #666;
      cursor: pointer; transition: all 0.15s;
    }
    .tab:hover { border-color: #7b1fa2; color: #7b1fa2; }
    .tab.active { background: #7b1fa2; border-color: #7b1fa2; color: white; }

    .add-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 9px 18px; border-radius: 10px;
      background: linear-gradient(135deg, #4a1080, #7b1fa2);
      color: white; border: none; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(74,16,128,0.3); }

    .loading { display: flex; align-items: center; gap: 12px; padding: 32px; justify-content: center; }
    .loading p { font-size: 14px; color: #888; }
    .spinner {
      width: 24px; height: 24px; border-radius: 50%;
      border: 3px solid #e8eaf6; border-top-color: #7b1fa2;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .table-wrap { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 10px rgba(0,0,0,0.06); }
    .table-header {
      display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1.5fr;
      padding: 12px 18px; background: #f5f0ff;
      font-size: 11px; font-weight: 700; color: #7b1fa2;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .table-row {
      display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1.5fr;
      padding: 13px 18px; align-items: center;
      border-top: 1px solid #f5f0ff; transition: background 0.12s;
    }
    .table-row:hover { background: #fdf8ff; }

    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .uname { font-size: 13px; font-weight: 600; color: #1a1a2e; }
    .uemail { font-size: 11px; color: #999; }

    .role-badge {
      padding: 4px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      display: inline-block; letter-spacing: 0.3px;
    }
    .role-employee        { background: #e8f5e9; color: #2e7d32; }
    .role-hr              { background: #e3f2fd; color: #1565c0; }
    .role-project_manager { background: #fff3e0; color: #e65100; }
    .role-admin           { background: #f3e5f5; color: #7b1fa2; }

    .status-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 700;
    }
    .status-on  { background: #e8f5e9; color: #2e7d32; }
    .status-off { background: #ffebee; color: #c62828; }

    .date { font-size: 12px; color: #888; }

    .actions { display: flex; align-items: center; gap: 6px; }
    .action-btn {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 8px; border: none;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .toggle-btn.deactivate { background: #fff3e0; color: #e65100; }
    .toggle-btn.deactivate:hover { background: #ffe0b2; }
    .toggle-btn.activate   { background: #e8f5e9; color: #2e7d32; }
    .toggle-btn.activate:hover { background: #c8e6c9; }
    .delete-btn { background: #ffebee; color: #c62828; padding: 6px 8px; }
    .delete-btn:hover { background: #ffcdd2; }

    .empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 48px; color: #999; font-size: 14px; }

    /* MODAL */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal {
      background: white; border-radius: 20px; padding: 36px 32px;
      max-width: 380px; width: 90%; text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .modal-icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: #ffebee; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
    }
    .modal h3 { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 10px; }
    .modal p { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 24px; }
    .modal-actions { display: flex; gap: 10px; justify-content: center; }
    .btn-cancel {
      padding: 10px 24px; border-radius: 10px;
      background: #f5f5f5; border: none; color: #555;
      font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .btn-cancel:hover { background: #e0e0e0; }
    .btn-delete {
      padding: 10px 24px; border-radius: 10px;
      background: #c62828; border: none; color: white;
      font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .btn-delete:hover { background: #b71c1c; }
  `]
})
export class AdminUsersComponent implements OnInit {
  allUsers: any[] = [];
  loading = true;
  searchTerm = '';
  activeFilter = '';
  deleteTarget: any = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role']) this.activeFilter = params['role'];
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => { this.allUsers = users; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filteredUsers(): any[] {
    return this.allUsers.filter(u => {
      const matchRole   = !this.activeFilter || u.role === this.activeFilter;
      const matchSearch = !this.searchTerm ||
        u.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchRole && matchSearch;
    });
  }

  setFilter(role: string): void { this.activeFilter = role; }

  toggleStatus(user: any): void {
    this.adminService.toggleStatus(user.id).subscribe({
      next: (updated) => {
        const idx = this.allUsers.findIndex(u => u.id === user.id);
        if (idx !== -1) this.allUsers[idx] = updated;
        this.toast.success(`${updated.fullName || updated.employeeId} ${updated.active ? 'activated' : 'deactivated'}.`);
      },
      error: () => this.toast.error('Failed to update user status.')
    });
  }

  confirmDelete(user: any): void { this.deleteTarget = user; }

  deleteUser(): void {
    if (!this.deleteTarget) return;
    this.adminService.deleteUser(this.deleteTarget.id).subscribe({
      next: () => {
        this.toast.success(`User ${this.deleteTarget.fullName || this.deleteTarget.employeeId} deleted.`);
        this.allUsers = this.allUsers.filter(u => u.id !== this.deleteTarget.id);
        this.deleteTarget = null;
      },
      error: () => this.toast.error('Failed to delete user.')
    });
  }

  getRoleColor(role: string): string {
    const map: any = { EMPLOYEE: '#43a047', HR: '#1e88e5', PROJECT_MANAGER: '#fb8c00', ADMIN: '#8e24aa' };
    return map[role] ?? '#9e9e9e';
  }

  getRoleLabel(role: string): string {
    const map: any = { EMPLOYEE: 'Employee', HR: 'HR', PROJECT_MANAGER: 'Project Manager', ADMIN: 'Admin' };
    return map[role] ?? role;
  }
}
