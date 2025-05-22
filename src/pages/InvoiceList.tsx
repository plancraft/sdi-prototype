import React from 'react';
import { useAtom } from 'jotai';
import { type ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Import } from 'lucide-react';
import { Invoice } from '../types/invoice';
import { DataTable } from '../components/DataTable';
import { LoadMore } from '../components/LoadMore';
import { ImportModal } from '../components/ImportModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { useApi } from '../lib/api';
import { formatDate, formatCurrency, cn } from '../lib/utils';
import { dataSourceAtom } from '../store/settings';
import { authTokenAtom } from '../store/auth';
import {
  selectedInvoiceAtom,
  invoicesAtom,
  isLoadingAtom,
  errorAtom,
  pageAtom,
  hasMoreAtom,
} from '../store/invoice';
import { getMockInvoices } from '../lib/mock/invoices';

interface InvoiceListProps {
  type: 'incoming' | 'outgoing';
}

export function InvoiceList({ type }: InvoiceListProps) {
  const { t } = useTranslation();
  const api = useApi();
  
  const [page, setPage] = useAtom(pageAtom);
  const [invoices, setInvoices] = useAtom(invoicesAtom);
  const [hasMore, setHasMore] = useAtom(hasMoreAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorAtom);
  const [selectedInvoice, setSelectedInvoice] = useAtom(selectedInvoiceAtom);
  const [dataSource] = useAtom(dataSourceAtom);
  const [authToken] = useAtom(authTokenAtom);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);

  const getInvoiceStatus = (invoice: Invoice): Invoice['status'] => {
    if (invoice.status === 'bezahlt' || invoice.status === 'storniert') {
      return invoice.status;
    }
    
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    return today > dueDate ? 'ueberfaellig' : 'offen';
  };

  const handleStatusChange = (invoice: Invoice, newStatus: Invoice['status']) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => 
        inv.id === invoice.id ? { ...inv, status: newStatus } : inv
      )
    );
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'number',
      header: t('table.invoiceNumber'),
    },
    {
      accessorKey: 'transmissionId',
      header: t('table.transmissionId'),
      cell: ({ row }) => (
        <span className="hidden md:inline-block">{row.original.transmissionId}</span>
      ),
    },
    {
      accessorKey: 'date',
      header: t('table.date'),
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'dueDate',
      header: t('table.dueDate'),
      cell: ({ row }) => (
        <span className="hidden sm:inline-block">{formatDate(row.original.dueDate)}</span>
      ),
    },
    {
      accessorKey: 'counterpartyName',
      header: t('table.name'),
    },
    {
      accessorKey: 'totalAmount',
      header: t('table.amount'),
      cell: ({ row }) => formatCurrency(row.original.totalAmount, row.original.currency),
    },
    {
      accessorKey: 'status',
      header: t('table.status'),
      cell: ({ row }) => {
        const status = getInvoiceStatus(row.original);
        return (
          <span className={cn(
            'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
            {
              'bg-blue-100 text-blue-800': status === 'offen',
              'bg-red-100 text-red-800': status === 'ueberfaellig',
              'bg-green-100 text-green-800': status === 'bezahlt',
              'bg-gray-100 text-gray-800': status === 'storniert',
            }
          )}>
            {t(`common.status.${status}`)}
          </span>
        );
      },
    },
  ];

  const fetchData = async (loadMore = false) => {
    try {
      setIsLoading(true);
      
      let response;
      if (type === 'incoming') {
        response = await api.getSupplierInvoices(
          loadMore ? page + 1 : 1,
          dataSource === 'sandbox' ? authToken! : null,
          dataSource === 'mock'
        );
      } else {
        response = await api.getCustomerInvoices(
          loadMore ? page + 1 : 1,
          dataSource === 'sandbox' ? authToken! : null,
          dataSource === 'mock'
        );
      }
      
      setInvoices(prev => loadMore ? [...prev, ...response.data] : response.data);
      setHasMore(response.meta.hasMore);
      setPage(loadMore ? page + 1 : 1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
      setInvoices([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsLoading(true);
      if (dataSource === 'sandbox') {
        await api.simulateSupplierInvoice(authToken!);
        await fetchData(); // Refresh the list after simulation
      }
      setIsImportModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to simulate supplier invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    try {
      if (dataSource === 'sandbox') {
        const xmlContent = await api.downloadInvoice(invoice.id, authToken!);
        
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${invoice.number}.xml`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download invoice');
    }
  };

  React.useEffect(() => {
    setInvoices([]);
    setPage(1);
    setHasMore(true);
    fetchData();
  }, [type, dataSource]);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{t('common.error')}</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900 sm:text-2xl">
          {t(type === 'incoming' ? 'common.inbound' : 'common.outbound')}
        </h2>
        {type === 'outgoing' && (
          <button
            onClick={handleImport}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Import className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('import.button')}</span>
          </button>
        )}
      </div>
      
      {isLoading && !invoices.length ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={invoices}
            onRowClick={(invoice) => setSelectedInvoice(invoice)}
            loadMoreComponent={
              <LoadMore
                loading={isLoading}
                hasMore={hasMore}
                onLoadMore={() => fetchData(true)}
              />
            }
          />
        </>
      )}

      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
        onDownloadXml={handleDownload}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}