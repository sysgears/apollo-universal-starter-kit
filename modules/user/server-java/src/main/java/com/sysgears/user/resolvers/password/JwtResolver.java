package com.sysgears.user.resolvers.password;

import com.sysgears.authentication.model.jwt.JwtUserIdentity;
import com.sysgears.authentication.model.jwt.Tokens;
import com.sysgears.authentication.service.jwt.JwtGenerator;
import com.sysgears.authentication.service.jwt.JwtParser;
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
import com.sysgears.user.repository.UserRepository;
import graphql.kickstart.tools.GraphQLMutationResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtResolver implements GraphQLMutationResolver {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtGenerator jwtGenerator;
    private final JwtParser jwtParser;

    @Transactional(readOnly = true)
    public CompletableFuture<AuthPayload> login(LoginUserInput loginUserInput) {
        return CompletableFuture.supplyAsync(() -> {
            Optional<User> userOpt = userRepository.findByUsernameOrAndEmail(loginUserInput.getUsernameOrEmail());
            if (userOpt.isEmpty()) {
                throw new UserNotFoundException();
            }

            User user = userOpt.get();
            boolean matches = passwordEncoder.matches(loginUserInput.getPassword(), user.getPassword());
            if (!matches) {
                log.debug("Password is invalid");
                throw new PasswordInvalidException();
            }

            Tokens tokens = jwtGenerator.generateTokens(convert(user));
            SessionUtils.SECURITY_CONTEXT.setAuthentication(new JWTPreAuthenticationToken(user, null));

            return new AuthPayload(user, tokens);
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
        //todo implement
        return null;
    }

    public CompletableFuture<Tokens> refreshTokens(String refreshToken) {
        return CompletableFuture.supplyAsync(() -> {
            Integer userId = jwtParser.getIdFromRefreshToken(refreshToken);
            User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
            return jwtGenerator.generateTokens(convert(user));
        });
    }

    private JwtUserIdentity convert(User user) {
        JwtUserIdentity.JwtUserIdentityBuilder builder = JwtUserIdentity.builder();
        builder
                .id(user.getId())
                .username(user.getUsername())
                .passwordHash(user.getPassword())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .email(user.getEmail());

        if (user.getProfile() != null) {
            builder
                    .firstName(user.getProfile().getFirstName())
                    .lastName(user.getProfile().getLastName());
        }
        return builder.build();
    }
}
