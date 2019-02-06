package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLSubscriptionResolver;
import graphql.model.Counter;
import graphql.publisher.CounterPubSubService;
import io.reactivex.functions.Predicate;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
class CounterSubscription implements GraphQLSubscriptionResolver {

    Logger logger = LogManager.getLogger(CounterSubscription.class);

    @Autowired
    private CounterPubSubService counterPubSubService;

    public Publisher<Counter> counterUpdated() {
        logger.debug("Server counter -> Subscribe");
        return counterPubSubService.subscribe((Predicate<Counter>) counter -> true);
    }
}
