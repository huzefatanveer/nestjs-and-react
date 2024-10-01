// redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addItem: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.name === action.payload.name
      );

      if (itemIndex >= 0) {
        // If item already exists in the cart, increase its quantity
        state.items[itemIndex].quantity += 1;
      } else {
        // Otherwise, add new item with quantity 1
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementItem: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.name === action.payload.name
      );
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity += 1;
      }
    },
    decrementItem: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.name === action.payload.name
      );
      if (itemIndex >= 0 && state.items[itemIndex].quantity > 1) {
        state.items[itemIndex].quantity -= 1;
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.name !== action.payload.name);
    },
  },
});

export const { addItem, incrementItem, decrementItem, removeItem } = cartSlice.actions;
export const getItemsSelector = (state) => state.cart.items;
export default cartSlice.reducer;
