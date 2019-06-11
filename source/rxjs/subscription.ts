import { PartialObserver, Unsubscribable } from './rxjs';

/**
 * A subscription to a subscriable.
 */
export class Subscription<T> implements Unsubscribable {
    /**
     * Creates a new subscription.
     *
     * @param observer The observer.
     * @param unsubscribe The function to unsubscribe from further updates.
     */
    public constructor(public readonly observer: PartialObserver<T>, public readonly unsubscribe: () => void) {}
}
