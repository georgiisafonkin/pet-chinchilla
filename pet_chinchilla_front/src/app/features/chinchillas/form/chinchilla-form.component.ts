import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { trigger, transition, style, animate } from '@angular/animations';
import { ChinchillaService, ChinchillaPayload } from '../../../core/services/chinchilla.service';

@Component({
  selector: 'app-chinchilla-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './chinchilla-form.component.html',
  styleUrl: './chinchilla-form.component.css',
})
export class ChinchillaFormComponent implements OnInit {
  id: number | null = null;
  name = '';
  age: number | null = null;
  breed = '';
  fur_type = '';
  color = '';
  error = '';
  loading = false;
  saving = false;

  furTypes = ['Standard', 'Velvet', 'Angora', 'Mosaic'];

  get isEditMode(): boolean {
    return this.id !== null;
  }

  constructor(
    private chinchillaService: ChinchillaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id = +id;
      this.loadChinchilla(this.id);
    }
  }

  loadChinchilla(id: number): void {
    this.loading = true;
    this.chinchillaService.getOne(id).subscribe({
      next: (c) => {
        this.name = c.name;
        this.age = c.age;
        this.breed = c.breed;
        this.fur_type = c.fur_type;
        this.color = c.color;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chinchilla.';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.name) {
      this.error = 'Name is required.';
      return;
    }

    this.saving = true;
    this.error = '';

    const payload: ChinchillaPayload = {
      name: this.name,
      age: this.age,
      breed: this.breed,
      fur_type: this.fur_type,
      color: this.color,
    };

    const request$ = this.isEditMode
      ? this.chinchillaService.update(this.id!, payload)
      : this.chinchillaService.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/chinchillas']),
      error: () => {
        this.error = 'Failed to save chinchilla.';
        this.saving = false;
      },
    });
  }
}