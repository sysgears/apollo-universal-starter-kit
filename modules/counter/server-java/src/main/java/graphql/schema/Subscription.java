package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLSubscriptionResolver;
import graphql.model.Counter;
import graphql.publisher.CounterPublisher;
import io.reactivex.functions.Predicate;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
class Subscription implements GraphQLSubscriptionResolver {

    Logger logger = LogManager.getLogger(Subscription.class);

    @Autowired
    private CounterPublisher counterPublisher;

    public Publisher<Counter> counterUpdated() {
        logger.debug("Server counter -> Subscribe");
        return counterPublisher.getPublisher((Predicate<Counter>) counter -> true);
    }
}
