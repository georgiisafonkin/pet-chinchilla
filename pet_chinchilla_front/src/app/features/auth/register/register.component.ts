import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username = '';
  password = '';
  password2 = '';
  bio = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.username || !this.password || !this.password2) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.password2) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register({
      username: this.username,
      password: this.password,
      password2: this.password2,
      bio: this.bio,
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.error = err.error?.username?.[0]
          || err.error?.password?.[0]
          || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }
}