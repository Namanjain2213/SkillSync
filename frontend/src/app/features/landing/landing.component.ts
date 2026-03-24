import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-brand">
        <div class="brand-logo">
          <app-icon name="zap" [size]="18" color="#fff"></app-icon>
        </div>
        <span class="brand-name">EMS Pro</span>
      </div>
      <button class="login-btn" (click)="goToLogin()">
        Login
        <app-icon name="arrow-right" [size]="16" color="#fff"></app-icon>
      </button>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
      </div>
      <div class="hero-content">
        <div class="badge">Employee Management System</div>
        <h1>Manage Your Workforce<br><span class="highlight">Smarter & Faster</span></h1>
        <p class="hero-sub">
          A complete platform for employee onboarding, skill assessment,
          certification tracking, and HR management — all in one place.
        </p>
        <div class="hero-actions">
          <button class="btn-primary" (click)="goToLogin()">
            Get Started
            <app-icon name="arrow-right" [size]="18" color="#fff"></app-icon>
          </button>
          <button class="btn-outline" (click)="scrollToFeatures()">
            Learn More
            <app-icon name="chevron-right" [size]="18" color="#fff"></app-icon>
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-num">4+</span><span class="stat-label">Skills Tested</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">400+</span><span class="stat-label">MCQ Questions</span></div>
          <div class="stat-divider"></div>
          <div class="stat"><span class="stat-num">4</span><span class="stat-label">User Roles</span></div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features" id="features">
      <div class="section-header">
        <h2>Everything You Need</h2>
        <p>Powerful tools for employees, HR, and administrators</p>
      </div>
      <div class="features-grid">
        <div class="feature-card" *ngFor="let f of features">
          <div class="feature-icon-wrap" [style.background]="f.bg">
            <app-icon [name]="f.icon" [size]="26" [color]="f.color"></app-icon>
          </div>
          <h3>{{f.title}}</h3>
          <p>{{f.desc}}</p>
        </div>
      </div>
    </section>

    <!-- Roles -->
    <section class="roles">
      <div class="section-header">
        <h2>Built for Every Role</h2>
        <p>Tailored experience for each user type</p>
      </div>
      <div class="roles-grid">
        <div class="role-card employee">
          <div class="role-icon-wrap emp-bg">
            <app-icon name="user" [size]="28" color="#2e7d32"></app-icon>
          </div>
          <h3>Employee</h3>
          <ul>
            <li *ngFor="let item of employeeItems">
              <app-icon name="check-circle" [size]="14" color="#2e7d32"></app-icon>
              {{item}}
            </li>
          </ul>
        </div>
        <div class="role-card hr">
          <div class="role-icon-wrap hr-bg">
            <app-icon name="users" [size]="28" color="#1565c0"></app-icon>
          </div>
          <h3>HR Manager</h3>
          <ul>
            <li *ngFor="let item of hrItems">
              <app-icon name="check-circle" [size]="14" color="#1565c0"></app-icon>
              {{item}}
            </li>
          </ul>
        </div>
        <div class="role-card admin">
          <div class="role-icon-wrap admin-bg">
            <app-icon name="shield" [size]="28" color="#6a1b9a"></app-icon>
          </div>
          <h3>Admin</h3>
          <ul>
            <li *ngFor="let item of adminItems">
              <app-icon name="check-circle" [size]="14" color="#6a1b9a"></app-icon>
              {{item}}
            </li>
          </ul>
        </div>
        <div class="role-card pm">
          <div class="role-icon-wrap pm-bg">
            <app-icon name="briefcase" [size]="28" color="#b45309"></app-icon>
          </div>
          <h3>Project Manager</h3>
          <ul>
            <li *ngFor="let item of pmItems">
              <app-icon name="check-circle" [size]="14" color="#b45309"></app-icon>
              {{item}}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section class="skills-section">
      <div class="section-header light">
        <h2>Skill Assessment Tests</h2>
        <p>Automated MCQ tests with 3 difficulty levels</p>
      </div>
      <div class="skills-grid">
        <div class="skill-pill" *ngFor="let s of skills">
          <app-icon name="cpu" [size]="16" [color]="s.color"></app-icon>
          {{s.name}}
        </div>
      </div>
      <div class="difficulty-row">
        <div class="diff-badge easy">
          <app-icon name="trending-up" [size]="14" color="#2e7d32"></app-icon>
          Easy — 10 Questions
        </div>
        <div class="diff-badge moderate">
          <app-icon name="bar-chart-2" [size]="14" color="#e65100"></app-icon>
          Moderate — 10 Questions
        </div>
        <div class="diff-badge hard">
          <app-icon name="zap" [size]="14" color="#6a1b9a"></app-icon>
          Advanced — 10 Questions
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-icon">
        <app-icon name="briefcase" [size]="40" color="#1a237e"></app-icon>
      </div>
      <h2>Ready to get started?</h2>
      <p>Login with your credentials to access the platform</p>
      <button class="btn-primary large" (click)="goToLogin()">
        Login Now
        <app-icon name="arrow-right" [size]="20" color="#fff"></app-icon>
      </button>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-brand">
        <app-icon name="zap" [size]="16" color="#90caf9"></app-icon>
        <span>EMS Pro</span>
      </div>
      <span>© 2026 Employee Management System. All rights reserved.</span>
    </footer>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host { font-family: 'Inter', 'Segoe UI', sans-serif; }

    /* NAVBAR */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 48px;
      background: rgba(255,255,255,0.96);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 20px rgba(0,0,0,0.08);
    }
    .nav-brand { display: flex; align-items: center; gap: 10px; }
    .brand-logo {
      width: 34px; height: 34px; border-radius: 9px;
      background: linear-gradient(135deg, #1a237e, #1565c0);
      display: flex; align-items: center; justify-content: center;
    }
    .brand-name { font-size: 20px; font-weight: 800; color: #1a237e; letter-spacing: -0.5px; }
    .login-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 24px; border-radius: 50px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white; border: none; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,35,126,0.3); }

    /* HERO */
    .hero {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #0d1b6e 0%, #1a237e 40%, #283593 70%, #1565c0 100%);
      position: relative; overflow: hidden; padding: 100px 24px 60px;
    }
    .hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.04); }
    .c1 { width: 600px; height: 600px; top: -200px; right: -150px; }
    .c2 { width: 400px; height: 400px; bottom: -100px; left: -100px; }
    .c3 { width: 250px; height: 250px; top: 40%; left: 30%; background: rgba(255,255,255,0.03); }

    .hero-content { position: relative; text-align: center; max-width: 780px; }
    .badge {
      display: inline-block; padding: 6px 20px; border-radius: 50px;
      background: rgba(255,255,255,0.12); color: #90caf9;
      font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
      text-transform: uppercase; margin-bottom: 24px;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .hero-content h1 {
      font-size: clamp(36px, 6vw, 64px); font-weight: 800;
      color: white; line-height: 1.15; margin-bottom: 24px;
    }
    .highlight {
      background: linear-gradient(90deg, #64b5f6, #90caf9);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-sub {
      font-size: 18px; color: rgba(255,255,255,0.72);
      line-height: 1.7; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;
    }
    .hero-actions { display: flex; gap: 14px; justify-content: center; margin-bottom: 56px; flex-wrap: wrap; }
    .btn-primary {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 32px; border-radius: 50px;
      background: linear-gradient(135deg, #42a5f5, #1e88e5);
      color: white; border: none; font-size: 15px; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 8px 24px rgba(66,165,245,0.4);
    }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(66,165,245,0.5); }
    .btn-primary.large { font-size: 17px; padding: 15px 44px; }
    .btn-outline {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 32px; border-radius: 50px;
      background: transparent; color: white;
      border: 2px solid rgba(255,255,255,0.35);
      font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: white; }

    .hero-stats { display: flex; align-items: center; justify-content: center; gap: 32px; flex-wrap: wrap; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-num { font-size: 32px; font-weight: 800; color: white; }
    .stat-label { font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 4px; }
    .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }

    /* SECTIONS */
    section { padding: 80px 24px; }
    .section-header { text-align: center; margin-bottom: 56px; }
    .section-header h2 { font-size: 34px; font-weight: 800; color: #1a237e; margin-bottom: 12px; }
    .section-header p { font-size: 16px; color: #666; }
    .section-header.light h2 { color: white; }
    .section-header.light p { color: rgba(255,255,255,0.65); }

    /* FEATURES */
    .features { background: #f8f9ff; }
    .features-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 22px; max-width: 1100px; margin: 0 auto;
    }
    .feature-card {
      background: white; border-radius: 16px; padding: 30px 26px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid #eef0ff;
    }
    .feature-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(26,35,126,0.12); }
    .feature-icon-wrap {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 18px;
    }
    .feature-card h3 { font-size: 17px; font-weight: 700; color: #1a237e; margin-bottom: 10px; }
    .feature-card p { font-size: 14px; color: #666; line-height: 1.65; }

    /* ROLES */
    .roles { background: white; }
    .roles-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 22px; max-width: 1000px; margin: 0 auto;
    }
    .role-card { border-radius: 20px; padding: 32px 28px; transition: transform 0.2s; }
    .role-card:hover { transform: translateY(-4px); }
    .role-card.employee { background: linear-gradient(135deg, #e8f5e9, #f1f8e9); border: 1px solid #c8e6c9; }
    .role-card.hr       { background: linear-gradient(135deg, #e3f2fd, #e8eaf6); border: 1px solid #bbdefb; }
    .role-card.admin    { background: linear-gradient(135deg, #fce4ec, #f3e5f5); border: 1px solid #f8bbd0; }
    .role-card.pm       { background: linear-gradient(135deg, #fff8e1, #fef3c7); border: 1px solid #fde68a; }
    .role-icon-wrap {
      width: 60px; height: 60px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
    }
    .emp-bg   { background: rgba(46,125,50,0.12); }
    .hr-bg    { background: rgba(21,101,192,0.12); }
    .admin-bg { background: rgba(106,27,154,0.12); }
    .pm-bg    { background: rgba(180,83,9,0.12); }
    .role-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 16px; color: #1a237e; }
    .role-card ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .role-card ul li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #444; }

    /* SKILLS */
    .skills-section { background: linear-gradient(135deg, #1a237e, #283593); }
    .skills-grid {
      display: flex; flex-wrap: wrap; gap: 14px;
      justify-content: center; max-width: 800px; margin: 0 auto 36px;
    }
    .skill-pill {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 22px; border-radius: 50px;
      background: rgba(255,255,255,0.1);
      color: white; font-size: 15px; font-weight: 600;
      border: 1px solid rgba(255,255,255,0.18);
    }
    .difficulty-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .diff-badge {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 22px; border-radius: 50px;
      font-size: 13px; font-weight: 600;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .diff-badge.easy     { background: rgba(46,125,50,0.2);  color: #a5d6a7; }
    .diff-badge.moderate { background: rgba(230,81,0,0.2);   color: #ffcc80; }
    .diff-badge.hard     { background: rgba(106,27,154,0.2); color: #ce93d8; }

    /* CTA */
    .cta { background: #f8f9ff; text-align: center; display: flex; flex-direction: column; align-items: center; }
    .cta-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: #e8eaf6; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
    }
    .cta h2 { font-size: 34px; font-weight: 800; color: #1a237e; margin-bottom: 12px; }
    .cta p  { font-size: 16px; color: #666; margin-bottom: 32px; }

    /* FOOTER */
    .footer {
      background: #0d1b6e; color: rgba(255,255,255,0.5);
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 28px 24px; font-size: 13px;
    }
    .footer-brand { display: flex; align-items: center; gap: 8px; color: #90caf9; font-weight: 700; font-size: 15px; }

    @media (max-width: 600px) {
      .navbar { padding: 12px 18px; }
      .hero-stats { gap: 20px; }
      .stat-divider { display: none; }
    }
  `]
})
export class LandingComponent {
  features = [
    { icon: 'user',         color: '#1565c0', bg: '#e3f2fd', title: 'Employee Profiles',  desc: 'Employees can create detailed profiles with personal info, qualifications, and skills.' },
    { icon: 'file-text',    color: '#2e7d32', bg: '#e8f5e9', title: 'MCQ Skill Tests',    desc: 'Automated tests for Java, Python, AI/ML, and .NET with easy, moderate, and advanced questions.' },
    { icon: 'award',        color: '#e65100', bg: '#fff3e0', title: 'Certifications',      desc: 'Upload and manage professional certifications with image attachments.' },
    { icon: 'check-circle', color: '#6a1b9a', bg: '#f3e5f5', title: 'HR Approval',        desc: 'HR managers can review, approve, or reject employee profiles with full visibility.' },
    { icon: 'bar-chart-2',  color: '#00695c', bg: '#e0f2f1', title: 'Score Tracking',     desc: 'Track test scores and pass/fail status across all skill assessments.' },
    { icon: 'shield',       color: '#c62828', bg: '#ffebee', title: 'Role-Based Access',  desc: 'Secure JWT authentication with separate dashboards for Employee, HR, and Admin.' },
  ];

  skills = [
    { name: 'Java',   color: '#ef5350' },
    { name: 'Python', color: '#66bb6a' },
    { name: 'AI / ML',color: '#ce93d8' },
    { name: '.NET',   color: '#64b5f6' },
  ];

  employeeItems = ['Create & update profile', 'Take skill MCQ tests', 'Upload certifications', 'Track test results'];
  hrItems       = ['Review employee profiles', 'Approve or reject profiles', 'View test scores', 'Manage certifications'];
  adminItems    = ['Full system access', 'Manage all users', 'Configure MCQ tests', 'System oversight'];
  pmItems       = ['Create & manage projects', 'Review project applications', 'Approve or reject candidates', 'Track project status'];

  constructor(private router: Router) {}

  goToLogin()        { this.router.navigate(['/login']); }
  scrollToFeatures() { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }
}
