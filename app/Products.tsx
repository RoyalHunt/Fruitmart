import { useGetProductsQuery } from '@/store/services/productApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectCartItems, selectCartTotalSum, clearCart } from '@/store/slices/cart';
import { Drawer, Spinner } from '@material-tailwind/react';
import { useTimer } from '@/hooks/useTimer';

import { ProductItem } from './ProductItem';
import { useEffect } from 'react';

export const Products = () => {
  const dispatch = useAppDispatch();
  const { data: products, error, isLoading, refetch } = useGetProductsQuery();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotalSum = useAppSelector(selectCartTotalSum);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const [TimerComponent, { resetTimer }] = useTimer({ time: 300, onTimerEnd: handleClearCart });

  useEffect(() => {
    const eventSource = new EventSource('/events');

    eventSource.addEventListener('connect', (event) => {
      console.log('Connection established:', event.data);
    });

    eventSource.addEventListener('update', (event) => {
      const parsedEvent = JSON.parse(event.data);
      console.log('shouldUpdate:', parsedEvent.message.shouldUpdate);
      if (parsedEvent.message.shouldUpdate) {
        refetch();
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (isLoading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center'>
        <Spinner className='h-14 w-14' color='green' />
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-500'>Error loading products</div>;
  }

  return (
    <div className='mx-auto max-w-screen-xl'>
      <h1 className='mb-4 text-2xl font-semibold'>Fruits</h1>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
        {products?.map((product) => (
          <ProductItem key={product.id} product={product} onItemClick={resetTimer} />
        ))}
      </div>
      <Drawer open={!!cartItems.length} placement='right' overlay={false} size={350}>
        <div className='flex h-full flex-col p-6'>
          <h2 className='mb-4 text-2xl font-bold'>Your Cart</h2>

          {cartItems.map((item) => (
            <div key={item.id} className='flex items-center justify-between'>
              <div className='flex items-center'>
                <h3 className='text-lg font-medium'>{item.name}</h3>
                <p className='ml-2 text-gray-500'>x{item.amount}</p>
              </div>
              <p className='text-lg font-medium'>
                {new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(
                  item.price * item.amount,
                )}
              </p>
            </div>
          ))}
          <div className='mt-6 border-t pt-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold'>Total:</h3>
              <p className='text-lg font-medium'>
                {new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(
                  cartTotalSum,
                )}
              </p>
            </div>
          </div>
          <div className='mt-auto'>
            <p className='mb-2 flex text-lg font-medium'>
              Cart will be expire in:{' '}
              <span className='ml-auto'>
                <TimerComponent />
              </span>
            </p>
            <div className='flex gap-2'>
              <button className='flex-1 rounded-md bg-green-500 py-3 text-white hover:bg-green-600'>
                Proceed to Checkout
              </button>
              <button
                onClick={handleClearCart}
                className='flex h-11 w-11 items-center justify-center rounded-md bg-blue-400 py-3 font-medium hover:bg-blue-200'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#ffffff'
                  strokeWidth='2'
                >
                  <path d='M3 6h18' />
                  <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
                  <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
                  <line x1='10' x2='10' y1='11' y2='17' />
                  <line x1='14' x2='14' y1='11' y2='17' />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
