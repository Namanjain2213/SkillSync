import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from './toast.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="toast-container">
      <div class="toast" *ngFor="let t of toasts" [class]="'toast-' + t.type">
        <app-icon [name]="getIcon(t.type)" [size]="18" color="currentColor"></app-icon>
        <span class="toast-msg">{{ t.message }}</span>
        <button class="toast-close" (click)="remove(t.id)">
          <app-icon name="x" [size]="14" color="currentColor"></app-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; top: 20px; right: 20px;
      display: flex; flex-direction: column; gap: 10px;
      z-index: 9999; max-width: 360px;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 13px 16px; border-radius: 12px;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      font-size: 13.5px; font-weight: 500;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      animation: slideIn 0.25s ease;
      min-width: 280px;
    }
    @keyframes slideIn {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    .toast-success { background: #1b5e20; color: #e8f5e9; border-left: 4px solid #69f0ae; }
    .toast-error   { background: #b71c1c; color: #ffebee; border-left: 4px solid #ff5252; }
    .toast-warning { background: #e65100; color: #fff3e0; border-left: 4px solid #ffd740; }
    .toast-info    { background: #0d47a1; color: #e3f2fd; border-left: 4px solid #40c4ff; }
    .toast-msg { flex: 1; line-height: 1.4; }
    .toast-close {
      background: none; border: none; cursor: pointer;
      color: currentColor; opacity: 0.7; padding: 0;
      display: flex; align-items: center; flex-shrink: 0;
    }
    .toast-close:hover { opacity: 1; }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => this.remove(toast.id), 4000);
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: string): string {
    const map: any = { success: 'check-circle', error: 'x-circle', warning: 'alert-circle', info: 'info' };
    return map[type] ?? 'info';
  }
}
