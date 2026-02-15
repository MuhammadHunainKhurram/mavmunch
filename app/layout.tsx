import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'MavMunch - Free Food at UTA',
  description:
    'Discover free food events at University of Texas at Arlington. Never miss a meal, never miss out.',
  keywords: ['UTA', 'free food', 'events', 'Arlington', 'students'],
  authors: [{ name: 'MavMunch' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mavmunch.com',
    title: 'MavMunch - Free Food at UTA',
    description: 'Find free food events at University of Texas at Arlington',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
