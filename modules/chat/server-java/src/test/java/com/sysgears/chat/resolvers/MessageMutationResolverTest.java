package com.sysgears.chat.resolvers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.graphql.spring.boot.test.GraphQLResponse;
import com.graphql.spring.boot.test.GraphQLTestTemplate;
import com.sysgears.chat.dto.MessagePayload;
import com.sysgears.chat.model.Message;
import com.sysgears.chat.service.MessageService;
import com.sysgears.user.model.User;
import com.sysgears.user.service.UserService;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.mock.web.MockPart;

import javax.servlet.http.Part;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class MessageMutationResolverTest {
	@Autowired
	private GraphQLTestTemplate template;
	@Autowired
	private MessageService messageService;
	@MockBean
	private UserService userService;

	@Test
	void addMessage() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		User user = new User();
		user.setId(1);
		user.setUsername("user");
		String text = "Hello";
		String uuid = UUID.randomUUID().toString();
		node.put("text", text);
		node.put("userId", user.getId());
		node.put("uuid", uuid);

		input.set("input", node);

		when(userService.findUserById(user.getId())).thenReturn(CompletableFuture.completedFuture(user));

		GraphQLResponse response = template.perform("add-message.graphql", input);
		assertTrue(response.isOk());

		MessagePayload messagePayload = response.get("$.data.addMessage", MessagePayload.class);

		assertNotNull(messagePayload.getId());
		assertEquals(text, messagePayload.getText());
		assertEquals(user.getId(), messagePayload.getUserId());
		assertFalse(messagePayload.getCreatedAt().isBlank());
		assertEquals(user.getUsername(), messagePayload.getUsername());
		assertEquals(uuid, messagePayload.getUuid());
		assertNull(messagePayload.getQuotedId());
		assertNull(messagePayload.getQuotedMessage().getId());
		assertNull(messagePayload.getFilename());
		assertNull(messagePayload.getPath());
	}

	@Test
	void addMessage_userId_not_specified() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		User user = new User();
		user.setId(2);
		user.setUsername("test");
		String text = "Foo";
		String uuid = UUID.randomUUID().toString();
		node.put("text", text);
		node.put("uuid", uuid);

		input.set("input", node);

		when(userService.getCurrentAuditor()).thenReturn(Optional.of(user));

		GraphQLResponse response = template.perform("add-message.graphql", input);
		assertTrue(response.isOk());

		MessagePayload messagePayload = response.get("$.data.addMessage", MessagePayload.class);

		assertNotNull(messagePayload.getId());
		assertEquals(text, messagePayload.getText());
		assertEquals(user.getId(), messagePayload.getUserId());
		assertFalse(messagePayload.getCreatedAt().isBlank());
		assertEquals(user.getUsername(), messagePayload.getUsername());
		assertEquals(uuid, messagePayload.getUuid());
		assertNull(messagePayload.getQuotedId());
		assertNull(messagePayload.getQuotedMessage().getId());
		assertNull(messagePayload.getFilename());
		assertNull(messagePayload.getPath());
	}

	@Test
	void addMessage_from_anonymous() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		String text = "bar";
		String uuid = UUID.randomUUID().toString();
		node.put("text", text);
		node.put("uuid", uuid);

		input.set("input", node);

		GraphQLResponse response = template.perform("add-message.graphql", input);
		assertTrue(response.isOk());

		MessagePayload messagePayload = response.get("$.data.addMessage", MessagePayload.class);

		assertNotNull(messagePayload.getId());
		assertEquals(text, messagePayload.getText());
		assertNull(messagePayload.getUserId());
		assertFalse(messagePayload.getCreatedAt().isBlank());
		assertNull(messagePayload.getUsername());
		assertEquals(uuid, messagePayload.getUuid());
		assertNull(messagePayload.getQuotedId());
		assertNull(messagePayload.getQuotedMessage().getId());
		assertNull(messagePayload.getFilename());
		assertNull(messagePayload.getPath());
	}

	@Test
	void addMessage_quote() throws IOException {
		Message message = new Message();
		message.setUuid(UUID.randomUUID());
		message.setText("foo bar");
		messageService.create(message);

		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		String text = "baz";
		String uuid = UUID.randomUUID().toString();
		node.put("text", text);
		node.put("quotedId", message.getId());
		node.put("uuid", uuid);

		input.set("input", node);

		GraphQLResponse response = template.perform("add-message.graphql", input);
		assertTrue(response.isOk());

		MessagePayload messagePayload = response.get("$.data.addMessage", MessagePayload.class);

		assertNotNull(messagePayload.getId());
		assertEquals(text, messagePayload.getText());
		assertNull(messagePayload.getUserId());
		assertFalse(messagePayload.getCreatedAt().isBlank());
		assertNull(messagePayload.getUsername());
		assertEquals(uuid, messagePayload.getUuid());
		assertEquals(message.getId(), messagePayload.getQuotedId());
		assertEquals(message.getId(), messagePayload.getQuotedMessage().getId());
		assertEquals(message.getText(), messagePayload.getQuotedMessage().getText());
		assertNull(messagePayload.getFilename());
		assertNull(messagePayload.getPath());
	}

	@Test
	void deleteMessage() throws IOException {
		Message message = new Message();
		message.setUuid(UUID.randomUUID());
		message.setText("foo bar");
		messageService.create(message);

		ObjectMapper mapper = new ObjectMapper();
		ObjectNode node = mapper.createObjectNode();

		node.put("id", message.getId());

		GraphQLResponse response = template.perform("delete-message.graphql", node);
		assertTrue(response.isOk());

		MessagePayload messagePayload = response.get("$.data.deleteMessage", MessagePayload.class);

		assertNotNull(messagePayload.getId());
		assertEquals(message.getText(), messagePayload.getText());
		assertNull(messagePayload.getUserId());
		assertFalse(messagePayload.getCreatedAt().isBlank());
		assertNull(messagePayload.getUsername());
		assertEquals(message.getUuid().toString(), messagePayload.getUuid());
		assertNull(messagePayload.getQuotedId());
		assertNull(messagePayload.getQuotedMessage().getId());
		assertNull(messagePayload.getFilename());
		assertNull(messagePayload.getPath());
	}

	@Test
	void deleteMessage_not_exists() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode node = mapper.createObjectNode();
		int invalidMessageId = 5555;
		node.put("id", invalidMessageId);

		GraphQLResponse response = template.perform("delete-message.graphql", node);
		assertTrue(response.isOk());
		assertEquals(String.format("Message with id %d not found", invalidMessageId), response.get("$.errors[0].message"));
	}

	@Test
	void editMessage() throws IOException {
		Message message = new Message();
		message.setUuid(UUID.randomUUID());
		message.setText("foo bar");
		messageService.create(message);

		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		String text = "baz";
		node.put("id", message.getId());
		node.put("text", text);

		input.set("input", node);

		GraphQLResponse response = template.perform("edit-message.graphql", input);
		assertTrue(response.isOk());

		MessagePayload messagePayload = response.get("$.data.editMessage", MessagePayload.class);

		assertNotNull(messagePayload.getId());
		assertEquals(text, messagePayload.getText());
		assertNull(messagePayload.getUserId());
		assertFalse(messagePayload.getCreatedAt().isBlank());
		assertNull(messagePayload.getUsername());
		assertEquals(message.getUuid().toString(), messagePayload.getUuid());
		assertNull(messagePayload.getQuotedId());
		assertNull(messagePayload.getQuotedMessage().getId());
		assertNull(messagePayload.getFilename());
		assertNull(messagePayload.getPath());
	}

	@Test
	void editMessage_not_exists() throws IOException {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode input = mapper.createObjectNode();
		ObjectNode node = mapper.createObjectNode();

		int invalidMessageId = 2414;
		String text = "new message";
		node.put("id", invalidMessageId);
		node.put("text", text);

		input.set("input", node);

		GraphQLResponse response = template.perform("edit-message.graphql", input);
		assertTrue(response.isOk());
		assertEquals(String.format("Message with id %d not found", invalidMessageId), response.get("$.errors[0].message"));
	}
}
