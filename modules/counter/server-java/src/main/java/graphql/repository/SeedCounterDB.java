package graphql.repository;

import graphql.model.Counter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class SeedCounterDB implements ApplicationRunner {

    Logger logger = LogManager.getLogger(SeedCounterDB.class);

    public static final Integer COUNTER_ID = 1;

    @Autowired
    private CounterRepository counterRepository;

    @Override
    public void run(ApplicationArguments args) {
        long count = counterRepository.count();

        if (count == 0) {
            logger.debug("Init DB. Table [COUNTER]");
            counterRepository.save(Counter.builder().amount(1).id(COUNTER_ID).build());
        }
    }
}
