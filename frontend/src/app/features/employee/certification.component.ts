import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { IconComponent } from '../../shared/icon.component';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="page">

      <!-- Header -->
      <div class="banner">
        <div class="banner-left">
          <div class="banner-icon">
            <app-icon name="award" [size]="26" color="#fff"></app-icon>
          </div>
          <div>
            <h2>My Certifications</h2>
            <p>Upload and manage your professional certificates</p>
          </div>
        </div>
      </div>

      <!-- No profile warning -->
      <div class="warn-card" *ngIf="!loading && !hasProfile">
        <app-icon name="alert-circle" [size]="20" color="#e65100"></app-icon>
        <div>
          <div class="warn-title">Profile required</div>
          <div class="warn-sub">Please create your profile first before uploading certifications.</div>
        </div>
        <button class="go-btn" (click)="router.navigate(['/employee/profile'])">Create Profile</button>
      </div>

      <!-- Upload form -->
      <div class="upload-card" *ngIf="hasProfile">
        <div class="card-title">
          <app-icon name="upload" [size]="16" color="#1a237e"></app-icon>
          Upload New Certificate
        </div>

        <div class="form-row">
          <div class="field">
            <label>Certificate Name *</label>
            <input [(ngModel)]="certName" placeholder="e.g. AWS Certified Developer" />
          </div>
          <div class="field">
            <label>Certificate File * (JPG, PNG, PDF)</label>
            <div class="file-drop" (click)="fileInput.click()" [class.has-file]="selectedFile">
              <app-icon [name]="selectedFile ? 'check-circle' : 'upload'" [size]="20"
                        [color]="selectedFile ? '#2e7d32' : '#9fa8da'"></app-icon>
              <span>{{ selectedFile ? selectedFile.name : 'Click to choose file' }}</span>
            </div>
            <input #fileInput type="file" accept=".jpg,.jpeg,.png,.pdf" style="display:none"
                   (change)="onFileSelected($event)" />
          </div>
        </div>

        <button class="upload-btn" (click)="upload()"
                [disabled]="uploading || !certName || !selectedFile">
          <span *ngIf="!uploading">
            <app-icon name="upload" [size]="15" color="#fff"></app-icon>
            Upload Certificate
          </span>
          <span *ngIf="uploading">Uploading...</span>
        </button>
      </div>

      <!-- Existing certifications -->
      <div class="certs-section" *ngIf="hasProfile">
        <div class="section-title">Uploaded Certificates ({{ certifications.length }})</div>

        <div class="loading" *ngIf="loading">
          <div class="spinner"></div><p>Loading...</p>
        </div>

        <div class="empty" *ngIf="!loading && certifications.length === 0">
          <app-icon name="award" [size]="40" color="#c5cae9"></app-icon>
          <p>No certificates uploaded yet.</p>
        </div>

        <div class="certs-grid" *ngIf="!loading && certifications.length > 0">
          <div class="cert-card" *ngFor="let c of certifications">
            <div class="cert-icon">
              <app-icon name="award" [size]="24" color="#1a237e"></app-icon>
            </div>
            <div class="cert-info">
              <div class="cert-name">{{ c.name }}</div>
              <div class="cert-date">{{ c.uploadedAt | date:'dd MMM yyyy' }}</div>
            </div>
            <a *ngIf="c.imagePath" [href]="getFileUrl(c.imagePath)" target="_blank" class="view-btn">
              <app-icon name="eye" [size]="14" color="#1a237e"></app-icon>
              View
            </a>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 20px; }

    .banner {
      background: linear-gradient(135deg, #1a237e, #1565c0);
      border-radius: 16px; padding: 22px 26px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .banner-left { display: flex; align-items: center; gap: 14px; }
    .banner-icon {
      width: 50px; height: 50px; border-radius: 14px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .banner h2 { font-size: 18px; font-weight: 700; color: white; margin-bottom: 3px; }
    .banner p { font-size: 13px; color: rgba(255,255,255,0.65); }

    .warn-card {
      display: flex; align-items: center; gap: 14px;
      padding: 18px 20px; border-radius: 14px;
      background: #fff3e0; border: 1.5px solid #ffcc80;
    }
    .warn-title { font-size: 14px; font-weight: 700; color: #e65100; }
    .warn-sub { font-size: 12px; color: #bf360c; margin-top: 2px; }
    .go-btn {
      margin-left: auto; padding: 8px 18px; border-radius: 8px;
      background: #e65100; border: none; color: white;
      font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap;
    }

    .upload-card {
      background: white; border-radius: 16px; padding: 22px 24px;
      box-shadow: 0 1px 12px rgba(0,0,0,0.07);
    }
    .card-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 15px; font-weight: 700; color: #1a237e; margin-bottom: 18px;
    }
    .success-msg {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: 10px;
      background: #e8f5e9; color: #2e7d32;
      font-size: 13px; font-weight: 600; margin-bottom: 14px;
    }
    .error-msg {
      padding: 10px 14px; border-radius: 10px;
      background: #ffebee; color: #c62828;
      font-size: 13px; margin-bottom: 14px;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
    .field { display: flex; flex-direction: column; gap: 7px; }
    label { font-size: 12px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.4px; }
    input[type=text], input:not([type=file]) {
      padding: 11px 14px; border-radius: 10px;
      border: 1.5px solid #e0e0e0; font-size: 14px;
      font-family: inherit; outline: none; transition: border 0.15s;
    }
    input:focus { border-color: #1a237e; }
    .file-drop {
      display: flex; align-items: center; gap: 10px;
      padding: 11px 14px; border-radius: 10px;
      border: 1.5px dashed #c5cae9; background: #f8f9ff;
      cursor: pointer; font-size: 13px; color: #888; transition: all 0.15s;
    }
    .file-drop:hover { border-color: #1a237e; background: #eef0ff; }
    .file-drop.has-file { border-color: #43a047; background: #f1f8e9; color: #2e7d32; }
    .upload-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 11px 26px; border-radius: 10px;
      background: linear-gradient(135deg, #1a237e, #1565c0);
      border: none; color: white; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .upload-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,35,126,0.3); }
    .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .certs-section { display: flex; flex-direction: column; gap: 14px; }
    .section-title { font-size: 15px; font-weight: 700; color: #1a237e; }
    .loading { display: flex; align-items: center; gap: 10px; padding: 20px; }
    .loading p { font-size: 14px; color: #888; }
    .spinner { width: 22px; height: 22px; border-radius: 50%; border: 3px solid #e8eaf6; border-top-color: #1a237e; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 40px; background: white; border-radius: 14px; }
    .empty p { font-size: 14px; color: #aaa; }
    .certs-grid { display: flex; flex-direction: column; gap: 10px; }
    .cert-card {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 18px; border-radius: 12px;
      background: white; border: 1.5px solid #e8eaf6;
      box-shadow: 0 1px 6px rgba(0,0,0,0.05);
    }
    .cert-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: #e8eaf6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .cert-info { flex: 1; }
    .cert-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .cert-date { font-size: 11px; color: #aaa; margin-top: 2px; }
    .view-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 14px; border-radius: 8px;
      background: #e8eaf6; color: #1a237e;
      font-size: 12px; font-weight: 600; text-decoration: none;
      transition: background 0.15s;
    }
    .view-btn:hover { background: #c5cae9; }
  `]
})
export class CertificationComponent implements OnInit {
  hasProfile = false;
  certifications: any[] = [];
  loading = true;
  certName = '';
  selectedFile: File | null = null;
  uploading = false;

  constructor(public router: Router, private employeeService: EmployeeService, private toast: ToastService) {}

  ngOnInit(): void {
    this.employeeService.getProfile().subscribe({
      next: (p) => {
        this.loading = false;
        if (p) {
          this.hasProfile = true;
          this.certifications = p.certifications || [];
        }
      },
      error: () => { this.loading = false; }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  upload(): void {
    if (!this.certName || !this.selectedFile) return;
    this.uploading = true;
    this.employeeService.uploadCertification(this.certName, this.selectedFile).subscribe({
      next: () => {
        this.uploading = false;
        this.toast.success('Certificate uploaded successfully!');
        this.certName = '';
        this.selectedFile = null;
        this.employeeService.getProfile().subscribe({
          next: (p) => { this.certifications = p?.certifications || []; }
        });
      },
      error: () => {
        this.uploading = false;
        this.toast.error('Upload failed. Please try again.');
      }
    });
  }

  getFileUrl(path: string): string {
    return `http://localhost:8080/api/uploads/certifications/${path}`;
  }
}
