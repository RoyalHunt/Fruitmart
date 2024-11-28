import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type Product = {
  id: string;
  name: string;
  price: number;
  stockLevel: number;
};

type CartItem = Product & {
  amount: number;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {} as Record<string, CartItem>,
  },
  reducers: {
    addToCart: (state, { payload }: PayloadAction<CartItem>) => {
      const existingItem = state.items[payload.id];

      if (existingItem) {
        state.items[payload.id] = {
          ...existingItem,
          amount: existingItem.amount + payload.amount,
        };
      } else {
        state.items[payload.id] = payload;
      }
    },

    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const selectCartItems = createSelector(
  (state: RootState) => state.cart.items,
  (items) => Object.values(items),
);

export const selectCartItemById = (id: string) =>
  createSelector(
    (state: RootState) => state.cart.items,
    (items) => items[id],
  );

export const selectCartTotalAmount = createSelector(selectCartItems, (items) => items.length);

export const selectCartTotalSum = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.price * item.amount, 0),
);

export const { addToCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
