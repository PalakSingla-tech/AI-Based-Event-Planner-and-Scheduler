import { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
