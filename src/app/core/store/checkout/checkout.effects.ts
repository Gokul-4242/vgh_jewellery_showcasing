import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { OrderService, OrderCheckoutPayload } from '../../services/order.service';
import * as CheckoutActions from './checkout.actions';
import * as CartActions from '../cart/cart.actions';

@Injectable()
export class CheckoutEffects {
  private readonly actions$ = inject(Actions);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  placeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.placeOrder),
      switchMap(({ items, userId, customer, paymentMethod }) => {
        const orderPayload: OrderCheckoutPayload = {
          items,
          userId: userId || undefined,
          shippingAddress: {
            fullName: customer?.name || 'Customer',
            email: customer?.email || '',
            phone: customer?.phone || '',
            addressLine1: customer?.address || '',
            city: customer?.city || customer?.district || 'Coimbatore',
            state: customer?.state || 'Tamil Nadu',
            pincode: customer?.postalCode || '641001',
            country: customer?.country || 'India'
          },
          paymentMethod: (paymentMethod || 'COD').toUpperCase()
        };

        return this.orderService.createOrder(orderPayload).pipe(
          map((res: any) => {
            if (res && res.success && res.data) {
              return CheckoutActions.placeOrderSuccess({ order: res.data });
            }
            return CheckoutActions.placeOrderFailure({
              error: res.message || 'Order could not be processed'
            });
          }),
          catchError((err) =>
            of(
              CheckoutActions.placeOrderFailure({
                error: err.error?.message || err.message || 'Order placement failed'
              })
            )
          )
        );
      })
    )
  );

  placeOrderSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CheckoutActions.placeOrderSuccess),
        tap(() => {
          this.router.navigate(['/checkout/confirmation']);
        })
      ),
    { dispatch: false }
  );

  clearCartOnOrderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.placeOrderSuccess),
      map(() => CartActions.clearCart())
    )
  );
}
