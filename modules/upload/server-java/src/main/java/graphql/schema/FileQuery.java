package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.File;
import graphql.repository.FileRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Component
public class FileQuery implements GraphQLQueryResolver {

    private final Logger logger = LogManager.getLogger(FileQuery.class);

    @Autowired
    private FileRepository fileRepository;

    @Async("repositoryThreadPoolTaskExecutor")
    public CompletableFuture<List<File>> files() {
        logger.debug("Started retrieving a files");
        return CompletableFuture.supplyAsync(() -> fileRepository.findAll());
    }
}
