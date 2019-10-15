package graphql.common.subscription;

import io.reactivex.BackpressureStrategy;
import io.reactivex.Flowable;
import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.functions.Predicate;
import io.reactivex.observables.ConnectableObservable;


public abstract class DefaultPubSubService<T> implements PubSubService<T> {

    private final Flowable<T> publisher;

    private ObservableEmitter<T> emitter;

    public DefaultPubSubService() {
        Observable<T> stockPriceUpdateObservable = Observable.create(emitter ->
                this.emitter = emitter
        );

        ConnectableObservable<T> connectableObservable = stockPriceUpdateObservable.share().publish();
        connectableObservable.connect();

        publisher = connectableObservable.toFlowable(BackpressureStrategy.BUFFER);
    }

    public Flowable<T> subscribe(Predicate predicate) {
        return this.publisher.filter(predicate);
    }

    public void publish(T event) {
        this.emitter.onNext(event);
    }
}
