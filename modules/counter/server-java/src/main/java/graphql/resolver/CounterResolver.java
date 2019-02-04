package graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLResolver;
import graphql.model.Counter;
import org.springframework.stereotype.Component;

@Component
public class CounterResolver implements GraphQLResolver<Counter> {
}
