import { Link, useRouterState } from '@tanstack/react-router';
import { Shield, Search, Activity, FileText } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/', label: 'Overview', icon: Shield },
    { path: '/url-analyzer', label: 'URL Analyzer', icon: Search },
    { path: '/process-monitoring', label: 'Process Monitor', icon: Activity },
    { path: '/security-reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/assets/generated/security-shield-logo.dim_256x256.png" 
                alt="PhishGuard Logo" 
                className="h-10 w-10 transition-transform group-hover:scale-110"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  PhishGuard
                </h1>
                <p className="text-xs text-muted-foreground">Security Detection System</p>
              </div>
            </Link>
            <nav className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border mt-16 py-6 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} PhishGuard Security System. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'phishguard-app'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
