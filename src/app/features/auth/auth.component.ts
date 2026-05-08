import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  // Form states
  loginData = { email: '', password: '' };
  signupData = { fullName: '', email: '', password: '', confirmPassword: '', phone: '' };
  
  errorMsg = '';
  isLoading = false;

  toggleForm() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMsg = '';
  }

  onLoginSubmit() {
    this.errorMsg = '';
    this.isLoading = true;
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cartService.loadCart(); // Load cart on login
        this.router.navigate(['/gold-collection']); // Redirect after login
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  onSignupSubmit() {
    this.errorMsg = '';
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMsg = 'Passwords do not match';
      return;
    }
    
    this.isLoading = true;
    const data = {
      name: this.signupData.fullName,
      email: this.signupData.email,
      password: this.signupData.password,
      phone: this.signupData.phone || '0000000000' // Phone is required in backend
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cartService.loadCart(); // Load cart on signup
        this.router.navigate(['/gold-collection']); // Redirect after signup
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
