package com.sysgears.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.graphql.spring.boot.test.GraphQLResponse;
import com.graphql.spring.boot.test.GraphQLTestTemplate;
import com.sysgears.user.constant.UserConstants;
import com.sysgears.user.dto.UserPayload;
import com.sysgears.user.model.User;
import com.sysgears.user.model.UserAuth;
import com.sysgears.user.model.UserProfile;
import com.sysgears.user.model.auth.*;
import com.sysgears.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserQueryTest {
    @Autowired
    GraphQLTestTemplate template;
    @MockBean
    private UserRepository repository;

    private User user;
    private final CertificateAuth certificateAuth = new CertificateAuth(UUID.randomUUID().toString());
    private final FacebookAuth facebookAuth = new FacebookAuth(UUID.randomUUID().toString(), "facebookAuthName");
    private final GithubAuth githubAuth = new GithubAuth(UUID.randomUUID().toString(), "githubAuthName");
    private final GoogleAuth googleAuth = new GoogleAuth(UUID.randomUUID().toString(), "googleAuthName");
    private final LinkedInAuth linkedInAuth = new LinkedInAuth(UUID.randomUUID().toString(), "linkedInAuthName");

    @BeforeEach
    void init() {
        user = new User("admin", "pass", "ADMIN", true, "example@sysgears.com");
        user.setProfile(new UserProfile("John", "Smith"));
        user.setAuth(
                UserAuth.builder()
                        .certificate(certificateAuth)
                        .facebook(facebookAuth)
                        .github(githubAuth)
                        .google(googleAuth)
                        .linkedin(linkedInAuth)
                        .build()
        );
    }

    @Test
    void users() throws IOException {
        when(repository.findByCriteria(Optional.empty(), Optional.empty()))
                .thenReturn(Collections.singletonList(user));

        GraphQLResponse response = template.postForResource("query/users.graphql");

        assertTrue(response.isOk());
        User actualUser = response.get("$.data.users[0]", User.class);
        assertThat(actualUser)
                .hasFieldOrPropertyWithValue("username", "admin")
                .hasFieldOrPropertyWithValue("role", "ADMIN")
                .hasFieldOrPropertyWithValue("email", "example@sysgears.com")
                .hasFieldOrPropertyWithValue("isActive", true)
                .hasFieldOrPropertyWithValue("profile.firstName", "John")
                .hasFieldOrPropertyWithValue("profile.lastName", "Smith")
                .hasFieldOrPropertyWithValue("profile.fullName", "John Smith");
        assertNotNull(actualUser.getAuth());
        assertEquals(certificateAuth, actualUser.getAuth().getCertificate());
        assertEquals(facebookAuth, actualUser.getAuth().getFacebook());
        assertEquals(githubAuth, actualUser.getAuth().getGithub());
        assertEquals(googleAuth, actualUser.getAuth().getGoogle());
        assertEquals(linkedInAuth, actualUser.getAuth().getLinkedin());
    }

    @Test
    void user() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("id", 1);

        when(repository.findById(1))
                .thenReturn(Optional.of(user));

        GraphQLResponse response = template.perform("query/user.graphql", node);

        assertTrue(response.isOk());
        UserPayload payload = response.get("$.data.user", UserPayload.class);
        User actualUser = payload.getUser();
        assertThat(actualUser)
                .hasFieldOrPropertyWithValue("username", "admin")
                .hasFieldOrPropertyWithValue("role", "ADMIN")
                .hasFieldOrPropertyWithValue("email", "example@sysgears.com")
                .hasFieldOrPropertyWithValue("isActive", true)
                .hasFieldOrPropertyWithValue("profile.firstName", "John")
                .hasFieldOrPropertyWithValue("profile.lastName", "Smith")
                .hasFieldOrPropertyWithValue("profile.fullName", "John Smith");
        assertNotNull(actualUser.getAuth());
        assertEquals(certificateAuth, actualUser.getAuth().getCertificate());
    }

    @Test
    void currentUser() throws IOException {
        when(repository.findUserById(UserConstants.ID))
                .thenReturn(CompletableFuture.completedFuture(user));

        GraphQLResponse response = template.postForResource("query/current-user.graphql");

        assertTrue(response.isOk());
        User actualUser = response.get("$.data.currentUser", User.class);
        assertThat(actualUser)
                .hasFieldOrPropertyWithValue("username", "admin")
                .hasFieldOrPropertyWithValue("profile.firstName", "John")
                .hasFieldOrPropertyWithValue("profile.lastName", "Smith")
                .hasFieldOrPropertyWithValue("profile.fullName", "John Smith");
        assertNotNull(actualUser.getAuth());
        assertEquals(facebookAuth, actualUser.getAuth().getFacebook());
    }
}
