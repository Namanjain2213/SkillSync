import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-mcq-test',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatRadioModule,
    MatToolbarModule, MatIconModule, MatProgressBarModule,
    MatSnackBarModule, MatSelectModule, MatFormFieldModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="goBack()"><mat-icon>arrow_back</mat-icon></button>
      <span>MCQ Test</span>
      <span class="spacer"></span>
      <span *ngIf="testStarted" class="timer" [class.timer-warning]="timeLeft < 300">
        <mat-icon>timer</mat-icon> {{formatTime(timeLeft)}}
      </span>
    </mat-toolbar>

    <!-- Skill Selection -->
    <div class="container" *ngIf="!testStarted && !testCompleted">
      <mat-card class="skill-card">
        <mat-card-header>
          <mat-card-title>Select Skill for MCQ Test</mat-card-title>
          <mat-card-subtitle>Choose a skill to start your mandatory test</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="pending-tests" *ngIf="pendingTests.length > 0">
            <h3>Your Pending Tests:</h3>
            <div class="test-buttons">
              <button mat-raised-button color="primary"
                *ngFor="let test of pendingTests"
                (click)="startTest(test.skill)"
                [disabled]="loading">
                <mat-icon>quiz</mat-icon>
                {{test.skill}} Test
              </button>
            </div>
          </div>
          <div *ngIf="pendingTests.length === 0 && !loading" class="no-tests">
            <mat-icon color="primary">check_circle</mat-icon>
            <p>No pending tests. All tests completed!</p>
            <button mat-raised-button color="primary" (click)="goBack()">Back to Dashboard</button>
          </div>
          <div *ngIf="loading" class="loading">Loading...</div>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- Test In Progress -->
    <div class="container" *ngIf="testStarted && !testCompleted && currentTest">
      <div class="test-header">
        <span>Question {{currentIndex + 1}} of {{currentTest.questions.length}}</span>
        <mat-progress-bar mode="determinate"
          [value]="((currentIndex + 1) / currentTest.questions.length) * 100">
        </mat-progress-bar>
      </div>

      <mat-card class="question-card">
        <mat-card-header>
          <mat-card-title>
            <span class="difficulty-badge" [class]="'diff-' + currentQuestion.difficulty.toLowerCase()">
              {{currentQuestion.difficulty}}
            </span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="question-text">{{currentIndex + 1}}. {{currentQuestion.question}}</p>
          <mat-radio-group [(ngModel)]="answers[currentQuestion.id]" class="options-group">
            <mat-radio-button value="A" class="option">A. {{currentQuestion.optionA}}</mat-radio-button>
            <mat-radio-button value="B" class="option">B. {{currentQuestion.optionB}}</mat-radio-button>
            <mat-radio-button value="C" class="option">C. {{currentQuestion.optionC}}</mat-radio-button>
            <mat-radio-button value="D" class="option">D. {{currentQuestion.optionD}}</mat-radio-button>
          </mat-radio-group>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button (click)="prevQuestion()" [disabled]="currentIndex === 0">Previous</button>
          <span class="spacer"></span>
          <button mat-raised-button color="primary"
            *ngIf="currentIndex < currentTest.questions.length - 1"
            (click)="nextQuestion()">Next</button>
          <button mat-raised-button color="accent"
            *ngIf="currentIndex === currentTest.questions.length - 1"
            (click)="submitTest()" [disabled]="loading">
            {{loading ? 'Submitting...' : 'Submit Test'}}
          </button>
        </mat-card-actions>
      </mat-card>

      <div class="question-nav">
        <button mat-mini-fab *ngFor="let q of currentTest.questions; let i = index"
          [color]="answers[q.id] ? 'primary' : 'basic'"
          (click)="goToQuestion(i)"
          [class.current]="i === currentIndex">
          {{i + 1}}
        </button>
      </div>
    </div>

    <!-- Test Result -->
    <div class="container" *ngIf="testCompleted && testResult">
      <mat-card class="result-card">
        <mat-card-header>
          <mat-card-title>Test Completed!</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="result-content">
            <mat-icon class="result-icon" [color]="testResult.status === 'PASSED' ? 'primary' : 'warn'">
              {{testResult.status === 'PASSED' ? 'emoji_events' : 'sentiment_dissatisfied'}}
            </mat-icon>
            <h2 [class]="testResult.status === 'PASSED' ? 'passed' : 'failed'">
              {{testResult.status}}
            </h2>
            <div class="score-details">
              <p>Skill: <strong>{{testResult.skill}}</strong></p>
              <p>Score: <strong>{{testResult.score}}%</strong></p>
              <p>Correct Answers: <strong>{{testResult.correctAnswers}} / {{testResult.totalQuestions}}</strong></p>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goBack()">Back to Dashboard</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .container { padding: 24px; background: #f5f5f5; min-height: calc(100vh - 64px); }
    .skill-card, .question-card, .result-card { max-width: 800px; margin: 0 auto; }
    .test-buttons { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; }
    .no-tests { text-align: center; padding: 32px; }
    .no-tests mat-icon { font-size: 64px; width: 64px; height: 64px; }
    .loading { text-align: center; padding: 32px; }
    .test-header { max-width: 800px; margin: 0 auto 16px; }
    .test-header span { display: block; margin-bottom: 8px; font-weight: 500; }
    .question-text { font-size: 16px; line-height: 1.6; margin: 16px 0; font-weight: 500; }
    .options-group { display: flex; flex-direction: column; gap: 12px; }
    .option { padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; }
    .option:hover { background: #f5f5f5; }
    .difficulty-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .diff-easy { background: #e8f5e9; color: #2e7d32; }
    .diff-moderate { background: #fff3e0; color: #e65100; }
    .diff-advanced { background: #fce4ec; color: #880e4f; }
    .question-nav { display: flex; flex-wrap: wrap; gap: 8px; max-width: 800px; margin: 16px auto 0; }
    .question-nav button.current { outline: 3px solid #1976d2; }
    .timer { display: flex; align-items: center; gap: 4px; font-size: 18px; font-weight: 600; }
    .timer-warning { color: #ff5722; }
    .result-content { text-align: center; padding: 24px; }
    .result-icon { font-size: 80px; width: 80px; height: 80px; }
    .score-details { margin-top: 16px; font-size: 16px; }
    .score-details p { margin: 8px 0; }
    .passed { color: #2e7d32; }
    .failed { color: #c62828; }
    mat-card-actions { display: flex; padding: 16px; }
  `]
})
export class McqTestComponent implements OnInit, OnDestroy {
  pendingTests: any[] = [];
  currentTest: any = null;
  testStarted = false;
  testCompleted = false;
  testResult: any = null;
  currentIndex = 0;
  answers: { [key: number]: string } = {};
  loading = false;
  timeLeft = 30 * 60; // 30 minutes
  private timer: any;

  get currentQuestion() {
    return this.currentTest?.questions[this.currentIndex];
  }

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingTests();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  loadPendingTests(): void {
    this.loading = true;
    this.employeeService.getProfile().subscribe({
      next: (profile) => {
        this.loading = false;
        if (profile?.mcqTests) {
          this.pendingTests = profile.mcqTests.filter((t: any) => t.status === 'PENDING');
        }
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Could not load profile. Please login again.', 'Close', { duration: 3000 });
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
        this.startTimer();
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Error loading test: ' + (err.error || err.message), 'Close', { duration: 4000 });
      }
    });
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.submitTest();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  nextQuestion(): void {
    if (this.currentIndex < this.currentTest.questions.length - 1) this.currentIndex++;
  }

  prevQuestion(): void {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  goToQuestion(i: number): void {
    this.currentIndex = i;
  }

  submitTest(): void {
    if (this.timer) clearInterval(this.timer);
    this.loading = true;
    const submission = { testId: this.currentTest.testId, answers: this.answers };
    this.employeeService.submitTest(submission).subscribe({
      next: (result) => {
        this.loading = false;
        this.testResult = result;
        this.testCompleted = true;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Error submitting test.', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/employee']);
  }
}
