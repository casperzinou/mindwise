'use client';

import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import CreateBotPage from './page';

export default function CreateBotPageClient() {
  return (
    <ReactQueryProvider>
      <CreateBotPage />
    </ReactQueryProvider>
  );
}