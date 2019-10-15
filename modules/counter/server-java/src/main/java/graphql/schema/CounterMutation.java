package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.Counter;
import graphql.publisher.CounterPubSubService;
import graphql.repository.CounterRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

import static graphql.repository.SeedCounterDB.COUNTER_ID;

@Slf4j
@Component
public class CounterMutation implements GraphQLMutationResolver {

    @Autowired
    private CounterRepository counterRepository;

    @Autowired
    private CounterPubSubService counterPubSubService;

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Counter> addServerCounter(Integer amount) {
        return counterRepository.findOneById(COUNTER_ID)
            .thenApplyAsync(counter -> {
                Integer currentAmount = counter.getAmount();
                counter.setAmount(currentAmount + amount);
                log.debug("Update amount");
                Counter savedCounter = counterRepository.save(counter);
                log.debug("Publish element [Counter]");
                counterPubSubService.publish(savedCounter);
                return savedCounter;
            });
    }
}
