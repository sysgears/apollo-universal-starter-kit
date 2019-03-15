package graphql.repository;

import graphql.model.File;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
public class SeedFileDB implements ApplicationRunner {

    private final Logger logger = LogManager.getLogger(SeedFileDB.class);

    @Autowired
    private FileRepository fileRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        long count = fileRepository.count();

        if (count == 0) {
            logger.debug("Starting seed file database");

//            TODO:add creating file on file system
            fileRepository.save(File.builder()
                    .id(1)
                    .name("avatar")
                    .type("jpg")
                    .size(12000514L)
                    .path("/tmp/avatar.jpg")
                    .build()
            );
        }
        logger.debug("File database successfully seeded");
    }
}