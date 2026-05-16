import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chinchillas',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'chinchillas',
    loadComponent: () =>
      import('./features/chinchillas/list/chinchillas-list.component').then(m => m.ChinchillasListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'chinchillas/new',
    loadComponent: () =>
      import('./features/chinchillas/form/chinchilla-form.component').then(m => m.ChinchillaFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'chinchillas/:id/edit',
    loadComponent: () =>
      import('./features/chinchillas/form/chinchilla-form.component').then(m => m.ChinchillaFormComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/breeders/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./features/chat/conversation/conversation.component').then(m => m.ConversationComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'chinchillas',
  },
];