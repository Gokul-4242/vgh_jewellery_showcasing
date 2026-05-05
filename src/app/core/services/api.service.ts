import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`, { params });
  }

  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  postPrivate<T>(path: string, body: Object = {}, token: string): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
