import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { IconComponent } from '../../shared/icon.component';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-mcq-test',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `

    <!-- ═══════════════ SKILL SELECTION ═══════════════ -->
    <div class="page" *ngIf="!testStarted && !testCompleted">
      <div class="sel-hero">
        <div class="sel-hero-icon">
          <app-icon name="file-text" [size]="36" color="#fff"></app-icon>
        </div>
        <h1>Skill Assessment</h1>
        <p>Prove your expertise with timed MCQ tests</p>
      </div>

      <div class="sel-body">
        <!-- Loading -->
        <div class="sel-loading" *ngIf="loading">
          <div class="spin-lg"></div>
          <span>Loading your tests...</span>
        </div>

        <!-- No pending -->
        <div class="sel-empty" *ngIf="!loading && pendingTests.length === 0 && limitReachedSkills.length === 0">
          <div class="sel-empty-icon">
            <app-icon name="check-circle" [size]="40" color="#22c55e"></app-icon>
          </div>
          <h3>All Tests Completed!</h3>
          <p>You have no pending skill assessments.</p>
          <button class="btn-back" (click)="goBack()">
            <app-icon name="arrow-right" [size]="16" color="#fff" style="transform:rotate(180deg)"></app-icon>
            Back to Dashboard
          </button>
        </div>

        <!-- Pending tests -->
        <div class="sel-grid" *ngIf="!loading && (pendingTests.length > 0 || limitReachedSkills.length > 0)">
          <div class="sel-info-banner" *ngIf="pendingTests.length > 0">
            <app-icon name="zap" [size]="15" color="#f59e0b"></app-icon>
            <span>You have <strong>{{ pendingTests.length }}</strong> pending test{{ pendingTests.length > 1 ? 's' : '' }}. Each test has 30 questions and 30 minutes.</span>
          </div>

          <div class="test-cards">
            <!-- Pending test cards -->
            <div class="test-card" *ngFor="let t of pendingTests" (click)="!loading && startTest(t.skill)">
              <div class="test-card-icon" [style.background]="getSkillColor(t.skill).bg">
                <app-icon name="cpu" [size]="28" [color]="getSkillColor(t.skill).color"></app-icon>
              </div>
              <div class="test-card-info">
                <div class="test-card-name">{{ t.skill }}</div>
                <div class="test-card-meta">
                  30 Questions &nbsp;·&nbsp; 30 Minutes
                  <span *ngIf="t.attemptNumber && t.attemptNumber > 1" class="attempt-badge">
                    Attempt {{ t.attemptNumber }}/3
                  </span>
                </div>
                <div class="test-card-levels">
                  <span class="lvl easy">10 Easy</span>
                  <span class="lvl moderate">10 Moderate</span>
                  <span class="lvl hard">10 Advanced</span>
                </div>
              </div>
              <div class="test-card-arrow">
                <app-icon name="arrow-right" [size]="18" color="#6366f1"></app-icon>
              </div>
            </div>

            <!-- Limit reached cards -->
            <div class="test-card limit-card" *ngFor="let skill of limitReachedSkills">
              <div class="test-card-icon" style="background:#fee2e2">
                <app-icon name="x-circle" [size]="28" color="#dc2626"></app-icon>
              </div>
              <div class="test-card-info">
                <div class="test-card-name" style="color:#991b1b">{{ skill }}</div>
                <div class="test-card-meta" style="color:#dc2626">Attempt Limit Reached (3/3)</div>
                <div class="limit-msg">
                  <app-icon name="alert-circle" [size]="12" color="#dc2626"></app-icon>
                  You cannot retake this test
                </div>
              </div>
              <div class="test-card-arrow" style="background:#fee2e2">
                <app-icon name="lock" [size]="18" color="#dc2626"></app-icon>
              </div>
            </div>
          </div>

          <div class="sel-rules">
            <div class="rule-title">
              <app-icon name="shield" [size]="14" color="#6366f1"></app-icon>
              Test Rules
            </div>
            <div class="rule-list">
              <div class="rule-item"><span class="rule-dot"></span>Timer starts as soon as the test loads</div>
              <div class="rule-item"><span class="rule-dot"></span>You can navigate between questions freely</div>
              <div class="rule-item"><span class="rule-dot"></span>Test auto-submits when time runs out</div>
              <div class="rule-item"><span class="rule-dot"></span>Passing score is 60% or above</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════ TEST IN PROGRESS ═══════════════ -->
    <div class="exam-page" *ngIf="testStarted && !testCompleted && currentTest">

      <!-- Top bar -->
      <div class="exam-topbar">
        <div class="exam-topbar-left">
          <div class="exam-skill-badge" [style.background]="getSkillColor(currentTest.skill || '').bg">
            <app-icon name="cpu" [size]="14" [color]="getSkillColor(currentTest.skill || '').color"></app-icon>
            <span [style.color]="getSkillColor(currentTest.skill || '').color">{{ currentTest.skill }}</span>
          </div>
          <span class="exam-qcount">Question {{ currentIndex + 1 }} / {{ currentTest.questions.length }}</span>
        </div>
        <div class="exam-timer" [class.warn]="timeLeft < 300" [class.danger]="timeLeft < 60">
          <app-icon name="clock" [size]="16" color="currentColor"></app-icon>
          {{ formatTime(timeLeft) }}
        </div>
      </div>

      <!-- Progress bar -->
      <div class="exam-progress-wrap">
        <div class="exam-progress-fill" [style.width.%]="((currentIndex + 1) / currentTest.questions.length) * 100"></div>
      </div>

      <div class="exam-body">

        <!-- Question panel -->
        <div class="exam-main">
          <div class="q-difficulty">
            <span class="diff-badge" [class]="'diff-' + currentQuestion.difficulty?.toLowerCase()">
              {{ currentQuestion.difficulty }}
            </span>
            <span class="q-num">Q{{ currentIndex + 1 }}</span>
          </div>

          <div class="q-text">{{ currentQuestion.question }}</div>

          <div class="options">
            <div class="option" *ngFor="let opt of getOptions()"
                 [class.selected]="answers[currentQuestion.id] === opt.key"
                 (click)="answers[currentQuestion.id] = opt.key">
              <div class="opt-key" [class.sel-key]="answers[currentQuestion.id] === opt.key">
                {{ opt.key }}
              </div>
              <div class="opt-text">{{ opt.value }}</div>
              <div class="opt-check" *ngIf="answers[currentQuestion.id] === opt.key">
                <app-icon name="check-circle" [size]="18" color="#6366f1"></app-icon>
              </div>
            </div>
          </div>

          <!-- Nav buttons -->
          <div class="exam-nav">
            <button class="nav-btn prev" (click)="prevQuestion()" [disabled]="currentIndex === 0">
              <app-icon name="arrow-right" [size]="16" color="currentColor" style="transform:rotate(180deg)"></app-icon>
              Previous
            </button>
            <button class="nav-btn next" *ngIf="currentIndex < currentTest.questions.length - 1" (click)="nextQuestion()">
              Next
              <app-icon name="arrow-right" [size]="16" color="currentColor"></app-icon>
            </button>
            <button class="nav-btn submit" *ngIf="currentIndex === currentTest.questions.length - 1"
                    (click)="submitTest()" [disabled]="loading">
              <span *ngIf="!loading" style="display:flex;align-items:center;gap:6px">
                <app-icon name="check-circle" [size]="16" color="#fff"></app-icon>
                Submit Test
              </span>
              <span *ngIf="loading" style="display:flex;align-items:center;gap:6px">
                <div class="spin-sm"></div> Submitting...
              </span>
            </button>
          </div>
        </div>

        <!-- Side panel: question navigator -->
        <div class="exam-sidebar">
          <div class="sidebar-title">
            <app-icon name="bar-chart-2" [size]="14" color="#6366f1"></app-icon>
            Question Navigator
          </div>
          <div class="answered-stat">
            <span class="stat-num answered-num">{{ answeredCount }}</span>
            <span class="stat-lbl">Answered</span>
            <span class="stat-sep"></span>
            <span class="stat-num unanswered-num">{{ currentTest.questions.length - answeredCount }}</span>
            <span class="stat-lbl">Remaining</span>
          </div>
          <div class="q-grid">
            <button class="q-dot"
                    *ngFor="let q of currentTest.questions; let i = index"
                    [class.q-answered]="answers[q.id]"
                    [class.q-current]="i === currentIndex"
                    (click)="goToQuestion(i)">
              {{ i + 1 }}
            </button>
          </div>
          <div class="q-legend">
            <div class="legend-item"><div class="legend-dot answered-dot"></div> Answered</div>
            <div class="legend-item"><div class="legend-dot current-dot"></div> Current</div>
            <div class="legend-item"><div class="legend-dot empty-dot"></div> Not visited</div>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══════════════ RESULT ═══════════════ -->
    <div class="result-page" *ngIf="testCompleted && testResult">
      <div class="result-card">
        <div class="result-top" [class.passed-top]="testResult.status === 'PASSED'" [class.failed-top]="testResult.status !== 'PASSED'">
          <div class="result-icon-wrap">
            <app-icon [name]="testResult.status === 'PASSED' ? 'award' : 'x-circle'" [size]="48"
                      [color]="testResult.status === 'PASSED' ? '#22c55e' : '#ef4444'"></app-icon>
          </div>
          <h2 [class.passed-text]="testResult.status === 'PASSED'" [class.failed-text]="testResult.status !== 'PASSED'">
            {{ testResult.status === 'PASSED' ? 'Congratulations!' : 'Better Luck Next Time' }}
          </h2>
          <p>{{ testResult.status === 'PASSED' ? 'You passed the assessment!' : 'You did not meet the passing criteria.' }}</p>
        </div>

        <div class="result-stats">
          <div class="r-stat">
            <div class="r-stat-val" [style.color]="testResult.status === 'PASSED' ? '#22c55e' : '#ef4444'">
              {{ testResult.score }}%
            </div>
            <div class="r-stat-lbl">Score</div>
          </div>
          <div class="r-divider"></div>
          <div class="r-stat">
            <div class="r-stat-val" style="color:#6366f1">{{ testResult.correctAnswers }}</div>
            <div class="r-stat-lbl">Correct</div>
          </div>
          <div class="r-divider"></div>
          <div class="r-stat">
            <div class="r-stat-val" style="color:#f59e0b">{{ testResult.totalQuestions }}</div>
            <div class="r-stat-lbl">Total</div>
          </div>
        </div>

        <!-- Score ring -->
        <div class="score-ring-wrap">
          <svg viewBox="0 0 120 120" class="score-ring">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" stroke-width="10"/>
            <circle cx="60" cy="60" r="50" fill="none"
                    [attr.stroke]="testResult.status === 'PASSED' ? '#22c55e' : '#ef4444'"
                    stroke-width="10" stroke-linecap="round"
                    [attr.stroke-dasharray]="314"
                    [attr.stroke-dashoffset]="314 - (314 * testResult.score / 100)"
                    transform="rotate(-90 60 60)"/>
            <text x="60" y="55" text-anchor="middle" font-size="22" font-weight="800"
                  [attr.fill]="testResult.status === 'PASSED' ? '#22c55e' : '#ef4444'">
              {{ testResult.score }}%
            </text>
            <text x="60" y="74" text-anchor="middle" font-size="11" fill="#94a3b8">Score</text>
          </svg>
        </div>

        <div class="result-skill-row">
          <app-icon name="cpu" [size]="16" [color]="getSkillColor(testResult.skill).color"></app-icon>
          <span>Skill: <strong>{{ testResult.skill }}</strong></span>
          <span class="result-status-badge" [class.pass-badge]="testResult.status === 'PASSED'" [class.fail-badge]="testResult.status !== 'PASSED'">
            {{ testResult.status }}
          </span>
        </div>

        <div class="result-pass-info" *ngIf="testResult.status !== 'PASSED'">
          <app-icon name="info" [size]="14" color="#6366f1"></app-icon>
          Passing score is 60%. You scored {{ testResult.score }}%.
        </div>

        <!-- Retry info for failed test -->
        <div class="retry-info" *ngIf="testResult.status !== 'PASSED' && testResult.remainingAttempts > 0">
          <app-icon name="refresh-cw" [size]="14" color="#d97706"></app-icon>
          <span>You have <strong>{{ testResult.remainingAttempts }}</strong> attempt{{ testResult.remainingAttempts > 1 ? 's' : '' }} remaining for this skill.</span>
        </div>

        <!-- Limit reached message -->
        <div class="limit-reached-info" *ngIf="testResult.status !== 'PASSED' && testResult.remainingAttempts === 0">
          <app-icon name="x-circle" [size]="14" color="#dc2626"></app-icon>
          <span>You have reached your test limit (3/3). You cannot retake this test.</span>
        </div>

        <!-- Retry button -->
        <button class="btn-retry" *ngIf="testResult.status !== 'PASSED' && testResult.remainingAttempts > 0"
                (click)="retryTest()">
          <app-icon name="refresh-cw" [size]="16" color="#fff"></app-icon>
          Retry Test
        </button>

        <button class="btn-back-dash" (click)="goBack()">
          <app-icon name="arrow-right" [size]="16" color="#fff" style="transform:rotate(180deg)"></app-icon>
          Back to Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host { font-family: 'Inter', 'Segoe UI', sans-serif; display: block; }

    /* ── SELECTION PAGE ── */
    .page { min-height: 100vh; background: #f8fafc; }

    .sel-hero {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%);
      padding: 48px 24px 56px; text-align: center;
      clip-path: ellipse(100% 85% at 50% 0%);
    }
    .sel-hero-icon {
      width: 72px; height: 72px; border-radius: 20px;
      background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px; border: 1px solid rgba(255,255,255,0.2);
    }
    .sel-hero h1 { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .sel-hero p  { font-size: 15px; color: rgba(255,255,255,0.75); }

    .sel-body { max-width: 760px; margin: -24px auto 0; padding: 0 20px 40px; }

    .sel-loading { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 60px; color: #94a3b8; font-size: 14px; }
    .spin-lg {
      width: 36px; height: 36px; border-radius: 50%;
      border: 3px solid #e2e8f0; border-top-color: #6366f1;
      animation: spin 0.8s linear infinite;
    }

    .sel-empty { text-align: center; padding: 48px 24px; background: #fff; border-radius: 20px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
    .sel-empty-icon { width: 72px; height: 72px; border-radius: 50%; background: #f0fdf4; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .sel-empty h3 { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
    .sel-empty p  { font-size: 14px; color: #64748b; margin-bottom: 24px; }

    .sel-info-banner {
      display: flex; align-items: center; gap: 10px;
      background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px;
      padding: 12px 16px; font-size: 13px; color: #92400e; margin-bottom: 20px;
    }

    .test-cards { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .test-card {
      display: flex; align-items: center; gap: 16px;
      background: #fff; border-radius: 16px; padding: 18px 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      cursor: pointer; transition: all 0.2s;
      border: 1.5px solid transparent;
    }
    .test-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.15); border-color: #6366f1; }
    .test-card-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .test-card-info { flex: 1; }
    .test-card-name { font-size: 17px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
    .test-card-meta { font-size: 12px; color: #94a3b8; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .attempt-badge { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #fef3c7; color: #92400e; }
    .test-card-levels { display: flex; gap: 6px; }
    .lvl { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .easy     { background: #dcfce7; color: #166534; }
    .moderate { background: #fef3c7; color: #92400e; }
    .hard     { background: #fce7f3; color: #9d174d; }
    .test-card-arrow { width: 36px; height: 36px; border-radius: 50%; background: #eef2ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    .sel-rules { background: #fff; border-radius: 16px; padding: 18px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .rule-title { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .rule-list { display: flex; flex-direction: column; gap: 8px; }
    .rule-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #475569; }
    .rule-dot { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; flex-shrink: 0; }

    /* ── EXAM PAGE ── */
    .exam-page { min-height: 100vh; background: #f8fafc; display: flex; flex-direction: column; }

    .exam-topbar {
      display: flex; align-items: center; justify-content: space-between;
      background: #fff; padding: 12px 24px;
      box-shadow: 0 1px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 10;
    }
    .exam-topbar-left { display: flex; align-items: center; gap: 14px; }
    .exam-skill-badge {
      display: flex; align-items: center; gap: 6px;
      padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;
    }
    .exam-qcount { font-size: 13px; color: #64748b; font-weight: 600; }
    .exam-timer {
      display: flex; align-items: center; gap: 7px;
      font-size: 18px; font-weight: 800; color: #1e293b;
      background: #f1f5f9; padding: 7px 16px; border-radius: 10px;
      transition: all 0.3s;
    }
    .exam-timer.warn   { background: #fef3c7; color: #d97706; }
    .exam-timer.danger { background: #fee2e2; color: #dc2626; animation: pulse 1s infinite; }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }

    .exam-progress-wrap { height: 4px; background: #e2e8f0; }
    .exam-progress-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); transition: width 0.3s; }

    .exam-body {
      display: grid; grid-template-columns: 1fr 260px; gap: 20px;
      padding: 24px; max-width: 1100px; margin: 0 auto; width: 100%; flex: 1;
    }
    @media (max-width: 800px) { .exam-body { grid-template-columns: 1fr; } }

    /* Question panel */
    .exam-main { background: #fff; border-radius: 20px; padding: 28px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }

    .q-difficulty { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
    .diff-badge { padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .diff-easy     { background: #dcfce7; color: #166534; }
    .diff-moderate { background: #fef3c7; color: #92400e; }
    .diff-advanced { background: #fce7f3; color: #9d174d; }
    .q-num { font-size: 12px; font-weight: 700; color: #94a3b8; margin-left: auto; }

    .q-text { font-size: 17px; font-weight: 600; color: #1e293b; line-height: 1.65; margin-bottom: 28px; }

    .options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
    .option {
      display: flex; align-items: center; gap: 14px;
      border: 2px solid #e2e8f0; border-radius: 14px; padding: 14px 16px;
      cursor: pointer; transition: all 0.18s; background: #f8fafc;
    }
    .option:hover { border-color: #a5b4fc; background: #eef2ff; }
    .option.selected { border-color: #6366f1; background: #eef2ff; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
    .opt-key {
      width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
      background: #e2e8f0; display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 800; color: #64748b; transition: all 0.18s;
    }
    .opt-key.sel-key { background: #6366f1; color: #fff; }
    .opt-text { flex: 1; font-size: 14px; color: #374151; line-height: 1.5; }
    .opt-check { margin-left: auto; flex-shrink: 0; }

    .exam-nav { display: flex; align-items: center; gap: 10px; }
    .nav-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 11px 22px; border-radius: 12px; border: none;
      font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .nav-btn.prev { background: #f1f5f9; color: #475569; margin-right: auto; }
    .nav-btn.prev:hover:not(:disabled) { background: #e2e8f0; }
    .nav-btn.prev:disabled { opacity: 0.4; cursor: not-allowed; }
    .nav-btn.next { background: #eef2ff; color: #6366f1; margin-left: auto; }
    .nav-btn.next:hover { background: #e0e7ff; }
    .nav-btn.submit { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; margin-left: auto; box-shadow: 0 4px 14px rgba(79,70,229,0.35); }
    .nav-btn.submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,70,229,0.45); }
    .nav-btn.submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .spin-sm { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; animation: spin 0.7s linear infinite; }

    /* Sidebar */
    .exam-sidebar { background: #fff; border-radius: 20px; padding: 20px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); align-self: start; position: sticky; top: 80px; }
    .sidebar-title { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }

    .answered-stat { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; padding: 10px 12px; background: #f8fafc; border-radius: 10px; }
    .stat-num { font-size: 20px; font-weight: 800; }
    .answered-num { color: #6366f1; }
    .unanswered-num { color: #94a3b8; }
    .stat-lbl { font-size: 11px; color: #94a3b8; font-weight: 600; }
    .stat-sep { width: 1px; height: 24px; background: #e2e8f0; margin: 0 4px; }

    .q-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 14px; }
    .q-dot {
      width: 100%; aspect-ratio: 1; border-radius: 8px; border: none;
      background: #f1f5f9; color: #64748b; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.15s;
    }
    .q-dot:hover { background: #e0e7ff; color: #6366f1; }
    .q-dot.q-answered { background: #eef2ff; color: #6366f1; }
    .q-dot.q-current  { background: #6366f1; color: #fff; box-shadow: 0 2px 8px rgba(99,102,241,0.4); }

    .q-legend { display: flex; flex-direction: column; gap: 6px; }
    .legend-item { display: flex; align-items: center; gap: 7px; font-size: 11.5px; color: #64748b; }
    .legend-dot { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; }
    .answered-dot { background: #eef2ff; border: 1.5px solid #6366f1; }
    .current-dot  { background: #6366f1; }
    .empty-dot    { background: #f1f5f9; border: 1.5px solid #e2e8f0; }

    /* ── RESULT PAGE ── */
    .result-page { min-height: 100vh; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .result-card { background: #fff; border-radius: 24px; padding: 0; max-width: 460px; width: 100%; box-shadow: 0 8px 40px rgba(0,0,0,0.12); overflow: hidden; }

    .result-top { padding: 36px 32px 28px; text-align: center; }
    .passed-top { background: linear-gradient(135deg, #f0fdf4, #dcfce7); }
    .failed-top { background: linear-gradient(135deg, #fff5f5, #fee2e2); }
    .result-icon-wrap { width: 80px; height: 80px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .result-top h2 { font-size: 24px; font-weight: 800; margin-bottom: 6px; }
    .passed-text { color: #166534; }
    .failed-text { color: #991b1b; }
    .result-top p { font-size: 14px; color: #64748b; }

    .result-stats { display: flex; align-items: center; justify-content: center; gap: 0; padding: 20px 32px; border-bottom: 1px solid #f1f5f9; }
    .r-stat { flex: 1; text-align: center; }
    .r-stat-val { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
    .r-stat-lbl { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .r-divider { width: 1px; height: 40px; background: #f1f5f9; }

    .score-ring-wrap { display: flex; justify-content: center; padding: 20px 0 8px; }
    .score-ring { width: 120px; height: 120px; }

    .result-skill-row { display: flex; align-items: center; gap: 8px; padding: 12px 32px; font-size: 14px; color: #374151; }
    .result-status-badge { margin-left: auto; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .pass-badge { background: #dcfce7; color: #166534; }
    .fail-badge { background: #fee2e2; color: #991b1b; }

    .result-pass-info { display: flex; align-items: center; gap: 8px; margin: 0 32px 4px; padding: 10px 14px; background: #eef2ff; border-radius: 10px; font-size: 12.5px; color: #4338ca; }

    .btn-back-dash {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: calc(100% - 64px); margin: 16px 32px 28px;
      padding: 13px; border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; border: none; font-size: 15px; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-back-dash:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,70,229,0.35); }

    .btn-back {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px; border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; border: none; font-size: 14px; font-weight: 700; cursor: pointer;
    }

    /* Limit reached card */
    .limit-card { cursor: not-allowed; opacity: 0.85; border-color: #fecaca !important; background: #fff5f5 !important; }
    .limit-card:hover { transform: none !important; box-shadow: 0 2px 12px rgba(0,0,0,0.06) !important; border-color: #fecaca !important; }
    .limit-msg { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #dc2626; font-weight: 600; margin-top: 4px; }

    /* Retry info */
    .retry-info {
      display: flex; align-items: center; gap: 8px;
      margin: 0 32px 4px; padding: 10px 14px;
      background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
      font-size: 12.5px; color: #92400e;
    }
    .limit-reached-info {
      display: flex; align-items: center; gap: 8px;
      margin: 0 32px 4px; padding: 10px 14px;
      background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px;
      font-size: 12.5px; color: #991b1b;
    }
    .btn-retry {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: calc(100% - 64px); margin: 12px 32px 0;
      padding: 13px; border-radius: 12px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff; border: none; font-size: 15px; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-retry:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.35); }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class McqTestComponent implements OnInit, OnDestroy {
  pendingTests: any[] = [];
  limitReachedSkills: string[] = [];
  currentTest: any = null;
  testStarted = false;
  testCompleted = false;
  testResult: any = null;
  currentIndex = 0;
  answers: { [key: number]: string } = {};
  loading = false;
  timeLeft = 30 * 60;
  private timer: any;

  get currentQuestion() { return this.currentTest?.questions[this.currentIndex]; }
  get answeredCount()   { return Object.keys(this.answers).length; }

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.loadPendingTests(); }
  ngOnDestroy(): void { if (this.timer) clearInterval(this.timer); }

  loadPendingTests(): void {
    this.loading = true;
    this.employeeService.getProfile().subscribe({
      next: (profile) => {
        this.loading = false;
        if (profile?.mcqTests) {
          // Group tests by skill
          const bySkill: { [skill: string]: any[] } = {};
          for (const t of profile.mcqTests) {
            if (!bySkill[t.skill]) bySkill[t.skill] = [];
            bySkill[t.skill].push(t);
          }

          this.pendingTests = [];
          this.limitReachedSkills = [];

          for (const skill of Object.keys(bySkill)) {
            const tests = bySkill[skill];
            const hasPending = tests.some((t: any) => t.status === 'PENDING');
            const failedCount = tests.filter((t: any) => t.status === 'FAILED').length;
            const hasPassed = tests.some((t: any) => t.status === 'PASSED');

            if (hasPassed) continue;

            if (hasPending) {
              // Normal pending test
              this.pendingTests.push(tests.find((t: any) => t.status === 'PENDING'));
            } else if (failedCount > 0 && failedCount < 3) {
              // Failed before but retry PENDING record is missing (legacy data or first-time fail)
              // Backend generateTest() will auto-create the PENDING record when clicked
              this.pendingTests.push({ skill, status: 'PENDING', attemptNumber: failedCount + 1 });
            } else if (failedCount >= 3) {
              this.limitReachedSkills.push(skill);
            }
          }
        }
      },
      error: () => {
        this.loading = false;
        this.toast.error('Could not load profile. Please login again.');
        this.router.navigate(['/login']);
      }
    });
  }

  startTest(skill: string): void {
    this.loading = true;
    this.employeeService.generateTest(skill).subscribe({
      next: (test) => {
        this.loading = false;
        this.currentTest = test;
        this.testStarted = true;
        this.timeLeft = 30 * 60;
        this.startTimer();
      },
      error: (err) => {
        this.loading = false;
        const msg: string = err.error || err.message || '';
        if (msg.includes('ATTEMPT_LIMIT_REACHED')) {
          const skill = msg.split(':')[1] || '';
          if (skill && !this.limitReachedSkills.includes(skill)) {
            this.limitReachedSkills.push(skill);
          }
          this.pendingTests = this.pendingTests.filter(t => t.skill !== skill);
          this.toast.error('You have reached the test limit (3/3) for ' + (skill || 'this skill') + '.');
        } else {
          this.toast.error('Error loading test: ' + msg);
        }
      }
    });
  }

  retryTest(): void {
    const skill = this.testResult?.skill;
    if (!skill) return;
    // Reset state and go back to selection — the new PENDING test was created by backend
    this.testCompleted = false;
    this.testResult = null;
    this.testStarted = false;
    this.currentTest = null;
    this.answers = {};
    this.currentIndex = 0;
    this.loadPendingTests();
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) { clearInterval(this.timer); this.submitTest(); }
    }, 1000);
  }

  formatTime(s: number): string {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  getOptions(): { key: string; value: string }[] {
    if (!this.currentQuestion) return [];
    return [
      { key: 'A', value: this.currentQuestion.optionA },
      { key: 'B', value: this.currentQuestion.optionB },
      { key: 'C', value: this.currentQuestion.optionC },
      { key: 'D', value: this.currentQuestion.optionD },
    ];
  }

  getSkillColor(skill: string): { color: string; bg: string } {
    const map: any = {
      'JAVA':   { color: '#dc2626', bg: '#fee2e2' },
      'PYTHON': { color: '#16a34a', bg: '#dcfce7' },
      'AI_ML':  { color: '#7c3aed', bg: '#ede9fe' },
      'AI/ML':  { color: '#7c3aed', bg: '#ede9fe' },
      'DOTNET': { color: '#2563eb', bg: '#dbeafe' },
      '.NET':   { color: '#2563eb', bg: '#dbeafe' },
    };
    return map[skill?.toUpperCase()] ?? { color: '#6366f1', bg: '#eef2ff' };
  }

  nextQuestion(): void { if (this.currentIndex < this.currentTest.questions.length - 1) this.currentIndex++; }
  prevQuestion(): void { if (this.currentIndex > 0) this.currentIndex--; }
  goToQuestion(i: number): void { this.currentIndex = i; }

  submitTest(): void {
    if (this.timer) clearInterval(this.timer);
    this.loading = true;
    this.employeeService.submitTest({ testId: this.currentTest.testId, answers: this.answers }).subscribe({
      next: (result) => { this.loading = false; this.testResult = result; this.testCompleted = true; },
      error: () => { this.loading = false; this.toast.error('Error submitting test.'); }
    });
  }

  goBack(): void { this.router.navigate(['/employee']); }
}
