import type { PropsWithChildren } from 'react';
import { cn } from '../lib/utils';

interface PageWrapperProps extends PropsWithChildren {
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={cn("flex flex-col min-h-screen items-center justify-center p-4 sm:p-6 md:p-8 ", className)}>
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  );
}
