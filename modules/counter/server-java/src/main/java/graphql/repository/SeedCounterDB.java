package graphql.repository;

import graphql.model.Counter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SeedCounterDB implements ApplicationRunner {

    public static final Integer COUNTER_ID = 1;

    @Autowired
    private CounterRepository counterRepository;

    @Override
    public void run(ApplicationArguments args) {
        long count = counterRepository.count();

        if (count == 0) {
            log.debug("Init DB. Table [COUNTER]");
            counterRepository.save(Counter.builder().amount(1).id(COUNTER_ID).build());
        }
    }
}
