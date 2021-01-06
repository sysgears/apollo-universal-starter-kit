package com.sysgears.user.service;

import com.sysgears.authentication.service.jwt.JwtParser;
import com.sysgears.authentication.utils.SessionUtils;
import com.sysgears.user.dto.input.FilterUserInput;
import com.sysgears.user.dto.input.OrderByUserInput;
import com.sysgears.user.exception.UserNotFoundException;
import com.sysgears.user.model.User;
import com.sysgears.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService implements UserDetailsService, AuditorAware<User> {

    private final UserRepository userRepository;
    private final JwtParser jwtParser;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsernameOrAndEmail(username).join();
    }

    @Override
    public Optional<User> getCurrentAuditor() {
        final Authentication authentication = SessionUtils.SECURITY_CONTEXT.getAuthentication();

        if (authentication == null) {
            // no user
            return Optional.empty();
        }

        if (authentication.getPrincipal() instanceof User) {
            return Optional.of((User) SessionUtils.SECURITY_CONTEXT.getAuthentication().getPrincipal());
        } else {
            // anonymous user
            return Optional.empty();
        }
    }

    @Transactional(readOnly = true)
    public User loadUserByToken(String token) {
        Integer userId = jwtParser.getIdFromAccessToken(token);
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }

    @Transactional(readOnly = true)
    public CompletableFuture<List<User>> findByCriteria(Optional<OrderByUserInput> orderBy, Optional<FilterUserInput> filter) {
        return userRepository.findByCriteria(orderBy, filter);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public CompletableFuture<User> findUserById(int id) {
        return userRepository.findUserById(id);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }
}
