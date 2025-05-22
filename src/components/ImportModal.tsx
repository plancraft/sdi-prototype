import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download } from 'lucide-react';
import { formatDate, formatCurrency, cn } from '../lib/utils';
import { mapDocumentToFatturaPAXml } from '../lib/xml';
import type { DBDocument } from '../types/document';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (document: DBDocument, xmlContent: string) => void;
}

export function ImportModal({ isOpen, onClose, onConfirm }: ImportModalProps) {
  const { t } = useTranslation();
  const [document, setDocument] = React.useState<DBDocument | null>(null);
  const [xmlOptions, setXmlOptions] = React.useState({
    isSplitPayment: false,
    isReverseCharge: false,
  });
  const [xmlPreview, setXmlPreview] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      const currentDate = new Date();
      const dueDate = new Date(currentDate);
      dueDate.setDate(dueDate.getDate() + 30); // 30 days payment term

      // Mock document data for testing
      const mockDocument: DBDocument = {
        recipient: {
          name: 'Example Corp',
          street: 'Via Roma 123',
          city: 'Milano',
          zipCode: '20121',
        },
        recipientVATNumber: 'IT12345678901',
        editorName: 'Your Company Name',
        editorEmail: 'info@yourcompany.com',
        editorPhone: '+39 02 1234567',
        totalNet: 1000.00,
        totalTax: 220.00,
        totalGross: 1220.00,
        taxType: 'VAT',
        date: currentDate.toISOString(),
        dueDate: dueDate.toISOString(),
        status: 'offen',
        publishedId: 'INV-2024-001',
        name: 'Construction services',
      };
      setDocument(mockDocument);
      
      // Generate initial XML preview
      const xml = mapDocumentToFatturaPAXml(mockDocument, xmlOptions);
      setXmlPreview(xml);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (document) {
      const xml = mapDocumentToFatturaPAXml(document, xmlOptions);
      setXmlPreview(xml);
    }
  }, [document, xmlOptions]);

  const handleDownloadXml = () => {
    if (!document || !xmlPreview) return;

    try {
      const blob = new Blob([xmlPreview], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${document.publishedId}.xml`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading XML:', error);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{t('import.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('import.preview')}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {t('import.recipient')}
                </label>
                <div className="mt-1 text-sm">
                  {document.recipient.name}<br />
                  {document.recipient.street}<br />
                  {document.recipient.zipCode} {document.recipient.city}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {t('import.vatNumber')}
                </label>
                <div className="mt-1 text-sm">
                  {document.recipientVATNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {t('import.amount')}
                </label>
                <div className="mt-1 text-sm">
                  {formatCurrency(document.totalGross, 'EUR')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {t('import.date')}
                </label>
                <div className="mt-1 text-sm">
                  {formatDate(document.date)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {t('import.dueDate')}
                </label>
                <div className="mt-1 text-sm">
                  {formatDate(document.dueDate)}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">{t('import.options.title')}</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={xmlOptions.isSplitPayment}
                    onChange={(e) => setXmlOptions(prev => ({ ...prev, isSplitPayment: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{t('import.options.splitPayment')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={xmlOptions.isReverseCharge}
                    onChange={(e) => setXmlOptions(prev => ({ ...prev, isReverseCharge: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{t('import.options.reverseCharge')}</span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t('import.xml.preview')}</h3>
                <button
                  onClick={handleDownloadXml}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  {t('import.xml.download')}
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
                {xmlPreview}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            {t('import.cancel')}
          </button>
          <button
            onClick={() => onConfirm(document, xmlPreview)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {t('import.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}