import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { IconComponent } from '../../shared/icon.component';
import { ToastService } from '../../shared/toast.service';

const SKILL_OPTIONS = ['Java', 'Python', 'JavaScript', 'TypeScript', 'Angular', 'React',
  'Spring Boot', '.NET', 'AI/ML', 'DevOps', 'AWS', 'Docker', 'Kubernetes',
  'SQL', 'MongoDB', 'Node.js', 'Flutter', 'Android', 'iOS'];

@Component({
  selector: 'app-pm-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="page">
      <div class="card">
        <div class="card-header">
          <app-icon name="plus-circle" [size]="22" color="#1565c0"></app-icon>
          <h2>Create New Project</h2>
        </div>

        <form (ngSubmit)="onSubmit()" #f="ngForm">
          <div class="field">
            <label>Project Name *</label>
            <input [(ngModel)]="form.name" name="name" required placeholder="e.g. E-Commerce Platform" />
          </div>

          <div class="field">
            <label>Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="4"
              placeholder="Describe the project goals, scope, and requirements..."></textarea>
          </div>

          <div class="field">
            <label>Required Skills *</label>
            <div class="skills-grid">
              <label class="skill-option" *ngFor="let s of skillOptions"
                     [class.selected]="isSelected(s)"
                     (click)="toggleSkill(s)">
                <span>{{ s }}</span>
                <app-icon *ngIf="isSelected(s)" name="check" [size]="12" color="#1565c0"></app-icon>
              </label>
            </div>
            <div class="selected-count" *ngIf="form.requiredSkills.length > 0">
              {{ form.requiredSkills.length }} skill(s) selected
            </div>
          </div>

          <div class="actions">
            <button type="button" class="btn-cancel" (click)="router.navigate(['/pm/projects'])">Cancel</button>
            <button type="submit" class="btn-submit" [disabled]="loading || !form.name || form.requiredSkills.length === 0">
              <span *ngIf="!loading">Create Project</span>
              <span *ngIf="loading">Creating...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page { font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 680px; margin: 0 auto; }
    .card { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); }
    .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
    .card-header h2 { font-size: 18px; font-weight: 700; color: #0a5276; }

    .success-msg {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; border-radius: 10px;
      background: #e8f5e9; color: #2e7d32;
      font-size: 13px; font-weight: 600; margin-bottom: 16px;
    }
    .error-msg {
      padding: 12px 16px; border-radius: 10px;
      background: #ffebee; color: #c62828;
      font-size: 13px; margin-bottom: 16px;
    }

    .field { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 7px; }
    input, textarea {
      width: 100%; padding: 11px 14px; border-radius: 10px;
      border: 1.5px solid #d6eaf8; font-size: 14px;
      font-family: inherit; outline: none; transition: border 0.15s;
    }
    input:focus, textarea:focus { border-color: #1565c0; }
    textarea { resize: vertical; }

    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-option {
      padding: 6px 14px; border-radius: 20px;
      border: 1.5px solid #d6eaf8; background: #f8fbff;
      font-size: 12px; font-weight: 600; color: #555;
      cursor: pointer; transition: all 0.15s;
      display: flex; align-items: center; gap: 5px;
    }
    .skill-option:hover { border-color: #1565c0; color: #1565c0; }
    .skill-option.selected { background: #e3f2fd; border-color: #1565c0; color: #1565c0; }
    .selected-count { font-size: 12px; color: #1565c0; margin-top: 8px; font-weight: 600; }

    .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
    .btn-cancel {
      padding: 11px 24px; border-radius: 10px;
      border: 1.5px solid #d6eaf8; background: white;
      color: #555; font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .btn-submit {
      padding: 11px 28px; border-radius: 10px;
      background: #1565c0; border: none; color: white;
      font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s;
    }
    .btn-submit:hover:not(:disabled) { background: #0d47a1; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class PmCreateProjectComponent {
  skillOptions = SKILL_OPTIONS;
  form = { name: '', description: '', requiredSkills: [] as string[] };
  loading = false;

  constructor(public router: Router, private projectService: ProjectService, private toast: ToastService) {}

  isSelected(skill: string): boolean {
    return this.form.requiredSkills.includes(skill);
  }

  toggleSkill(skill: string): void {
    const idx = this.form.requiredSkills.indexOf(skill);
    if (idx >= 0) this.form.requiredSkills.splice(idx, 1);
    else this.form.requiredSkills.push(skill);
  }

  onSubmit(): void {
    if (!this.form.name || this.form.requiredSkills.length === 0) return;
    this.loading = true;
    this.projectService.createProject(this.form).subscribe({
      next: (p) => {
        this.loading = false;
        this.toast.success('Project created successfully!');
        setTimeout(() => this.router.navigate(['/pm/projects', p.id, 'candidates']), 800);
      },
      error: (e) => {
        this.loading = false;
        this.toast.error(e?.error?.message || 'Failed to create project.');
      }
    });
  }
}
