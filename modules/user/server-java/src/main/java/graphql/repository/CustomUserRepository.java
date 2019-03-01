package graphql.repository;

import graphql.model.FilterUserInput;
import graphql.model.OrderByUserInput;
import graphql.model.User;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public interface CustomUserRepository {

    CompletableFuture<List<User>> users(Optional<OrderByUserInput> orderBy, Optional<FilterUserInput> filter);
}
