package graphql.repository;

import graphql.model.FileMetadata;
import graphql.services.FileService;
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

    @Autowired
    private FileService fileService;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        long count = fileRepository.count();

        if (count == 0) {
            logger.debug("Starting seed file database");

            String fileName = "avatar.jpg";

            fileService.createNewFile(fileName).thenAccept(file -> {
                fileRepository.save(FileMetadata.builder()
                        .id(1)
                        .name(file.getName())
                        .type(fileService.getFileExtension(file.getName()))
                        .size((Long) file.length())
                        .path(file.getPath())
                        .build()
                );
                logger.debug("FileMetadata database successfully seeded");
            });
        }
    }
}