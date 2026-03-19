import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;

  toggleForm() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLoginSubmit() {
    console.log('Login submitted');
    // Implement login logic
  }

  onSignupSubmit() {
    console.log('Signup submitted');
    // Implement signup logic
  }
}
