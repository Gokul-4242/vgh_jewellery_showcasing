import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { GoldCollectionComponent } from './features/gold-collection/gold-collection.component';
import { SilverCollectionComponent } from './features/silver-collection/silver-collection.component';
import { ProductDetailsComponent } from './features/product-details/product-details.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { ContactComponent } from './features/contact/contact.component';
import { AuthComponent } from './features/auth/auth.component';
import { CartComponent } from './features/cart/cart';
import { CheckoutShipping } from './features/checkout-shipping/checkout-shipping';
import { CheckoutPayment } from './features/checkout-payment/checkout-payment';
import { CheckoutConfirmationComponent } from './features/checkout-confirmation/checkout-confirmation';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'gold-collection', component: GoldCollectionComponent },
  { path: 'silver-collection', component: SilverCollectionComponent },
  { path: 'product-details', component: ProductDetailsComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout/shipping', component: CheckoutShipping },
  { path: 'checkout/payment', component: CheckoutPayment },
  { path: 'checkout/confirmation', component: CheckoutConfirmationComponent },
  { path: '**', redirectTo: '' }
];
