import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, filter, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { ProductService } from './product.service';
import * as productListActions from './product-list/actions';
import { productApiActions } from './actions';
import { productDetailsActions } from './product-details/actions';
import { selectCurrentProductId } from './product.selectors';

@Injectable()
export class ProductEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly productService: ProductService,
    private readonly store: Store
  ) {}

  fetchProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(productListActions.productsOpened),
      exhaustMap(() =>
        this.productService.getProducts().pipe(
          map((products) =>
            productApiActions.productsFetchedSuccess({
              products,
            })
          ),
          catchError(() =>
            of(
              productApiActions.productsFetchedError({
                errorMessage: 'Error Fetching Products',
              })
            )
          )
        )
      )
    );
  });

  fetchCurrentProduct$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(productDetailsActions.pageOpened),
      concatLatestFrom(() =>
        this.store
          .select(selectCurrentProductId)
          .pipe(filter((id): id is string => id != null))
      ),
      switchMap(([, id]) =>
        this.productService.getProduct(id).pipe(
          map((product) =>
            productApiActions.singleProductFetchedSuccess({ product })
          ),
          catchError(() =>
            of(
              productApiActions.singleProductFetchedError({
                errorMessage: 'Error Fetching Single Product',
              })
            )
          )
        )
      )
    );
  });
}
