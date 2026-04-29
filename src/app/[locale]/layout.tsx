import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CopyCodeHandler } from '@/components/CopyCodeHandler';

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased bg-cover bg-center bg-fixed bg-no-repeat" style={{ backgroundImage: 'url(/images/bg.svg)' }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
              {children}
            </main>
            <Footer />
            <CopyCodeHandler />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
