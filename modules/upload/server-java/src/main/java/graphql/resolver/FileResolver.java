package graphql.resolver;

import com.coxautodev.graphql.tools.GraphQLResolver;
import graphql.model.FileMetadata;
import org.springframework.stereotype.Component;

@Component
public class FileResolver implements GraphQLResolver<FileMetadata> {
}
