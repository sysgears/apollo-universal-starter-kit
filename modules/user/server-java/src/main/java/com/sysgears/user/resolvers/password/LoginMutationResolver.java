package com.sysgears.user.resolvers.password;

import com.sysgears.authentication.model.jwt.Tokens;
import com.sysgears.authentication.service.jwt.JwtGenerator;
import com.sysgears.authentication.utils.SessionUtils;
import com.sysgears.user.config.JWTPreAuthenticationToken;
import com.sysgears.user.dto.AuthPayload;
import com.sysgears.user.dto.UserPayload;
import com.sysgears.user.dto.input.ForgotPasswordInput;
import com.sysgears.user.dto.input.LoginUserInput;
import com.sysgears.user.dto.input.RegisterUserInput;
import com.sysgears.user.dto.input.ResetPasswordInput;
import com.sysgears.user.exception.LoginFailedException;
import com.sysgears.user.exception.UserAlreadyExistsException;
import com.sysgears.user.model.User;
import com.sysgears.user.service.UserService;
import com.sysgears.user.util.UserIdentityUtils;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.NoResultException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginMutationResolver implements GraphQLMutationResolver {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtGenerator jwtGenerator;

    @Transactional(readOnly = true)
    public CompletableFuture<AuthPayload> login(LoginUserInput loginUserInput) {
        return userService.findUserByUsernameOrEmail(loginUserInput.getUsernameOrEmail())
                .thenApply(user -> {
                    boolean matches = passwordEncoder.matches(loginUserInput.getPassword(), user.getPassword());
                    if (!matches) {
                        log.debug("Password is invalid");
                        throw new LoginFailedException(Map.of("password", "Please enter a valid password."));
                    }

                    Tokens tokens = jwtGenerator.generateTokens(UserIdentityUtils.convert(user));
                    SessionUtils.SECURITY_CONTEXT.setAuthentication(new JWTPreAuthenticationToken(user, null));

                    return new AuthPayload(user, tokens);
                })
                .exceptionally(throwable -> {
                    if (throwable.getCause() instanceof NoResultException) {
                        log.warn("Specified email or username '{}' is invalid.", loginUserInput.getUsernameOrEmail());
                        throw new LoginFailedException(Map.of("usernameOrEmail", "Please enter a valid username or e-mail."));
                    } else {
                        log.error("Unexpected error happens when find user with " + loginUserInput.getUsernameOrEmail(), throwable);
                        throw (CompletionException) throwable;
                    }
                });
    }

    public CompletableFuture<String> forgotPassword(ForgotPasswordInput input) {
        //todo implement
        return null;
    }

    public CompletableFuture<String> resetPassword(ResetPasswordInput input) {
        //todo implement
        return null;
    }

    public CompletableFuture<UserPayload> register(RegisterUserInput input) {
        return CompletableFuture.supplyAsync(() -> {
            Map<String, String> errors = new HashMap<>();
            if (userService.existsByEmail(input.getEmail())) {
                errors.put("email", "E-mail already exists.");
            }
            if (userService.existsByUsername(input.getUsername())) {
                errors.put("username", "Username already exists.");
            }
            if (!errors.isEmpty()) {
                throw new UserAlreadyExistsException(errors);
            }

            User user = new User(
                    input.getUsername(),
                    passwordEncoder.encode(input.getPassword()),
                    "user",
                    false,
                    input.getEmail());
            User registered = userService.save(user);
            // todo: send email to activate user.
            return new UserPayload(registered);
        });
    }
}
