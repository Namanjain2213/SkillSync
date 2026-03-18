import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { IconComponent } from '../../shared/icon.component';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-admin-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="create-page">
      <div class="create-card">

        <div class="card-top">
          <div class="card-icon">
            <app-icon name="plus-circle" [size]="24" color="#7b1fa2"></app-icon>
          </div>
          <div>
            <h2>Create New User</h2>
            <p>Add a new user to the system</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <!-- Role Selection -->
          <div class="field">
            <label>Select Role</label>
            <div class="role-grid">
              <button type="button" class="role-opt" *ngFor="let r of roles"
                      [class.selected]="form.get('role')?.value === r.value"
                      (click)="form.get('role')?.setValue(r.value)">
                <div class="role-opt-icon" [style.background]="r.bg">
                  <app-icon [name]="r.icon" [size]="20" [color]="r.color"></app-icon>
                </div>
                <span>{{ r.label }}</span>
              </button>
            </div>
          </div>

          <!-- Full Name -->
          <div class="field">
            <label>Full Name</label>
            <div class="input-wrap" [class.err]="isInvalid('fullName')">
              <app-icon name="user" [size]="15" color="#999"></app-icon>
              <input formControlName="fullName" placeholder="Enter full name">
            </div>
            <span class="err-msg" *ngIf="isInvalid('fullName')">Full name is required</span>
          </div>

          <!-- Email -->
          <div class="field">
            <label>Email Address</label>
            <div class="input-wrap" [class.err]="isInvalid('email')">
              <app-icon name="info" [size]="15" color="#999"></app-icon>
              <input formControlName="email" type="email" placeholder="Enter email address">
            </div>
            <span class="err-msg" *ngIf="isInvalid('email')">Valid email is required</span>
          </div>

          <!-- Password -->
          <div class="field">
            <label>Password</label>
            <div class="input-wrap" [class.err]="isInvalid('password')">
              <app-icon name="shield" [size]="15" color="#999"></app-icon>
              <input formControlName="password" [type]="showPass ? 'text' : 'password'" placeholder="Enter password">
              <button type="button" class="eye-btn" (click)="showPass = !showPass">
                <app-icon [name]="showPass ? 'x-circle' : 'info'" [size]="14" color="#aaa"></app-icon>
              </button>
            </div>
            <span class="err-msg" *ngIf="isInvalid('password')">
              Min 8 chars with uppercase, lowercase, number &amp; special character
            </span>
            <span class="hint-msg" *ngIf="!isInvalid('password')">
              e.g. Admin&#64;1234 (uppercase, lowercase, number, special char)
            </span>
          </div>

          <!-- Error / Success banners removed — using toast notifications -->

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="router.navigate(['/admin/users'])">Cancel</button>
            <button type="submit" class="btn-submit" [disabled]="form.invalid || loading">
              <span *ngIf="!loading" style="display:flex;align-items:center;gap:7px">
                <app-icon name="plus-circle" [size]="16" color="#fff"></app-icon>
                Create User
              </span>
              <span *ngIf="loading" class="loading-text">
                <div class="spinner"></div> Creating...
              </span>
            </button>
          </div>

        </form>
      </div>

      <!-- Role Info Panel -->
      <div class="info-panel">
        <div class="info-title">
          <app-icon name="info" [size]="16" color="#7b1fa2"></app-icon>
          Role Permissions
        </div>
        <div class="info-item" *ngFor="let r of roles">
          <div class="info-role-icon" [style.background]="r.bg">
            <app-icon [name]="r.icon" [size]="16" [color]="r.color"></app-icon>
          </div>
          <div>
            <div class="info-role-name">{{ r.label }}</div>
            <div class="info-role-desc">{{ r.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .create-page {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start;
    }
    @media (max-width: 900px) { .create-page { grid-template-columns: 1fr; } }

    .create-card {
      background: white; border-radius: 20px; padding: 32px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    }
    .card-top { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
    .card-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: #f3e5f5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .card-top h2 { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 4px; }
    .card-top p { font-size: 13px; color: #888; }

    .field { margin-bottom: 20px; }
    label { display: block; font-size: 12px; font-weight: 700; color: #555; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

    .role-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    @media (min-width: 600px) { .role-grid { grid-template-columns: repeat(4, 1fr); } }
    .role-opt {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 14px 10px; border-radius: 12px;
      border: 2px solid #e8eaf6; background: #fafafa;
      cursor: pointer; transition: all 0.15s; font-size: 12px; font-weight: 600; color: #555;
    }
    .role-opt:hover { border-color: #7b1fa2; background: #fdf8ff; }
    .role-opt.selected { border-color: #7b1fa2; background: #f3e5f5; color: #7b1fa2; }
    .role-opt-icon {
      width: 40px; height: 40px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }

    .input-wrap {
      display: flex; align-items: center; gap: 10px;
      border: 1.5px solid #e0e0e0; border-radius: 10px;
      padding: 11px 14px; background: #fafafa; transition: border-color 0.15s;
    }
    .input-wrap:focus-within { border-color: #7b1fa2; background: white; }
    .input-wrap.err { border-color: #e53935; }
    .input-wrap input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 14px; color: #222; font-family: inherit;
    }
    .eye-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
    .err-msg { font-size: 11px; color: #e53935; margin-top: 5px; display: block; }
    .hint-msg { font-size: 11px; color: #999; margin-top: 5px; display: block; }

    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #ffebee; color: #c62828;
      padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px;
    }
    .success-banner {
      display: flex; align-items: center; gap: 8px;
      background: #e8f5e9; color: #2e7d32;
      padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px;
    }

    .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
    .btn-cancel {
      padding: 11px 24px; border-radius: 10px;
      background: #f5f5f5; border: none; color: #555;
      font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .btn-cancel:hover { background: #e0e0e0; }
    .btn-submit {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 11px 28px; border-radius: 10px;
      background: linear-gradient(135deg, #4a1080, #7b1fa2);
      color: white; border: none; font-size: 14px; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(74,16,128,0.3); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .loading-text { display: flex; align-items: center; gap: 8px; }
    .spinner {
      width: 14px; height: 14px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* INFO PANEL */
    .info-panel {
      background: white; border-radius: 20px; padding: 24px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    }
    .info-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 700; color: #7b1fa2;
      text-transform: uppercase; letter-spacing: 0.5px;
      margin-bottom: 18px;
    }
    .info-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
    .info-item:last-child { margin-bottom: 0; }
    .info-role-icon {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .info-role-name { font-size: 13px; font-weight: 700; color: #1a1a2e; margin-bottom: 3px; }
    .info-role-desc { font-size: 12px; color: #888; line-height: 1.5; }
  `]
})
export class AdminCreateUserComponent {
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=])[A-Za-z\d@$!%*?&#^()_+\-=]{8,}$/;

  form = this.fb.group({
    role:     ['EMPLOYEE', Validators.required],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
  });

  loading = false;
  showPass = false;

  roles = [
    { value: 'EMPLOYEE',        label: 'Employee',        icon: 'user',       color: '#2e7d32', bg: '#e8f5e9', desc: 'Can create profile, take MCQ tests, upload certifications.' },
    { value: 'HR',              label: 'HR Manager',      icon: 'users',      color: '#1565c0', bg: '#e3f2fd', desc: 'Can review, approve or reject employee profiles.' },
    { value: 'PROJECT_MANAGER', label: 'Project Manager', icon: 'briefcase',  color: '#e65100', bg: '#fff3e0', desc: 'Can manage projects and view team members.' },
    { value: 'ADMIN',           label: 'Admin',           icon: 'shield',     color: '#7b1fa2', bg: '#f3e5f5', desc: 'Full system access — manage all users and settings.' },
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private toast: ToastService,
    public router: Router
  ) {}

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.adminService.createUser(this.form.value).subscribe({
      next: (user) => {
        this.loading = false;
        this.toast.success(`User created! Employee ID: ${user.employeeId}`);
        this.form.reset({ role: 'EMPLOYEE' });
        setTimeout(() => this.router.navigate(['/admin/users']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.error ?? 'Failed to create user. Please try again.');
      }
    });
  }
}
