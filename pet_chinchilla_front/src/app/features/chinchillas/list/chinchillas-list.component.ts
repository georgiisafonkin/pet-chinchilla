import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChinchillaService, Chinchilla } from '../../../core/services/chinchilla.service';

@Component({
  selector: 'app-chinchillas-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './chinchillas-list.component.html',
})
export class ChinchillasListComponent implements OnInit {
  chinchillas: Chinchilla[] = [];
  loading = false;
  error = '';

  constructor(private chinchillaService: ChinchillaService) {}

  ngOnInit(): void {
    this.loadChinchillas();
  }

  loadChinchillas(): void {
    this.loading = true;
    this.chinchillaService.getAll().subscribe({
      next: (data) => {
        this.chinchillas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chinchillas.';
        this.loading = false;
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