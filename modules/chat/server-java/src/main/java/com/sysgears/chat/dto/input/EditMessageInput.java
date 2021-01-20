package com.sysgears.chat.dto.input;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class EditMessageInput {
    @NonNull
    private final Integer id;
    private final String text;
    private final Integer userId;
}
