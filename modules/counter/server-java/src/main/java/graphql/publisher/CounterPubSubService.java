package graphql.publisher;

import graphql.model.Counter;
import graphql.common.subscription.DefaultPubSubService;
import org.springframework.stereotype.Component;

@Component
public class CounterPubSubService extends DefaultPubSubService<Counter> {
}
