package com.sysgears.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.graphql.spring.boot.test.GraphQLResponse;
import com.graphql.spring.boot.test.GraphQLTestTemplate;
import com.sysgears.mailer.service.EmailService;
import com.sysgears.user.dto.AuthPayload;
import com.sysgears.user.model.User;
import com.sysgears.user.repository.UserRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
@Disabled //todo figure out tests fails when run with coverage and when build project with gradle
public class LoginMutationTest {
	@Autowired
	private GraphQLTestTemplate template;
	@MockBean
	private EmailService emailService;
	@Autowired
	UserRepository userRepository;

	@Test
	void login_with_username() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		node.put("usernameOrEmail", "user");
		node.put("password", "user1234");

		input.set("input", node);
		GraphQLResponse response = template.perform("mutation/login.graphql", input);

		assertTrue(response.isOk());
		System.err.println(response.getRawResponse().getBody());
		AuthPayload payload = response.get("$.data.login", AuthPayload.class);

		User user = payload.getUser();
		assertEquals("user", user.getUsername());
		assertEquals("user", user.getRole());
		assertTrue(user.getIsActive());
		assertEquals("user@example.com", user.getEmail());
		assertNull(user.getProfile());

		assertNotNull(payload.getTokens().getAccessToken());
		assertNotNull(payload.getTokens().getRefreshToken());
	}

	@Test
	void login_with_email() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		node.put("usernameOrEmail", "admin@example.com");
		node.put("password", "admin123");

		input.set("input", node);
		GraphQLResponse response = template.perform("mutation/login.graphql", input);

		assertTrue(response.isOk());
		AuthPayload payload = response.get("$.data.login", AuthPayload.class);

		User user = payload.getUser();
		assertEquals("admin", user.getUsername());
		assertEquals("admin", user.getRole());
		assertTrue(user.getIsActive());
		assertEquals("admin@example.com", user.getEmail());
		assertNull(user.getProfile());

		assertNotNull(payload.getTokens().getAccessToken());
		assertNotNull(payload.getTokens().getRefreshToken());
	}

	@Test
	void login_invalid_email() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		node.put("usernameOrEmail", "invalid_user");
		node.put("password", "supersecret");

		input.set("input", node);
		GraphQLResponse response = template.perform("mutation/login.graphql", input);

		assertTrue(response.isOk());
		assertEquals("Login failed.", response.get("$.errors[0].message"));
		assertEquals("Please enter a valid username or e-mail.", response.get("$.errors[0].extensions.exception.errors.usernameOrEmail"));
	}

	@Test
	void login_invalid_password() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		node.put("usernameOrEmail", "admin");
		node.put("password", "supersecret");

		input.set("input", node);

		GraphQLResponse response = template.perform("mutation/login.graphql", input);

		assertTrue(response.isOk());
		assertEquals("Login failed.", response.get("$.errors[0].message"));
		assertEquals("Please enter a valid password.", response.get("$.errors[0].extensions.exception.errors.password"));
	}
}
