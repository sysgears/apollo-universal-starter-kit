package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.Counter;
import graphql.repository.CounterRepository;
import org.apache.logging.log4j.LogManager;

import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class CounterQuery implements GraphQLQueryResolver {

    Logger logger = LogManager.getLogger(CounterQuery.class);

    @Autowired
    private CounterRepository counterRepository;

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Counter> serverCounter() {
        logger.debug("Get counter");
        return counterRepository.findOneById(1);
    }
}
