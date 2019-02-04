package graphql.publisher;

import graphql.model.Counter;
import graphql.common.subscription.DefaultPublisher;
import org.springframework.stereotype.Component;

@Component
public class CounterPublisher extends DefaultPublisher<Counter> {
}
