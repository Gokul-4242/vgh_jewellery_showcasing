import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterOption {
  label: string;
  checked?: boolean;
  active?: boolean;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  @Input() jewelryTypes: FilterOption[] = [];
  @Input() purityLevels: FilterOption[] = [];
  @Input() minPrice: string = '$500';
  @Input() maxPrice: string = '$10,000+';
}
