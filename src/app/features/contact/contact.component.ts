import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';

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

  constructor(private contactService: ContactService) {}

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
    'Custom Jewellery Design',
    'Gold / Silver Product Inquiry',
    'Price & Weight Consultation',
    'Repair & Restoration',
    'Bulk / Wedding Order',
    'Store Visit Appointment',
    'Order Status / Tracking',
    'Other'
  ];

  formData = {
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'Select Inquiry Type...',
    customInquiry: '',
    message: ''
  };

  isDropdownOpen = false;
  isSubmitting   = false;
  submitSuccess  = false;
  submitError    = '';
  referenceId    = '';

  get isOtherSelected(): boolean {
    return this.formData.inquiryType === 'Other';
  }

  get resolvedInquiryType(): string {
    return this.isOtherSelected
      ? `Other: ${this.formData.customInquiry}`
      : this.formData.inquiryType;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(type: string) {
    this.formData.inquiryType = type;
    if (type !== 'Other') {
      this.formData.customInquiry = '';
    }
    this.isDropdownOpen = false;
  }

  onSubmit() {
    // Guard: inquiry type must be selected
    if (this.formData.inquiryType === 'Select Inquiry Type...') {
      this.submitError = 'Please select an inquiry type.';
      return;
    }
    // Guard: "Other" needs description
    if (this.isOtherSelected && !this.formData.customInquiry.trim()) {
      this.submitError = 'Please describe your inquiry.';
      return;
    }

    this.submitError  = '';
    this.isSubmitting = true;

    const payload = {
      fullName:    this.formData.fullName.trim(),
      email:       this.formData.email.trim(),
      phone:       this.formData.phone.trim(),
      inquiryType: this.resolvedInquiryType,
      message:     this.formData.message.trim()
    };

    this.contactService.submitEnquiry(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.submitSuccess = true;
          this.referenceId   = res.data?.referenceId || '';
          // Reset form
          this.formData = {
            fullName: '', email: '', phone: '',
            inquiryType: 'Select Inquiry Type...',
            customInquiry: '', message: ''
          };
        } else {
          this.submitError = res.message || 'Something went wrong. Please try again.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError  = err?.error?.message || 'Unable to send enquiry. Please try again later.';
      }
    });
  }

  resetForm() {
    this.submitSuccess = false;
    this.submitError   = '';
    this.referenceId   = '';
  }

  scrollToForm() {
    const el = document.getElementById('contact-message-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
