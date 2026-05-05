import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private api: ApiService) {}

  getProducts(page: number = 1, limit: number = 10, material?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    // Passed to backend to filter if backend supports it!
    if (material) {
      params = params.set('material', material);
    }
    
    return this.api.get('/products', params);
  }

  getProduct(id: string): Observable<any> {
    return this.api.get(`/products/${id}`);
  }

  getRates(): Observable<any> {
    return this.api.get('/rates');
  }
}
