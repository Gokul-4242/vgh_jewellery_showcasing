import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface OrderCheckoutPayload {
  items: { productId: string; quantity: number }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  billingAddress?: any;
  paymentMethod?: string;
  notes?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private api: ApiService) {}

  createOrder(payloadOrItems: OrderCheckoutPayload | { productId: string; quantity: number }[], userId?: string): Observable<any> {
    if (Array.isArray(payloadOrItems)) {
      const payload: OrderCheckoutPayload = {
        userId: userId || undefined,
        items: payloadOrItems,
        shippingAddress: {
          fullName: 'Customer',
          phone: '9876543210',
          addressLine1: 'VGH Showroom',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641001',
          country: 'India'
        },
        paymentMethod: 'COD'
      };
      return this.api.post('/orders/checkout', payload);
    }

    return this.api.post('/orders/checkout', payloadOrItems);
  }

  getMyOrders(): Observable<any> {
    return this.api.get('/orders/my-orders');
  }

  getOrderById(id: string): Observable<any> {
    return this.api.get(`/orders/${id}`);
  }
}
