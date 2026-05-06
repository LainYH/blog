import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Lain's Blog",
  description: 'Here\'s some strange things.',
  icons: {
    icon: '/blog/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
