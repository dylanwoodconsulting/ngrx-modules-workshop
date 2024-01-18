import { createActionGroup, emptyProps } from '@ngrx/store';

export const cartDetailActions = createActionGroup({
  source: 'Cart Details Page',
  events: {
    pageOpened: emptyProps(),
    purchaseSuccess: emptyProps(),
  },
});
