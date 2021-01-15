package com.sysgears.upload.dto;

import lombok.Data;
import org.springframework.lang.NonNull;

@Data
public class File {
    @NonNull
    private final Integer id;
    @NonNull
    private final String name;
    @NonNull
    private final String type;
    @NonNull
    private final Long size;
    @NonNull
    private final String path;
}
