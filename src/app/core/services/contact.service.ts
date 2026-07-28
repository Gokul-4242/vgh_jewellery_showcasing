import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EnquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export interface EnquiryResponse {
  success: boolean;
  message: string;
  data?: { id: string; referenceId: string };
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);

  submitEnquiry(payload: EnquiryPayload): Observable<EnquiryResponse> {
    return this.http.post<EnquiryResponse>(`${environment.apiUrl}/enquiry`, payload);
  }
}
