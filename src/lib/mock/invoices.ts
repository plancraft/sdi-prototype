import type { Invoice, ApiResponse } from '../../types/invoice';

const PER_PAGE = 25;
const BASE_DATE = new Date(2025, 2, 31);

export function generateMockInvoice(index: number, type: 'incoming' | 'outgoing', page: number): Invoice {
  const invoiceDate = new Date(BASE_DATE);
  invoiceDate.setDate(invoiceDate.getDate() - index);
  
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30);
  
  const id = `${type}-${page}-${index}`;
  const number = `INV-${2025}-${(page - 1) * PER_PAGE + index + 1}`.padStart(8, '0');
  
  return {
    id,
    number,
    date: invoiceDate.toISOString(),
    dueDate: dueDate.toISOString(),
    counterpartyName: `${type === 'incoming' ? 'Supplier' : 'Customer'} ${index + 1}`,
    totalAmount: Math.round(Math.random() * 10000),
    currency: 'EUR',
    status: Math.random() > 0.7 ? 'bezahlt' : 'offen',
    type,
    transmissionFormat: 'FPA12',
    transmissionId: `T${Math.random().toString(36).slice(2, 11)}`,
    documentType: 'TD01',
    fiscalYear: 2025,
    items: [{
      id: `item-${id}-1`,
      description: 'Product or Service',
      quantity: Math.floor(Math.random() * 5) + 1,
      unitPrice: Math.round(Math.random() * 1000),
      vatRate: 22,
      totalAmount: Math.round(Math.random() * 2000),
    }],
  };
}

export function getMockInvoices(type: 'incoming' | 'outgoing', page = 1): ApiResponse<Invoice[]> {
  const mockInvoices = Array.from(
    { length: PER_PAGE },
    (_, i) => generateMockInvoice(i, type, page)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    data: mockInvoices,
    meta: {
      total: 100,
      page,
      perPage: PER_PAGE,
      hasMore: page * PER_PAGE < 100,
    },
  };
}