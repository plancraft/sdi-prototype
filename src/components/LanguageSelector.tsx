import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const languages = [
  { code: 'en-GB', name: 'English' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'de-IT', name: 'Deutsch' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="relative inline-block text-left">
      <div className="relative inline-flex items-center">
        <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className={cn(
            "appearance-none pl-8 pr-4 py-2",
            "rounded-md bg-white text-sm font-medium text-gray-700",
            "border border-gray-300 shadow-sm",
            "hover:bg-gray-50 focus:outline-none focus:ring-2",
            "focus:ring-blue-500 focus:ring-offset-2",
            "cursor-pointer"
          )}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}