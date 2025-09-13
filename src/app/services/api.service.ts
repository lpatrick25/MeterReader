import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.storage.create();
  }

  async getApiUrl(): Promise<string> {
    const storedUrl = await this.storage.get('customApiUrl');
    return storedUrl && storedUrl.trim() !== '' ? storedUrl : this.baseUrl;
  }

  async getCustomApiUrl(): Promise<string | null> {
    return await this.storage.get('customApiUrl');
  }

  async setCustomApiUrl(url: string): Promise<void> {
    await this.storage.set('customApiUrl', url);
  }

  async clearCustomApiUrl(): Promise<void> {
    await this.storage.remove('customApiUrl');
  }

  async getAuthToken(): Promise<string | null> {
    return await this.storage.get('auth-token');
  }

  async clearAuthToken(): Promise<void> {
    await this.storage.remove('auth-token');
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return from(this.getApiUrl()).pipe(
      switchMap(apiUrl => this.http.post(`${apiUrl}/login`, credentials))
    );
  }

  getMeterDetails(meterNumber: string): Observable<any> {
    return from(this.getApiUrl()).pipe(
      switchMap(apiUrl => this.http.get(`${apiUrl}/meter-details/${meterNumber}`))
    );
  }

  calculateAmountDue(payload: any): Observable<any> {
    return from(this.getApiUrl()).pipe(
      switchMap(apiUrl => this.http.post(`${apiUrl}/calculate-amount-due`, payload))
    );
  }
}
