import { createFeature, createReducer, on } from '@ngrx/store';

import { ProductModel } from '../model/product';
import { productApiActions } from './actions';

interface ProductState {
  products: ProductModel[] | undefined;
}

const initialState: ProductState = {
  products: undefined,
};

export const productFeature = createFeature({
  name: 'product',
  reducer: createReducer(
    initialState,
    on(productApiActions.productsFetchedSuccess, (state, { products }) => ({
      ...state,
      products: [...products],
    })),
    on(productApiActions.productsFetchedError, (state) => ({
      ...state,
      products: [],
    })),
    on(productApiActions.singleProductFetchedSuccess, (state, { product }) => {
      const productsClone = state.products ? [...state.products] : [];
      const indexOfProduct = productsClone.findIndex(
        (p) => p.id === product.id
      );

      // Remove old one and replace with single product fetch
      if (indexOfProduct < 0) {
        productsClone.push(product);
      } else {
        productsClone.splice(indexOfProduct, 1, product);
      }

      return {
        ...state,
        products: productsClone,
      };
    })
  ),
});
