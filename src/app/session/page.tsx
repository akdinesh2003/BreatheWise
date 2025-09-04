import { Suspense } from 'react';
import SessionPageClient from '@/components/SessionPageClient';

export default function SessionPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-background"><p>Loading session...</p></div>}>
      <SessionPageClient />
    </Suspense>
  );
}
