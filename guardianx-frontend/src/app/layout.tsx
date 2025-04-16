import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientComponentWrapper } from '@/components/ui/ClientComponentWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GuardianX - Infrastructure Protection',
  description: 'Decentralized platform for critical infrastructure protection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientComponentWrapper>
          {children}
        </ClientComponentWrapper>
      </body>
    </html>
  );
}