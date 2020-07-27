package com.sysgears.user;

import com.sysgears.user.model.User;
import com.sysgears.user.model.UserAuth;
import com.sysgears.user.model.UserProfile;
import com.sysgears.user.model.auth.*;
import com.sysgears.user.repository.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserDBInitializer {
    private final JpaUserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @EventListener
    public void onApplicationStartedEvent(ApplicationStartedEvent event) {
        long count = repository.count();
        if (count == 0) {
            String encodedPassword = passwordEncoder.encode("qwerty");
            log.info("Encoded pass: {}", encodedPassword);
            User user = new User("admin", encodedPassword, "ADMIN", true, "example@sysgears.com");
            user.setProfile(new UserProfile("John", "Smith"));
            user.setAuth(
                    UserAuth.builder()
                            .certificate(new CertificateAuth(UUID.randomUUID().toString()))
                            .facebook(new FacebookAuth(UUID.randomUUID().toString(), "facebookAuthName"))
                            .github(new GithubAuth(UUID.randomUUID().toString(), "githubAuthName"))
                            .google(new GoogleAuth(UUID.randomUUID().toString(), "googleAuthName"))
                            .linkedin(new LinkedInAuth(UUID.randomUUID().toString(), "linkedInAuthName"))
                            .build()
            );
            repository.save(user);
            log.debug("User initialized");
        }
    }
}
