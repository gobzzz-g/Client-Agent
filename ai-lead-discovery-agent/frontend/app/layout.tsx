import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Sidebar from '@/components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'AI Lead Discovery Agent',
  description: 'Discover, analyze, and score business leads using AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-surface text-slate-100 min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main content area — pushed right by sidebar width */}
            <main className="flex-1 ml-64 min-h-screen flex flex-col">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
