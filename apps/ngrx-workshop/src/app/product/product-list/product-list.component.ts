import { Component, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Store, createSelector } from '@ngrx/store';

import { Rating } from '@angular-monorepo/api-interfaces';
import { RatingService } from '../rating.service';
import { ProductModel } from '../../model/product';
import * as productActions from './actions';
import { selectProducts } from '../product.selectors';
import { productFeature } from '../product.reducer';

const productListVm = createSelector({
  products: selectProducts,
  productsRequestStatus: productFeature.selectProductsRequestStatus,
});

@Component({
  selector: 'ngrx-workshop-home',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productListVm$ = this.store.select(productListVm);
  customerRatings$?: Observable<{ [productId: string]: Rating }>;

  constructor(
    private readonly ratingService: RatingService,
    private readonly store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(productActions.productsOpened());

    this.customerRatings$ = this.ratingService.getRatings().pipe(
      map((ratingsArray) =>
        // Convert from Array to Indexable.
        ratingsArray.reduce(
          (acc: { [productId: string]: Rating }, ratingItem) => {
            acc[ratingItem.productId] = ratingItem.rating;
            return acc;
          },
          {}
        )
      ),
      shareReplay({
        refCount: true,
        bufferSize: 1,
      })
    );
  }
}
