package graphql.services;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class FileService {

    private final Logger logger = LogManager.getLogger(FileService.class);

    private Path resourcesDirPath = Paths.get(this.getClass().getResource("/").getPath());
    public Path publicDirPath = resourcesDirPath.resolve("public");

    public String hashAppend(String fileName) {
        return UUID.randomUUID().toString().substring(0, 5) + "_" + fileName;
    }

    public void createResourceDirectory() throws IOException {
        if (!publicDirPath.toFile().exists()) {
            Files.createDirectory(publicDirPath);
            logger.debug("Directory created [" + publicDirPath + "]");
        }
    }

    public CompletableFuture<File> createNewFile(String fileName) throws IOException {
        final String hashedFileName = hashAppend(fileName);
        createResourceDirectory();
        return CompletableFuture.supplyAsync(() -> {
            File file = new File(publicDirPath + "/" + hashedFileName);
            try {
                file.createNewFile();
            } catch (IOException e) {
                logger.error("The file wasn't create");
            }
            return file;
        });
    }
}
