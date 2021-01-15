package com.sysgears.upload.resolvers;

import com.sysgears.upload.exception.FileNotFoundException;
import com.sysgears.upload.file.FileStorage;
import com.sysgears.upload.model.FileMetadata;
import com.sysgears.upload.repository.FileMetadataRepository;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.servlet.http.Part;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UploadMutationResolver implements GraphQLMutationResolver {
    private final FileMetadataRepository fileMetadataRepository;
    private final FileStorage fileStorage;

    public boolean uploadFiles(List<Part> files) {
        for (Part part : files) {
            String fileName = part.getSubmittedFileName().replace(" ", "_");
            String path = fileStorage.writeFile(fileName, part);

            fileMetadataRepository.save(new FileMetadata(fileName, part.getContentType(), part.getSize(), path));
        }

        return true;
    }

    public boolean removeFile(Integer id) {
        FileMetadata fileMetadata = fileMetadataRepository.findById(id).orElseThrow(()-> new FileNotFoundException(id));

        fileStorage.deleteFile(fileMetadata.getPath());
        fileMetadataRepository.deleteById(id);

        return true;
    }
}
