import { selectCurrentProductId } from './../product.selectors';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { RatingService } from '../rating.service';
import { productDetailsActions } from './actions';
import { Rating } from '@angular-monorepo/api-interfaces';
import { selectCurrentProduct } from '../product.selectors';

@Component({
  selector: 'ngrx-workshop-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  readonly product$ = this.store.select(selectCurrentProduct);

  protected customerRating$ = new BehaviorSubject<number | undefined>(
    undefined
  );

  constructor(
    private readonly ratingService: RatingService,
    private readonly location: Location,
    private readonly store: Store
  ) {
    this.store
      .select(selectCurrentProductId)
      .pipe(
        filter((id: string | undefined): id is string => id != null),
        switchMap((id) => this.ratingService.getRating(id))
      )
      .subscribe((productRating) =>
        this.customerRating$.next(productRating && productRating.rating)
      );

    this.store.dispatch(productDetailsActions.pageOpened());
  }

  setRating(productId: string, rating: Rating) {
    this.ratingService
      .setRating({ productId, rating })
      .pipe(
        map((arr) =>
          arr.find((productRating) => productId === productRating.productId)
        ),
        filter(
          (productRating): productRating is NonNullable<typeof productRating> =>
            productRating != null
        ),
        map((productRating) => productRating.rating)
      )
      .subscribe((newRating) => this.customerRating$.next(newRating));
  }

  addToCart(productId: string) {
    this.store.dispatch(productDetailsActions.addToCartClicked({ productId }));
  }

  back() {
    this.location.back();
  }
}
