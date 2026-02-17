import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'MavMunch',
  description:
    'Discover free food events at University of Texas at Arlington. Never miss a meal, never miss out.',
  keywords: ['UTA', 'free food', 'events', 'Arlington', 'students'],
  authors: [{ name: 'MavMunch' }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍕</text></svg>",
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mavmunch.com',
    title: 'MavMunch',
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