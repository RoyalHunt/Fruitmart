'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';

import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-sans antialiased'>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
