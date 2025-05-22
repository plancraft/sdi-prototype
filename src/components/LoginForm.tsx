import React from 'react';
import { useTranslation } from 'react-i18next';
import { LogIn, ExternalLink } from 'lucide-react';
import { useAuth } from '../functions/useAuth';
import { cn } from '../lib/utils';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {t('auth.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.description')}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Sandbox Environment Access</h3>
            <p className="text-sm text-blue-700 mb-3">
              To access the sandbox environment, you need to:
            </p>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
              <li>Register at the Sandbox Dashboard
                <a 
                  href="https://dashboard-sandbox.acubeapi.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-1 text-blue-600 hover:text-blue-800"
                >
                  <span className="underline">dashboard-sandbox.acubeapi.com</span>
                  <ExternalLink className="h-3 w-3 ml-0.5" />
                </a>
              </li>
              <li>Use your registered email and password below</li>
              <li>The system will automatically generate a JWT token for API access</li>
            </ol>
            <div className="mt-4 text-xs text-blue-700">
              <p className="font-medium">API Details:</p>
              <p className="font-mono mt-1">
                POST https://common-sandbox.api.acubeapi.com/login
              </p>
              <p className="mt-2">Headers:</p>
              <p className="font-mono mt-1">Content-Type: application/json</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "block w-full appearance-none rounded-md border px-3 py-2",
                    "placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm",
                    "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "block w-full appearance-none rounded-md border px-3 py-2",
                    "placeholder-gray-400 shadow-sm focus:outline-none sm:text-sm",
                    "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  )}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "flex w-full justify-center rounded-md border border-transparent",
                  "bg-blue-600 py-2 px-4 text-sm font-medium text-white",
                  "hover:bg-blue-700 focus:outline-none focus:ring-2",
                  "focus:ring-blue-500 focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? t('auth.loggingIn') : t('auth.login')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}