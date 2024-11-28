import Image from 'next/image';

export const Logo = () => {
  return <Image priority src='/logo.svg' alt='FruitMart Logo' width={120} height={120} />;
};
