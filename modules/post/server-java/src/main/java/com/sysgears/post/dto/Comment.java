package com.sysgears.post.dto;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class Comment {
    @NonNull
    private final Integer id;
    @NonNull
    private final String content;
}
