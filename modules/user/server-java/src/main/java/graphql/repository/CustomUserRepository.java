package graphql.repository;

import graphql.model.FilterUserInput;
import graphql.model.OrderByUserInput;
import graphql.model.User;

import java.util.List;

public interface CustomUserRepository {

    List<User> users(OrderByUserInput orderBy, FilterUserInput filter);
}
