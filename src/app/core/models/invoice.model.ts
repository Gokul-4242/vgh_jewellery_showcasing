export interface BillingItem {
  id: string;
  productId: string;
  name: string;
  code: string;
  weight: number;
  purity: string;
  rate: number;
  makingCharges: number;
  wastage?: number; // percentage
  discount?: number;
  stoneCost?: number;
  total: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  email?: string;
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  customer: CustomerDetails;
  items: BillingItem[];
  subtotal: number;
  gst: number; // calculated tax (3% for jewelry)
  gstRate: number; // percentage (typically 3%)
  discount: number;
  makingTotal: number;
  wastageTotal: number;
  grandTotal: number;
  goldRate: number;
  silverRate?: number;
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'Split' | 'NetBanking';
  status?: 'Completed' | 'Pending' | 'Cancelled';
}
