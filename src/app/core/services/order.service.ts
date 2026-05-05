import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private api: ApiService) {}

  createOrder(items: { productId: string; quantity: number }[], userId?: string): Observable<any> {
    // Default placeholder ID used in backend if Customer is purely a guest for MVP.
    const payload = {
      userId: userId || '60d0fe4f5311236168a109ca',
      items: items
    };
    return this.api.post('/orders', payload);
  }
}
