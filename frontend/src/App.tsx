import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import SystemOverviewDashboard from './components/SystemOverviewDashboard';
import URLAnalyzer from './components/URLAnalyzer';
import ProcessMonitoringDashboard from './components/ProcessMonitoringDashboard';
import SecurityReportDashboard from './components/SecurityReportDashboard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SystemOverviewDashboard,
});

const urlAnalyzerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/url-analyzer',
  component: URLAnalyzer,
});

const processMonitoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/process-monitoring',
  component: ProcessMonitoringDashboard,
});

const securityReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/security-reports',
  component: SecurityReportDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  urlAnalyzerRoute,
  processMonitoringRoute,
  securityReportsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
