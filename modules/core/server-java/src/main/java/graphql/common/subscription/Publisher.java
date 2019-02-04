package graphql.common.subscription;

import io.reactivex.Flowable;
import io.reactivex.functions.Predicate;

public interface Publisher<T> {

    void publish(T event);
    Flowable<T> subscribe(Predicate predicate);
}
