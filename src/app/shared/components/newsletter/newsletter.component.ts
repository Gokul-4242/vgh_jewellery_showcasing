import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {
  @Input() title: string = 'Join the Inner Circle';
  @Input() description: string = 'Be the first to receive exclusive previews of our new collections and invitations to private trunk shows.';
  @Input() placeholder: string = 'Your email address';
  @Input() buttonText: string = 'Subscribe';
  @Input() footerText: string = 'Respecting your privacy since 1994.';
}
