import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChinchillaService, Chinchilla } from '../../../core/services/chinchilla.service';

@Component({
  selector: 'app-chinchillas-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './chinchillas-list.component.html',
  styleUrl: './chinchillas-list.component.css',
})
export class ChinchillasListComponent implements OnInit {
  chinchillas: Chinchilla[] = [];
  loading = false;
  error = '';

  constructor(
    private chinchillaService: ChinchillaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadChinchillas();
  }

  loadChinchillas(): void {
    this.loading = true;
    this.chinchillaService.getAll().subscribe({
      next: (data) => {
        this.chinchillas = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load chinchillas.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  delete(id: number): void {
    if (!confirm('Are you sure you want to delete this chinchilla?')) return;
    this.chinchillaService.delete(id).subscribe({
      next: () => {
        this.chinchillas = this.chinchillas.filter(c => c.id !== id);
      },
      error: () => {
        this.error = 'Failed to delete chinchilla.';
      },
    });
  }
}