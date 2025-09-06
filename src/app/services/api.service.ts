import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  getMeterDetails(meterNumber: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/meter-details/${meterNumber}`);
  }

  calculateAmountDue(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/calculate-amount-due`, payload);
  }
}
