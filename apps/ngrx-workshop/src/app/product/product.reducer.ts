import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { ProductModel } from '../model/product';
import { productApiActions } from './actions';

export interface ProductState {
  products: EntityState<ProductModel>;
}

export const productAdaptor: EntityAdapter<ProductModel> =
  createEntityAdapter();

const initialState: ProductState = {
  products: productAdaptor.getInitialState(),
};

export const productFeature = createFeature({
  name: 'product',
  reducer: createReducer(
    initialState,
    on(productApiActions.productsFetchedSuccess, (state, { products }) => ({
      products: productAdaptor.upsertMany(products, state.products),
    })),
    on(productApiActions.productsFetchedError, (state) => ({
      products: productAdaptor.setAll([], state.products),
    })),
    on(productApiActions.singleProductFetchedSuccess, (state, { product }) => ({
      products: productAdaptor.upsertOne(product, state.products),
    }))
  ),
});
