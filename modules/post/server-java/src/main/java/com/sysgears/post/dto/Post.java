package com.sysgears.post.dto;

import lombok.Data;
import org.springframework.lang.NonNull;

import java.util.List;

@Data
public class Post {
    @NonNull
    private final Integer id;
    @NonNull
    private final String title;
    @NonNull
    private final String content;
    private final List<Comment> comments;
}
