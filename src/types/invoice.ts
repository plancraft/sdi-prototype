export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  counterpartyName: string;
  totalAmount: number;
  currency: string;
  status: 'offen' | 'ueberfaellig' | 'bezahlt' | 'storniert';
  type: 'incoming' | 'outgoing';
  // Additional fields from API spec
  transmissionFormat: 'FPA12' | 'FPR12';
  transmissionId: string;
  documentType: string;
  fiscalYear: number;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  totalAmount: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    perPage: number;
    hasMore: boolean;
  };
}