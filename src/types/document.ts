export interface DBDocument {
  recipient: {
    name: string;
    street?: string;
    city?: string;
    zipCode?: string;
  };
  recipientVATNumber: string;
  editorName: string;
  editorEmail: string;
  editorPhone: string;
  totalNet: number;
  totalTax: number;
  totalGross: number;
  taxType: string;
  date: string;
  dueDate: string;
  status: 'offen' | 'ueberfaellig' | 'bezahlt' | 'storniert';
  publishedId: string;
  name: string;
}