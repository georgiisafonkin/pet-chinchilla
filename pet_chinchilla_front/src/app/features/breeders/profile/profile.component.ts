import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreederService, Breeder } from '../../../core/services/breeder.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  breeder: Breeder | null = null;
  bio = '';
  loading = false;
  saving = false;
  error = '';
  success = '';

  constructor(private breederService: BreederService) {}

  ngOnInit(): void {
    this.loading = true;
    this.breederService.getMe().subscribe({
      next: (data) => {
        this.breeder = data;
        this.bio = data.bio;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile.';
        this.loading = false;
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
      },
      error: () => {
        this.error = 'Failed to update profile.';
        this.saving = false;
      },
    });
  }
}