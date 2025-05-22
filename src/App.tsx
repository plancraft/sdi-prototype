import React from 'react';
import { useAtom } from 'jotai';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { InvoiceList } from './pages/InvoiceList';
import { LoginForm } from './components/LoginForm';
import { isAuthenticatedAtom, authTokenAtom } from './store/auth';
import { dataSourceAtom } from './store/settings';
import { getToken, isTokenExpired } from './lib/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <InvoiceList type="outgoing" />,
      },
      {
        path: '/outgoing',
        element: <InvoiceList type="outgoing" />,
      },
      {
        path: '/incoming',
        element: <InvoiceList type="incoming" />,
      },
    ],
  },
]);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [dataSource] = useAtom(dataSourceAtom);
  const [authToken, setAuthToken] = useAtom(authTokenAtom);

  // Check authentication status when component mounts or when dataSource changes
  React.useEffect(() => {
    if (dataSource === 'sandbox') {
      const storedToken = getToken();
      if (storedToken && !isTokenExpired()) {
        setAuthToken(storedToken);
        setIsAuthenticated(true);
      } else {
        setAuthToken(null);
        setIsAuthenticated(false);
      }
    }
  }, [dataSource, setAuthToken, setIsAuthenticated]);

  // Only show login form if using sandbox data and not authenticated
  if (dataSource === 'sandbox' && !isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <RouterProvider router={router} />;
}

export default App;