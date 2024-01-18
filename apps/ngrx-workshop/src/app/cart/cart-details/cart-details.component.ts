import { Component } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartProduct } from '../../model/product';
import { CartService } from '../cart.service';
import { selectCartProducts, selectCartTotal } from '../cart.selectors';
import { cartDetailActions } from './actions';

const cartDetailsVm = createSelector({
  products: selectCartProducts,
  total: selectCartTotal,
});

@Component({
  selector: 'ngrx-workshop-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
})
export class CartDetailsComponent {
  cartDetailsVm$ = this.store.select(cartDetailsVm);

  constructor(
    private readonly cartService: CartService,
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
