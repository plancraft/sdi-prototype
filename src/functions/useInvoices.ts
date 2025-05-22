import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { dataSourceAtom } from '../store/settings';
import { authTokenAtom } from '../store/auth';
import type { Invoice } from '../types/invoice';
import { sampleInvoicePayload } from '../lib/mock/simulation';

export function useInvoices(type: 'incoming' | 'outgoing') {
  const [dataSource] = useAtom(dataSourceAtom);
  const [authToken] = useAtom(authTokenAtom);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const repository = new InvoiceRepository(authToken);

  const fetchInvoices = async (loadMore = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const newPage = loadMore ? page + 1 : 1;
      const response = await repository.getInvoices(
        type,
        newPage,
        dataSource === 'mock'
      );

      setInvoices(prev => loadMore ? [...prev, ...response.data] : response.data);
      setHasMore(response.meta.hasMore);
      setPage(newPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
      setInvoices([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateInvoice = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await repository.simulateInvoice(sampleInvoicePayload);
      await fetchInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate invoice');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setInvoices([]);
    setPage(1);
    setHasMore(true);
    fetchInvoices();
  }, [type, dataSource]);

  return {
    invoices,
    isLoading,
    error,
    hasMore,
    fetchMore: () => fetchInvoices(true),
    simulateInvoice,
  };
}