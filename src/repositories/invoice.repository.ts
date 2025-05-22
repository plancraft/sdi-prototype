import type { Invoice, ApiResponse } from '../types/invoice';
import { getMockInvoices } from '../lib/mock/invoices';

const ACUBE_API_URL = 'https://api-sandbox.acubeapi.com';

export class InvoiceRepository {
  constructor(private readonly token: string | null) {}

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${ACUBE_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Authorization': this.token ? `Bearer ${this.token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    return response;
  }

  private mapInvoiceFromApi(item: any, type: 'incoming' | 'outgoing'): Invoice {
    return {
      id: item.id,
      number: item.number,
      date: item.date,
      dueDate: item.due_date,
      counterpartyName: item.counterparty_name,
      totalAmount: item.total_amount,
      currency: item.currency,
      status: item.status,
      type,
      transmissionFormat: item.transmission_format,
      transmissionId: item.transmission_id,
      documentType: item.document_type,
      fiscalYear: item.fiscal_year,
      items: item.items.map((lineItem: any) => ({
        id: lineItem.id,
        description: lineItem.description,
        quantity: lineItem.quantity,
        unitPrice: lineItem.unit_price,
        vatRate: lineItem.vat_rate,
        totalAmount: lineItem.total_amount,
      })),
    };
  }

  async getSupplierInvoices(page: number, useMockData: boolean): Promise<ApiResponse<Invoice[]>> {
    if (useMockData) {
      return getMockInvoices('incoming', page);
    }

    if (!this.token) {
      throw new Error('Authentication required');
    }

    const response = await this.fetchWithAuth(`/supplier-invoices?page=${page}&per_page=25`);
    const data = await response.json();

    return {
      data: data.invoices.map((item: any) => this.mapInvoiceFromApi(item, 'incoming')),
      meta: {
        total: data.total,
        page: data.page,
        perPage: data.per_page,
        hasMore: data.has_more,
      },
    };
  }

  async getCustomerInvoices(page: number, useMockData: boolean): Promise<ApiResponse<Invoice[]>> {
    if (useMockData) {
      return getMockInvoices('outgoing', page);
    }

    if (!this.token) {
      throw new Error('Authentication required');
    }

    const response = await this.fetchWithAuth(`/customer-invoices?page=${page}&per_page=25`);
    const data = await response.json();

    return {
      data: data.invoices.map((item: any) => this.mapInvoiceFromApi(item, 'outgoing')),
      meta: {
        total: data.total,
        page: data.page,
        perPage: data.per_page,
        hasMore: data.has_more,
      },
    };
  }

  async simulateInvoice(payload: any): Promise<void> {
    if (!this.token) {
      throw new Error('Authentication required');
    }

    await this.fetchWithAuth('/simulate/supplier-invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }
}