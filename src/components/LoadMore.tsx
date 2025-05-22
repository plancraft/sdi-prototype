import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoadMoreProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function LoadMore({ loading, hasMore, onLoadMore }: LoadMoreProps) {
  const { t } = useTranslation();

  if (!hasMore) return null;

  return (
    <tr>
      <td colSpan={7} className="px-4 py-4">
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className={cn(
              "inline-flex items-center px-4 py-2 text-sm font-medium",
              "text-gray-700 bg-white border border-gray-300 rounded-md",
              "hover:bg-gray-50 focus:outline-none focus:ring-2",
              "focus:ring-offset-2 focus:ring-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {t('common.loadMore')}
          </button>
        </div>
      </td>
    </tr>
  );
}