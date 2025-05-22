import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, FileText } from 'lucide-react';
import { formatDate, formatCurrency, cn } from '../lib/utils';
import type { Invoice } from '../types/invoice';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onDownloadXml: (invoice: Invoice) => void;
  onStatusChange: (invoice: Invoice, newStatus: Invoice['status']) => void;
}

export function InvoiceModal({ isOpen, onClose, invoice, onDownloadXml, onStatusChange }: InvoiceModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'details' | 'items'>('details');

  if (!isOpen || !invoice) return null;

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'offen':
        return 'bg-blue-50 text-blue-800';
      case 'ueberfaellig':
        return 'bg-red-50 text-red-800';
      case 'bezahlt':
        return 'bg-green-50 text-green-800';
      case 'storniert':
        return 'bg-gray-50 text-gray-800';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold">{invoice.number}</h2>
              <p className="text-sm text-gray-500">{invoice.transmissionId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('invoice.details')}
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'items'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('invoice.items')}
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('invoice.counterparty')}</h3>
                <p className="mt-1 text-sm text-gray-900">{invoice.counterpartyName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('invoice.date')}</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('invoice.dueDate')}</h3>
                <p className="mt-1 text-sm text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('invoice.amount')}</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('invoice.status')}</h3>
                <div className="mt-1">
                  <select
                    value={invoice.status}
                    onChange={(e) => onStatusChange(invoice, e.target.value as Invoice['status'])}
                    className={cn(
                      "mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base",
                      "focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm",
                      getStatusColor(invoice.status)
                    )}
                  >
                    <option value="offen" className="bg-blue-50 text-blue-800">
                      {t('common.status.offen')}
                    </option>
                    <option value="bezahlt" className="bg-green-50 text-green-800">
                      {t('common.status.bezahlt')}
                    </option>
                    <option value="storniert" className="bg-gray-50 text-gray-800">
                      {t('common.status.storniert')}
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('invoice.fiscalYear')}</h3>
                <p className="mt-1 text-sm text-gray-900">{invoice.fiscalYear}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('invoice.item.description')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('invoice.item.quantity')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('invoice.item.unitPrice')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('invoice.item.vatRate')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('invoice.item.total')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.unitPrice, invoice.currency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.vatRate}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.totalAmount, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      {t('invoice.total')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(invoice.totalAmount, invoice.currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={() => onDownloadXml(invoice)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('invoice.downloadXml')}
          </button>
        </div>
      </div>
    </div>
  );
}