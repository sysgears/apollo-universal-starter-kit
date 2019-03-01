package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.model.*;
import graphql.publisher.UserPubSubService;
import graphql.repository.UserRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

@Component
public class UserMutation implements GraphQLMutationResolver {

    Logger logger = LogManager.getLogger(UserMutation.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserPubSubService userPubSubService;

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<UserPayload> addUser(AddUserInput input) {
        logger.debug("Add User: [{}]", input);
        User user = User.builder()
                .password(passwordEncoder.encode(input.getPassword()))
                .email(input.getEmail())
                .role(input.getRole())
                .username(input.getUsername())
                .isActive(input.getIsActive().orElse(false))
                //TODO Add profile and auth
//                .profile(input.getProfile().ifPresent(profile -> {
//                     UserProfile.builder()
//                            .firstName(profile.getFirstName().orElse(null))
//                            .lastName(profile.getLastName().orElse(null))
//                            .fullName(profile.getFirstName().orElse(null) + " " + profile.getLastName().orElse(null))
//                            .build();
//                })
//                )
                .build();

        return CompletableFuture.supplyAsync(() -> UserPayload.builder()
                .user(user)
                .build());
    }

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<UserPayload> editUser(EditUserInput input) {
        logger.debug("Edit User: [{}]", input);
        return userRepository.findOneById(input.getId())
                .thenApplyAsync(maybeUser -> {

                    maybeUser.setUsername(input.getUsername());
                    maybeUser.setEmail(input.getEmail());
                    maybeUser.setRole(input.getRole());

                    input.getIsActive().ifPresent(maybeUser::setIsActive);
                    input.getPassword().ifPresent(password -> maybeUser.setPassword(passwordEncoder.encode(password)));

                    input.getProfile().ifPresent(profileInput -> {
                        profileInput.getFirstName().ifPresent(firstName -> {
                            maybeUser.getProfile().setFirstName(firstName);
                            String lastName = maybeUser.getProfile().getLastName();
                            maybeUser.getProfile().setFullName(firstName + " " + lastName);
                        });
                        profileInput.getLastName().ifPresent(lastName -> {
                            maybeUser.getProfile().setLastName(lastName);
                            String firstName = maybeUser.getProfile().getFirstName();
                            maybeUser.getProfile().setFullName(firstName + " " + lastName);
                        });
                    });

                    input.getAuth().ifPresent(authInput -> {

                        authInput.getCertificate().ifPresent(certificate -> {
                            certificate.getSerial().ifPresent(serial -> maybeUser.getAuth().getCertificate().setSerial(serial));
                        });

                        authInput.getFacebook().ifPresent(facebook -> {
                            facebook.getFbId().ifPresent(fbId -> maybeUser.getAuth().getFacebook().setFbId(fbId));
                            facebook.getDisplayName().ifPresent(displayName -> maybeUser.getAuth().getFacebook().setDisplayName(displayName));
                        });

                        authInput.getGithub().ifPresent(github -> {
                            github.getGhId().ifPresent(ghId -> maybeUser.getAuth().getGithub().setGhId(ghId));
                            github.getDisplayName().ifPresent(displayName -> maybeUser.getAuth().getGithub().setDisplayName(displayName));
                        });

                        authInput.getGoogle().ifPresent(google -> {
                            google.getGoogleId().ifPresent(googleId -> maybeUser.getAuth().getGoogle().setGoogleId(googleId));
                            google.getDisplayName().ifPresent(displayName -> maybeUser.getAuth().getGithub().setDisplayName(displayName));
                        });

                        authInput.getLinkedin().ifPresent(linkedIn -> {
                            linkedIn.getLnId().ifPresent(lnId -> maybeUser.getAuth().getLinkedin().setLnId(lnId));
                            linkedIn.getDisplayName().ifPresent(displayName -> maybeUser.getAuth().getGithub().setDisplayName(displayName));
                        });

                    });

                    return userRepository.save(maybeUser);
                })
                .thenApplyAsync(updatedUser -> UserPayload.builder()
                                                .user(updatedUser)
                                                .build());
    }

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<UserPayload> deleteUser(Integer id) {
        logger.debug("Delete User by ID: [{}]", id);
        return userRepository.findOneById(id)
                .thenApplyAsync(maybeUser -> {
                            userRepository.delete(maybeUser);
                    return UserPayload.builder()
                            .user(maybeUser)
                            .build();
                });
    }
}
