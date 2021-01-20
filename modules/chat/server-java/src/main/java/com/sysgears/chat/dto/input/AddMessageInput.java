package com.sysgears.chat.dto.input;

import lombok.Data;

import javax.servlet.http.Part;

@Data
public class AddMessageInput {
    private final String text;
    private final Integer userId;
    private final String uuid;
    private final Integer quotedId;
    private final Part attachment;
}
