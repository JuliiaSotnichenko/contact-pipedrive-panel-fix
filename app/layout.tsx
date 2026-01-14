import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pipedrive Contact Panel',
  description: 'Enhanced contact information panel for Pipedrive',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
