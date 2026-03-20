import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
  @Input() title: string = 'Need a Custom Design?';
  @Input() description: string = 'Share your idea with us—we’ll help you create jewellery based on your design, budget, and preference.';
  @Input() placeholder: string = 'Your email address';
  @Input() buttonText: string = 'Get a Callback';
  @Input() footerText: string = 'Respecting your privacy since 1994.';
}
