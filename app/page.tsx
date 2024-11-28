'use client';

import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';
import { initMSW } from '@/mocks/server';
import { useEffect, useState } from 'react';
import { Products } from './Products';

const footerItems = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export default function Home() {
  const [isMSWReady, setIsMSWReady] = useState(false);

  useEffect(() => {
    const setupMSW = async () => {
      if (process.env.NEXT_PUBLIC_MSW_ENABLED === 'true') {
        try {
          await initMSW();
          setIsMSWReady(true);
        } catch (error) {
          console.error('MSW initialization failed:', error);
          setIsMSWReady(true);
        }
      }
    };

    setupMSW();
  }, []);

  if (!isMSWReady) {
    return null;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <header>
        <nav className='border-gray-200 bg-white px-4 dark:bg-gray-800 lg:px-6'>
          <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between'>
            <a href='#' className='flex items-center'>
              <Logo />
            </a>
          </div>
        </nav>
      </header>
      <main className='flex-grow px-8'>
        <Products />
      </main>

      <Footer withLogo items={footerItems} />
    </div>
  );
}
