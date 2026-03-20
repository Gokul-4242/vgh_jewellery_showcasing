import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.isDropdownOpen && this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  contactInfo = [
    {
      icon: 'mail',
      label: 'Email Support',
      value: 'vghjewellers@gmail.com',
      subtext: 'Official Support'
    },
    {
      icon: 'call',
      label: 'Call / WhatsApp',
      value: '+91 79043 94546',
      subtext: 'Mon - Sun, 10am - 9pm'
    }
  ];

  inquiryTypes = [
    'Bespoke Design Consultation',
    'Collection Availability',
    'Boutique Appointment',
    'Press Inquiry'
  ];

  formData = {
    fullName: '',
    email: '',
    inquiryType: 'Select Inquiry Type...',
    message: ''
  };

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(type: string) {
    this.formData.inquiryType = type;
    this.isDropdownOpen = false;
  }

  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Add submission logic here
    alert('Thank you for your inquiry. Our artisans will contact you soon.');
  }

  scrollToForm() {
    const el = document.getElementById('contact-message-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
