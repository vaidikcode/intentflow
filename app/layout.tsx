import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'IntentFlow — Natural Language DeFi Automation',
  description: 'Write what you want in plain English. AI parses it. Smart contracts execute it on-chain.',
  openGraph: {
    title: 'IntentFlow',
    description: 'Natural Language DeFi Automation Protocol',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
