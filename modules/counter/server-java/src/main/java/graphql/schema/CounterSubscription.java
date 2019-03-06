package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLSubscriptionResolver;
import graphql.model.Counter;
import graphql.publisher.CounterPubSubService;
import io.reactivex.functions.Predicate;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
class CounterSubscription implements GraphQLSubscriptionResolver {

    @Autowired
    private CounterPubSubService counterPubSubService;

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Publisher<Counter>> counterUpdated() {
        log.debug("Subscribe: counter updated");
        return CompletableFuture.supplyAsync(() -> counterPubSubService.subscribe((Predicate<Counter>) counter -> true));
    }
}
