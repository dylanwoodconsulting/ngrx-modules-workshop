import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import { ProductModel } from '../model/product';
import { productApiActions } from './actions';
import { LoadingState, RequestStatus } from '../shared/request-status';
import { productsOpened } from './product-list/actions';

export interface ProductState {
  products: EntityState<ProductModel>;
  productsRequestStatus: RequestStatus;
}

export const productAdaptor: EntityAdapter<ProductModel> =
  createEntityAdapter<ProductModel>();

const initialState: ProductState = {
  products: productAdaptor.getInitialState(),
  productsRequestStatus: LoadingState.IDLE,
};

export const productFeature = createFeature({
  name: 'product',
  reducer: createReducer(
    initialState,
    on(productsOpened, (state) => ({
      ...state,
      productsRequestStatus: LoadingState.PENDING,
    })),
    on(productApiActions.productsFetchedSuccess, (state, { products }) => ({
      ...state,
      products: productAdaptor.upsertMany(products, state.products),
      productsRequestStatus: LoadingState.FULFILLED,
    })),
    on(productApiActions.productsFetchedError, (state, { errorMessage }) => ({
      ...state,
      productsRequestStatus: { errorMessage },
    })),
    on(productApiActions.singleProductFetchedSuccess, (state, { product }) => ({
      ...state,
      products: productAdaptor.upsertOne(product, state.products),
    }))
  ),
});
