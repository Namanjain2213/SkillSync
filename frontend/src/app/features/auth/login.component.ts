import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="login-page">
      <div class="login-left">
        <div class="brand">
          <div class="brand-logo">
            <app-icon name="zap" [size]="22" color="#fff"></app-icon>
          </div>
          <span class="brand-name">EMS Pro</span>
        </div>
        <h1>Welcome Back</h1>
        <p>Sign in to access your Employee Management dashboard</p>
        <div class="features-list">
          <div class="feat" *ngFor="let f of feats">
            <app-icon [name]="f.icon" [size]="16" color="#90caf9"></app-icon>
            <span>{{f.text}}</span>
          </div>
        </div>
      </div>

      <div class="login-right">
        <div class="login-card">
          <div class="card-header">
            <div class="card-logo">
              <app-icon name="zap" [size]="20" color="#1a237e"></app-icon>
            </div>
            <h2>Sign In</h2>
            <p>Enter your credentials to continue</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="field">
              <label>Username</label>
              <div class="input-wrap" [class.error]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                <app-icon name="user" [size]="16" color="#999"></app-icon>
                <input formControlName="username" placeholder="Enter username" autocomplete="username">
              </div>
              <span class="err-msg" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                Username is required
              </span>
            </div>

            <div class="field">
              <label>Password</label>
              <div class="input-wrap" [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <app-icon name="shield" [size]="16" color="#999"></app-icon>
                <input [type]="showPass ? 'text' : 'password'" formControlName="password" placeholder="Enter password" autocomplete="current-password">
                <button type="button" class="eye-btn" (click)="showPass = !showPass">
                  <app-icon [name]="showPass ? 'x-circle' : 'info'" [size]="15" color="#aaa"></app-icon>
                </button>
              </div>
              <span class="err-msg" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </span>
            </div>

            <div class="error-banner" *ngIf="errorMsg">
              <app-icon name="x-circle" [size]="15" color="#c62828"></app-icon>
              {{errorMsg}}
            </div>

            <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || loading">
              <span *ngIf="!loading">
                Sign In
                <app-icon name="arrow-right" [size]="17" color="#fff"></app-icon>
              </span>
              <span *ngIf="loading" class="loading-text">
                <span class="spinner"></span>
                Signing in...
              </span>
            </button>
          </form>

          <div class="demo-box">
            <div class="demo-title">
              <app-icon name="info" [size]="14" color="#1565c0"></app-icon>
              Demo Credentials
            </div>
            <div class="demo-row" *ngFor="let d of demos" (click)="fillDemo(d)">
              <div class="demo-role">
                <app-icon [name]="d.icon" [size]="13" [color]="d.color"></app-icon>
                {{d.role}}
              </div>
              <div class="demo-creds">{{d.username}} / {{d.password}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host { font-family: 'Inter', 'Segoe UI', sans-serif; }

    .login-page {
      display: flex; min-height: 100vh;
    }

    /* LEFT PANEL */
    .login-left {
      flex: 1; display: flex; flex-direction: column; justify-content: center;
      padding: 60px 56px;
      background: linear-gradient(160deg, #0d1b6e 0%, #1a237e 50%, #1565c0 100%);
      color: white;
    }
    .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 48px; }
    .brand-logo {
      width: 38px; height: 38px; border-radius: 10px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center;
    }
    .brand-name { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .login-left h1 { font-size: 38px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
    .login-left p { font-size: 16px; color: rgba(255,255,255,0.65); line-height: 1.6; margin-bottom: 40px; }
    .features-list { display: flex; flex-direction: column; gap: 14px; }
    .feat { display: flex; align-items: center; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.8); }

    /* RIGHT PANEL */
    .login-right {
      width: 480px; display: flex; align-items: center; justify-content: center;
      background: #f0f2f8; padding: 40px 32px;
    }
    .login-card {
      width: 100%; max-width: 400px;
      background: white; border-radius: 20px;
      padding: 36px 32px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.1);
    }
    .card-header { text-align: center; margin-bottom: 28px; }
    .card-logo {
      width: 52px; height: 52px; border-radius: 14px;
      background: #e8eaf6; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 14px;
    }
    .card-header h2 { font-size: 24px; font-weight: 800; color: #1a237e; margin-bottom: 6px; }
    .card-header p { font-size: 13px; color: #888; }

    /* FORM */
    .field { margin-bottom: 18px; }
    label { display: block; font-size: 12px; font-weight: 600; color: #555; margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.5px; }
    .input-wrap {
      display: flex; align-items: center; gap: 10px;
      border: 1.5px solid #e0e0e0; border-radius: 10px;
      padding: 11px 14px; background: #fafafa;
      transition: border-color 0.15s;
    }
    .input-wrap:focus-within { border-color: #1a237e; background: white; }
    .input-wrap.error { border-color: #e53935; }
    .input-wrap input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 14px; color: #222; font-family: inherit;
    }
    .eye-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
    .err-msg { font-size: 11px; color: #e53935; margin-top: 5px; display: block; }

    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #ffebee; color: #c62828;
      padding: 10px 14px; border-radius: 8px;
      font-size: 13px; margin-bottom: 16px;
    }

    .submit-btn {
      width: 100%; padding: 13px;
      background: linear-gradient(135deg, #1a237e, #1565c0);
      color: white; border: none; border-radius: 10px;
      font-size: 15px; font-weight: 700; cursor: pointer;
      transition: all 0.2s; margin-top: 4px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,35,126,0.3); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .submit-btn span { display: flex; align-items: center; gap: 8px; }
    .loading-text { display: flex; align-items: center; gap: 10px; }
    .spinner {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* DEMO BOX */
    .demo-box {
      margin-top: 22px; border-radius: 12px;
      background: #f8f9ff; border: 1px solid #e8eaf6;
      overflow: hidden;
    }
    .demo-title {
      display: flex; align-items: center; gap: 7px;
      padding: 10px 14px; font-size: 12px; font-weight: 700;
      color: #1565c0; background: #e8eaf6; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .demo-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 9px 14px; cursor: pointer; transition: background 0.12s;
      border-top: 1px solid #eef0ff;
    }
    .demo-row:hover { background: #eef0ff; }
    .demo-role { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: #333; }
    .demo-creds { font-size: 11px; color: #888; font-family: monospace; }

    @media (max-width: 768px) {
      .login-left { display: none; }
      .login-right { width: 100%; }
    }
  `]
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  showPass = false;
  errorMsg = '';

  feats = [
    { icon: 'user',        text: 'Employee profile management' },
    { icon: 'file-text',   text: 'Skill-based MCQ assessments' },
    { icon: 'award',       text: 'Certification tracking' },
    { icon: 'shield',      text: 'Role-based secure access' },
  ];

  demos = [
    { role: 'Employee', icon: 'user',      color: '#2e7d32', username: 'employee', password: 'emp123' },
    { role: 'HR',       icon: 'users',     color: '#1565c0', username: 'hr',       password: 'hr123'  },
    { role: 'Admin',    icon: 'shield',    color: '#6a1b9a', username: 'admin',    password: 'admin123'},
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  fillDemo(d: any): void {
    this.loginForm.patchValue({ username: d.username, password: d.password });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMsg = '';
      const { username, password } = this.loginForm.value;
      this.authService.login({ username: username!, password: password! }).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.role === 'EMPLOYEE') this.router.navigate(['/employee']);
          else if (response.role === 'HR')   this.router.navigate(['/hr']);
          else if (response.role === 'ADMIN') this.router.navigate(['/admin']);
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Invalid username or password. Please try again.';
        }
      });
    }
  }
}
