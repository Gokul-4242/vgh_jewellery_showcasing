import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() minPrice: string = '₹500';
  @Input() maxPrice: string = '₹10,000+';

  @Output() filterChange = new EventEmitter<{
    types: FilterOption[],
    purities: FilterOption[]
  }>();

  toggleType(type: FilterOption) {
    type.checked = !type.checked;
    this.emitChange();
  }

  togglePurity(purity: FilterOption) {
    purity.active = !purity.active;
    this.emitChange();
  }

  resetFilters() {
    this.jewelryTypes.forEach(t => t.checked = false);
    this.purityLevels.forEach(p => p.active = false);
    this.emitChange();
  }

  emitChange() {
    this.filterChange.emit({
      types: this.jewelryTypes,
      purities: this.purityLevels
    });
  }
}
