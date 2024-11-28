import { Typography } from '@material-tailwind/react';
import { Logo } from '../Logo';

type FooterProps = {
  withLogo?: boolean;
  items?: { label: string; href: string }[];
};

export function Footer({ withLogo = true, items = [] }: FooterProps) {
  return (
    <footer className='bg-white px-4 lg:px-6'>
      <div className='mx-auto flex max-w-screen-xl flex-row flex-wrap items-center justify-center gap-x-12 gap-y-6 text-center md:justify-between'>
        {withLogo && <Logo />}
        <ul className='flex flex-wrap items-center gap-x-8 gap-y-2'>
          {items.map((item, index) => (
            <li key={index}>
              <Typography
                as='a'
                href={item.href}
                color='blue-gray'
                className='font-normal transition-colors hover:text-blue-500 focus:text-blue-500'
              >
                {item.label}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
