package com.sysgears.user.repository;

import com.sysgears.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public interface UserRepository extends JpaRepository<User, Integer>, CustomUserRepository {
    CompletableFuture<User> findUserById(int id);

    Optional<User> findById(int id);
}
