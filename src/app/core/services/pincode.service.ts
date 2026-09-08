import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface DeliveryInfo {
  serviceable: boolean;
  codAvailable: boolean;
  estimatedDays: number;
  shippingCharge: number;
  courierPartner: string;
  insuranceIncluded: boolean;
}

export interface PincodeDetails {
  valid: boolean;
  pincode: string;
  city: string;
  district: string;
  state: string;
  country: string;
  postOffices: string[];
  delivery: DeliveryInfo;
  isEstimated?: boolean;
}

export interface PincodeResponse {
  success: boolean;
  valid?: boolean;
  message?: string;
  data?: PincodeDetails;
}

export interface VerificationResponse {
  success: boolean;
  data?: {
    isValid: boolean;
    isMatch: boolean;
    cityMatch: boolean;
    stateMatch: boolean;
    message: string;
    delivery?: DeliveryInfo;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PincodeService {
  private readonly api = inject(ApiService);

  lookupPincode(pincode: string): Observable<PincodeResponse> {
    return this.api.get<PincodeResponse>(`/pincode/${pincode.trim()}`);
  }

  verifyCityAndPincode(pincode: string, city: string, state?: string): Observable<VerificationResponse> {
    return this.api.post<VerificationResponse>('/pincode/verify', {
      pincode: pincode.trim(),
      city: city.trim(),
      state: state ? state.trim() : undefined
    });
  }

  lookupCity(cityName: string): Observable<any> {
    return this.api.get(`/pincode/city/${encodeURIComponent(cityName.trim())}`);
  }
}
