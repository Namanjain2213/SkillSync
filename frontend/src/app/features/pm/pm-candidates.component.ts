import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { IconComponent } from '../../shared/icon.component';

@Component({
  selector: 'app-pm-candidates',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="page">
      <div class="top-bar">
        <button class="back-btn" (click)="router.navigate(['/pm/projects'])">
          <app-icon name="arrow-left" [size]="16" color="#1565c0"></app-icon>
          Back to Projects
        </button>
      </div>

      <div class="project-banner" *ngIf="project">
        <div class="banner-left">
          <div class="banner-icon">
            <app-icon name="layers" [size]="24" color="#fff"></app-icon>
          </div>
          <div>
            <h2>{{ project.name }}</h2>
            <p>{{ project.description || 'No description' }}</p>
          </div>
        </div>
        <div class="required-skills">
          <div class="skills-label">Required Skills:</div>
          <div class="skills-row">
            <span class="skill-chip req" *ngFor="let s of project.requiredSkills">{{ s }}</span>
          </div>
        </div>
      </div>

      <div class="section-header">
        <h3>Suggested Candidates</h3>
        <span class="count-badge" *ngIf="!loading">{{ candidates.length }} approved candidate(s) found</span>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div><p>Finding matching candidates...</p>
      </div>

      <div class="empty" *ngIf="!loading && candidates.length === 0">
        <app-icon name="users" [size]="48" color="#b0bec5"></app-icon>
        <p>No approved candidates match the required skills yet.</p>
      </div>

      <div class="candidates-grid" *ngIf="!loading && candidates.length > 0">
        <div class="candidate-card" *ngFor="let c of candidates">
          <div class="card-top">
            <div class="avatar">{{ c.name?.[0]?.toUpperCase() || '?' }}</div>
            <div class="candidate-info">
              <div class="candidate-name">{{ c.name }}</div>
              <div class="candidate-id">{{ c.username }}</div>
              <div class="candidate-email">{{ c.email }}</div>
            </div>
            <span class="approved-badge">
              <app-icon name="check-circle" [size]="12" color="#2e7d32"></app-icon>
              Approved
            </span>
          </div>

          <div class="detail-row">
            <app-icon name="book-open" [size]="13" color="#888"></app-icon>
            <span>{{ c.highestQualification }}</span>
          </div>

          <div class="skills-section">
            <div class="skills-label">Skills:</div>
            <div class="skills-row">
              <span class="skill-chip"
                    *ngFor="let s of c.skills"
                    [class.match]="isMatch(s)">
                {{ s }}
                <app-icon *ngIf="isMatch(s)" name="check" [size]="10" color="#1565c0"></app-icon>
              </span>
            </div>
          </div>

          <div class="match-bar" *ngIf="project">
            <div class="match-label">Skill Match</div>
            <div class="bar-track">
              <div class="bar-fill" [style.width]="getMatchPercent(c) + '%'"></div>
            </div>
            <div class="match-pct">{{ getMatchPercent(c) }}%</div>
          </div>

          <div class="tests-section" *ngIf="c.mcqTests && c.mcqTests.length > 0">
            <div class="tests-label">Test Results:</div>
            <div class="tests-row">
              <span class="test-chip" *ngFor="let t of c.mcqTests"
                    [class]="'test-' + (t.status || 'pending').toLowerCase()">
                {{ t.skill }}: {{ t.score !== null ? t.score + '%' : 'Pending' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .page { font-family: 'Inter', 'Segoe UI', sans-serif; display: flex; flex-direction: column; gap: 20px; }

    .top-bar { display: flex; align-items: center; }
    .back-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 8px 16px; border-radius: 8px;
      background: white; border: 1.5px solid #d6eaf8;
      color: #1565c0; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .back-btn:hover { background: #e3f2fd; }

    .project-banner {
      background: linear-gradient(135deg, #0d2137, #0a5276);
      border-radius: 16px; padding: 22px 26px;
      display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px;
    }
    .banner-left { display: flex; align-items: flex-start; gap: 14px; }
    .banner-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .project-banner h2 { font-size: 17px; font-weight: 700; color: white; margin-bottom: 4px; }
    .project-banner p { font-size: 13px; color: rgba(255,255,255,0.6); }
    .required-skills { display: flex; flex-direction: column; gap: 6px; }
    .skills-label { font-size: 11px; color: rgba(255,255,255,0.6); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .skills-row { display: flex; flex-wrap: wrap; gap: 5px; }
    .skill-chip { padding: 3px 10px; border-radius: 20px; background: #e3f2fd; color: #1565c0; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .skill-chip.req { background: rgba(255,255,255,0.2); color: white; }
    .skill-chip.match { background: #e3f2fd; color: #1565c0; border: 1.5px solid #1565c0; }

    .section-header { display: flex; align-items: center; gap: 12px; }
    .section-header h3 { font-size: 16px; font-weight: 700; color: #0a5276; }
    .count-badge { padding: 4px 12px; border-radius: 20px; background: #e3f2fd; color: #1565c0; font-size: 12px; font-weight: 600; }

    .loading { display: flex; align-items: center; gap: 12px; padding: 32px; }
    .loading p { font-size: 14px; color: #888; }
    .spinner { width: 24px; height: 24px; border-radius: 50%; border: 3px solid #d6eaf8; border-top-color: #1565c0; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 64px; background: white; border-radius: 14px; }
    .empty p { font-size: 14px; color: #888; text-align: center; }

    .candidates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .candidate-card {
      background: white; border-radius: 14px; padding: 20px;
      box-shadow: 0 1px 10px rgba(0,0,0,0.07);
      border: 1.5px solid #d6eaf8; display: flex; flex-direction: column; gap: 12px;
    }
    .card-top { display: flex; align-items: flex-start; gap: 12px; }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #29b6f6, #0277bd);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .candidate-info { flex: 1; }
    .candidate-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
    .candidate-id { font-size: 11px; color: #1565c0; font-weight: 600; margin-top: 1px; }
    .candidate-email { font-size: 11px; color: #888; margin-top: 1px; }
    .approved-badge {
      display: flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 20px;
      background: #e8f5e9; color: #2e7d32;
      font-size: 11px; font-weight: 700; white-space: nowrap;
    }
    .detail-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #666; }
    .skills-section { display: flex; flex-direction: column; gap: 6px; }
    .tests-section { display: flex; flex-direction: column; gap: 6px; }
    .tests-label, .skills-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.4px; }
    .tests-row { display: flex; flex-wrap: wrap; gap: 5px; }
    .test-chip { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .test-passed  { background: #e8f5e9; color: #2e7d32; }
    .test-failed  { background: #ffebee; color: #c62828; }
    .test-pending { background: #fff3e0; color: #e65100; }

    .match-bar { display: flex; align-items: center; gap: 8px; }
    .match-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.4px; white-space: nowrap; }
    .bar-track { flex: 1; height: 6px; border-radius: 3px; background: #e3f2fd; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #29b6f6, #1565c0); transition: width 0.4s; }
    .match-pct { font-size: 12px; font-weight: 700; color: #1565c0; min-width: 36px; text-align: right; }
  `]
})
export class PmCandidatesComponent implements OnInit {
  project: any = null;
  candidates: any[] = [];
  loading = true;
  projectId!: number;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.projectService.getProject(this.projectId).subscribe({
      next: (p) => { this.project = p; },
      error: () => {}
    });
    this.projectService.getCandidates(this.projectId).subscribe({
      next: (c) => { this.candidates = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  isMatch(skill: string): boolean {
    if (!this.project) return false;
    return this.project.requiredSkills.some(
      (r: string) => r.toLowerCase() === skill.toLowerCase()
    );
  }

  getMatchPercent(candidate: any): number {
    if (!this.project || !candidate.skills?.length) return 0;
    const required: string[] = this.project.requiredSkills.map((s: string) => s.toLowerCase());
    const matches = candidate.skills.filter((s: string) => required.includes(s.toLowerCase())).length;
    return Math.round((matches / required.length) * 100);
  }
}
