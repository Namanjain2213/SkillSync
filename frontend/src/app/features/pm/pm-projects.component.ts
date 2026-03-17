import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-pm-projects',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="page">
      <div class="top-bar">
        <h2>My Projects</h2>
        <button class="create-btn" (click)="router.navigate(['/pm/create'])">
          <app-icon name="plus-circle" [size]="16" color="#fff"></app-icon>
          New Project
        </button>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div><p>Loading projects...</p>
      </div>

      <div class="empty" *ngIf="!loading && projects.length === 0">
        <app-icon name="layers" [size]="48" color="#b0bec5"></app-icon>
        <p>No projects yet.</p>
        <button class="create-btn-empty" (click)="router.navigate(['/pm/create'])">Create First Project</button>
      </div>

      <div class="projects-grid" *ngIf="!loading && projects.length > 0">
        <div class="project-card" *ngFor="let p of projects">
          <div class="card-top">
            <div class="project-name">{{ p.name }}</div>
            <span class="status-badge" [class]="'status-' + p.status.toLowerCase()">{{ p.status }}</span>
          </div>
          <div class="project-desc">{{ p.description || 'No description provided.' }}</div>
          <div class="skills-row">
            <span class="skill-chip" *ngFor="let s of p.requiredSkills">{{ s }}</span>
          </div>
          <div class="card-footer">
            <span class="date">{{ p.createdAt | date:'dd MMM yyyy' }}</span>
            <button class="candidates-btn" (click)="router.navigate(['/pm/projects', p.id, 'candidates'])">
              <app-icon name="users" [size]="14" color="#fff"></app-icon>
              View Candidates
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page { font-family: 'Inter', 'Segoe UI', sans-serif; }
    .top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .top-bar h2 { font-size: 18px; font-weight: 700; color: #0a5276; }
    .create-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 50px;
      background: #1565c0; border: none; color: white;
      font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .create-btn:hover { background: #0d47a1; }

    .loading { display: flex; align-items: center; gap: 12px; padding: 32px; }
    .loading p { font-size: 14px; color: #888; }
    .spinner { width: 24px; height: 24px; border-radius: 50%; border: 3px solid #d6eaf8; border-top-color: #1565c0; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 64px; background: white; border-radius: 14px; }
    .empty p { font-size: 14px; color: #888; }
    .create-btn-empty { padding: 10px 24px; border-radius: 8px; background: #1565c0; border: none; color: white; font-size: 13px; font-weight: 600; cursor: pointer; }

    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .project-card {
      background: white; border-radius: 14px; padding: 20px;
      box-shadow: 0 1px 10px rgba(0,0,0,0.07);
      border: 1.5px solid #d6eaf8; display: flex; flex-direction: column; gap: 10px;
      transition: all 0.15s;
    }
    .project-card:hover { border-color: #1565c0; box-shadow: 0 4px 16px rgba(13,59,94,0.12); }
    .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    .project-name { font-size: 15px; font-weight: 700; color: #1a1a2e; }
    .project-desc { font-size: 13px; color: #666; line-height: 1.5; }
    .skills-row { display: flex; flex-wrap: wrap; gap: 5px; }
    .skill-chip { padding: 3px 10px; border-radius: 20px; background: #e3f2fd; color: #1565c0; font-size: 11px; font-weight: 600; }
    .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
    .status-active    { background: #e8f5e9; color: #2e7d32; }
    .status-on_hold   { background: #fff3e0; color: #e65100; }
    .status-completed { background: #f3e5f5; color: #7b1fa2; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
    .date { font-size: 11px; color: #aaa; }
    .candidates-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 14px; border-radius: 8px;
      background: #1565c0; border: none; color: white;
      font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .candidates-btn:hover { background: #0d47a1; }
  `]
})
export class PmProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = true;

  constructor(public router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getMyProjects().subscribe({
      next: (p) => { this.projects = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
