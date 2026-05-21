import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  label: string;
  checked?: boolean;
  active?: boolean;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit, OnChanges {
  @Input() jewelryTypes: FilterOption[] = [];
  @Input() purityLevels: FilterOption[] = [];
  @Input() minPrice: any = 0;
  @Input() maxPrice: any = 100000;

  sliderMin: number = 0;
  sliderMax: number = 100000;
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 100000;

  @Output() filterChange = new EventEmitter<{
    types: FilterOption[],
    purities: FilterOption[],
    minPrice: number,
    maxPrice: number
  }>();

  ngOnInit(): void {
    this.initPrices();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minPrice'] || changes['maxPrice']) {
      this.initPrices();
    }
  }

  private initPrices() {
    this.selectedMinPrice = this.parsePrice(this.minPrice, 0);
    this.selectedMaxPrice = this.parsePrice(this.maxPrice, 100000);
    this.sliderMin = 0;
    
    // Set sliderMax to a higher limit so the user can drag to increase prices
    if (this.selectedMaxPrice <= 2000) {
      this.sliderMax = 10000; // 10k for Silver
    } else {
      this.sliderMax = 500000; // 5 Lakhs for Gold
    }
  }

  private parsePrice(value: any, fallback: number): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[₹$,+\s]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  }

  getTrackStyle() {
    const range = this.sliderMax - this.sliderMin;
    if (range <= 0) return { left: '0%', right: '0%' };
    const minPercent = ((this.selectedMinPrice - this.sliderMin) / range) * 100;
    const maxPercent = ((this.selectedMaxPrice - this.sliderMin) / range) * 100;
    return {
      left: `${Math.max(0, Math.min(100, minPercent))}%`,
      right: `${Math.max(0, Math.min(100, 100 - maxPercent))}%`
    };
  }

  getMinThumbStyle() {
    const range = this.sliderMax - this.sliderMin;
    if (range <= 0) return { left: '0%' };
    const percent = ((this.selectedMinPrice - this.sliderMin) / range) * 100;
    return {
      left: `${Math.max(0, Math.min(100, percent))}%`
    };
  }

  getMaxThumbStyle() {
    const range = this.sliderMax - this.sliderMin;
    if (range <= 0) return { left: '100%' };
    const percent = ((this.selectedMaxPrice - this.sliderMin) / range) * 100;
    return {
      left: `${Math.max(0, Math.min(100, percent))}%`
    };
  }

  toggleType(type: FilterOption) {
    type.checked = !type.checked;
    this.emitChange();
  }

  togglePurity(purity: FilterOption) {
    purity.active = !purity.active;
    this.emitChange();
  }

  onPriceInputChange() {
    if (this.selectedMinPrice === null || this.selectedMinPrice === undefined || isNaN(this.selectedMinPrice)) {
      this.selectedMinPrice = 0;
    }
    if (this.selectedMaxPrice === null || this.selectedMaxPrice === undefined || isNaN(this.selectedMaxPrice)) {
      this.selectedMaxPrice = this.sliderMax;
    }

    if (this.selectedMinPrice < this.sliderMin) {
      this.sliderMin = this.selectedMinPrice;
    }
    if (this.selectedMaxPrice > this.sliderMax) {
      this.sliderMax = this.selectedMaxPrice;
    }

    this.emitChange();
  }

  onSliderChange(slider: 'min' | 'max') {
    if (slider === 'min' && this.selectedMinPrice > this.selectedMaxPrice) {
      this.selectedMinPrice = this.selectedMaxPrice;
    } else if (slider === 'max' && this.selectedMaxPrice < this.selectedMinPrice) {
      this.selectedMaxPrice = this.selectedMinPrice;
    }
    this.emitChange();
  }

  resetFilters() {
    this.jewelryTypes.forEach(t => t.checked = false);
    this.purityLevels.forEach(p => p.active = false);
    this.initPrices();
    this.emitChange();
  }

  emitChange() {
    this.filterChange.emit({
      types: this.jewelryTypes,
      purities: this.purityLevels,
      minPrice: this.selectedMinPrice,
      maxPrice: this.selectedMaxPrice
    });
  }
}
