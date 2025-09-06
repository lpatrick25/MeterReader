import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private storage: Storage
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const response = await this.apiService.login(this.credentials).toPromise();

      const token = response?.content?.token;
      const user = response?.content?.user;

      if (!token) {
        throw new Error('No token returned from API');
      }

      await this.storage.set('auth-token', token);
      await this.storage.set('user', user);

      console.log('Token stored:', token);
      this.successMessage = 'Login successful! Redirecting...';

      setTimeout(() => {
        this.router.navigate(['/connect']);
      }, 1500);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'error' in error) {
        // @ts-ignore
        this.errorMessage = (error as any).error?.error || 'An error occurred. Please try again.';
      } else {
        this.errorMessage = 'An error occurred. Please try again.';
      }
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
