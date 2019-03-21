package graphql.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
@Slf4j
public class FileService {

    private Path resourcesDirPath = Paths.get(this.getClass().getResource("/").getPath());
    public Path publicDirPath = resourcesDirPath.resolve("public");

    public String hashAppend(String fileName) {
        return UUID.randomUUID().toString().substring(0, 5) + "_" + fileName;
    }

    private void createResourceDirectory() throws IOException {
        if (!publicDirPath.toFile().exists()) {
            Files.createDirectory(publicDirPath);
            log.debug("Directory created [" + publicDirPath + "]");
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
                log.error("The file with [name=" + fileName + "] wasn't create");
            }
            return file;
        });
    }
}
