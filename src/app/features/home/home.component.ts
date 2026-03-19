import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { BrandStoryComponent } from './components/brand-story/brand-story.component';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CollectionsComponent,
    BrandStoryComponent,
    NewsletterComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-collections></app-collections>
    <app-brand-story></app-brand-story>
    <app-newsletter></app-newsletter>
  `
})
export class HomeComponent {}
