import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Database } from 'lucide-react';
import { useAtom } from 'jotai';
import { LanguageSelector } from '../LanguageSelector';
import { cn } from '../../lib/utils';
import { dataSourceAtom } from '../../store/settings';
import { authTokenAtom, isAuthenticatedAtom } from '../../store/auth';

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [dataSource, setDataSource] = useAtom(dataSourceAtom);
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [authToken] = useAtom(authTokenAtom);

  const handleDataSourceChange = (value: 'mock' | 'sandbox') => {
    setDataSource(value);
    if (value === 'sandbox') {
      // Check if we have a valid token when switching to sandbox
      setIsAuthenticated(!!authToken);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">{t('common.title')}</span>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link
                to="/outgoing"
                className={cn(
                  "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                  location.pathname === "/outgoing" || location.pathname === "/"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                {t('common.outbound')}
              </Link>
              <Link
                to="/incoming"
                className={cn(
                  "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                  location.pathname === "/incoming"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                )}
              >
                {t('common.inbound')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Database className="h-4 w-4 text-gray-500 mr-2" />
              <select
                value={dataSource}
                onChange={(e) => handleDataSourceChange(e.target.value as 'mock' | 'sandbox')}
                className={cn(
                  "appearance-none pl-2 pr-8 py-1",
                  "rounded-md bg-white text-sm font-medium text-gray-700",
                  "border border-gray-300 shadow-sm",
                  "hover:bg-gray-50 focus:outline-none focus:ring-2",
                  "focus:ring-blue-500 focus:ring-offset-2",
                  "cursor-pointer"
                )}
              >
                <option value="mock">{t('common.mockData')}</option>
                <option value="sandbox">{t('common.sandboxData')}</option>
              </select>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </nav>
  );
}