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
    }))
  ),
});
