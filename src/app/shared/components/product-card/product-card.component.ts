import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() price: number = 0;
  @Input() weight: string = '';
  @Input() category: string = '';
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = '';
}
