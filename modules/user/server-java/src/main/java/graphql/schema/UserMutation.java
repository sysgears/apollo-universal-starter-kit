package graphql.schema;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import graphql.common.model.Event;
import graphql.model.*;
import graphql.publisher.UserPubSubService;
import graphql.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CompletableFuture;

import static graphql.schema.OperationNames.*;

@Slf4j
@Component
public class UserMutation implements GraphQLMutationResolver {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserPubSubService userPubSubService;

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<UserPayload> addUser(AddUserInput input) {
        log.debug("Add User: [{}]", input);

        UserProfile profile = input.getProfile().map(profileInput -> UserProfile.builder()
                .firstName(profileInput.getFirstName().orElse(""))
                .lastName(profileInput.getLastName().orElse(""))
                .fullName(profileInput.getFirstName().orElse("") + " " + profileInput.getLastName().orElse(""))
                .build()).orElse(null);

        UserAuth auth = input.getAuth().map(authInput -> {

            CertificateAuth certificateAuth = authInput.getCertificate().map(authCertificateInput -> CertificateAuth.builder()
                    .serial(authCertificateInput.getSerial().orElse(null))
                    .build()).orElse(null);

            LinkedInAuth linkedInAuth = authInput.getLinkedin().map(authLinkedInInput ->
                    LinkedInAuth.builder()
                            .lnId(authLinkedInInput.getLnId().orElse(null))
                            .displayName(authLinkedInInput.getDisplayName().orElse(null))
                            .build()).orElse(null);

            GoogleAuth googleAuth = authInput.getGoogle().map(authGoogleInput ->
                    GoogleAuth.builder()
                            .googleId(authGoogleInput.getGoogleId().orElse(null))
                            .displayName(authGoogleInput.getDisplayName().orElse(null))
                            .build()).orElse(null);

            GithubAuth githubAuth = authInput.getGithub().map(authGitHubInput ->
                    GithubAuth.builder()
                            .ghId(authGitHubInput.getGhId().orElse(null))
                            .displayName(authGitHubInput.getDisplayName().orElse(null))
                            .build()).orElse(null);

            FacebookAuth facebookAuth = authInput.getFacebook().map(authFacebookInput ->
                    FacebookAuth.builder()
                            .fbId(authFacebookInput.getFbId().orElse(null))
                            .displayName(authFacebookInput.getDisplayName().orElse(null))
                            .build()).orElse(null);

            return UserAuth.builder()
                    .certificate(certificateAuth)
                    .linkedin(linkedInAuth)
                    .github(githubAuth)
                    .google(googleAuth)
                    .facebook(facebookAuth)
                    .build();
        }).orElse(null);


        User user = User.builder()
                .password(passwordEncoder.encode(input.getPassword()))
                .email(input.getEmail())
                .role(input.getRole())
                .username(input.getUsername())
                .isActive(input.getIsActive().orElse(false))
                .profile(profile)
                .auth(auth)
                .build();

        User savedUser = userRepository.save(user);

        userPubSubService.publish(Event.<User>builder().element(savedUser).name(ADD_USER).build());

        return CompletableFuture.supplyAsync(() -> UserPayload.builder()
                .user(savedUser)
                .build());
    }

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<UserPayload> editUser(EditUserInput input) {
        log.debug("Edit User: [{}]", input);
        return userRepository.findOneById(input.getId())
                .thenApplyAsync(user -> {

                    user.setUsername(input.getUsername());
                    user.setEmail(input.getEmail());
                    user.setRole(input.getRole());

                    input.getIsActive().ifPresent(user::setIsActive);
                    input.getPassword().ifPresent(password -> user.setPassword(passwordEncoder.encode(password)));

                    input.getProfile().ifPresent(profileInput -> {
                        profileInput.getFirstName().ifPresent(firstName -> {
                            user.getProfile().setFirstName(firstName);
                            String lastName = user.getProfile().getLastName();
                            user.getProfile().setFullName(firstName + " " + lastName);
                        });
                        profileInput.getLastName().ifPresent(lastName -> {
                            user.getProfile().setLastName(lastName);
                            String firstName = user.getProfile().getFirstName();
                            user.getProfile().setFullName(firstName + " " + lastName);
                        });
                    });

                    input.getAuth().ifPresent(authInput -> {

                        authInput.getCertificate().ifPresent(certificate -> {
                            certificate.getSerial().ifPresent(serial -> user.getAuth().getCertificate().setSerial(serial));
                        });

                        authInput.getFacebook().ifPresent(facebook -> {
                            facebook.getFbId().ifPresent(fbId -> user.getAuth().getFacebook().setFbId(fbId));
                            facebook.getDisplayName().ifPresent(displayName -> user.getAuth().getFacebook().setDisplayName(displayName));
                        });

                        authInput.getGithub().ifPresent(github -> {
                            github.getGhId().ifPresent(ghId -> user.getAuth().getGithub().setGhId(ghId));
                            github.getDisplayName().ifPresent(displayName -> user.getAuth().getGithub().setDisplayName(displayName));
                        });

                        authInput.getGoogle().ifPresent(google -> {
                            google.getGoogleId().ifPresent(googleId -> user.getAuth().getGoogle().setGoogleId(googleId));
                            google.getDisplayName().ifPresent(displayName -> user.getAuth().getGithub().setDisplayName(displayName));
                        });

                        authInput.getLinkedin().ifPresent(linkedIn -> {
                            linkedIn.getLnId().ifPresent(lnId -> user.getAuth().getLinkedin().setLnId(lnId));
                            linkedIn.getDisplayName().ifPresent(displayName -> user.getAuth().getGithub().setDisplayName(displayName));
                        });

                    });

                    User savedUser = userRepository.save(user);

                    userPubSubService.publish(Event.<User>builder().element(savedUser).name(EDIT_USER).build());

                    return savedUser;
                })
                .thenApplyAsync(updatedUser -> UserPayload.builder()
                        .user(updatedUser)
                        .build());
    }

    @Transactional
    @Async("resolverThreadPoolTaskExecutor")
    public CompletableFuture<UserPayload> deleteUser(Integer id) {
        log.debug("Delete User by ID: [{}]", id);
        return userRepository.findOneById(id)
                .thenApplyAsync(user -> {
                    userRepository.delete(user);
                    userPubSubService.publish(Event.<User>builder().element(user).name(DELETE_USER).build());
                    return UserPayload.builder()
                            .user(user)
                            .build();
                });
    }
}
