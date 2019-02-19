package graphql.repository;

import graphql.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.concurrent.CompletableFuture;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {

    @Async("repositoryThreadPoolTaskExecutor")
    CompletableFuture<Post> findOneById(Integer id);
}
