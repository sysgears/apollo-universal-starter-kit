package graphql.common.subscription;

import io.reactivex.BackpressureStrategy;
import io.reactivex.Flowable;
import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.functions.Predicate;
import io.reactivex.observables.ConnectableObservable;


public abstract class DefaultPublisher<T> {

    private final Flowable<T> publisher;

    private ObservableEmitter<T> emitter;

    public DefaultPublisher() {
        Observable<T> stockPriceUpdateObservable = Observable.create(emitter ->
                this.emitter = emitter
        );

        ConnectableObservable<T> connectableObservable = stockPriceUpdateObservable.share().publish();
        connectableObservable.connect();

        publisher = connectableObservable.toFlowable(BackpressureStrategy.BUFFER);
    }

    public ObservableEmitter<T> getEmitter() {
        return this.emitter;
    }

    public Flowable<T> getPublisher(Predicate predicate) {
        return publisher.filter(predicate);
    }
}
