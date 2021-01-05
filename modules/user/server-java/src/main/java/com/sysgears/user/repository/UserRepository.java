package com.sysgears.user.repository;

import com.sysgears.user.dto.input.FilterUserInput;
import com.sysgears.user.dto.input.OrderByUserInput;
import com.sysgears.user.model.User;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public interface UserRepository {
    Optional<User> findById(int id);

    CompletableFuture<User> findUserById(int id);

    User save(User user);

    void delete(User user);

    List<User> findByCriteria(Optional<OrderByUserInput> orderBy, Optional<FilterUserInput> filter);

    Optional<User> findByUsernameOrAndEmail(String usernameOrEmail);
}
