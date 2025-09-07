'use client';

import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import DashboardPage from './page';

export default function DashboardPageClient() {
  return (
    <ReactQueryProvider>
      <DashboardPage />
    </ReactQueryProvider>
  );
}