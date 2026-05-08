import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}${path}`, { 
      params,
      headers: this.getHeaders()
    });
  }

  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}${path}`, body, {
      headers: this.getHeaders()
    });
  }

  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}${path}`, body, {
      headers: this.getHeaders()
    });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}${path}`, {
      headers: this.getHeaders()
    });
  }
}
