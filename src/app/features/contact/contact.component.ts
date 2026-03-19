import { Component } from '@angular/core';
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
  contactInfo = [
    {
      icon: 'mail',
      label: 'Email Us',
      value: 'concierge@vghjewellers.com',
      subtext: '24h response time'
    },
    {
      icon: 'call',
      label: 'Call Us',
      value: '+1 (888) VGH-GOLD',
      subtext: 'Mon - Sat, 10am - 7pm'
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
    inquiryType: this.inquiryTypes[0],
    message: ''
  };

  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Add submission logic here
    alert('Thank you for your inquiry. Our artisans will contact you soon.');
  }
}
