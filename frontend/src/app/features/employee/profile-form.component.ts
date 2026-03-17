import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EmployeeService } from '../../core/services/employee.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  template: `
    <div class="form-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>Employee Profile Information</mat-card-title>
          <mat-card-subtitle>Please fill in all required information</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <!-- Personal Information -->
            <div class="form-section">
              <h3>Personal Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" required>
                <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="email" required>
                <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Contact Number</mat-label>
                <input matInput formControlName="contactNo" required>
                <mat-error *ngIf="profileForm.get('contactNo')?.hasError('required')">
                  Contact number is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="3" required></textarea>
                <mat-error *ngIf="profileForm.get('address')?.hasError('required')">
                  Address is required
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Educational Information -->
            <div class="form-section">
              <h3>Educational Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Highest Qualification</mat-label>
                <mat-select formControlName="highestQualification" required>
                  <mat-option value="High School">High School</mat-option>
                  <mat-option value="Bachelor's Degree">Bachelor's Degree</mat-option>
                  <mat-option value="Master's Degree">Master's Degree</mat-option>
                  <mat-option value="PhD">PhD</mat-option>
                  <mat-option value="Diploma">Diploma</mat-option>
                  <mat-option value="Certificate">Certificate</mat-option>
                </mat-select>
                <mat-error *ngIf="profileForm.get('highestQualification')?.hasError('required')">
                  Highest qualification is required
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Skills Section -->
            <div class="form-section">
              <h3>Skills</h3>
              <p class="skills-note">
                <mat-icon color="warn">warning</mat-icon>
                Note: If you select Java, Python, AI/ML, or .NET, you will need to take mandatory MCQ tests.
              </p>
              
              <div class="skills-input">
                <mat-form-field appearance="outline" class="skill-input">
                  <mat-label>Add Skill</mat-label>
                  <input matInput #skillInput (keyup.enter)="addSkill(skillInput.value); skillInput.value=''">
                </mat-form-field>
                <button mat-raised-button type="button" color="primary" 
                        (click)="addSkill(skillInput.value); skillInput.value=''">
                  Add Skill
                </button>
              </div>

              <div class="predefined-skills">
                <h4>Quick Add:</h4>
                <div class="skill-buttons">
                  <button mat-stroked-button type="button" 
                          *ngFor="let skill of predefinedSkills"
                          (click)="addSkill(skill)"
                          [disabled]="skills.includes(skill)">
                    {{skill}}
                  </button>
                </div>
              </div>

              <div class="selected-skills" *ngIf="skills.length > 0">
                <h4>Selected Skills:</h4>
                <mat-chip-set>
                  <mat-chip *ngFor="let skill of skills; let i = index" 
                           (removed)="removeSkill(i)">
                    {{skill}}
                    <button matChipRemove>
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="mcq-warning" *ngIf="getMandatoryTestSkills().length > 0">
                <mat-icon color="warn">info</mat-icon>
                <span>You will need to take MCQ tests for: {{getMandatoryTestSkills().join(', ')}}</span>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/employee">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="profileForm.invalid || loading">
                {{loading ? 'Creating Profile...' : 'Create Profile'}}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 24px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 64px);
    }
    
    .profile-card {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .form-section {
      margin-bottom: 32px;
    }
    
    .form-section h3 {
      margin: 0 0 16px 0;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .skills-note {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #fff3e0;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      color: #f57c00;
    }
    
    .skills-input {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      margin-bottom: 16px;
    }
    
    .skill-input {
      flex: 1;
    }
    
    .predefined-skills {
      margin-bottom: 16px;
    }
    
    .predefined-skills h4 {
      margin: 0 0 8px 0;
      color: #666;
    }
    
    .skill-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .selected-skills {
      margin-bottom: 16px;
    }
    
    .selected-skills h4 {
      margin: 0 0 8px 0;
      color: #666;
    }
    
    .mcq-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #e3f2fd;
      padding: 12px;
      border-radius: 4px;
      color: #1976d2;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class ProfileFormComponent implements OnInit {
  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contactNo: ['', Validators.required],
    address: ['', Validators.required],
    highestQualification: ['', Validators.required]
  });

  skills: string[] = [];
  loading = false;

  predefinedSkills = [
    'Java', 'Python', 'AI/ML', '.NET', 'JavaScript', 'TypeScript', 
    'React', 'Angular', 'Node.js', 'Spring Boot', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML/CSS'
  ];

  mandatoryTestSkills = ['Java', 'Python', 'AI/ML', '.NET'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExistingProfile();
  }

  loadExistingProfile(): void {
    this.employeeService.getProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.profileForm.patchValue({
            name: profile.name,
            email: profile.email,
            contactNo: profile.contactNo,
            address: profile.address,
            highestQualification: profile.highestQualification
          });
          this.skills = profile.skills || [];
        }
      },
      error: (error) => {
        console.log('No existing profile found');
      }
    });
  }

  addSkill(skill: string): void {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !this.skills.includes(trimmedSkill)) {
      this.skills.push(trimmedSkill);
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  getMandatoryTestSkills(): string[] {
    return this.skills.filter(skill => 
      this.mandatoryTestSkills.some(testSkill => 
        skill.toLowerCase().includes(testSkill.toLowerCase())
      )
    );
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.skills.length > 0) {
      this.loading = true;
      
      const profileData = {
        ...this.profileForm.value,
        skills: this.skills
      };

      this.employeeService.createProfile(profileData as any).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Profile created successfully!', 'Close', { duration: 3000 });
          
          const mandatoryTests = this.getMandatoryTestSkills();
          if (mandatoryTests.length > 0) {
            this.snackBar.open(
              `Please complete MCQ tests for: ${mandatoryTests.join(', ')}`, 
              'Close', 
              { duration: 5000 }
            );
          }
          
          this.router.navigate(['/employee']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error creating profile. Please try again.', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields and add at least one skill.', 'Close', { duration: 3000 });
    }
  }

  goBack(): void {
    this.router.navigate(['/employee']);
  }
}