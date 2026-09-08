import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { cartReducer } from './core/store/cart/cart.reducer';
import { checkoutReducer } from './core/store/checkout/checkout.reducer';
import { CartEffects } from './core/store/cart/cart.effects';
import { CheckoutEffects } from './core/store/checkout/checkout.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ 
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })),
    provideHttpClient(),
    provideStore({
      cart: cartReducer,
      checkout: checkoutReducer
    }),
    provideEffects([CartEffects, CheckoutEffects])
  ]
};
