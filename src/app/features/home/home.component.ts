import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { CollectionsComponent } from './components/collections/collections.component';
import { BrandStoryComponent } from './components/brand-story/brand-story.component';
import { GoldShowcaseComponent } from './components/gold-showcase/gold-showcase.component';
import { NewsletterComponent } from '../../shared/components/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CollectionsComponent,
    BrandStoryComponent,
    GoldShowcaseComponent,
    NewsletterComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-collections></app-collections>
    <app-brand-story></app-brand-story>
    <app-gold-showcase></app-gold-showcase>
    <app-newsletter></app-newsletter>
  `
})
export class HomeComponent {}
