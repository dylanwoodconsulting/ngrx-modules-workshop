import { Component } from '@angular/core';
import { from, map, mergeMap, Observable, switchMap, toArray } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartProduct } from '../../model/product';
import { ProductService } from '../../product/product.service';
import { CartService } from '../cart.service';
import { selectCartItems } from '../cart.selectors';
import { cartDetailActions } from './actions';

@Component({
  selector: 'ngrx-workshop-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
})
export class CartDetailsComponent {
  cartProducts$: Observable<CartProduct[]> = this.store
    .select(selectCartItems)
    .pipe(
      switchMap((cartItems) =>
        from(cartItems ?? []).pipe(
          mergeMap((item) =>
            this.productService
              .getProduct(item.productId)
              .pipe(map((product) => ({ ...product, quantity: item.quantity })))
          ),
          toArray()
        )
      )
    );

  total$ = this.cartProducts$.pipe(
    map(
      (cartProducts) =>
        cartProducts &&
        cartProducts.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        )
    )
  );

  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly store: Store
  ) {
    this.cartService.getCartProducts();
  }

  removeOne(id: string) {
    this.cartService.removeProduct(id);
  }

  removeAll() {
    this.cartService.removeAll();
  }

  purchase(products: CartProduct[]) {
    this.cartService
      .purchase(
        products.map(({ id, quantity }) => ({ productId: id, quantity }))
      )
      // 👇 really important not to forget to subscribe
      .subscribe((isSuccess) => {
        if (isSuccess) {
          this.store.dispatch(cartDetailActions.purchaseSuccess());
          this.router.navigateByUrl('');
        } else {
          this.snackBar.open('Purchase error', 'Error', {
            duration: 2500,
          });
        }
      });
  }
}
