"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { Suspense, useState } from "react";
import { AuthGuard } from "~/components/auth/AuthGuard";
import { AuthGuardFallback } from "~/components/auth/AuthGuardFallback";
import { Toaster } from "~/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { trpc } from "~/trpc/client";
import { createTRPCHttpBatchClientClient } from "~/trpc/create-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      staleTime: Infinity,
    },
  },
});

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [createTRPCHttpBatchClientClient()],
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <trpc.Provider queryClient={queryClient} client={trpcClient}>
          <Suspense fallback={<AuthGuardFallback />}>
            <AuthGuard>
              <NuqsAdapter>{children}</NuqsAdapter>
            </AuthGuard>
          </Suspense>
          <Toaster richColors position="bottom-right" />
        </trpc.Provider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};
