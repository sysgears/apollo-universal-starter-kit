package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.FileMetadata;
import graphql.model.FileUpload;
import graphql.repository.FileRepository;
import graphql.services.FileService;
import graphql.servlet.GraphQLContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Stream;

@Component
@Slf4j
public class FileMutation implements GraphQLMutationResolver {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private FileService fileService;

    @Async("resolverThreadPoolTaskExecutor")
    @Transactional
    public CompletableFuture<Boolean> uploadFiles(List<FileUpload> files, DataFetchingEnvironment environment) {
        GraphQLContext context = environment.getContext();
        Optional<Map<String, List<Part>>> uploadFiles = context.getFiles();

        return CompletableFuture.supplyAsync(() ->
                uploadFiles.map(keys ->
                        keys.values().stream().flatMap(Collection::stream).flatMap(f -> {
                                    if (f.getSubmittedFileName() == null) return Stream.of(false);
                                    String hashedFileName = fileService.hashAppend(f.getSubmittedFileName());
                                    File toStoreFile = new File(fileService.publicDirPath + "/" + hashedFileName);
                                    try {
                                        f.write(toStoreFile.getPath());
                                        fileRepository.save(new FileMetadata(
                                                null,
                                                f.getSubmittedFileName(),
                                                f.getContentType(),
                                                f.getSize(),
                                                toStoreFile.getPath()));
                                        log.debug("File with [name=" + f.getSubmittedFileName() + "] successfully stored!");
                                        return Stream.of(true);
                                    } catch (IOException e) {
                                        log.error("File with [name=" + f.getSubmittedFileName() + "] not stored!");
                                        return Stream.of(false);
                                    }
                                }
                        ).reduce(true, Boolean::equals)
                ).orElse(false)
        );
    }

    @Async("repositoryThreadPoolTaskExecutor")
    @Transactional
    public CompletableFuture<Boolean> removeFile(Integer id) {
        log.debug("Started removing a file with [id=" + id + "]");

        return CompletableFuture.supplyAsync(() -> {
                    Optional<FileMetadata> maybeFile = fileRepository.findById(id);
                    if (!maybeFile.isPresent()) return false;
                    FileMetadata dbFileMetadata = maybeFile.get();
                    File toDeleteFile = new File(dbFileMetadata.getPath());
                    if (!toDeleteFile.delete()) return false;
                    fileRepository.deleteById(dbFileMetadata.getId());
                    log.debug("FileMetadata with [id=" + id + "] successfully removed");
                    return true;
                }
        );
    }
}
