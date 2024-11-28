import { useAppDispatch, useAppSelector } from '@/store/store';
import { addToCart, Product, selectCartItemById } from '@/store/slices/cart';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type ProductItemProps = {
  product: Product;
  onItemClick: () => void;
};

export const ProductItem = ({ product, onItemClick }: ProductItemProps) => {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const cartItemAmount = useAppSelector(selectCartItemById(product.id))?.amount || 0;

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${product.name}&per_page=1`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API || '',
          },
        },
      );
      const data = await response.json();
      if (data.photos) {
        setImage(data.photos[0].src.medium);
      }
    };

    fetchImage();
  }, [product.name]);

  const handleAddToCart = (product: Product) => {
    if (quantity <= product.stockLevel) {
      dispatch(addToCart({ ...product, amount: quantity }));
      setQuantity(1);
      onItemClick();
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    const availableStock = product.stockLevel - cartItemAmount;
    const constrainedQuantity = Math.min(Math.max(1, newQuantity), availableStock);

    setQuantity(constrainedQuantity);
  };

  const availableStock = product.stockLevel - cartItemAmount;

  return (
    <div className='flex flex-col rounded border'>
      {image && (
        <Image
          src={image}
          alt={product.name}
          className='aspect-video w-full rounded object-cover'
          width={200}
          height={200}
          priority
        />
      )}
      <div className='flex flex-1 flex-col p-4'>
        <h2 className='text-xl font-bold'>{product.name}</h2>
        <p>
          Price:{' '}
          {new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD' }).format(
            product.price,
          )}
        </p>
        <p className='my-3'>{!!availableStock ? `Available: ${availableStock}` : 'Out of Stock'}</p>

        {!!availableStock && (
          <div className='my-3 flex items-center gap-2'>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity === 1}
              className='h-10 w-10 cursor-pointer rounded bg-gray-200 text-lg font-bold'
            >
              -
            </button>
            <input
              type='number'
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className='w-12 border text-center'
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity === availableStock}
              className='h-10 w-10 cursor-pointer rounded bg-gray-200 text-lg font-bold'
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={() => handleAddToCart(product)}
          disabled={!availableStock}
          className={`mt-auto rounded px-4 py-2 ${!!availableStock ? 'bg-green-500 text-white hover:bg-green-600' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
