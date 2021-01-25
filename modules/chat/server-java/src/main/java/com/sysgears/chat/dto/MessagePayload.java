package com.sysgears.chat.dto;

import com.sysgears.chat.model.Message;
import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class MessagePayload {
    @NonNull
    private final Integer id;
    private final String text;
    private final Integer userId;
    private final String createdAt;
    private final String username;
    private final String uuid;
    private final Integer quotedId;
    private final String filename;
    private final String path;
    private final QuotedMessage quotedMessage;

    public static MessagePayload from(Message message) {
        QuotedMessage quotedMessage = new QuotedMessage();
        if (message.getQuoted() != null) {
            quotedMessage.setId(message.getQuoted().getId());
            quotedMessage.setText(message.getQuoted().getText());
            quotedMessage.setUsername(message.getQuoted().getUsername());
            if (message.getQuoted().getAttachment() != null) {
                quotedMessage.setFilename(message.getQuoted().getAttachment().getName());
                quotedMessage.setPath(message.getQuoted().getAttachment().getPath());
            }
        }
        return new MessagePayload(
                message.getId(),
                message.getText(),
                message.getUserId(),
                message.getCreatedAt().toString(),
                message.getUsername(),
                message.getUuid().toString(),
                quotedMessage.getId(),
                message.getAttachment() != null ? message.getAttachment().getName() : null,
                message.getAttachment() != null ? message.getAttachment().getPath() : null,
                quotedMessage
        );
    }
}
