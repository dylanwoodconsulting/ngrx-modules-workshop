/** Enum representing different possible loading states of ajax call */
export enum LoadingState {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
}

/** Enum representing error state of ajax call */
export interface ErrorState {
  errorMessage: string;
}

export type RequestStatus = LoadingState | ErrorState;

/** Helper function to extract error, if there is one. */
export function getErrorMessage(callState: RequestStatus): string | undefined {
  if ((callState as ErrorState).errorMessage != null) {
    return (callState as ErrorState).errorMessage;
  }

  return undefined;
}
