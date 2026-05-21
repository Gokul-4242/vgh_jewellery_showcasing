import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Use a signal for the current user
  private userState = signal<any>(this.getUserFromStorage());

  // Expose signals for components
  currentUser = computed(() => this.userState());
  isAuthenticated = computed(() => !!this.userState());

  private getUserFromStorage() {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  }

  login(credentials: any) {
    return this.apiService.post<any>('/customer/auth/login', credentials).pipe(
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userState.set(res.user);
        }
      })
    );
  }

  register(userData: any) {
    return this.apiService.post<any>('/customer/auth/signup', userData).pipe(
      tap(res => {
        if (res.success && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userState.set(res.user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userState.set(null);
    this.router.navigate(['/auth']);
  }
}
