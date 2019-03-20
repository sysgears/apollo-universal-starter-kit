package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.FileMetadata;
import graphql.model.FileUpload;
import graphql.repository.FileRepository;
import graphql.services.FileService;
import graphql.servlet.GraphQLContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Component
public class FileMutation implements GraphQLMutationResolver {

    private final Logger logger = LogManager.getLogger(FileQuery.class);

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private FileService fileService;

    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<Boolean> uploadFiles(List<FileUpload> files, DataFetchingEnvironment environment) {
        GraphQLContext context = environment.getContext();
        Optional<Map<String, List<Part>>> uploadFiles = context.getFiles();
        return CompletableFuture.supplyAsync(() ->
                uploadFiles.map(keys ->
                        keys.values().parallelStream().map(file ->
                                file.parallelStream().map(f -> {
                                            if (f.getSubmittedFileName() != null) {
                                                String hashedFileName = fileService.hashAppend(f.getSubmittedFileName());
                                                File toStoreFile = new File(fileService.publicDirPath + "/" + hashedFileName);
                                                try {
                                                    toStoreFile.createNewFile();
                                                    f.write(toStoreFile.getPath());
                                                    fileRepository.save(new FileMetadata(
                                                            null,
                                                            f.getSubmittedFileName(),
                                                            f.getContentType(),
                                                            f.getSize(),
                                                            toStoreFile.getPath()));
                                                    logger.debug("File with [name=" + f.getSubmittedFileName() + "] successfully stored!");
                                                    return true;
                                                } catch (IOException e) {
                                                    logger.error("File with [name=" + f.getSubmittedFileName() + "] not stored!");
                                                    return false;
                                                }
                                            } else {
                                                return false;
                                            }
                                        }
                                ).collect(Collectors.toList()).parallelStream().reduce(true, (l, r) -> l == r)
                        ).collect(Collectors.toList()).parallelStream().reduce(true, (l, r) -> l == r)
                ).orElse(false)
        );
    }

    @Async("repositoryThreadPoolTaskExecutor")
    @Transactional
    public CompletableFuture<Boolean> removeFile(Integer id) {
        logger.debug("Started removing a file with [id=" + id + "]");

        return CompletableFuture.supplyAsync(() -> {
                    Optional<FileMetadata> maybeFile = fileRepository.findById(id);
                    if (maybeFile.isPresent()) {
                        FileMetadata dbFileMetadata = maybeFile.get();
                        File toDeleteFile = new File(dbFileMetadata.getPath());
                        if (toDeleteFile.delete()) {
                            fileRepository.deleteById(dbFileMetadata.getId());
                            logger.debug("FileMetadata with [id=" + id + "] successfully removed");
                            return true;
                        }
                        return false;
                    } else {
                        logger.debug("The file with [id=" + id + "] not found");
                        return false;
                    }
                }
        );
    }
}
