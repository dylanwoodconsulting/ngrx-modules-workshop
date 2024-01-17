import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, filter, map, shareReplay, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { ProductService } from '../product.service';
import { RatingService } from '../rating.service';
import { productDetailsActions } from './actions';
import { Rating } from '@angular-monorepo/api-interfaces';

@Component({
  selector: 'ngrx-workshop-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  readonly productId$ = this.router.paramMap.pipe(
    map((params: ParamMap) => params.get('productId')),
    filter((id: string | null): id is string => id != null),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly product$ = this.productId$.pipe(
    switchMap((id) => this.productService.getProduct(id))
  );

  protected customerRating$ = new BehaviorSubject<number | undefined>(
    undefined
  );

  constructor(
    private readonly router: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly ratingService: RatingService,
    private readonly location: Location,
    private readonly store: Store
  ) {
    this.productId$
      .pipe(switchMap((id) => this.ratingService.getRating(id)))
      .subscribe((productRating) =>
        this.customerRating$.next(productRating && productRating.rating)
      );
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
