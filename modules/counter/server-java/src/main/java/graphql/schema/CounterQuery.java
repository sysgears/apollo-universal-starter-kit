package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.Counter;
import graphql.repository.CounterRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Component
public class CounterQuery implements GraphQLQueryResolver {

    @Autowired
    private CounterRepository counterRepository;

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Counter> serverCounter() {
        log.debug("Get counter");
        return counterRepository.findOneById(1);
    }
}
