package com.sysgears.chat.dto;

import lombok.Data;

@Data
public class QuotedMessage {
    private final Integer id;
    private final String text;
    private final String username;
    private final String filename;
    private final String path;
}
