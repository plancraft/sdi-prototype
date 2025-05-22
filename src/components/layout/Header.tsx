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
      setIsAuthenticated(!!authToken);
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="ml-2 text-lg sm:text-xl font-bold hidden sm:inline">{t('common.title')}</span>
              <span className="ml-2 text-lg font-bold sm:hidden">SDI</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
          
          {/* Mobile navigation */}
          <div className="sm:hidden flex space-x-4">
            <Link
              to="/outgoing"
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-md",
                location.pathname === "/outgoing" || location.pathname === "/"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500"
              )}
            >
              {t('common.outbound')}
            </Link>
            <Link
              to="/incoming"
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-md",
                location.pathname === "/incoming"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500"
              )}
            >
              {t('common.inbound')}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Database className="h-4 w-4 text-gray-500 mr-2" />
              <select
                value={dataSource}
                onChange={(e) => handleDataSourceChange(e.target.value as 'mock' | 'sandbox')}
                className={cn(
                  "appearance-none pl-2 pr-6 py-1",
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
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}