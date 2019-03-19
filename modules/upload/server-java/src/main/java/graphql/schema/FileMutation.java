package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.File;
import graphql.repository.FileRepository;
import graphql.services.FileService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class FileMutation implements GraphQLMutationResolver {

    private final Logger logger = LogManager.getLogger(FileQuery.class);

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private FileService fileService;

    public CompletableFuture<Boolean> uploadFiles(List<MultipartFile> files) {
        AtomicInteger successfullyUploadCounter = new AtomicInteger();
       return CompletableFuture.supplyAsync(() -> {
            files.parallelStream().forEach(file -> {
                try {
                    String hashedFileName = fileService.hashAppend(file.getOriginalFilename());
                    java.io.File uploadedFile = new java.io.File(fileService.publicDirPath.toString()+hashedFileName);
                    file.transferTo(uploadedFile);
                    fileRepository.save(new File(
                            0,
                            hashedFileName,
                            fileService.getFileExtension(hashedFileName),
                            file.getSize(),
                            uploadedFile.getPath()
                            ));
                    successfullyUploadCounter.getAndIncrement();
                } catch (IOException e) {
                    logger.debug("Unsuccessful upload file with [name=" + file.getOriginalFilename() + "]");
                }
            });
            return files.size() == successfullyUploadCounter.get();
        }
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
