import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { IconComponent } from '../../shared/icon.component';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  template: `
    <div class="page">

      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <app-icon name="user" [size]="28" color="#fff"></app-icon>
        </div>
        <div>
          <h1>Create Your Profile</h1>
          <p>Fill in your details to get started</p>
        </div>
      </div>

      <div class="form-layout">

        <!-- LEFT: Form -->
        <div class="form-card">

          <!-- Step indicator -->
          <div class="steps">
            <div class="step" [class.active]="true" [class.done]="true">
              <div class="step-dot"><app-icon name="user" [size]="12" color="#fff"></app-icon></div>
              <span>Personal</span>
            </div>
            <div class="step-line"></div>
            <div class="step" [class.active]="true" [class.done]="form.get('highestQualification')?.valid">
              <div class="step-dot"><app-icon name="award" [size]="12" color="#fff"></app-icon></div>
              <span>Education</span>
            </div>
            <div class="step-line"></div>
            <div class="step" [class.active]="skills.length > 0">
              <div class="step-dot"><app-icon name="cpu" [size]="12" color="#fff"></app-icon></div>
              <span>Skills</span>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <!-- ── PERSONAL INFO ── -->
            <div class="section-label">
              <app-icon name="user" [size]="14" color="#6366f1"></app-icon>
              Personal Information
            </div>

            <!-- Name -->
            <div class="field">
              <label>Full Name <span class="req">*</span></label>
              <div class="input-box" [class.focused]="nameFocus" [class.error]="showErr('name')" [class.success]="form.get('name')?.valid && form.get('name')?.touched">
                <app-icon name="user" [size]="15" [color]="showErr('name') ? '#ef4444' : nameFocus ? '#6366f1' : '#9ca3af'"></app-icon>
                <input formControlName="name" placeholder="e.g. Rahul Sharma"
                       (keydown)="blockNonAlpha($event)"
                       (focus)="nameFocus=true" (blur)="nameFocus=false">
                <app-icon *ngIf="form.get('name')?.valid && form.get('name')?.touched" name="check-circle" [size]="15" color="#22c55e"></app-icon>
              </div>
              <div class="err-row" *ngIf="showErr('name')">
                <app-icon name="x-circle" [size]="12" color="#ef4444"></app-icon>
                <span *ngIf="form.get('name')?.hasError('required')">Full name is required</span>
                <span *ngIf="form.get('name')?.hasError('minlength')">Minimum 2 characters required</span>
                <span *ngIf="form.get('name')?.hasError('pattern')">Only alphabets and spaces are allowed</span>
              </div>
            </div>

            <!-- Email -->
            <div class="field">
              <label>Email Address <span class="req">*</span></label>
              <div class="input-box" [class.focused]="emailFocus" [class.error]="showErr('email')" [class.success]="form.get('email')?.valid && form.get('email')?.touched">
                <app-icon name="info" [size]="15" [color]="showErr('email') ? '#ef4444' : emailFocus ? '#6366f1' : '#9ca3af'"></app-icon>
                <input formControlName="email" type="email" placeholder="e.g. rahul@example.com"
                       (focus)="emailFocus=true" (blur)="emailFocus=false">
                <app-icon *ngIf="form.get('email')?.valid && form.get('email')?.touched" name="check-circle" [size]="15" color="#22c55e"></app-icon>
              </div>
              <div class="err-row" *ngIf="showErr('email')">
                <app-icon name="x-circle" [size]="12" color="#ef4444"></app-icon>
                <span *ngIf="form.get('email')?.hasError('required')">Email is required</span>
                <span *ngIf="form.get('email')?.hasError('pattern')">Enter a valid email with domain (e.g. user&#64;example.com)</span>
              </div>
            </div>

            <!-- Contact -->
            <div class="field">
              <label>Mobile Number <span class="req">*</span></label>
              <div class="input-box" [class.focused]="phoneFocus" [class.error]="showErr('contactNo')" [class.success]="form.get('contactNo')?.valid && form.get('contactNo')?.touched">
                <span class="prefix">+91</span>
                <div class="divider-v"></div>
                <input formControlName="contactNo" placeholder="9XXXXXXXXX" maxlength="10"
                       (keydown)="blockNonDigit($event)"
                       (focus)="phoneFocus=true" (blur)="phoneFocus=false">
                <app-icon *ngIf="form.get('contactNo')?.valid && form.get('contactNo')?.touched" name="check-circle" [size]="15" color="#22c55e"></app-icon>
              </div>
              <div class="err-row" *ngIf="showErr('contactNo')">
                <app-icon name="x-circle" [size]="12" color="#ef4444"></app-icon>
                <span *ngIf="form.get('contactNo')?.hasError('required')">Mobile number is required</span>
                <span *ngIf="form.get('contactNo')?.hasError('pattern') && form.get('contactNo')?.value?.length === 10">Number must start with 6, 7, 8 or 9</span>
                <span *ngIf="form.get('contactNo')?.hasError('pattern') && form.get('contactNo')?.value?.length !== 10">Enter a valid 10-digit mobile number</span>
              </div>
            </div>

            <!-- Address -->
            <div class="field">
              <label>Address <span class="req">*</span></label>
              <div class="input-box textarea-box" [class.focused]="addrFocus" [class.error]="showErr('address')" [class.success]="form.get('address')?.valid && form.get('address')?.touched">
                <textarea formControlName="address" placeholder="Enter your full address" rows="3"
                          (focus)="addrFocus=true" (blur)="addrFocus=false"></textarea>
              </div>
              <div class="err-row" *ngIf="showErr('address')">
                <app-icon name="x-circle" [size]="12" color="#ef4444"></app-icon>
                <span>Address is required (min 5 characters)</span>
              </div>
            </div>

            <!-- ── EDUCATION ── -->
            <div class="section-label" style="margin-top:8px">
              <app-icon name="award" [size]="14" color="#6366f1"></app-icon>
              Education
            </div>

            <div class="field">
              <label>Highest Qualification <span class="req">*</span></label>
              <div class="select-box" [class.error]="showErr('highestQualification')">
                <app-icon name="award" [size]="15" color="#9ca3af"></app-icon>
                <select formControlName="highestQualification">
                  <option value="" disabled>Select qualification</option>
                  <option value="High School">High School</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Certificate">Certificate</option>
                </select>
                <app-icon name="chevron-right" [size]="14" color="#9ca3af" style="transform:rotate(90deg)"></app-icon>
              </div>
              <div class="err-row" *ngIf="showErr('highestQualification')">
                <app-icon name="x-circle" [size]="12" color="#ef4444"></app-icon>
                <span>Please select your qualification</span>
              </div>
            </div>

            <!-- ── SKILLS ── -->
            <div class="section-label" style="margin-top:8px">
              <app-icon name="cpu" [size]="14" color="#6366f1"></app-icon>
              Skills <span class="req">*</span>
            </div>

            <!-- Quick add chips -->
            <div class="quick-skills">
              <button type="button" class="skill-chip"
                      *ngFor="let s of predefinedSkills"
                      [class.added]="skills.includes(s)"
                      (click)="toggleSkill(s)">
                <app-icon [name]="skills.includes(s) ? 'check-circle' : 'plus-circle'" [size]="12"
                          [color]="skills.includes(s) ? '#6366f1' : '#9ca3af'"></app-icon>
                {{ s }}
              </button>
            </div>

            <!-- Custom skill input -->
            <div class="custom-skill-row">
              <div class="input-box" style="flex:1" [class.focused]="skillFocus">
                <app-icon name="cpu" [size]="15" color="#9ca3af"></app-icon>
                <input #skillInput placeholder="Add custom skill..."
                       (keydown.enter)="addCustomSkill(skillInput.value); skillInput.value=''; $event.preventDefault()"
                       (focus)="skillFocus=true" (blur)="skillFocus=false">
              </div>
              <button type="button" class="add-skill-btn" (click)="addCustomSkill(skillInput.value); skillInput.value=''">
                <app-icon name="plus-circle" [size]="15" color="#fff"></app-icon>
                Add
              </button>
            </div>

            <!-- Selected skills -->
            <div class="selected-skills" *ngIf="skills.length > 0">
              <span class="selected-chip" *ngFor="let s of skills; let i = index">
                {{ s }}
                <button type="button" (click)="removeSkill(i)">
                  <app-icon name="x-circle" [size]="11" color="#6366f1"></app-icon>
                </button>
              </span>
            </div>
            <div class="err-row" *ngIf="submitAttempted && skills.length === 0">
              <app-icon name="x-circle" [size]="12" color="#ef4444"></app-icon>
              <span>Please add at least one skill</span>
            </div>

            <!-- MCQ warning -->
            <div class="mcq-notice" *ngIf="mandatoryTests.length > 0">
              <app-icon name="zap" [size]="14" color="#f59e0b"></app-icon>
              MCQ tests required for: <strong>{{ mandatoryTests.join(', ') }}</strong>
            </div>

            <!-- Submit -->
            <button type="submit" class="submit-btn" [disabled]="loading">
              <span *ngIf="!loading" style="display:flex;align-items:center;gap:8px">
                <app-icon name="check-circle" [size]="18" color="#fff"></app-icon>
                Create Profile
              </span>
              <span *ngIf="loading" style="display:flex;align-items:center;gap:8px">
                <div class="spinner"></div> Creating...
              </span>
            </button>

          </form>
        </div>

        <!-- RIGHT: Info panel -->
        <div class="info-col">

          <div class="info-card tips">
            <div class="info-card-title">
              <app-icon name="zap" [size]="15" color="#f59e0b"></app-icon>
              Quick Tips
            </div>
            <ul>
              <li>Use your legal full name</li>
              <li>Provide an active email address</li>
              <li>Mobile number must be 10 digits starting with 6–9</li>
              <li>Add skills relevant to your expertise</li>
              <li>Java, Python, AI/ML, .NET require MCQ tests</li>
            </ul>
          </div>

          <div class="info-card mandatory">
            <div class="info-card-title">
              <app-icon name="file-text" [size]="15" color="#6366f1"></app-icon>
              MCQ Test Skills
            </div>
            <div class="test-skill" *ngFor="let s of ['Java','Python','AI/ML','.NET']">
              <div class="test-dot"></div>
              <span>{{ s }}</span>
              <span class="test-badge">Required</span>
            </div>
          </div>

          <!-- Progress -->
          <div class="info-card progress-card">
            <div class="info-card-title">
              <app-icon name="bar-chart-2" [size]="15" color="#22c55e"></app-icon>
              Form Progress
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" [style.width.%]="formProgress"></div>
            </div>
            <div class="progress-label">{{ formProgress }}% complete</div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host { font-family: 'Inter', 'Segoe UI', sans-serif; display: block; }

    .page { display: flex; flex-direction: column; gap: 24px; }

    /* HEADER */
    .page-header {
      display: flex; align-items: center; gap: 16px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      border-radius: 18px; padding: 24px 28px;
      box-shadow: 0 8px 24px rgba(79,70,229,0.3);
    }
    .header-icon {
      width: 56px; height: 56px; border-radius: 16px;
      background: rgba(255,255,255,0.15);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .page-header h1 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .page-header p  { font-size: 13px; color: rgba(255,255,255,0.7); }

    /* LAYOUT */
    .form-layout {
      display: grid; grid-template-columns: 1fr 280px; gap: 20px; align-items: start;
    }
    @media (max-width: 860px) { .form-layout { grid-template-columns: 1fr; } }

    /* FORM CARD */
    .form-card {
      background: #fff; border-radius: 20px; padding: 28px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.07);
    }

    /* STEPS */
    .steps {
      display: flex; align-items: center; gap: 0;
      margin-bottom: 28px; padding-bottom: 24px;
      border-bottom: 1px solid #f1f5f9;
    }
    .step { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
    .step-dot {
      width: 28px; height: 28px; border-radius: 50%;
      background: #e2e8f0; display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .step.active .step-dot  { background: #6366f1; }
    .step.done .step-dot    { background: #22c55e; }
    .step span { font-size: 11px; font-weight: 600; color: #94a3b8; }
    .step.active span { color: #6366f1; }
    .step.done span   { color: #22c55e; }
    .step-line { flex: 1; height: 2px; background: #e2e8f0; margin-bottom: 18px; }

    /* SECTION LABEL */
    .section-label {
      display: flex; align-items: center; gap: 8px;
      font-size: 11px; font-weight: 700; color: #6366f1;
      text-transform: uppercase; letter-spacing: 1px;
      margin-bottom: 16px; margin-top: 4px;
    }

    /* FIELD */
    .field { margin-bottom: 18px; }
    label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 7px; }
    .req { color: #ef4444; }

    /* INPUT BOX */
    .input-box {
      display: flex; align-items: center; gap: 10px;
      border: 1.5px solid #e2e8f0; border-radius: 12px;
      padding: 11px 14px; background: #f8fafc;
      transition: all 0.2s;
    }
    .input-box.focused { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
    .input-box.error   { border-color: #ef4444; background: #fff5f5; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
    .input-box.success { border-color: #22c55e; background: #f0fdf4; }
    .input-box input, .input-box textarea {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 14px; color: #1e293b; font-family: inherit;
    }
    .input-box textarea { resize: none; line-height: 1.5; }
    .textarea-box { align-items: flex-start; padding-top: 12px; }

    .prefix { font-size: 13px; font-weight: 700; color: #6366f1; white-space: nowrap; }
    .divider-v { width: 1px; height: 18px; background: #e2e8f0; }

    /* SELECT */
    .select-box {
      display: flex; align-items: center; gap: 10px;
      border: 1.5px solid #e2e8f0; border-radius: 12px;
      padding: 11px 14px; background: #f8fafc; transition: all 0.2s;
    }
    .select-box.error { border-color: #ef4444; }
    .select-box select {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 14px; color: #1e293b; font-family: inherit; cursor: pointer;
      appearance: none;
    }

    /* ERROR ROW */
    .err-row {
      display: flex; align-items: center; gap: 5px;
      margin-top: 5px; font-size: 11.5px; color: #ef4444; font-weight: 500;
    }

    /* SKILLS */
    .quick-skills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
    .skill-chip {
      display: flex; align-items: center; gap: 5px;
      padding: 6px 12px; border-radius: 20px;
      border: 1.5px solid #e2e8f0; background: #f8fafc;
      font-size: 12px; font-weight: 600; color: #64748b;
      cursor: pointer; transition: all 0.15s;
    }
    .skill-chip:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
    .skill-chip.added { border-color: #6366f1; background: #eef2ff; color: #6366f1; }

    .custom-skill-row { display: flex; gap: 8px; margin-bottom: 12px; }
    .add-skill-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 11px 16px; border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; border: none; font-size: 13px; font-weight: 600;
      cursor: pointer; white-space: nowrap; transition: all 0.2s;
    }
    .add-skill-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(79,70,229,0.3); }

    .selected-skills { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; }
    .selected-chip {
      display: flex; align-items: center; gap: 5px;
      padding: 5px 10px 5px 12px; border-radius: 20px;
      background: #eef2ff; color: #4f46e5;
      font-size: 12px; font-weight: 600;
    }
    .selected-chip button {
      background: none; border: none; cursor: pointer; padding: 0;
      display: flex; align-items: center;
    }

    .mcq-notice {
      display: flex; align-items: center; gap: 8px;
      background: #fffbeb; border: 1px solid #fde68a;
      border-radius: 10px; padding: 10px 14px;
      font-size: 12.5px; color: #92400e; margin-bottom: 20px;
    }

    /* SUBMIT */
    .submit-btn {
      width: 100%; padding: 14px; border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff; border: none; font-size: 15px; font-weight: 700;
      cursor: pointer; transition: all 0.2s; margin-top: 4px;
      box-shadow: 0 4px 16px rgba(79,70,229,0.3);
      display: flex; align-items: center; justify-content: center;
    }
    .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,70,229,0.4); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .spinner {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* INFO COL */
    .info-col { display: flex; flex-direction: column; gap: 14px; }
    .info-card {
      background: #fff; border-radius: 16px; padding: 18px 20px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .info-card-title {
      display: flex; align-items: center; gap: 7px;
      font-size: 12px; font-weight: 700; color: #374151;
      text-transform: uppercase; letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .tips ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .tips ul li {
      font-size: 12.5px; color: #64748b; padding-left: 14px; position: relative; line-height: 1.5;
    }
    .tips ul li::before { content: '→'; position: absolute; left: 0; color: #f59e0b; font-size: 11px; }

    .test-skill {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #374151;
    }
    .test-skill:last-child { border-bottom: none; }
    .test-dot { width: 7px; height: 7px; border-radius: 50%; background: #6366f1; flex-shrink: 0; }
    .test-badge {
      margin-left: auto; font-size: 10px; font-weight: 700;
      background: #eef2ff; color: #6366f1; padding: 2px 8px; border-radius: 10px;
    }

    .progress-bar-wrap {
      height: 8px; background: #f1f5f9; border-radius: 10px; overflow: hidden; margin-bottom: 8px;
    }
    .progress-bar-fill {
      height: 100%; background: linear-gradient(90deg, #4f46e5, #22c55e);
      border-radius: 10px; transition: width 0.4s ease;
    }
    .progress-label { font-size: 12px; color: #64748b; font-weight: 600; text-align: right; }
  `]
})
export class ProfileFormComponent implements OnInit {
  namePattern  = /^[a-zA-Z][a-zA-Z\s]{1,}$/;
  emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  phonePattern = /^[6-9][0-9]{9}$/;

