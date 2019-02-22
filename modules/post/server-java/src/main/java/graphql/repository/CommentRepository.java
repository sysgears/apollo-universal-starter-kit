package graphql.repository;

import graphql.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {

    @Async("repositoryThreadPoolTaskExecutor")
    CompletableFuture<Comment> findOneById(Integer id);

    @Async("repositoryThreadPoolTaskExecutor")
    CompletableFuture<List<Comment>> findAllByPostId(Integer postId);
}
