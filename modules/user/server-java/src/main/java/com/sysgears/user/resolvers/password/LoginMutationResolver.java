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
import com.sysgears.user.exception.PasswordInvalidException;
import com.sysgears.user.exception.UserNotFoundException;
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
import java.util.concurrent.CompletableFuture;

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
                        throw new PasswordInvalidException();
                    }

                    Tokens tokens = jwtGenerator.generateTokens(UserIdentityUtils.convert(user));
                    SessionUtils.SECURITY_CONTEXT.setAuthentication(new JWTPreAuthenticationToken(user, null));

                    return new AuthPayload(user, tokens);
                })
                .exceptionally(throwable -> {
                    if (throwable.getCause() instanceof NoResultException) {
                        throw new UserNotFoundException("No user with specified email or username.");
                    } else {
                        log.error("Unexpected error happens when find user with " + loginUserInput.getUsernameOrEmail(), throwable);
                        throw new RuntimeException(throwable.getCause());
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
