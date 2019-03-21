package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import graphql.model.FileMetadata;
import graphql.repository.FileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Component
@Slf4j
public class FileQuery implements GraphQLQueryResolver {

    @Autowired
    private FileRepository fileRepository;

    @Async("repositoryThreadPoolTaskExecutor")
    public CompletableFuture<List<FileMetadata>> files() {
        log.debug("Started retrieving a files");
        return CompletableFuture.supplyAsync(() -> fileRepository.findAll());
    }
}
