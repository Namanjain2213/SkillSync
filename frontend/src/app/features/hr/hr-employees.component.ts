import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HrService } from '../../core/services/hr.service';
import { IconComponent } from '../../shared/icon.component';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-hr-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="page">

      <!-- Filters -->
      <div class="filters-bar">
        <div class="search-wrap">
          <app-icon name="search" [size]="15" color="#999"></app-icon>
          <input [(ngModel)]="search" placeholder="Search by name, email or skill..." class="search-input">
        </div>
        <div class="tabs">
          <button *ngFor="let t of tabs" class="tab" [class.active]="activeTab === t.key" (click)="setTab(t.key)">
            {{ t.label }}
            <span class="tab-count">{{ getCount(t.key) }}</span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        Loading employees...
      </div>

      <!-- Empty -->
      <div class="empty" *ngIf="!loading && filtered.length === 0">
        <app-icon name="users" [size]="40" color="#b2dfdb"></app-icon>
        <p>No employees found</p>
      </div>

      <!-- Table -->
      <div class="table-wrap" *ngIf="!loading && filtered.length > 0">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Contact</th>
              <th>Skills</th>
              <th>Qualification</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of filtered">
              <td>
                <div class="emp-cell">
                  <div class="emp-avatar">{{ emp.name?.[0]?.toUpperCase() || '?' }}</div>
                  <div>
                    <div class="emp-name">{{ emp.name }}</div>
                    <div class="emp-id">{{ emp.username }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="emp-email">{{ emp.email }}</div>
                <div class="emp-phone">{{ emp.contactNo }}</div>
              </td>
              <td>
                <div class="skills-wrap">
                  <span class="skill-tag" *ngFor="let s of (emp.skills || []).slice(0, 3)">{{ s }}</span>
                  <span class="skill-more" *ngIf="emp.skills?.length > 3">+{{ emp.skills.length - 3 }}</span>
                </div>
              </td>
              <td class="qual-cell">{{ emp.highestQualification }}</td>
              <td>
                <span class="status-badge" [class]="'status-' + emp.status?.toLowerCase()">
                  {{ emp.status === 'ON_BENCH' ? 'On Bench' : emp.status }}
                </span>
              </td>
              <td>
                <div class="action-cell">
                  <button class="view-btn" (click)="viewDetail(emp.id)">
                    <app-icon name="eye" [size]="14" color="#00695c"></app-icon>
                    View
                  </button>
                  <button class="bench-btn" *ngIf="emp.status === 'APPROVED'" (click)="onBench(emp)">
                    <app-icon name="clock" [size]="14" color="#e65100"></app-icon>
                    On Bench
                  </button>
                  <button class="approve-btn" *ngIf="emp.status === 'ON_BENCH'" (click)="removeFromBench(emp)">
                    <app-icon name="check-circle" [size]="14" color="#2e7d32"></app-icon>
                    Approve
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 16px; }

    .filters-bar {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
      background: white; border-radius: 14px; padding: 14px 18px;
      box-shadow: 0 1px 10px rgba(0,0,0,0.06);
    }
    .search-wrap {
      display: flex; align-items: center; gap: 8px;
      border: 1.5px solid #e0e0e0; border-radius: 10px;
      padding: 9px 14px; background: #fafafa; min-width: 260px;
    }
    .search-wrap:focus-within { border-color: #00897b; }
    .search-input { border: none; outline: none; background: transparent; font-size: 13.5px; color: #222; flex: 1; }

    .tabs { display: flex; gap: 6px; flex-wrap: wrap; }
    .tab {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 20px;
      border: 1.5px solid #e0e0e0; background: white;
      font-size: 12.5px; font-weight: 600; color: #666; cursor: pointer; transition: all 0.15s;
    }
    .tab:hover { border-color: #00897b; color: #00695c; }
    .tab.active { background: #e0f2f1; border-color: #00897b; color: #004d40; }
    .tab-count {
      background: #e0e0e0; color: #555;
      padding: 1px 7px; border-radius: 10px; font-size: 11px;
    }
    .tab.active .tab-count { background: #00897b; color: white; }

    .loading { display: flex; align-items: center; gap: 10px; padding: 40px; justify-content: center; color: #888; font-size: 14px; }
    .spinner {
      width: 20px; height: 20px; border-radius: 50%;
      border: 2px solid #e0f2f1; border-top-color: #00897b;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 60px; color: #aaa; font-size: 14px; }

    .table-wrap {
      background: white; border-radius: 16px;
      box-shadow: 0 1px 12px rgba(0,0,0,0.06); overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f0faf9; }
    th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #00695c; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 13px 16px; border-top: 1px solid #f5f5f5; vertical-align: middle; }
    tr:hover td { background: #f9fffe; }

    .emp-cell { display: flex; align-items: center; gap: 10px; }
    .emp-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #26a69a, #00796b);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .emp-name { font-size: 13.5px; font-weight: 600; color: #1a1a2e; }
    .emp-id { font-size: 11px; color: #999; margin-top: 2px; }
    .emp-email { font-size: 13px; color: #333; }
    .emp-phone { font-size: 11px; color: #999; margin-top: 2px; }
    .qual-cell { font-size: 13px; color: #555; }

    .skills-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
    .skill-tag { padding: 2px 9px; border-radius: 20px; background: #e0f2f1; color: #00695c; font-size: 11px; font-weight: 600; }
    .skill-more { padding: 2px 9px; border-radius: 20px; background: #f5f5f5; color: #888; font-size: 11px; }

    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-pending  { background: #fff3e0; color: #e65100; }
    .status-approved { background: #e8f5e9; color: #2e7d32; }
    .status-rejected { background: #ffebee; color: #c62828; }
    .status-on_bench { background: #e3f2fd; color: #1565c0; }

    .action-cell { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .view-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 14px; border-radius: 8px;
      background: #e0f2f1; border: none; color: #00695c;
      font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .view-btn:hover { background: #b2dfdb; }
    .bench-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 8px;
      background: #fff3e0; border: none; color: #e65100;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .bench-btn:hover { background: #ffe0b2; }
    .approve-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 8px;
      background: #e8f5e9; border: none; color: #2e7d32;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .approve-btn:hover { background: #c8e6c9; }
  `]
})
export class HrEmployeesComponent implements OnInit {
  employees: any[] = [];
  loading = true;
  search = '';
  activeTab = 'ALL';

  tabs = [
    { key: 'ALL',      label: 'All' },
    { key: 'PENDING',  label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'ON_BENCH', label: 'On Bench' },
  ];

  constructor(
    private hrService: HrService,
    public router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['status']) this.activeTab = params['status'];
    });
    this.hrService.getAllEmployees().subscribe({
      next: (data) => { this.employees = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  setTab(key: string): void { this.activeTab = key; }

  onBench(emp: any): void {
    this.hrService.onBenchProfile(emp.id).subscribe({
      next: (updated) => {
        const idx = this.employees.findIndex(e => e.id === emp.id);
        if (idx !== -1) this.employees[idx] = updated;
        this.toast.success(`${emp.name} moved to On Bench.`);
      },
      error: () => this.toast.error('Failed to update status.')
    });
  }

  removeFromBench(emp: any): void {
    this.hrService.approveProfile(emp.id).subscribe({
      next: (updated) => {
        const idx = this.employees.findIndex(e => e.id === emp.id);
        if (idx !== -1) this.employees[idx] = updated;
        this.toast.success(`${emp.name} moved back to Approved.`);
      },
      error: () => this.toast.error('Failed to update status.')
    });
  }

  get filtered(): any[] {
    let list = this.employees;
    if (this.activeTab !== 'ALL') list = list.filter(e => e.status === this.activeTab);
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      list = list.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.username?.toLowerCase().includes(q) ||
        e.skills?.some((s: string) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getCount(key: string): number {
    if (key === 'ALL') return this.employees.length;
    return this.employees.filter(e => e.status === key).length;
  }

  viewDetail(id: number): void { this.router.navigate(['/hr/employees', id]); }
}
