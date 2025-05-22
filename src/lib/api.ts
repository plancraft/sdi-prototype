import { useAtom } from 'jotai';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { authTokenAtom } from '../store/auth';
import { sampleInvoicePayload } from './mock/simulation';

export function useApi() {
  const [authToken] = useAtom(authTokenAtom);
  const invoiceRepository = new InvoiceRepository(authToken);
  const authRepository = new AuthRepository();

  return {
    getSupplierInvoices: (page: number, token: string | null, useMockData: boolean) => {
      return invoiceRepository.getSupplierInvoices(page, useMockData);
    },
    getCustomerInvoices: (page: number, token: string | null, useMockData: boolean) => {
      return invoiceRepository.getCustomerInvoices(page, useMockData);
    },
    simulateSupplierInvoice: (token: string) => {
      return invoiceRepository.simulateInvoice(sampleInvoicePayload);
    },
    login: (email: string, password: string) => {
      return authRepository.login(email, password);
    }
  };
}