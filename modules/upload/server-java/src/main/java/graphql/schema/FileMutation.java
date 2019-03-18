package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.FileUpload;
import graphql.repository.FileRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Component
public class FileMutation implements GraphQLMutationResolver {

    private final Logger logger = LogManager.getLogger(FileQuery.class);

    @Autowired
    private FileRepository fileRepository;

    public CompletableFuture<Boolean> uploadFiles(final List<FileUpload> files) {
        return CompletableFuture.supplyAsync(() -> false);
    }

    @Async("repositoryThreadPoolTaskExecutor")
    public Boolean removeFile(Integer id) {
        logger.debug("Started removing a file with [id=" + id + "]");
        Optional<File> maybeFile = fileRepository.findById(id);
        if (maybeFile.isPresent()) {
            File dbFile = maybeFile.get();
            java.io.File toDeleteFile = new java.io.File(dbFile.getPath());
            if(toDeleteFile.delete()) {
                fileRepository.deleteById(dbFile.getId());
                logger.debug("File with [id=" + id + "] successfully removed");
                return true;
            }
            return false;
        } else {
            logger.debug("The file with [id=" + id + "] not found");
            return false;
        }
    }
}
