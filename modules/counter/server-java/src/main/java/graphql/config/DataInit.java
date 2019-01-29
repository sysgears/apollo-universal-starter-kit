package graphql.config;

import graphql.model.Counter;
import graphql.repository.CounterRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInit implements ApplicationRunner {

    Logger logger = LogManager.getLogger(DataInit.class);

    private CounterRepository counterRepository;

    @Autowired
    public DataInit(CounterRepository counterRepository) {
        this.counterRepository = counterRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        long count = counterRepository.count();

        if (count == 0) {
            logger.info("Init DB. Table [COUNTER]");
            counterRepository.save(Counter.builder().amount(1).build());
        }
    }
}
