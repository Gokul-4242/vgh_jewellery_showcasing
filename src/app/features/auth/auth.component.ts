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
  loginData = { identifier: '', password: '' };
  signupData = { 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    phone: '',
    agreeToTerms: false 
  };
  
  errorMsg = '';
  isLoading = false;

  // Password visibility states
  showLoginPassword = false;
  showSignupPassword = false;
  showConfirmPassword = false;

  // Custom validation toast states
  showValidationToast = false;
  validationToastMsg = '';
  toastTimeout: any = null;

  toggleForm() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMsg = '';
    this.showLoginPassword = false;
    this.showSignupPassword = false;
    this.showConfirmPassword = false;
    this.closeValidationToast();
  }

  closeValidationToast() {
    this.showValidationToast = false;
    this.validationToastMsg = '';
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  showErrorToast(err: any) {
    let msg = 'An unexpected error occurred.';
    
    if (typeof err === 'string') {
      msg = err;
    } else if (err) {
      if (err.error) {
        const subErr = err.error;
        if (typeof subErr === 'string') {
          try {
            const parsed = JSON.parse(subErr);
            msg = parsed.message || parsed.error || subErr;
          } catch (e) {
            msg = subErr;
          }
        } else if (subErr && typeof subErr === 'object') {
          msg = subErr.message || subErr.error || msg;
        }
      } else if (err.message) {
        msg = err.message;
      }
    }

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.validationToastMsg = msg;
    this.showValidationToast = true;
    this.errorMsg = msg;

    // Auto-dismiss the toast after 4 seconds
    this.toastTimeout = setTimeout(() => {
      this.closeValidationToast();
    }, 4000);
  }

  onLoginSubmit() {
    this.errorMsg = '';
    
    // Validations
    if (!this.loginData.identifier || !this.loginData.identifier.trim()) {
      this.showErrorToast('Email Address or Phone Number is required.');
      return;
    }
    if (!this.loginData.password) {
      this.showErrorToast('Password is required.');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cartService.loadCart(); // Load cart on login
        this.router.navigate(['/gold-collection']); // Redirect after login
      },
      error: (err) => {
        this.isLoading = false;
        this.showErrorToast(err);
      }
    });
  }

  onSignupSubmit() {
    this.errorMsg = '';

    // Validations
    if (!this.signupData.fullName || !this.signupData.fullName.trim()) {
      this.showErrorToast('Full Name is required.');
      return;
    }
    if (!this.signupData.email || !this.signupData.email.trim()) {
      this.showErrorToast('Email Address is required.');
      return;
    }
    // Simple Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signupData.email.trim())) {
      this.showErrorToast('Please enter a valid Email Address.');
      return;
    }
    if (!this.signupData.phone || !this.signupData.phone.trim()) {
      this.showErrorToast('Phone Number is required.');
      return;
    }
    // 10 digit Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(this.signupData.phone.trim())) {
      this.showErrorToast('Phone Number must be a valid 10-digit number.');
      return;
    }
    if (!this.signupData.password) {
      this.showErrorToast('Password is required.');
      return;
    }
    if (this.signupData.password.length < 6) {
      this.showErrorToast('Password must be at least 6 characters long.');
      return;
    }
    if (!this.signupData.confirmPassword) {
      this.showErrorToast('Confirm Password is required.');
      return;
    }
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.showErrorToast('Passwords do not match.');
      return;
    }
    if (!this.signupData.agreeToTerms) {
      this.showErrorToast('You must agree to the Terms of Excellence and Privacy Policy.');
      return;
    }
    
    this.isLoading = true;
    const data = {
      name: this.signupData.fullName.trim(),
      email: this.signupData.email.trim(),
      password: this.signupData.password,
      phone: this.signupData.phone.trim()
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cartService.loadCart(); // Load cart on signup
        this.router.navigate(['/gold-collection']); // Redirect after signup
      },
      error: (err) => {
        this.isLoading = false;
        this.showErrorToast(err);
      }
    });
  }
}