  form = this.fb.group({
    name:                 ['', [Validators.required, Validators.minLength(2), Validators.pattern(this.namePattern)]],
    email:                ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    contactNo:            ['', [Validators.required, Validators.pattern(this.phonePattern)]],
    address:              ['', [Validators.required, Validators.minLength(5)]],
    highestQualification: ['', Validators.required]
  });

  skills: string[] = [];
  loading = false;
  submitAttempted = false;

  nameFocus  = false;
  emailFocus = false;
  phoneFocus = false;
  addrFocus  = false;
  skillFocus = false;

  predefinedSkills = ['Java', 'Python', 'AI/ML', '.NET', 'JavaScript', 'TypeScript',
    'React', 'Angular', 'Node.js', 'Spring Boot', 'SQL', 'MongoDB', 'AWS', 'Docker'];

  mandatoryTestSkillsSet = ['Java', 'Python', 'AI/ML', '.NET'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.employeeService.getProfile().subscribe({
      next: (p) => {
        if (p) {
          this.form.patchValue({
            name: p.name, email: p.email, contactNo: p.contactNo,
            address: p.address, highestQualification: p.highestQualification
          });
          this.skills = p.skills || [];
        }
      },
      error: () => {}
    });
  }

  showErr(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  blockNonAlpha(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const ctrl = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End'];
    if (ctrl.includes(event.key)) return;
    if (!/^[a-zA-Z\s]$/.test(event.key)) event.preventDefault();
  }

  blockNonDigit(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) return;
    const ctrl = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (ctrl.includes(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) event.preventDefault();
  }

  get mandatoryTests(): string[] {
    return this.skills.filter(s => this.mandatoryTestSkillsSet.some(m => s.toLowerCase() === m.toLowerCase()));
  }

  get formProgress(): number {
    let score = 0;
    const fields = ['name','email','contactNo','address','highestQualification'];
    fields.forEach(f => { if (this.form.get(f)?.valid) score += 18; });
    if (this.skills.length > 0) score += 10;
    return Math.min(score, 100);
  }

  toggleSkill(skill: string): void {
    const idx = this.skills.indexOf(skill);
    if (idx === -1) this.skills.push(skill);
    else this.skills.splice(idx, 1);
  }

  addCustomSkill(val: string): void {
    const s = val.trim();
    if (s && !this.skills.includes(s)) this.skills.push(s);
  }

  removeSkill(i: number): void { this.skills.splice(i, 1); }

  onSubmit(): void {
    this.submitAttempted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid || this.skills.length === 0) return;
    this.loading = true;
    this.employeeService.createProfile({ ...this.form.value as any, skills: this.skills }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Profile created successfully!');
        this.router.navigate(['/employee']);
      },
      error: () => {
        this.loading = false;
        this.toast.error('Error creating profile. Please try again.');
      }
    });
  }
}
