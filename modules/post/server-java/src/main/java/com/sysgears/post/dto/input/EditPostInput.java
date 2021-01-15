package com.sysgears.post.dto.input;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class EditPostInput {
    @NonNull
    private final Integer id;
    @NonNull
    private final String title;
    @NonNull
    private final String content;
}
