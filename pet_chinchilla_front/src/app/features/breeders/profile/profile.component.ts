import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { BreederService, Breeder } from '../../../core/services/breeder.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  breeder: Breeder | null = null;
  bio = '';
  loading = false;
  saving = false;
  error = '';
  success = '';

  constructor(
    private breederService: BreederService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.breederService.getMe().subscribe({
      next: (data) => {
        this.breeder = data;
        this.bio = data.bio;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load profile.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit(): void {
    this.saving = true;
    this.error = '';
    this.success = '';

    this.breederService.updateMe({ bio: this.bio }).subscribe({
      next: (data) => {
        this.breeder = data;
        this.success = 'Profile updated successfully.';
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to update profile.';
        this.saving = false;
        this.cdr.detectChanges();
      },
    });
  }
}